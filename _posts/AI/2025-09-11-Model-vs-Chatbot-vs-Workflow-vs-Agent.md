---

layout: post

title: "Model vs. Chatbot vs. Workflow vs. Agent: Draft"
subtitle: "Clarifying the distinctions between core AI concepts in formal and plain language"
quote: "A chatbot only emits text, a workflow follows a script, but an agent perceives, decides, and acts with autonomy."
excerpt: "This post breaks down the differences between models, chatbots, workflows, and agents, using both formal computer science definitions and plain-English explanations."
source: "Original Content"
source-url: ""
call-to-action: "Discuss on Mastodon"

date: 2025-09-11 05:00:00 -0700
update: 2025-09-11 05:00:00 -0700

author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512\&d=mp\&r=g
    name: Ted Tschopp
    url: https://tedt.org/

bullets:
  - Defines models, chatbots, workflows, and agents in formal computer science notation.
  - Provides plain-English explanations for each concept.
  - Highlights the difference between text-only interfaces and autonomous systems.
  - Includes a diagram mapping relationships between the concepts.
  - Summarizes variables and notation in a consolidated reference table.

description: "A deep dive into the distinctions between AI models, chatbots, workflows, and agents. This post blends formal definitions with clear explanations, offering both a technical and intuitive understanding of these foundational terms."
seo-description: "Explore the differences between models, chatbots, workflows, and agents, explained with formal notation and plain-English clarity."

categories:
  - AI

tags:
  - ai
  - models
  - chatbots
  - workflows
  - agents
  - llms
  - automation
  - autonomy
  - computer science
  - governance

keywords:
  - chatbot definition
  - workflow vs agent
  - autonomous agents
  - llm chatbot
  - ai terminology
  - computer science definitions
  - language model
  - agent autonomy
  - workflow automation

location:
    name: Bradbury, CA
    coordinates:
        latitude: 34.1470
        longitude: -117.9709

image: "img/2025-09/AI-Model-Chatbot-Workflow-Agent.webp"
image-alt: "Diagram showing differences between model, chatbot, workflow, and agent"
image-artist: "Ted Tschopp"
image-artist-URL: https://tedt.org
image-credits: "Ted Tschopp"
image-credits-URL: https://tedt.org
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: 
image-credits-title: "Model vs. Chatbot vs. Workflow vs. Agent Diagram"
image-description: "A diagram illustrating the relationships and distinctions between models, chatbots, workflows, and agents."
image-title: "Model vs. Chatbot vs. Workflow vs. Agent"
image_width:
image_height:

mastodon-post-id: 115186286978010327

math: true
mermaid: true
no_toc: true

---

