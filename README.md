# BusinessIntelligence.ai

### AI-Powered Business Investigation & Decision Intelligence Platform

BusinessIntelligence.ai is an AI-powered business intelligence platform designed to go beyond conventional dashboards. Instead of simply showing **what changed**, the system investigates **why it changed**, connects quantitative business data with operational signals and business documents, and produces an evidence-backed explanation with actionable recommendations.

The platform combines structured-data analytics, anomaly detection, driver decomposition, operational relationship analysis, Retrieval-Augmented Generation (RAG), and Large Language Model (LLM) reasoning into a single investigation workflow.

> **Prototype Note:** This project uses a synthetic business dataset and simulated business documents to demonstrate the complete investigation workflow.

---

## 1. Problem Statement

Traditional Business Intelligence systems are highly effective at answering questions such as:

* What was our revenue this month?
* Which region generated the most sales?
* Which product performed poorly?
* How did the KPI change compared with the previous period?

However, when a business leader asks:

> **"Why did revenue decline, and what should we investigate next?"**

the answer often requires manually combining information from multiple dashboards, spreadsheets, operational reports, customer feedback, and other business documents.

This creates several challenges:

### 1.1 Fragmented Information

Business information is distributed across different sources.

For example:

```text
Sales Data
     +
Inventory Data
     +
Delivery Data
     +
Customer Complaints
     +
Operational Reports
```

A traditional dashboard may visualize each source independently but does not necessarily connect them into one investigation.

### 1.2 Descriptive Rather Than Investigative Analytics

A conventional dashboard can identify:

```text
Revenue ↓ 14%
```

but the user still has to manually investigate:

```text
Which region?
Which product?
Which channel?
Which operational factor?
What happened operationally?
Is there supporting evidence?
What should we do?
```

### 1.3 Lack of Context

Numerical data alone may show that two variables moved together, but operational documents often contain the context required to understand what happened.

For example:

```text
Stock-out rate ↑
        +
Delivery delays ↑
        +
Revenue ↓
```

Operational reports may explain that a particular product experienced replenishment problems.

### 1.4 Slow Root-Cause Investigation

Analysts and decision-makers may spend significant time manually filtering dashboards, comparing periods, reading reports, and forming hypotheses.

BusinessIntelligence.ai aims to reduce this investigation effort by bringing these steps into one workflow.

---

# 2. Proposed Solution

BusinessIntelligence.ai transforms a traditional KPI dashboard into an **AI-assisted investigation system**.

The platform follows this workflow:

```text
Business Data
     ↓
KPI Analysis
     ↓
Anomaly Detection
     ↓
Driver Decomposition
     ↓
Operational Relationship Analysis
     ↓
Relevant Document Retrieval
     ↓
Evidence Fusion
     ↓
LLM Reasoning
     ↓
Root-Cause Explanation
     ↓
Actionable Recommendations
```

Instead of returning only a chart, the system generates an investigation containing:

* KPI performance
* Trend analysis
* Anomaly status
* Major contributing dimensions
* Operational relationships
* Supporting business documents
* Evidence strength
* Executive summary
* Likely root causes
* Confidence assessment
* Recommended actions

The objective is to help decision-makers move from:

> **"What happened?"**

to:

> **"What likely contributed to it, what evidence supports that interpretation, and what should we investigate or act on next?"**

---

# 3. Why It Matters

The value of the platform comes from connecting multiple layers of business intelligence.

```text
                WHAT?
                  │
                  ▼
             KPI Change
                  │
                  ▼
                WHERE?
                  │
                  ▼
          Regional/Product Drivers
                  │
                  ▼
                WHY?
                  │
                  ▼
       Operational Relationships
                  │
                  ▼
             EVIDENCE?
                  │
                  ▼
       Business Documents / RAG
                  │
                  ▼
              SO WHAT?
                  │
                  ▼
          Recommendations
```

This creates a more complete decision-support workflow than a conventional reporting dashboard.

