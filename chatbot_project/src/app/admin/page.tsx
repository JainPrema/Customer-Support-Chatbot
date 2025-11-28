'use client';
import useSWR from 'swr';
const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function AdminPage(){
  const { data: docs } = useSWR('/api/admin/documents', fetcher, { refreshInterval: 5000 });
  const { data: esc } = useSWR('/api/admin/escalations', fetcher, { refreshInterval: 5000 });

  const documents = Array.isArray(docs) ? docs : (docs?.data ?? []);
  const escalations = Array.isArray(esc) ? esc : (esc?.data ?? []);

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>

      <section>
        <h2 className="text-lg font-medium">Documents</h2>
        <table className="w-full text-sm mt-2">
          <thead className="bg-slate-100"><tr><th className="p-2 text-left">Name</th><th className="p-2">Chunks</th><th className="p-2">Created</th></tr></thead>
          <tbody>
            {documents.map((d:any)=>(
              <tr key={d.id} className="border-t"><td className="p-2">{d.file_name}</td><td className="p-2">{d.chunk_count}</td><td className="p-2">{new Date(d.created_at).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-lg font-medium">Escalations</h2>
        <table className="w-full text-sm mt-2">
          <thead className="bg-slate-100"><tr><th className="p-2">Session</th><th className="p-2">Message</th><th className="p-2">Created</th></tr></thead>
          <tbody>
            {escalations.map((e:any)=>(
              <tr key={e.id} className="border-t"><td className="p-2">{e.session_id}</td><td className="p-2">{e.user_message}</td><td className="p-2">{new Date(e.created_at).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