| Concept      | Formal CS Definition (with variable definitions)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Plain English Definition                                                                                                                                                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Model**  = the **engine** (statistical text predictor).   | **Language Model**:  $L_{\theta} : \Sigma^{\ast} \to \Delta(\Sigma)$  **Variables:**<br>$\Sigma$: token vocabulary.<br>$\Sigma^{\ast}$: all finite strings of tokens.<br>$\Delta(\Sigma)$: probability distributions over tokens.<br>$\theta$: parameters of the model.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | The raw **LLM engine**: given a prompt (string of tokens), it returns a probability distribution over the next token and generates text by sampling/decoding. Examples: GPT-4, Claude, Mistral.                                                                  |
| **Chatbot** = the **interface** around a model (dialogue handling, memory, RAG, safety).  | **Chatbot tuple**:  $\mathcal{C} = (L_{\theta}, s, \tau, \delta, \omega, M_c, \mu_c, \Gamma, \mathcal{B})$  **Variables:**<br>$L_{\theta}$: language model (see above).<br>$s \in \Sigma^{\ast}$: system prompt.<br>$\tau: (R_c \times \Sigma^{\ast})^{\ast} \to \Sigma^{\ast}$: chat template (serialize history).<br>$\delta$: decoding policy (greedy, top-k, nucleus).<br>$R_c = \{\mathsf{sys},\mathsf{user},\mathsf{bot}\}$: roles.<br>$M_c$: conversation memory space.<br>$\mu_c$: memory update rule.<br>$\omega$: windowing/truncation to fit context budget.<br>$K_c \in \mathbb{N}$: max context tokens.<br>$\Gamma$: safety/governance filter.<br>$\mathcal{B}$: optional retrieval-augmented backend (documents, retrieval, ranking, selection).                                                                                                                              | A **conversation interface** around a model: it handles history, system instructions, optional memory, retrieval, and safety checks — but **its only action is emitting text**.                                                                                  |
| **Workflow** = the **scripted process** (pre-drawn map of tasks, deterministic once defined).| **Workflow net / graph**:  $W = (V, E, v_{start}, v_{end}, D_w, f_w)$  **Variables:**<br>$V$: set of tasks/nodes.<br>$E \subseteq V \times V$: edges (control/data flow).<br>$v_{start}, v_{end} \in V$: unique start and end nodes.<br>$D_w$: data schema (case variables).<br>$f_w: V \times D_w \to D_w$: task update functions.<br>A run is a path from $v_{start}$ to $v_{end}$ satisfying guards.<br>Often formalized as Petri nets (workflow nets) with soundness (every case can complete, no dead tasks).                                                                                                                                                                                                                                                                                                                                                          | A **pre-defined process model**: a sequence/graph of tasks with explicit branching and conditions. Execution follows the script exactly (like BPMN diagrams, Airflow DAGs, or BPEL orchestrations). Predictable and testable.                                    |
| **Agent** = the **autonomous actor** (perceives, decides, acts, learns in a loop toward goals).    | **Agent in environment**:  Environment: $$\mathcal{E} = (S_a, A_a, O_a, T_a, Z_a, R_a)$$ Agent: $$\mathcal{A} = (M_a, \mu_a, \Theta_a, \pi_{\theta_a}, \Lambda_a, \iota_a, \mathcal{G}_a)$$  **Variables:**<br>$S_a$: environment states.<br>$A_a$: actions (tool invocations).<br>$O_a$: observations.<br>$T_a: S_a \times A_a \to \Delta(S_a)$: transition kernel.<br>$Z_a: S_a \times A_a \to \Delta(O_a)$: observation kernel.<br>$R_a: S_a \times A_a \times S_a \to \mathbb{R}$: reward/utility.<br>$M_a$: internal state/memory.<br>$\mu_a$: memory update.<br>$\Theta_a$: parameter space.<br>$\pi_{\theta_a}: G_a \times H_a \times M_a \to \Delta(A_a)$: policy.<br>$\Lambda_a$: learning/adaptation rule.<br>$\iota_a$: initialization function.<br>$\mathcal{G}_a = (\mathsf{Perm}, \mathsf{Cons}, \mathsf{Audit})$: governance (permissions, constraints, audit). | A **goal-directed autonomous system**: it perceives environment inputs, chooses and executes actions (via tools), maintains state, and adapts based on feedback. Unlike a chatbot, it has actuators beyond text and can operate under uncertainty with autonomy. |
{: .well .table .table-striped}

## Diagrams

```mermaid
%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph TD

    subgraph "Core"
        M["Model - (base engine that converts inputs to outputs)"]
    end

    M --> T["Tool or Skill - (callable function or API, e.g., via MCP)"]
    M --> C["Chatbot - (conversation wrapper with memory and guardrails)"]
    M --> W["Workflow - (recipe of steps that orchestrates AI and non-AI tasks)"]
    M --> A["Agent - (goal-directed loop that observes, decides, acts, and uses tools)"]

    C --> CP["Copilot - (chatbot inside one application with in-app context and actions)"]
    A --> AS["Autonomous System - (persistent agent with monitoring, budgets, and overrides)"]

    %% Styling
    classDef core fill:#fefce8,stroke:#ca8a04,stroke-width:2px,color:#713f12;
    classDef tool fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#064e3b;
    classDef chat fill:#f6f9ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef flow fill:#fff7ed,stroke:#f97316,stroke-width:2px,color:#7c2d12;
    classDef agent fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d;
    classDef copilot fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#312e81;
    classDef system fill:#fdf2f8,stroke:#db2777,stroke-width:2px,color:#831843;

    M:::core
    T:::tool
    C:::chat
    CP:::copilot
    W:::flow
    A:::agent
    AS:::system

    %% Notes / Labels
    T -->|"Extends reach of model"| TNote["Outputs: function calls<br/>Adds APIs, calculators, databases"]
    C -->|"Text-only interface"| CNote["Outputs: replies<br/>Adds history, memory, RAG, safety"]
    CP -->|"Embedded interface"| CPNote["Outputs: in-app suggestions<br/>Tied to app data and permissions"]
    W -->|"Structured control"| WNote["Outputs: predefined steps<br/>Explicit control/data flow<br/>Like BPMN or DAGs"]
    A -->|"Autonomous loop"| ANote["Outputs: tool actions<br/>Perceive → Decide → Act → Learn<br/>Goal-directed autonomy"]
    AS -->|"Persistent system"| ASNote["Outputs: continuous actions<br/>Handles multiple goals<br/>Monitoring and fail-safes"]
```