The system is particularly useful for scenarios involving:

* Revenue deterioration
* Sales performance changes
* Inventory problems
* Fulfillment issues
* Customer complaints
* Regional performance anomalies
* Product performance deterioration
* Operational KPI monitoring
* Executive business investigations

---

# 4. Key Features

## 4.1 KPI Investigation

Users can select a business KPI and a reporting period to initiate an investigation.

The system analyzes the selected KPI against the available historical data.

Example:

```text
KPI: Revenue
Period: August 2025
```

The investigation then evaluates the KPI's recent behavior and contributing factors.

---

## 4.2 KPI Trend Analysis

The platform visualizes KPI movement over time.

This allows users to distinguish between:

* Stable performance
* Gradual deterioration
* Sudden changes
* Unusual periods
* Potential anomalies

The trend provides the initial context for the investigation.

---

## 4.3 Anomaly Detection

The analytics layer evaluates whether the observed KPI movement represents an unusual change.

The anomaly result becomes one of the inputs to the investigation pipeline.

The system therefore does not rely exclusively on an LLM to decide whether something changed.

Instead:

```text
Historical Business Data
        ↓
Statistical/Analytical Processing
        ↓
Anomaly Detection
        ↓
LLM receives analytical result
```

This keeps numerical analysis separate from language-model reasoning.

---

## 4.4 Driver Decomposition

After detecting a KPI change, the system investigates which business dimensions contributed to it.

Possible dimensions include:

* Region
* Product
* Channel
* Customer segment

For example:

```text
Revenue Decline
      │
      ├── East Region
      ├── Product D
      └── Distributor Channel
```

The dashboard allows users to drill into important contributors.

---

## 4.5 Operational Relationship Analysis

Business performance is often affected by operational variables.

The platform therefore examines relationships between the KPI and operational indicators such as:

* Inventory availability
* Stock-out rate
* Delivery delay rate
* Units sold
* Customer complaints

For example:

```text
Inventory Availability ↓
          │
          ▼
     Stock-outs ↑
          │
          ▼
      Units Sold ↓
          │
          ▼
      Revenue ↓
```

These relationships provide additional quantitative context for the investigation.

---

# 5. Retrieval-Augmented Generation

A key feature of BusinessIntelligence.ai is the use of **Retrieval-Augmented Generation (RAG)**.

Traditional LLM-only analysis can produce explanations based on the information included in the prompt, but it does not automatically have access to an organization's internal reports.

The RAG pipeline allows the system to retrieve relevant business documents before generating its explanation.

```text
Business Documents
       ↓
Document Chunking
       ↓
Embeddings
       ↓
Vector Store
       ↓
Semantic Retrieval
       ↓
Relevant Evidence
       ↓
LLM
```

The prototype includes business documents such as:

```text
inventory_report.txt
operations_report.txt
sales_report.txt
customer_feedback.txt
```

These documents contain qualitative operational information that complements the structured business dataset.

---

# 6. Evidence Fusion

One of the most important design principles is that the LLM does not operate independently.

The reasoning layer receives two major forms of evidence:

### Quantitative Evidence

Generated from structured business data:

```text
KPI movement
Anomaly status
Regional contribution
Product contribution
Operational relationships
```

### Qualitative Evidence

Retrieved from business documents:

```text
Inventory reports
Operations reports
Sales reports
Customer feedback
```

These are combined into an evidence package:

```text
             Quantitative Evidence
                     │
                     │
                     ▼
                ┌─────────┐
                │ Evidence│
                │  Fusion │
                └────┬────┘
                     │
                     ▲
                     │
             Document Evidence
```

The resulting package is sent to the LLM for synthesis.

---

# 7. AI Reasoning Layer

The LLM acts as a **reasoning and synthesis layer**, not as the primary numerical analytics engine.

This distinction is important.

The system first calculates business metrics using deterministic analytics logic.

The LLM then receives those results and performs tasks such as:

