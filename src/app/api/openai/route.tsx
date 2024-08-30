import axios from "axios";
import Cors from "cors";
import { NextResponse } from "next/server";

// Initialize the CORS middleware with the allowed origin
const cors = Cors({
  origin: "http://pustack-blog.vercel.app", // Replace with your domain
  methods: ["POST"],
});

// Helper function to wait for middleware to execute before continuing
function runMiddleware(req: Request, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function POST(request: Request, response: any) {
  // Run CORS middleware
  try {
    // Set CORS headers manually
    const origin = request.headers.get("origin") ?? "";
    const allowedOrigins = [
      "http://pustack-blog.vercel.app",
      "http://localhost:3000",
    ]; // Your allowed origins

    if (allowedOrigins.includes(origin)) {
      const response = NextResponse.next();
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "POST");
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    } else {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const { subText } = await request.json();

    if (!subText) {
      return NextResponse.json(
        { error: "Please provide a sub-text" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY; // Replace with your API key
    const url = "https://api.openai.com/v1/chat/completions";

    const messages = [
      {
        role: "system",
        content:
          "You are an assistant that generates text variants of different lengths.",
      },
      {
        role: "user",
        content: `Given the sub-text "${subText}", generate three variants and return them in JSON format with the following keys:
        - long: a long variant (100-120 words).
        - medium: a medium variant (50-60 words).
        - short: a short variant (20-30 words).
        - very_short: a very short variant (10-20 words).`,
      },
    ];

    const res = await axios.post(
      url,
      {
        model: "gpt-3.5-turbo", // You can also use "gpt-4" if you have access
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const data = res.data;
    const text = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ text }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}