```mermaid
%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph TD
    %% ===== Runtime Path =====
    UI["User Input - (text or embeddings)"] --> TOK["Tokenizer - (uses Vocabulary)"]
    VOC["Vocabulary"] --> UI
    VOC --> TD
    TOK --> CORE["AI Model - (think of a model like the engine in a car: it doesn't decide where to go, it just converts inputs into outputs)"]
    W["Weights - (the learned stuff)"] -. read by .-> CORE
    INF["Infrastructure to Train - (GPUs, memory, servers)"] 
    INFR["Infrastructure to Run - (GPUs, memory, servers)"]
    INFR -. host .-> CORE
    INFR -. host .-> TOK
    CORE --> DEC["Decoding - (how you go from math to text)"]
    DEC --> OUT["Output Text - (generated words or tokens)"]

    %% ===== Training Path =====
    subgraph "Training Pipeline"
      TD["Training Data - (what it learned from)"] --> TRAIN["Training - (optimizer updates weights)"]
      TRAIN --> W
      INF -. train .-> TRAIN
    end

    subgraph "Model Enviroment"
        TOK
         INFR
         CORE
         DEC
    end
```


```mermaid
%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph LR
    A["Caller - (Agent, Workflow, or Chatbot)"] --> C["MCP Client"]
    C <-- contracts --> S["Tool Registry - (schemas, prompts)"]
    C <-- transport --> TS["MCP Tool Server - (HTTP or WebSocket)"]
    TS --> F1["Function or API 1"]
    TS --> F2["Function or API 2"]
    TS --> FN["Function or API N"]
    P["Permissions and Policy - (rate limits, access)"] -. enforce .-> TS
    L["Logging and Audit"] -. tap .-> TS
    A <-- results or errors --> C
```

```mermaid
%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph TD
    U["User Interface - (text or voice)"] --> ORCH["Chat Orchestrator"]
    ORCH -->|prompt| LM["AI Model"]
    H["Conversation History - (short-term memory)"] --> ORCH
    M["Memory and Profiles - (long-term context)"] --> ORCH
    R["Knowledge Retrieval - (RAG or search index)"] --> ORCH
    G["Guardrails and Moderation"] -. pre & post .-> ORCH
    ORCH -->|optional tool calls| TOOLS["Tools and Skills"]
    LM --> ORCH --> U
    L["Telemetry and Logs"] -. tap .-> ORCH
```

```mermaid
%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph TD
    subgraph "Host Application"
      UI["In-App UI - (panel or inline suggestions)"]
      CXT["Context Providers - (cursor, document, selection, repo)"]
      APPAPI["App APIs and Data"]
      ID["Identity and Permissions"]
    end

    UI --> ORCH["Copilot Orchestrator"]
    CXT --> ORCH
    ID --> ORCH
    ORCH -->|prompt plus context| LM["AI Model"]
    ORCH -->|app-scoped actions| APPAPI
    ORCH -->|tools| TOOLS["Tools and Skills"]
    G["Policy and Guardrails"] -. pre or post .-> ORCH
    LM --> ORCH --> UI
```

```mermaid
%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph TD
    TRG["Trigger - (event, schedule, webhook)"] --> ENG["Workflow Engine"]
    ENG --> N1["Task A - (non-AI step)"]
    ENG --> N2["Task B - (AI step with prompt and model)"]
    ENG --> N3["Task C - (human review or approval)"]
    N2 --> TOOLS["Tools and External APIs"]
    DS["Workflow Data and Variables"] <-- read or write --> ENG
    BR["Branching and Conditions"] -. control .-> ENG
    ERR["Retry and Recovery - (compensation, DLQ)"] -. failures .-> ENG
    OBS["Observability - (logs, metrics, traces)"] -. tap .-> ENG
    ENG --> OUT["Outputs - (artifacts, notifications, updates)"]
```

```mermaid
%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph LR
    G["Goal or Task"] --> PL["Planner"]
    SENS["Observations - (environment, documents, APIs)"] --> ST["Working Memory and State"]
    ST --> PL
    PL --> DEC["Decision Policy"]
    DEC --> ACT["Action Executor"]
    ACT --> TOOLS["Tools and External APIs"]
    ACT --> ENV["Operational Environment"]
    ENV --> SENS
    EVAL["Evaluator and Feedback - (rewards, scores)"] --> ST
    ACT --> EVAL
    POL["Safety, Permissions, and Audit"] -. gate .-> ACT
```

```mermaid
%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph TD
    subgraph "Control Plane"
      SCH["Scheduler and Event Loop"]
      MGR["Resource Manager - (time, compute, cost)"]
      MON["Monitoring and SLAs - (health checks)"]
      GOV["Governance - (policy, approvals, guardrails)"]
    end

    subgraph "Cognitive Loop"
      LG["Long-Term Memory - (vector store or database)"]
      WM["Working Memory and State"]
      PLN["Planner and Decomposer"]
      DEC["Decision Policy"]
      EXE["Executor"]
      CRT["Critic and Evaluator"]
    end

    TRG["Triggers - (business events, cron, webhooks)"] --> SCH
    SCH --> PLN
    ENV["Domain Environment and App APIs"] --> WM
    LG <--> WM
    PLN --> DEC --> EXE --> TOOLS["Tools and External APIs"]
    EXE --> ENV
    CRT --> WM
    MON -. tap .-> EXE
    GOV -. gate .-> EXE
    MGR -. budgets and quotas .-> EXE
```