* Synthesizing evidence
* Explaining likely contributors
* Connecting quantitative and qualitative signals
* Producing an executive summary
* Identifying likely root causes
* Generating recommendations
* Communicating uncertainty

The prototype uses the Groq API with a configurable model.

The model is instructed to:

1. Avoid inventing facts.
2. Use the supplied evidence.
3. Distinguish correlation from causation.
4. Avoid unsupported numerical claims.
5. Communicate uncertainty.
6. Base recommendations on available evidence.
7. Return structured JSON.

---

# 8. Correlation Is Not Treated as Causation

A deliberate design principle of the platform is to avoid presenting statistical relationships as proven causal relationships.

For example:

```text
Stock-out rate ↑
Revenue ↓
```

does not automatically prove:

```text
Stock-outs caused the entire revenue decline.
```

Instead, the system communicates the finding as a likely contributor when supported by multiple pieces of evidence.

The investigation can therefore distinguish between:

```text
Observed
Supported
Likely
Uncertain
```

This is particularly important for business decision-support applications where overconfident AI explanations can be misleading.

---

# 9. Prototype Scenario

The prototype contains a deliberately constructed business scenario.

The synthetic dataset contains:

```text
8 months
× 4 regions
× 4 products
× 2 channels
× 2 customer segments

= 512 records
```

The dataset includes:

```text
date
region
product
channel
customer_segment
revenue
inventory_available
stockout_rate
delivery_delay_rate
customer_complaints
units_sold
unit_price
```

The demonstration scenario introduces deterioration during August, particularly involving:

```text
East Region
       +
Product D
       +
Inventory availability
       +
Stock-outs
       +
Delivery delays
```

The purpose of this scenario is to demonstrate whether the system can connect multiple signals into a coherent business investigation.

---

# 10. Example Investigation

Suppose an executive observes:

```text
Revenue ↓
```

The platform investigates progressively.

### Step 1 — KPI

```text
Revenue
```

### Step 2 — Trend

The system examines historical revenue behavior and identifies the relevant change.

### Step 3 — Driver Decomposition

The system identifies major contributors.

Example:

```text
East Region
Product D
Distributor Channel
```

### Step 4 — Operational Signals

The system evaluates associated operational variables.

Example:

```text
Stock-out rate ↑
Delivery delay rate ↑
Units sold ↓
Customer complaints ↑
```

### Step 5 — Document Retrieval

Relevant documents are retrieved.

For example:

```text
Inventory Report
Operations Report
Sales Report
Customer Feedback
```

### Step 6 — Evidence Fusion

The quantitative and qualitative evidence is combined.

### Step 7 — AI Reasoning

The LLM generates:

```text
Executive Summary
Root Causes
Confidence
Ambiguity
Recommendations
```

### Step 8 — Decision Support

The final dashboard gives the user potential next actions.

---

# 11. System Architecture

The locked architecture is:

```text
                         ┌──────────────────┐
                         │       USER       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Next.js      │
                         │ TypeScript + UI  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ FastAPI Backend  │
                         └────────┬─────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
          ┌───────────┐    ┌────────────┐    ┌────────────┐
          │    KPI    │    │  Anomaly   │    │   Driver   │
          │  Analysis │    │ Detection  │    │  Analysis  │
          └─────┬─────┘    └──────┬─────┘    └──────┬─────┘
                │                 │                 │
                └─────────────────┼─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Evidence Fusion  │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
           ┌─────────────────┐        ┌─────────────────┐
           │ Structured Data │        │       RAG       │
           │      CSV        │        │                 │
           └─────────────────┘        └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │   Embeddings    │
                                      │ + Vector Store  │
                                      └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │    Retrieval    │
                                      └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │    Groq LLM     │
                                      │    Reasoning    │
                                      └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │  Investigation  │
                                      │     Result      │
                                      └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │ Next.js         │
                                      │ Dashboard       │
                                      └─────────────────┘
```

