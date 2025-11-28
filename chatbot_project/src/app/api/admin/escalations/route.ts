import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export async function GET(){
  try {
    const { data, error } = await supabase.from('escalations').select('*').order('created_at', { ascending: false }).limit(200);
    if(error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
