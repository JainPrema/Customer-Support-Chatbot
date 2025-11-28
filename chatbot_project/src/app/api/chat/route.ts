import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      query: body.query || body.message || body.input || "",
      body: body.body || "",
      chunks: body.chunks || [],
    };

    const n8nWebhookUrl = "http://n8n.localhost:5678/webhook-test/chat/message_new";
    // const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL!;

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.body) {
      return NextResponse.json({ error: "No response body from n8n" }, { status: 500 });
    }

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();

        try {
          let partial = "";

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            partial += decoder.decode(value, { stream: true });

            // Split on newlines or possible JSON delimiters
            const segments = partial.split("\n");
            for (let i = 0; i < segments.length - 1; i++) {
              const cleaned = segments[i]
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .trim();

              if (cleaned) {
                controller.enqueue(encoder.encode(cleaned + "\n"));
              }
            }

            partial = segments[segments.length - 1];
          }

          if (partial.trim()) {
            const cleaned = partial.replace(/\\n/g, "\n").trim();
            controller.enqueue(encoder.encode(cleaned));
          }

          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("💥 Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