---

# 12. Technology Stack

## Frontend

| Technology   | Purpose                                        |
| ------------ | ---------------------------------------------- |
| Next.js      | Frontend application and application framework |
| TypeScript   | Type-safe frontend development                 |
| Tailwind CSS | UI styling                                     |
| React        | Interactive dashboard components               |

## Backend

| Technology   | Purpose                             |
| ------------ | ----------------------------------- |
| Python       | Analytics and AI backend            |
| FastAPI      | REST API layer                      |
| Pydantic     | Request/response validation         |
| Pandas       | Structured business-data processing |
| NumPy        | Numerical computation               |
| Scikit-learn | Analytical/statistical utilities    |

## AI / RAG

| Technology             | Purpose                          |
| ---------------------- | -------------------------------- |
| Sentence Transformers  | Text embeddings                  |
| Local vector store     | Semantic document retrieval      |
| Groq API               | LLM reasoning                    |
| Configurable LLM model | Business investigation synthesis |

## Data

| Technology | Purpose                            |
| ---------- | ---------------------------------- |
| CSV        | Prototype structured business data |
| TXT        | Prototype business documents       |

---

# 13. Backend Architecture

The backend follows a modular service-oriented structure.

```text
backend/
└── app/
    ├── api/
    │   └── routes/
    │       └── investigation.py
    │
    ├── core/
    │   └── config.py
    │
    ├── models/
    │   ├── kpi_models.py
    │   └── investigation_models.py
    │
    ├── rag/
    │   ├── embeddings.py
    │   ├── vector_store.py
    │   ├── ingestion.py
    │   └── container.py
    │
    └── services/
        ├── kpi_service.py
        ├── anomaly_service.py
        ├── decomposition_service.py
        ├── driver_service.py
        ├── retrieval_service.py
        ├── evidence_service.py
        └── llm_service.py
```

---

# 14. Backend Components

## `kpi_service.py`

Responsible for KPI-related calculations and historical performance analysis.

The service operates on structured business data and produces the numerical information used by later stages.

---

## `anomaly_service.py`

Determines whether the selected KPI demonstrates unusual behavior.

This analytical result is passed into the investigation pipeline.

---

## `decomposition_service.py`

Breaks down KPI changes across business dimensions.

This allows the platform to identify where the largest contribution to the KPI movement occurred.

---

## `driver_service.py`

Analyzes operational variables and their relationships with the business KPI.

This provides additional context around potential operational drivers.

---

## `embeddings.py`

Converts document text and queries into vector representations.

The prototype uses Sentence Transformers with:

```text
all-MiniLM-L6-v2
```

Embeddings are normalized to support cosine-similarity retrieval.

---

## `vector_store.py`

Provides the lightweight vector-search layer.

Each stored document chunk contains:

```text
document_id
source
content
embedding
```

When a query arrives, the query is embedded and compared against stored document embeddings using cosine similarity.

---

## `ingestion.py`

Handles document ingestion.

The process is:

```text
TXT File
   ↓
Read Text
   ↓
Chunk Text
   ↓
Generate Embeddings
   ↓
Create Vector Documents
   ↓
Add to Vector Store
```

---

## `retrieval_service.py`

Receives an investigation query, generates its embedding, searches the vector store, and returns the most relevant document chunks.

---

## `evidence_service.py`

Combines quantitative investigation results with retrieved documents.

The resulting evidence package becomes the main input to the reasoning layer.

---

## `llm_service.py`

Handles communication with the Groq API.

It:

1. Builds the reasoning prompt.
2. Sends quantitative evidence.
3. Sends retrieved document evidence.
4. Requests structured JSON.
5. Validates the returned structure.
6. Returns the final investigation result.

---

# 15. RAG Pipeline in Detail

The document pipeline works as follows:

