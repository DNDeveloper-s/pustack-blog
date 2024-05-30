import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request: any) {
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
  const baseImage = await sharp(imageBuffer);

  // Get dimensions of the overlay image
  const overlayImage = await sharp(overlayImagePath).resize(400, 400);

  const shadowBuffer = await sharp(overlayImagePath)
    .resize(440, 440)
    .blur(5) // Adjust blur radius for the shadow effect
    .toBuffer();

  const image = await baseImage
    .resize(800, 600)
    .composite([
      {
        input: shadowBuffer,
        left: 800 - 320 - 20, // Adjust the shadow position
        top: -140, // Adjust the shadow position
      },
      {
        input: await overlayImage.toBuffer(),
        left: 800 - 320,
        top: -120,
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
