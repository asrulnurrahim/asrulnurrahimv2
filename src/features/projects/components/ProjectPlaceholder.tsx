import React from "react";

export function ProjectPlaceholder() {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-900">
      <svg
        className="absolute inset-0 h-full w-full opacity-60 mix-blend-color-dodge transition-transform duration-700 ease-out group-hover:scale-105"
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#3b82f6", stopOpacity: 0.2 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#8b5cf6", stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#14b8a6", stopOpacity: 0.2 }}
            />
          </linearGradient>

          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#ec4899", stopOpacity: 0.2 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#6366f1", stopOpacity: 0.3 }}
            />
          </linearGradient>

          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="2" fill="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>

        {/* Base Background Gradient */}
        <rect width="100%" height="100%" fill="url(#grad1)" />

        {/* Diagonal Gradient Overlay */}
        <path d="M0,0 L800,0 L800,600 Z" fill="url(#grad2)" opacity="0.6" />

        {/* Dot Pattern Overlay */}
        <rect width="100%" height="100%" fill="url(#dots)" />

        {/* Abstract Geometry */}
        <g stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none">
          {/* Main Circles */}
          <circle cx="200" cy="150" r="120" />
          <circle cx="600" cy="450" r="180" />
          <circle cx="450" cy="100" r="60" />

          {/* Intersecting Lines */}
          <line x1="80" y1="150" x2="800" y2="450" />
          <line x1="200" y1="30" x2="600" y2="630" />

          {/* Decorative Polygon */}
          <polygon
            points="300,200 500,100 650,300 450,450"
            fill="rgba(59, 130, 246, 0.05)"
            stroke="rgba(255,255,255,0.15)"
          />
        </g>
      </svg>
    </div>
  );
}