```text
data/documents/
       │
       ├── inventory_report.txt
       ├── operations_report.txt
       ├── sales_report.txt
       └── customer_feedback.txt
       │
       ▼
Document Ingestion
       │
       ▼
Text Chunking
       │
       ▼
Sentence Transformer
       │
       ▼
Vector Embeddings
       │
       ▼
Vector Store
       │
       ▼
Semantic Query
       │
       ▼
Top-K Relevant Chunks
       │
       ▼
Evidence Fusion
```

This makes the system capable of grounding AI explanations in business-specific documents.

---

# 16. API Investigation Flow

The primary investigation endpoint orchestrates the system.

Conceptually:

```text
POST /investigation
```

The request contains information such as:

```text
KPI
Period
```

The backend then performs:

```text
1. Load business data
2. Calculate KPI performance
3. Detect anomaly
4. Decompose drivers
5. Analyze operational relationships
6. Construct retrieval query
7. Retrieve relevant documents
8. Build evidence package
9. Send evidence to Groq
10. Validate AI response
11. Return structured investigation
```

---

# 17. Investigation Response

The API returns a structured response containing information such as:

```json
{
  "status": "success",
  "investigation": {
    "kpi": {},
    "anomaly": {},
    "trend": [],
    "drivers": [],
    "operational_drivers": [],
    "evidence": [],
    "evidence_strength": "high",
    "executive_summary": "...",
    "root_causes": [],
    "recommendations": [],
    "confidence": "high",
    "ambiguity": "..."
  }
}
```

This structure keeps the frontend independent from the internal implementation of the analytics and reasoning services.

---

# 18. Frontend Architecture

The frontend is built with Next.js, TypeScript, React, and Tailwind CSS.

The main dashboard is composed of investigation-oriented components.

```text
frontend/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   └── investigation/
│       ├── KPITrendChart.tsx
│       ├── CorrelationChart.tsx
│       ├── EvidenceStrength.tsx
│       ├── DriverInvestigation.tsx
│       ├── RootCausePanel.tsx
│       └── RecommendationsPanel.tsx
│
└── lib/
    ├── api.ts
    └── types.ts
```

---

# 19. Dashboard Experience

The dashboard follows an executive investigation workflow.

### KPI Selection

The user selects the KPI and period.

### Performance Overview

The dashboard presents:

* Current value
* Previous value
* Change
* Trend

### Investigation Summary

The system presents an executive-level explanation.

### Driver Analysis

Users can inspect major contributing regions, products, channels, or segments.

### Operational Analysis

Users can inspect relevant operational signals.

### Evidence

Retrieved documents are displayed with their source and content.

### Root Causes

The AI-generated likely explanations are displayed with confidence.

### Recommendations

Potential actions are presented with rationale and priority.

---

# 20. User Journey

The complete user journey is:

```text
1. Open dashboard
       ↓
2. Select KPI
       ↓
3. Select period
       ↓
4. Click "Investigate KPI"
       ↓
5. KPI analysis
       ↓
6. Anomaly detection
       ↓
7. Driver decomposition
       ↓
8. Operational analysis
       ↓
9. Document retrieval
       ↓
10. Evidence fusion
       ↓
11. AI reasoning
       ↓
12. Investigation displayed
       ↓
13. User drills into contributors
       ↓
14. User reviews evidence
       ↓
15. User reviews recommendations
```

---

# 21. Data Flow

The complete data flow is:

```text
                     BUSINESS DATA
                          │
                          ▼
                  ┌───────────────┐
                  │ KPI Analysis  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │    Anomaly    │
                  │   Detection   │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │    Driver     │
                  │ Decomposition │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Operational   │
                  │   Analysis    │
                  └───────┬───────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Evidence Fusion  │◄──────────────┐
                 └────────┬─────────┘               │
                          │                          │
                          ▼                          │
                    ┌──────────┐                     │
                    │   LLM    │                     │
                    └────┬─────┘                     │
                         │                           │
                         ▼                           │
                   Investigation                     │
                                                     │
                DOCUMENTS                            │
                    │                                │
                    ▼                                │
              Text Chunking                          │
                    │                                │
                    ▼                                │
               Embeddings                            │
                    │                                │
                    ▼                                │
              Vector Store                           │
                    │                                │
                    ▼                                │
                Retrieval ───────────────────────────┘
```

