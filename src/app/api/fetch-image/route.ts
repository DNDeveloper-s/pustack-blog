// import { NextResponse } from "next/server";
// import sharp from "sharp";
// import path from "path";
// import { promises as fs } from "fs";

// export const revalidate = 0;

// export async function GET(request: any) {
//   const { searchParams } = new URL(request.url);
//   const imageUrl = searchParams.get("imageUrl");
//   const width = searchParams.get("width");
//   const height = searchParams.get("height");
//   const original = searchParams.get("original");

//   if (!imageUrl) {
//     return new NextResponse("Missing imageUrl query parameter", {
//       status: 400,
//     });
//   }

//   const response = await fetch(imageUrl);
//   // console.log("response - ", response);
//   if (!response.ok) {
//     return NextResponse.json(
//       { error: "Failed to fetch image" },
//       { status: 500 }
//     );
//   }

//   const arrayBuffer = await response.arrayBuffer();
//   const imageBuffer = Buffer.from(arrayBuffer);

//   // const overlayBuffer = await sharp(overlayImagePath).toBuffer();

//   // const image = await sharp(imageBuffer)
//   //   .resize(1200, 630)
//   //   .composite([
//   //     {
//   //       input: overlayBuffer,
//   //       gravity: "southeast", // Position of the logo
//   //       blend: "over",
//   //       dx: -20,
//   //       // left: 20,
//   //       // top: 20,
//   //     },
//   //   ])
//   //   .png()
//   //   .toBuffer();
//   // Ensure the overlay image exists

//   // Get dimensions of the base image
//   const baseImage = await sharp(imageBuffer);

//   // const shadowBuffer = await sharp(overlayImagePath)
//   //   .resize(320, 320)
//   //   .blur(3) // Adjust blur radius for the shadow effect
//   //   .modulate({ brightness: 0.5 })
//   //   .toBuffer();

//   const _width = +(width ?? 450);
//   const _height = +(height ?? 300);

//   if (original) {
//     const image = await baseImage.png().toBuffer();

//     return new NextResponse(image, {
//       headers: {
//         "Content-Type": "image/png",
//       },
//     });
//   }

//   const image = await baseImage
//     .resize(+(width ?? 450), +(height ?? 300))
//     .png()
//     .toBuffer();

//   return new NextResponse(image, {
//     headers: {
//       "Content-Type": "image/png",
//     },
//   });
// }

// pages/api/fetch-image.js

import { NextResponse } from "next/server";
import sharp from "sharp";

export const revalidate = 0;

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");
  const width = searchParams.get("width");
  const height = searchParams.get("height");
  const original = searchParams.get("original");

  if (!imageUrl) {
    return new NextResponse("Missing imageUrl query parameter", {
      status: 400,
    });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("Content-Type");
    const format = contentType?.split("/")[1]; // Extract image format

    if (original) {
      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": contentType ?? "image/png",
        },
      });
    }

    const baseImage = sharp(imageBuffer);

    const _width = +(width ?? 450);
    const _height = +(height ?? 300);
    let resizedImage;

    if (format === "jpeg" || format === "jpg") {
      resizedImage = await baseImage.resize(_width, _height).jpeg().toBuffer();
    } else if (format === "png") {
      resizedImage = await baseImage.resize(_width, _height).png().toBuffer();
    } else if (format === "webp") {
      resizedImage = await baseImage.resize(_width, _height).webp().toBuffer();
    } else if (format === "gif") {
      resizedImage = await baseImage.resize(_width, _height).gif().toBuffer();
    } else {
      // Fallback to original image if format is not handled
      resizedImage = await baseImage.resize(_width, _height).png().toBuffer();
    }

    return new NextResponse(resizedImage, {
      headers: {
        "Content-Type": contentType ?? "image/png",
      },
    });
  } catch (error) {
    console.error("Error fetching and processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
