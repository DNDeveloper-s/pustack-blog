import fetch from "node-fetch";

export async function GET(req: any) {
  const response = await fetch(
    "https://www.imatheq.com/imatheq/com/imatheq/math-equation-editor-latex-mathml.html"
  );
  const html = await response.text();
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