---

# 22. Project Structure

```text
businessintelligenceai/
│
├── README.md
├── .gitignore
│
├── data/
│   ├── business_data.csv
│   ├── generate_business_data.py
│   │
│   └── documents/
│       ├── inventory_report.txt
│       ├── operations_report.txt
│       ├── sales_report.txt
│       └── customer_feedback.txt
│
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── requirements.txt
│   ├── test_rag.py
│   │
│   └── app/
│       ├── main.py
│       │
│       ├── api/
│       │   └── routes/
│       │       └── investigation.py
│       │
│       ├── core/
│       │   └── config.py
│       │
│       ├── models/
│       │   ├── kpi_models.py
│       │   └── investigation_models.py
│       │
│       ├── rag/
│       │   ├── embeddings.py
│       │   ├── vector_store.py
│       │   ├── ingestion.py
│       │   └── container.py
│       │
│       └── services/
│           ├── kpi_service.py
│           ├── anomaly_service.py
│           ├── decomposition_service.py
│           ├── driver_service.py
│           ├── retrieval_service.py
│           ├── evidence_service.py
│           └── llm_service.py
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    │
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    │
    ├── components/
    │   └── investigation/
    │       ├── KPITrendChart.tsx
    │       ├── CorrelationChart.tsx
    │       ├── EvidenceStrength.tsx
    │       ├── DriverInvestigation.tsx
    │       ├── RootCausePanel.tsx
    │       └── RecommendationsPanel.tsx
    │
    └── lib/
        ├── api.ts
        └── types.ts
```

---

# 23. Installation

## Prerequisites

Install:

* Python 3.10+
* Node.js 18+
* npm
* Git

A Groq API key is required for AI-powered investigation.

---

# 24. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 25. Environment Variables

Create:

```text
backend/.env
```

Add:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Do not commit `.env` to version control.

---

# 26. Run the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The FastAPI backend will start locally.

---

# 27. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local Next.js application in your browser.

---

# 28. Testing RAG Retrieval

The prototype includes a simple RAG test script:

```text
backend/test_rag.py
```

Run:

```bash
cd backend
python test_rag.py
```

Example queries include:

```text
Why did revenue decline?

What happened to Product D?

What happened in the East region?

Why were customers experiencing delays?
```

The test verifies that the semantic retrieval layer returns relevant business documents.

---

# 29. Example RAG Retrieval

For a query such as:

```text
Why did revenue decline?
```

the retrieval system should surface relevant documents such as:

```text
sales_report.txt
inventory_report.txt
operations_report.txt
```

The retrieved information is then provided to the evidence-fusion layer.

---

# 30. Security Considerations

The prototype follows several basic security practices.

### API Key Protection

The Groq API key is stored in an environment variable rather than source code.

```env
GROQ_API_KEY=...
```

### `.gitignore`

Environment files and Python-generated artifacts should not be committed.

### LLM Grounding

The LLM is explicitly instructed not to invent unsupported facts.

### Structured Responses

The AI response is requested as JSON and validated before being returned to the frontend.

---

# 31. Error Handling

The backend handles failures in the AI investigation pipeline and returns an appropriate API error rather than exposing raw implementation details.

The frontend also provides an error state so users receive a meaningful message if the investigation cannot be completed.

The interface includes a loading state while the investigation is being processed.

---

# 32. Design Principles

The project follows several important design principles.

## Deterministic Analytics First

Numerical calculations are performed by analytical services rather than delegated entirely to an LLM.

```text
Data
 ↓
Analytics
 ↓
Evidence
 ↓
LLM
```

rather than:

```text
Data
 ↓
LLM guesses everything
```

---

## Evidence Before Explanation

