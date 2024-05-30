import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");

  if (!imageUrl) {
    return new NextResponse("Missing imageUrl query parameter", {
      status: 400,
    });
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

  const overlayImagePath = path.resolve("./public/logo.png"); // Path to your logo image
  console.log("overlayImagePath - ", overlayImagePath);
  // const overlayBuffer = await sharp(overlayImagePath).toBuffer();

  // const image = await sharp(imageBuffer)
  //   .resize(1200, 630)
  //   .composite([
  //     {
  //       input: overlayBuffer,
  //       gravity: "southeast", // Position of the logo
  //       blend: "over",
  //       dx: -20,
  //       // left: 20,
  //       // top: 20,
  //     },
  //   ])
  //   .png()
  //   .toBuffer();
  // Ensure the overlay image exists
  await fs.access(overlayImagePath);

  // Get dimensions of the base image
  const baseImage = await sharp(imageBuffer).resize(1200, 630);
  const baseMetadata = await baseImage.metadata();

  // Get dimensions of the overlay image
  const overlayImage = sharp(overlayImagePath);
  const overlayMetadata = await overlayImage.metadata();

  // Calculate position
  const rightOffset = -80; // pixels from the right
  const bottomOffset = -220; // pixels from the bottom

  if (
    !baseMetadata.width ||
    !overlayMetadata.width ||
    !baseMetadata.height ||
    !overlayMetadata.height
  ) {
    return new NextResponse("Failed to get image metadata", {
      status: 500,
    });
  }

  const leftPosition = baseMetadata.width - rightOffset;
  const topPosition =
    baseMetadata.height - overlayMetadata.height - bottomOffset;

  const image = await baseImage
    .resize(1200, 630)
    .composite([
      {
        input: await overlayImage.toBuffer(),
        left: leftPosition,
        top: topPosition,
      },
    ])
    .png()
    .toBuffer();

  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
