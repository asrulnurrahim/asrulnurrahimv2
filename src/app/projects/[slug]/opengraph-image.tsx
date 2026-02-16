import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/features/projects/services";

export const runtime = "edge";

export const alt = "Project Image";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
        }}
      >
        Asrul.tech
      </div>,
      { ...size },
    );
  }

  // Calculate font size based on title length to prevent overflow
  const titleFontSize = project.title.length > 40 ? 60 : 80;

  // Fetch thumbnail if available
  let thumbnailBuffer: ArrayBuffer | null = null;
  if (project.thumbnail) {
    try {
      const res = await fetch(project.thumbnail);
      if (res.ok) {
        thumbnailBuffer = await res.arrayBuffer();
      }
    } catch (e) {
      console.error("Failed to fetch thumbnail:", e);
    }
  }

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#1e1b4b",
        color: "white",
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Image with Overlay */}
      {thumbnailBuffer && (
        <img
          src={thumbnailBuffer as unknown as string}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.6,
          }}
        />
      )}

      {/* Dark Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: thumbnailBuffer
            ? "linear-gradient(to bottom, rgba(30, 27, 75, 0.4), rgba(30, 27, 75, 0.9))"
            : "linear-gradient(to bottom right, #1e1b4b, #312e81)",
        }}
      />

      {/* Content Container - Ensure it sits on top of overlay */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "80px",
          zIndex: 10,
        }}
      >
        {/* Background Patterns (Only if no thumbnail) */}
        {!thumbnailBuffer && (
          <>
            <div
              style={{
                position: "absolute",
                top: "-100px",
                right: "-100px",
                width: "400px",
                height: "400px",
                background: "#8b5cf6",
                borderRadius: "100%",
                filter: "blur(150px)",
                opacity: 0.2,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-100px",
                left: "-100px",
                width: "400px",
                height: "400px",
                background: "#ec4899",
                borderRadius: "100%",
                filter: "blur(150px)",
                opacity: 0.2,
              }}
            />
          </>
        )}

        {/* Header: Project Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: thumbnailBuffer
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(139, 92, 246, 0.2)",
              border: thumbnailBuffer
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid rgba(139, 92, 246, 0.4)",
              padding: "12px 24px",
              borderRadius: "50px",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: thumbnailBuffer ? "#e2e8f0" : "#a78bfa",
                letterSpacing: "-0.02em",
              }}
            >
              Project Showcase
            </div>
          </div>
        </div>

        {/* Main Content: Title & Tech Stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "90%",
          }}
        >
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 900,
              lineHeight: 1.1,
              backgroundImage: thumbnailBuffer
                ? "none"
                : "linear-gradient(to right, #ffffff, #c4b5fd)",
              backgroundClip: thumbnailBuffer ? "border-box" : "text",
              color: thumbnailBuffer ? "white" : "transparent",
              letterSpacing: "-0.03em",
              textShadow: thumbnailBuffer
                ? "0 4px 20px rgba(0,0,0,0.5)"
                : "none",
            }}
          >
            {project.title}
          </div>
          {/* Tagline/Summary */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#cbd5e1",
              maxWidth: "80%",
              lineHeight: 1.4,
            }}
          >
            {project.summary || "A software engineering project."}
          </div>
        </div>

        {/* Footer: Tech Stack & Brand */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            paddingTop: "40px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {project.tech_stack?.slice(0, 3).map((tech, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#e2e8f0",
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: "white",
              }}
            >
              A
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#e2e8f0",
                letterSpacing: "-0.02em",
              }}
            >
              asrul.tech
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
