# Hypno Text

**Hypnotherapeutischer Schreib- und Reflexionsassistent**

Hypno Text ist ein lokaler KI-Co-Pilot für hypnotherapeutische Arbeit. Er nimmt Fallinformationen entgegen und generiert daraus mehrere professionelle Textvarianten – ressourcenorientiert, indirekt und hypothesenbasiert.

> Hypno Text stellt keine medizinischen Diagnosen und ersetzt keine professionelle psychotherapeutische Diagnostik.

---

## Installation

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen anlegen

Kopiere `.env.example` zu `.env.local` und trage deinen API-Key ein:

```bash
cp .env.example .env.local
```

Dann `.env.local` öffnen und ausfüllen:

```
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
```

Kompatibel mit:
- OpenAI (api.openai.com)
- Lokale Modelle via LM Studio oder Ollama (OpenAI-kompatible API)
- Andere OpenAI-kompatible APIs

### 3. PDFs in `/knowledge` ablegen

Lege deine hypnotherapeutischen Fach-PDFs in den Ordner:

```
hypno-text/knowledge/
```

Der Ordner ist bereits vorhanden.

### 4. Wissensbasis indexieren

Starte den Dev-Server und klicke in der App auf **"Neu indexieren"** in der Wissensbasis-Karte.

Oder per API:

```bash
curl -X POST http://localhost:3000/api/knowledge/reindex
```

### 5. Dev Server starten

```bash
npm run dev
```

Die App läuft auf [http://localhost:3000](http://localhost:3000).

---

## Nutzung

1. Formular ausfüllen (Fallbezeichnung, Anliegen, Ziel – Pflichtfelder)
2. Optional: Demo-Fall laden
3. Auf **"Generieren"** klicken
4. Vier Textvarianten werden generiert:
   - Kurzfassung
   - Fachliche Fallreflexion
   - Erickson-inspirierte Formulierung
   - Sitzungsfokus
5. Texte kopieren oder als PDF exportieren

---

## Architektur

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **pdf-parse** für PDF-Extraktion
- **jsPDF** für PDF-Export
- **OpenAI SDK** für LLM-Integration
- **Lokales RAG**: Keyword-Scoring auf JSON-basiertem Wissensindex

### Wissensverarbeitung

```
knowledge/*.pdf
    → Textextraktion (pdf-parse)
    → Chunking (ca. 500 Zeichen, 80 Zeichen Overlap)
    → Keyword-Extraktion
    → data/knowledge-index.json
    → Keyword-Scoring bei jeder Generierung
    → Top-6 relevante Chunks → Prompt
```

---

## Lokale Modelle

Du kannst Hypno Text auch mit lokalen Modellen nutzen, z.B. via [LM Studio](https://lmstudio.ai):

```env
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_API_KEY=lm-studio
OPENAI_MODEL=local-model
```

---

## Hinweis

Dieses Tool dient ausschließlich als Schreib- und Reflexionsassistent. Es ersetzt keine medizinische oder psychotherapeutische Fachdiagnostik.
