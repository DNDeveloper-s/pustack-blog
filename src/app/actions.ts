"use server";
import { JSDOM } from "jsdom";

export async function parseContent(content: string) {
  const parser = new JSDOM(content, {
    contentType: "text/html",
  });
  // const doc = parser.parseFromString(this.content, "text/html");
  return parser.window.document;
}
