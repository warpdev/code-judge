import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { PROMPTS } from "@/constants/prompts";
import { getProblemInfo } from "@/utils/dbUtils";
import { makeHintUserPrompt } from "@/utils/commonUtils";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/utils/serverUtils";
import { NextResponse } from "next/server";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const userInfo = await getServerUser();
  if (!userInfo) return NextResponse.error();
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
      `hint_ratelimit_${userInfo.id}`
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

  let { prompt: userCode } = await req.json();
  const problemInfo = await getProblemInfo(params.id);
  const prompt = makeHintUserPrompt(
    JSON.stringify(problemInfo.description),
    userCode,
    JSON.stringify(problemInfo.inputFormat),
    JSON.stringify(problemInfo.outputFormat)
  );

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: PROMPTS["hint"],
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onCompletion: async (completion) => {
      await prisma.hint.create({
        data: {
          userId: userInfo.id,
          problemId: problemInfo.id,
          content: completion,
        },
      });
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
