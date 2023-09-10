import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { PROMPTS } from "@/constants/prompts";
import { serverGetProblemInfo } from "@/utils/dbUtils";
import { makeHintUserPrompt } from "@/utils/commonUtils";
import prisma from "@/lib/prisma";
import { wrapApi } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import { LOCALES } from "@/constants/common";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { z } from "zod";
import { openAiClient } from "@/lib/openAi";

const HintSchema = z.object({
  prompt: z.string(),
});

export const POST = wrapApi({
  withAuth: true,
  paramsSchema: ProblemParamsSchema,
  bodySchema: HintSchema,
})(async (req: Request, { user, params, body }): Promise<Response> => {
  if (
    process.env.NODE_ENV != "development" &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "10 m"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `hint_ratelimit_${user.id}`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  let { prompt: userCode } = body;
  const problemInfo = await serverGetProblemInfo(params.id);
  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem not found");
  }
  const prompt = makeHintUserPrompt(
    LOCALES[problemInfo.locale],
    JSON.stringify(problemInfo.description),
    userCode,
    JSON.stringify(problemInfo.inputFormat),
    JSON.stringify(problemInfo.outputFormat),
  );

  const response = await openAiClient.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: PROMPTS["hint"][LOCALES[problemInfo.locale]],
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onCompletion: async (completion) => {
      await prisma.hint.create({
        data: {
          userId: user.id,
          problemId: problemInfo.id,
          content: completion,
        },
      });
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
});

export const GET = wrapApi({
  withAuth: true,
  paramsSchema: ProblemParamsSchema,
})(async (req: Request, { user, params }) => {
  const hints = await prisma.hint.findMany({
    where: {
      problemId: params.id,
      userId: user.id,
    },
  });

  return ResTypes.OK(hints);
});
