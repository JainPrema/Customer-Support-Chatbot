'use client';
import { useState } from 'react';

export default function UploadPage(){
  const [file, setFile] = useState<File|null>(null);
  const [msg, setMsg] = useState('');

  async function submit(){
    if(!file) return setMsg('Choose a file');
    setMsg('Uploading...');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await res.json().catch(()=>({}));
    setMsg(res.ok ? 'Uploaded & queued for ingest.' : `Failed: ${JSON.stringify(j)}`);
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Upload Document</h1>
      <input type="file" accept=".md,.txt,.pdf" onChange={(e)=>setFile(e.target.files?.[0]??null)} className="my-4" />
      <div className="flex gap-2">
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
      </div>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </main>
  );
}