The system retrieves evidence before generating the final explanation.

```text
Evidence
   ↓
Reasoning
   ↓
Explanation
```

This improves grounding.

---

## Explainability

The user can inspect the evidence used to support the investigation.

The system does not simply return:

```text
"Inventory caused the decline."
```

Instead, the user can see:

```text
Quantitative signal
        +
Retrieved operational report
        +
AI interpretation
```

---

## Uncertainty Awareness

The system avoids presenting correlation as definitive causation.

This makes the output more appropriate for decision-support scenarios.

---

# 33. Limitations

This project is a prototype and has several limitations.

### Synthetic Dataset

The business data is generated for demonstration purposes and does not represent real organizational data.

### Prototype Vector Store

The vector store is intentionally lightweight and local. A production implementation would require a persistent and scalable vector database.

### Limited Document Formats

The current prototype focuses on text documents. Production deployments would need support for formats such as:

* PDF
* DOCX
* XLSX
* PPTX
* Web pages
* Database records

### Limited Causal Inference

The system identifies relationships and evidence-supported hypotheses. It does not perform formal causal inference.

### LLM Dependence

The final natural-language reasoning depends on the configured LLM service.

### Prototype Scalability

The current architecture is designed to demonstrate the complete workflow rather than support large enterprise-scale workloads.

---

# 34. Future Extensions

The architecture can be extended in future versions without changing the core investigation concept.

Potential production extensions include:

### Enterprise Data Connectors

Connect directly to:

```text
PostgreSQL
Snowflake
BigQuery
Excel
ERP systems
CRM systems
Data warehouses
```

### Persistent Vector Database

Replace the prototype vector store with a production vector database.

### Multi-Format Document Processing

Add ingestion for:

```text
PDF
DOCX
XLSX
PPTX
HTML
```

### Advanced Causal Analysis

Introduce dedicated causal inference techniques to distinguish correlation from causal impact more rigorously.

### Role-Based Access

Different users could receive different access to:

* Financial data
* Operational data
* Customer information
* Executive reports

### Automated Monitoring

The platform could continuously monitor KPIs and automatically trigger investigations when anomalies occur.

### Conversational Investigation

A future interface could support follow-up questions such as:

```text
Why did East perform poorly?

What was the largest contributor?

Show me the evidence.

What should the operations team investigate?

Compare this with July.
```

---

# 35. Production Evolution

The prototype can evolve into a production architecture:

```text
                  DATA SOURCES
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
       ERP            CRM        Data Warehouse
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                Data Processing
                       │
                       ▼
               Analytics Engine
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       KPI Monitoring          RAG
             │                   │
             │             Document Store
             │                   │
             └─────────┬─────────┘
                       ▼
                Evidence Fusion
                       │
                       ▼
                   LLM Layer
                       │
                       ▼
              Investigation Engine
                       │
                       ▼
                 Web Dashboard
```

The prototype therefore demonstrates the core intelligence workflow while leaving clear paths for enterprise expansion.

---

# 36. Why This Is More Than a Dashboard

A traditional dashboard primarily provides:

```text
Metrics
Charts
Filters
Reports
```

BusinessIntelligence.ai adds an investigation layer:

```text
Metrics
   ↓
Anomaly
   ↓
Drivers
   ↓
Operational Signals
   ↓
Evidence
   ↓
Reasoning
   ↓
Recommendations
```

The goal is not to replace analysts or decision-makers.

Instead, the platform acts as an **investigation assistant** that reduces the manual effort required to move from an observed KPI change to a structured, evidence-backed understanding of the situation.

---

# 37. Core Value Proposition

BusinessIntelligence.ai can be summarized as:

> **From dashboards that show what happened to AI-assisted investigations that explain what likely contributed to it.**

The platform connects:

```text
Structured Data
       +
Operational Analytics
       +
Unstructured Business Knowledge
       +
AI Reasoning
       =
Evidence-Backed Business Intelligence
```