```mermaid
---
title: AI Application Stack
---

%%{ init: { "flowchart": { "defaultRenderer": "elk" } } }%%

graph TD

  %% ===== LAYERED STACK =====
  M["Model - (base engine that converts inputs to outputs)"]

  T["Tool or Skill - (callable function or API, e.g., via MCP)"]

  C["Chatbot - (conversation wrapper with memory and guardrails)"]

  CP["Copilot - (chatbot inside one application with in-app context and actions)"]

  W["Workflow - (recipe of steps that orchestrates AI and non-AI tasks)"]

  A["Agent - (goal-directed loop that observes, decides, acts, and uses tools)"]

  AS["Autonomous System - (persistent agent with monitoring, budgets, and overrides)"]

  %% ===== SUPPORTING CAPABILITIES (SHARED) =====
  R["Knowledge Retrieval - (RAG or search index)"]
  MEM["Memory - (short-term and long-term context)"]
  G["Guardrails - (policy, safety, permissions, audit)"]
  MON["Monitoring - (health, metrics, SLAs)"]
  RES["Resources - (compute, cost, time budgets)"]

  %% ===== STACK RELATIONSHIPS =====
  M --> C
  C --> CP
  C --> W
  M --> W
  M --> A
  W --> A
  A --> AS

  %% Tools plug into Chatbot / Workflow / Agent
  T --> C
  T --> W
  T --> A
  T --> AS

  %% Shared capabilities used by multiple layers
  R --> C
  R --> CP
  R --> W
  R --> A
  R --> AS

  MEM --> C
  MEM --> CP
  MEM --> A
  MEM --> AS

  G -.-> C
  G -.-> CP
  G -.-> W
  G -.-> A
  G -.-> AS

  MON -.-> AS
  RES -.-> AS

  %% ===== VISUAL LAYERING HINTS (no semantic meaning) =====
  M --- T
  C --- CP
  W --- A
  A --- AS
```






## Variables by Concept

| Concept      | Variables (formal notation)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Model**    |  $\Sigma$: token vocabulary  <br>  $\Sigma^{\ast}$: strings (finite token sequences)  <br>  $\theta$: model parameters  <br>  $L_\theta : \Sigma^{\ast} \to \Delta(\Sigma)$: mapping from prompt to distribution over next token                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Chatbot**  |  $L_\theta$: base model  <br>  $s \in \Sigma^{\ast}$: system prompt  <br>  $R_c = \{\mathsf{sys}, \mathsf{user}, \mathsf{bot}\}$: roles  <br>  $\tau: (R_c \times \Sigma^{\ast})^{\ast} \to \Sigma^{\ast}$: chat template (serialize history)  <br>  $\delta$: decoding policy  <br>  $\omega$: windowing function  <br>  $K_c \in \mathbb{N}$: context budget  <br>  $M_c$: memory state  <br>  $\mu_c$: memory update rule  <br>  $\Gamma$: safety / governance filter  <br>  $\mathcal{B}$: retrieval backend (documents, retrieval, ranking, selection)                                                                                                                                                                                                                                                      |
| **Workflow** |  $V$: set of tasks/nodes  <br>  $E \subseteq V \times V$: directed edges (control/data flow)  <br>  $v_{start}, v_{end} \in V$: designated start/end tasks  <br>  $D_w$: data schema (case variables)  <br>  $f_w: V \times D_w \to D_w$: task update functions  <br>  **Runs**: executions = paths from $v_{start}$ to $v_{end}$ respecting guards/conditions                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Agent**    | **Environment $\mathcal{E}$:**  <br>  $S_a$: environment states  <br>  $A_a$: action set (tools/actuators)  <br>  $O_a$: observations  <br>  $T_a: S_a \times A_a \to \Delta(S_a)$: transition kernel  <br>  $Z_a: S_a \times A_a \to \Delta(O_a)$: observation kernel  <br>  $R_a: S_a \times A_a \times S_a \to \mathbb{R}$: reward function  <br><br> **Agent $\mathcal{A}$:**  <br>  $M_a$: internal memory state  <br>  $\mu_a$: memory update rule  <br>  $\Theta_a$: parameter space  <br>  $\pi_{\theta_a}: G_a \times H_a \times M_a \to \Delta(A_a)$: policy  <br>  $\Lambda_a$: learning / adaptation rule  <br>  $\iota_a$: initialization function  <br>  $\mathcal{G}_a = (\mathsf{Perm}, \mathsf{Cons}, \mathsf{Audit})$: governance controls (permissions, constraints, audit) |
{: .well .table .table-striped}