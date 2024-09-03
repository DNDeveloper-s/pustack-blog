import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("imageUrl");
    const cropX = parseFloat(searchParams.get("x") ?? "0");
    const cropY = parseFloat(searchParams.get("y") ?? "0");
    const cropWidth = parseFloat(searchParams.get("width") ?? "0");
    const cropHeight = parseFloat(searchParams.get("height") ?? "0");
    const outputWidth = parseFloat(searchParams.get("outputWidth") ?? "640");
    const outputHeight = parseFloat(searchParams.get("outputHeight") ?? "480");
    const quality = parseFloat(searchParams.get("quality") ?? "80");

    if (
      !imageUrl ||
      isNaN(cropX) ||
      isNaN(cropY) ||
      isNaN(cropWidth) ||
      isNaN(cropHeight)
    ) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(imageUrl);
    // console.log("response - ", response);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Use sharp to crop and resize the image
    const resizedImageBuffer = await sharp(Buffer.from(imageBuffer))
      .extract({
        left: cropX,
        top: cropY,
        width: cropWidth,
        height: cropHeight,
      }) // Crop the image
      .resize({ width: outputWidth, height: outputHeight }) // Resize to the desired dimensions
      .webp({ quality }) // Convert to WebP format
      .toBuffer();

    return new NextResponse(resizedImageBuffer, {
      headers: {
        "Content-Type": "image/webp",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