---

# 38. Demo Flow

For a demonstration, use the following sequence:

### Step 1

Open the dashboard.

### Step 2

Select:

```text
KPI: Revenue
Period: August 2025
```

### Step 3

Click:

```text
Investigate KPI
```

### Step 4

Show the KPI change and trend.

### Step 5

Show the largest contributing dimensions.

For the prototype scenario, this should lead toward the East region and Product D.

### Step 6

Open the operational relationships.

Highlight signals such as:

```text
Stock-out rate
Delivery delay rate
Units sold
Customer complaints
```

### Step 7

Show the supporting documents.

Explain that the RAG layer retrieves relevant operational context.

### Step 8

Show the AI-generated root-cause analysis.

### Step 9

Show the recommendations.

The complete story becomes:

```text
Revenue declined
      ↓
East contributed significantly
      ↓
Product D was a major contributor
      ↓
Inventory availability deteriorated
      ↓
Stock-outs increased
      ↓
Fulfillment performance deteriorated
      ↓
Customer complaints increased
      ↓
Business documents support the interpretation
      ↓
AI synthesizes the evidence
      ↓
Recommended operational actions
```

---

# 39. Example Executive Output

A representative investigation may look like:

```text
Executive Summary

Revenue declined during the selected period, with the East
region and Product D representing important contributors to the
observed movement.

Operational indicators show deterioration in inventory
availability and fulfillment performance during the same period.
Retrieved business reports provide additional qualitative support
for Product D availability and East-region fulfillment issues.

These factors are supported as likely contributors to the
observed revenue decline, although the available evidence does
not establish that they were the sole causal drivers.
```

Potential actions:

```text
1. Review Product D replenishment planning.
2. Investigate East-region inventory allocation.
3. Review fulfillment and delivery delays.
4. Quantify potential lost sales associated with stock-outs.
```

---

# 40. Project Objectives Achieved

The prototype demonstrates the following capabilities:

* KPI monitoring
* Historical trend analysis
* Anomaly detection
* Driver decomposition
* Operational relationship analysis
* Semantic document retrieval
* RAG-based evidence retrieval
* Evidence fusion
* LLM-based investigation
* Root-cause synthesis
* Confidence and uncertainty communication
* Actionable recommendations
* Interactive dashboard
* End-to-end API integration

---

# 41. Conclusion

BusinessIntelligence.ai demonstrates an approach to modern business intelligence in which analytics and generative AI work together.

The analytical layer establishes **what changed and where the change occurred**.

The operational layer identifies **which business signals are associated with the change**.

The RAG layer provides **relevant organizational context and supporting evidence**.

The LLM layer then synthesizes these signals into an understandable investigation containing:

```text
What happened?
      ↓
Where did it happen?
      ↓
What contributed?
      ↓
What evidence supports it?
      ↓
How confident are we?
      ↓
What should be investigated or done next?
```

The result is a prototype for an AI-powered business investigation platform that moves beyond static reporting toward **evidence-backed decision intelligence**.

---

# 42. Quick Start

```bash
# Backend

cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

# Configure .env
# GROQ_API_KEY=your_key
# GROQ_MODEL=llama-3.3-70b-versatile

uvicorn app.main:app --reload
```

In another terminal:

```bash
# Frontend

cd frontend

npm install

npm run dev
```

Then open the local frontend and run an investigation.

---

# 43. Project Summary

**BusinessIntelligence.ai** is an AI-powered business investigation platform combining:

```text
Next.js
+
TypeScript
+
Tailwind CSS
+
FastAPI
+
Python
+
Pandas
+
Scikit-learn
+
Sentence Transformers
+
Vector Retrieval
+
Groq LLM
+
RAG
```

to transform business data and organizational knowledge into an interactive, evidence-backed investigation workflow.

**Core principle:**

> **Don't just show the number. Investigate the change. Connect it to evidence. Help the decision-maker determine what to do next.**
