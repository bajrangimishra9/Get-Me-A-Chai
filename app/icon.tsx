import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#3b3b3b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "2px",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          ☕
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}