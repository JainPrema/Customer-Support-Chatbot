import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const payload = {
      file_name: file.name,
      content: buf.toString("utf8"),
    };

    const ingestUrl = process.env.NEXT_PUBLIC_N8N_INGEST_URL!;
    const r = await fetch(ingestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // ✅ FIX: handle both JSON and non-JSON responses cleanly
    let data;
    try {
      data = await r.json();
    } catch {
      data = await r.text();
    }

    return NextResponse.json({ ok: r.ok, result: data }, { status: r.status || 200 });
  } catch (err: any) {
    console.error("upload error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

