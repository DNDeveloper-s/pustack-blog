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
  const overlayImage = await sharp(overlayImagePath).resize(250, 250);

  const shadowBuffer = await sharp(overlayImagePath)
    .resize(270, 270)
    .blur(3) // Adjust blur radius for the shadow effect
    .modulate({ brightness: 0.5 })
    .toBuffer();

  const topPosition = -90;
  const leftPosition = 290;

  const image = await baseImage
    .resize(450, 300)
    .composite([
      {
        input: shadowBuffer,
        left: leftPosition - 10, // Adjust the shadow position
        top: topPosition - 10, // Adjust the shadow position
      },
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
