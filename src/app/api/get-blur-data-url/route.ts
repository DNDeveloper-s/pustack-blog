import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";
import { getPlaiceholder } from "plaiceholder";

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");

  try {
    if (!imageUrl) {
      throw new Error("imageUrl is required");
    }

    const res = await fetch(imageUrl);

    if (!res.ok) {
      throw new Error("Failed to fetch image");
    }

    const buffer = await res.arrayBuffer();

    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return new NextResponse(base64, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    if (err instanceof Error) {
      console.error(err.stack);
      return new NextResponse(err.message, {
        headers: {
          "Content-Type": "image/png",
        },
        status: 500,
      });
    } else {
      console.error(err);
      return new NextResponse(err, {
        headers: {
          "Content-Type": "image/png",
        },
        status: 500,
      });
    }
  }
}
