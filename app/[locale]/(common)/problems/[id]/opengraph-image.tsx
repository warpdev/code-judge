import { ImageResponse } from "next/server";
import { pageWithOptions } from "@/utils/serverUtils";
import { ProblemPageParamsSchema } from "@/types/schema";
import { getTranslator } from "next-intl/server";
import prisma from "@/lib/prisma";

export const size = {
  width: 1200,
  height: 630,
};

const getBadgeColor = (score: number) => {
  if (score === 0) {
    return "#59606d";
  } else if (score < 100) {
    return "#948c00";
  } else {
    return "#37b100";
  }
};

const OpengraphImage = pageWithOptions({
  paramsSchema: ProblemPageParamsSchema,
})(async ({ locale, params: { id } }) => {
  const problem = await prisma.problem.findUnique({
    where: {
      id,
      isPublic: true,
    },
    select: {
      title: true,
      submission: {
        where: {
          judgeTokens: {
            every: {
              status: 3,
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
  });
  const allSubmission = await prisma.submission.count({
    where: {
      problemId: id,
    },
  });
  const t = await getTranslator(locale, "problem.opengraph");
  const score =
    problem && allSubmission
      ? (problem.submission.length / allSubmission) * 100
      : 0;

  return new ImageResponse(
    (
      <div
        style={{
          fontWeight: 900,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 32,
            position: "absolute",
            top: 16,
            left: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -50 500 500"
            width="64"
            height="64"
          >
            <g fill="none" fillRule="evenodd">
              <g fill="#59606d">
                <path d="M163.19 259.952a7.486 7.486 0 0 1-7.488-7.488 7.49 7.49 0 1 1 7.488 7.488zM383.27 70.738h27.613c0 15.62-12.215 28.359-27.613 29.262v.16h-53.645v-.076c-1.2 0-2.376-.093-3.536-.233 22.214 24.98 35.71 57.88 35.71 93.936 0 78.132-63.34 141.473-141.473 141.473-44.266 0-83.762-20.35-109.7-52.186a138.807 138.807 0 0 1-7.966-10.796 37.548 37.548 0 0 1-3.862-16.64c0-20.855 16.904-37.76 37.763-37.76h83.963c36.103 0 65.82-27.327 69.623-62.425h.003v-.044c.27-2.49.413-5.015.413-7.575l.018-50.93 23.3-26.166H383.27zm-98.494 248.954s-12.782-36.689-61.927-36.689H110.626c25.938 31.836 65.434 52.183 109.7 52.183 23.213 0 45.12-5.59 64.45-15.494z" />
                <path
                  fillOpacity=".8"
                  d="M333.412 305.84h27.613c0 15.623-12.217 28.359-27.613 29.259v.163h-31.824l26.826-29.422h4.998zm-48.636 13.852c-19.33 9.905-41.237 15.494-64.45 15.494-44.266 0-83.762-20.347-109.7-52.183h112.223c49.145 0 61.927 36.689 61.927 36.689zM168.455 153.471a7.447 7.447 0 0 1 0 10.534l-5.266 5.269-5.266-5.269a7.452 7.452 0 0 1 0-10.534 7.45 7.45 0 0 1 10.532 0zm117.143-82.732c0 15.62-12.217 28.355-27.613 29.261v.16h-53.641v-.075c-16.211 0-29.35-13.141-29.35-29.346H285.598z"
                />
              </g>
              <path d="M20 371h460v80H20z" />
            </g>
          </svg>
          <span>OpenCody</span>
        </div>

        {problem ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              className="min-w-max"
              style={{
                fontSize: 64,
              }}
            >
              {problem.title}
            </span>
            <div
              style={{
                fontSize: 32,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  background: getBadgeColor(score),
                  padding: "4px 8px",
                  borderRadius: 4,
                }}
              >{`${Math.round(score)}%`}</span>
            </div>
          </div>
        ) : (
          <span
            style={{
              fontSize: 128,
              textAlign: "center",
            }}
          >
            {t("privateProblem")}
          </span>
        )}
      </div>
    ),
    {
      ...size,
    },
  );
});

export default OpengraphImage;
