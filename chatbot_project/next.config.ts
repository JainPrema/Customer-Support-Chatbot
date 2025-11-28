/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: "./", // ✅ Ensures Next.js treats this folder as the root
  },


   env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_N8N_URL: process.env.NEXT_PUBLIC_N8N_URL,
  },
};

export default nextConfig;

