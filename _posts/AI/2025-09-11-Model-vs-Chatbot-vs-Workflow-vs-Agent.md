---

layout: post

title: "Model vs. Chatbot vs. Workflow vs. Agent"
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

## Model vs. Chatbot vs. Workflow vs. Agent

| Concept      | Plain English Definition                                                                                                                                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Model** = the **engine** (statistical text predictor).   | The raw **LLM engine**: given a prompt (string of tokens), it returns a probability distribution over the next token and generates text by sampling/decoding. Examples: GPT-4, Claude, Mistral.                                                                  |
| **Chatbot**  = the **interface** around a model (dialogue handling, memory, RAG, safety).| A **conversation interface** around a model: it handles history, system instructions, optional memory, retrieval, and safety checks — but **its only action is emitting text**.                                                                                  |
| **Workflow** = the **scripted process** (pre-drawn map of tasks, deterministic once defined).| A **pre-defined process model**: a sequence/graph of tasks with explicit branching and conditions. Execution follows the script exactly (like BPMN diagrams, Airflow DAGs, or BPEL orchestrations). Predictable and testable.                                    |
| **Agent**  = the **autonomous actor** (perceives, decides, acts, learns in a loop toward goals).  | A **goal-directed autonomous system**: it perceives environment inputs, chooses and executes actions (via tools), maintains state, and adapts based on feedback. Unlike a chatbot, it has actuators beyond text and can operate under uncertainty with autonomy. |
{: .well .table .table-striped}

## Diagram

```mermaid
graph TD

    subgraph Core
        M[Model]
    end

    M --> C[Chatbot]
    M --> W[Workflow]
    M --> A[Agent]

    C:::chat
    W:::flow
    A:::agent

    classDef chat fill:#f6f9ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef flow fill:#fff7ed,stroke:#f97316,stroke-width:2px,color:#7c2d12;
    classDef agent fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d;

    %% Notes
    M:::core



    %% Labels
    C -->|"Text-only interface"| CNote[Outputs: text replies<br/>Adds history, memory, RAG, safety]
    W -->|"Structured control"| WNote[Outputs: predefined steps<br/>Explicit control/data flow<br/>BPMN, DAGs]
    A -->|"Autonomous loop"| ANote[Outputs: actions via tools<br/>Perceive → Decide → Act → Learn<br/>Goal-directed autonomy]
```

## Variables by Concept

| Concept      | Variables (formal notation)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Model**    | </BR>• $\Sigma$: token vocabulary  <br> </BR>• $\Sigma^{\ast}$: strings (finite token sequences)  <br> </BR>• $\theta$: model parameters  <br> </BR>• $L_\theta : \Sigma^{\ast} \to \Delta(\Sigma)$: mapping from prompt to distribution over next token                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Chatbot**  | </BR>• $L_\theta$: base model  <br> </BR>• $s \in \Sigma^{\ast}$: system prompt  <br> </BR>• $R_c = \{\mathsf{sys}, \mathsf{user}, \mathsf{bot}\}$: roles  <br> </BR>• $\tau: (R_c \times \Sigma^{\ast})^{\ast} \to \Sigma^{\ast}$: chat template (serialize history)  <br> </BR>• $\delta$: decoding policy  <br> </BR>• $\omega$: windowing function  <br> </BR>• $K_c \in \mathbb{N}$: context budget  <br> </BR>• $M_c$: memory state  <br> </BR>• $\mu_c$: memory update rule  <br> </BR>• $\Gamma$: safety / governance filter  <br> </BR>• $\mathcal{B}$: retrieval backend (documents, retrieval, ranking, selection)                                                                                                                                                                                                                                                      |
| **Workflow** | </BR>• $V$: set of tasks/nodes  <br> </BR>• $E \subseteq V \times V$: directed edges (control/data flow)  <br> </BR>• $v_{start}, v_{end} \in V$: designated start/end tasks  <br> </BR>• $D_w$: data schema (case variables)  <br> </BR>• $f_w: V \times D_w \to D_w$: task update functions  <br> </BR>• **Runs**: executions = paths from $v_{start}$ to $v_{end}$ respecting guards/conditions                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Agent**    | **Environment $\mathcal{E}$:**  <br> </BR>• $S_a$: environment states  <br> </BR>• $A_a$: action set (tools/actuators)  <br> </BR>• $O_a$: observations  <br> </BR>• $T_a: S_a \times A_a \to \Delta(S_a)$: transition kernel  <br> </BR>• $Z_a: S_a \times A_a \to \Delta(O_a)$: observation kernel  <br> </BR>• $R_a: S_a \times A_a \times S_a \to \mathbb{R}$: reward function  <br><br> **Agent $\mathcal{A}$:**  <br> </BR>• $M_a$: internal memory state  <br> </BR>• $\mu_a$: memory update rule  <br> </BR>• $\Theta_a$: parameter space  <br> </BR>• $\pi_{\theta_a}: G_a \times H_a \times M_a \to \Delta(A_a)$: policy  <br> </BR>• $\Lambda_a$: learning / adaptation rule  <br> </BR>• $\iota_a$: initialization function  <br> </BR>• $\mathcal{G}_a = (\mathsf{Perm}, \mathsf{Cons}, \mathsf{Audit})$: governance controls (permissions, constraints, audit) |
{: .well .table .table-striped}