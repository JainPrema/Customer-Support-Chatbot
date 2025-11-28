# 📘 **README.md**

**RAG Customer Support Agent — Local Docker Stack (Postgres + n8n + Ollama + Next.js)**

This repository contains a complete local RAG (Retrieval-Augmented Generation) customer support system running fully on **Docker**, including:

* 🐘 **Postgres** with pgvector
* 🔁 **n8n workflows** (Close inactive sessions + Ingest + Chat)
* 🤖 **Ollama LLM server** using **LLaMA 3.1**
* 🌐 **Next.js frontend** with `/api/chat`
* 📂 **Version-controlled DB schema**
* 🎛️ **Admin + Upload pages**

---

## 🚀 **1. Project Structure**

```
project/
 ├── docker-compose.yml
 ├── frontend/                  # Next.js client + API routes
 ├── n8n/
 │    └── Close inactive sessions.json
 │    └── Ingest Workflow.json
 │    └── WF_Chat.json          # exported n8n workflows (versioned)
 ├── db/
 │    └── schema/
 │         └── schema.sql       # Postgres schema backup (no data)
 ├── .gitignore
 ├── .env.example
 └── README.md
```

---

## 🐳 **2. Running the Full Stack (Docker)**

Start all services:

```bash
docker-compose up -d
```

Services:

| Service    | URL                                              |
| ---------- | ------------------------------------------------ |
| Frontend   | [http://localhost:3000](http://localhost:3000)   |
| n8n UI     | [http://localhost:5678](http://localhost:5678)   |
| Ollama API | [http://localhost:11434](http://localhost:11434) |
| Postgres   | localhost:5432                                   |

Check running containers:

```bash
docker ps
```

---

## 🧠 **3. n8n Workflows (Version Controlled)**

Workflows are exported manually from the n8n UI:

1. Open → [http://localhost:5678](http://localhost:5678)
2. Select a workflow
3. **Export → Download**
4. Save inside:

```
n8n/Close inactive sessions.json
n8n/Ingest Workflow.json
n8n/WF_Chat.json
```

⚠️ Do NOT commit the internal `.n8n` folder.

---

## 🗄️ **4. Backing Up Postgres Schema (Manual, Docker-Based)**

This project uses **Docker Postgres**, not Supabase Cloud, so schema is exported with `pg_dump`.

### Export schema:

```bash
docker exec -t postgres pg_dump -s -U postgres postgres > db/schema/schema.sql
```

### Export seeds (optional):

```bash
docker exec -t postgres pg_dump -a -U postgres postgres > db/schema/seed.sql
```

---

## 🔄 **5. Restoring the Database Schema**

After running the stack:

```bash
docker-compose up -d
```

Restore schema:

```bash
cat db/schema/schema.sql | docker exec -i postgres psql -U postgres postgres
```

Or:

```bash
docker exec -i postgres psql -U postgres postgres < db/schema/schema.sql
```

---

## 📦 **6. Ollama Setup (LLaMA 3.1)**

### Pull required model:

```bash
docker exec -it ollama ollama pull llama3.1
```

Test:

```bash
curl http://localhost:11434/api/generate -d '{ "model": "llama3.1", "prompt": "Hello"}'
```

> ⚠️ Ensure all n8n chat workflows and frontend `/api/chat` queries reference **llama3.1**.

---

## 💬 **7. Frontend Chat API**

The Next.js backend exposes:

```
/api/chat
```

Responsibilities:

* Accept user messages
* Query n8n **WF_Chat** workflow
* Handle streaming responses
* Persist sessions in Postgres
* Trigger escalation if needed

Start dev frontend (if needed):

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 **8. Environment Variables**

Create `.env` from template:

```
cp .env.example .env
```

Example values (fake):

```
POSTGRES_HOST=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres

N8N_URL=http://n8n:5678
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=llama3.1
```

Never commit `.env`.

---

## 🔍 **9. Developer Workflow Summary**

### ✔ After updating database:

Export schema:

```bash
docker exec -t postgres pg_dump -s -U postgres postgres > db/schema/schema.sql
```

Commit to GitHub.

---

### ✔ After updating n8n workflows:

Export from n8n UI → overwrite:

```
n8n/Close inactive sessions.json
n8n/Ingest Workflow.json
n8n/WF_Chat.json
```

Commit to GitHub.

---

### ✔ After updating frontend code:

Commit `frontend/`

---

### ✔ After changing infra:

Commit `docker-compose.yml`

---

## 🧪 **10. Testing Checklist**

### 🔹 Ingestion

* Upload test document (FAQ.md)
* Run n8n **Ingest Workflow**
* Verify embeddings count in DB

### 🔹 Chat

* Open frontend
* Start session
* Ask question
* Confirm RAG retrieval works with **LLaMA 3.1**
* Test low-confidence → escalation email

### 🔹 Admin

* Check logs
* Validate documents table
* Confirm sessions update last_activity_at

---

## 🏁 **11. Final Outcome**

This project provides a fully local, containerized RAG agent with:

✔ Vector DB (pgvector)
✔ n8n workflows for ingestion + chat + session management
✔ LLM runtime (**Ollama LLaMA 3.1**)
✔ Full version control (schema + workflows + code)
✔ Easy backup + restore
✔ Extensible modular design

---


