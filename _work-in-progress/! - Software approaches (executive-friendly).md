## IT Software Approaches and the Impacts of AI

**Bottom Line Up Front:** AI doesn’t eliminate the classic types of enterprise software—it amplifies the need for clear ownership, controls, and accountability. Use the categories below to align obligations to risk: systems of record and analytics must be governed and auditable; collaboration artifacts need guardrails so they don’t become “shadow operations”; applications and SaaS need lifecycle management (security, change control, monitoring, support); and NHIs/agents must be treated like a supervised workforce capability with explicit permissions, traceability, and incident response.

### 1) Core Enterprise Suites & Transaction Systems

Large, integrated systems that run foundational operations and hold trusted
operational records.

* **Examples:** ERP, core banking/claims, HR/payroll suites, enterprise CRM, mainframe transaction systems
* **Typical Traits:** shared data, strong governance, many modules, heavy integration, long-lived
* **Primary Purpose:** run the business and maintain authoritative operational truth
* **Obligations:** treat it like infrastructure: strong data quality and controls, resilient architecture (scalability, reliability, disaster recovery), secure-by-design, disciplined change management, and auditability/traceability for transactions and decisions.

**One‑Liner Test:** *If it’s the official system used to run core processes and keep the “book of record,” it belongs here.  If you need to audit it, it belongs here.*

**AI Impact:** AI is increasingly **embedded into these platforms** (recommendations, “next best action,” automated case handling), but the value depends heavily on **data quality, controls, and clear accountability** for decisions and changes.  As soon as data quality reaches a threshold, most users will stop using these tools and treat them as “just a data source” for agents and applications with short lifespans.

### 2) Productivity & Collaboration Artifacts

Office-style tools used as “digital paper” to communicate, coordinate, capture, and track—without becoming an application.

* **Examples:** documents, slide decks, spreadsheets, shared folders, Teams/Slack spaces, wikis, simple intake forms, checklists
* **Typical Traits:** fast to create, easy to share, team-owned, lightweight controls, risk increases when relied on operationally
* **Primary Purpose:** support collaboration, documentation, and lightweight tracking
* **Obligations:** set clear ownership and guardrails so it doesn’t become a solution without operational support or that the operational support is untethered to Corporate Asset Management Policies.  If any of the following is missing, you have untethered operations: data classification, appropriate data sharing/access guidelines, version control, data retention schedules that are enforced, and a defined triggers and targets for an off-ramp when the solution needs to become a real app.

**One‑Liner Test:** *If it’s mainly content, communication, or tracking numbers, it belongs here.*

**AI Impact:** Copilots make these tools **far more powerful** (drafting, summarizing, searching across content), which increases speed—but also raises the need for **clear guidance on what data can be placed in a given output** and how to avoid “polished but incorrect” outputs becoming official.  As AI Agents come online, they will be used to directly **interact with and generate content in these tools**.

### 3) Application Solutions (Coded, Scripted, Low‑Code, and No‑Code)

Anything built to automate work using logic—whether created with traditional code or low‑code/no‑code tools.  Many times they integrate with core systems as a “solution” to a specific need.

* **Examples:** custom web apps/portals, workflow apps with rules and approvals, Power Apps-style solutions, scripts/jobs, spreadsheet macros, small team-built utilities, Access databases, RPA bots, custom desktop apps
* **Typical Traits:** includes business rules, needs an owner, should be tested and controlled, may require integrations and support
* **Primary Purpose:** automate a process or deliver a repeatable capability that behaves like an application
* **Obligation:** own the full lifecycle like a product: define requirements and boundaries, test changes, secure it (identity/permissions, secrets), monitor and support it, document it, and ensure continuity (backups, runbooks, and an accountable owner who can take calls from users and IT operations 24 x 7).

**One‑Liner Test:** *If it contains business rules or automation that people rely on, it belongs here.*

**AI Impact:**

  * AI can **accelerate delivery** (faster prototyping, faster changes) and enable more “self-serve” apps.
  * AI also enables **agent-like features inside apps** (apps that interpret requests and carry out steps), which increases the need for **strong guardrails, testing, and auditability** because the app is no longer fully predictable step-by-step.

### 4) SaaS Specialist Applications

Vendor cloud products that deliver strong capability in a focused area and are mostly configured rather than built.  Generally focused on supporting business capabilities that can be found at most large enterprises, but not delivered by core suites.

* **Examples:** IT service management/helpdesk, contract lifecycle management, recruiting/ATS, expense tools, e‑signature, niche compliance tools
* **Typical Traits:** subscription, quick rollout, frequent vendor updates, standard functionality, integrates via APIs/connectors
* **Primary Purpose:** deliver best-in-class capability for a specific domain without adopting a full enterprise suite
* **Obligation:** manage the vendor and configuration as “your system”: govern configuration changes, ensure integration reliability, control access and data sharing, validate compliance/data residency needs, and maintain an exit/continuity plan (data portability, contract/SLA clarity).

**One‑Liner Test:** *If it’s a purchased cloud product that excels in a specific function, it belongs here.*

**AI Impact:** SaaS vendors are rapidly shipping **embedded copilots and  automation**; the key shift is that these tools may start to **take actions**, not just provide insights—so you’ll want clarity on **what it’s allowed to do, how it’s supervised, and how outcomes are tracked**.  The challenge here is that your data is now fueling a continuous improvement cycle within another company, and the sovereignty and control of that data is easily lost.  Additionally, many times the capabilities of a SaaS tool can be replicated with a custom app or an Agent built with AI on top of your systems of record.  This model is generally seen as being at risk of disruption by AI.

### 5) Analytics & Reporting Platforms

Tools whose primary purpose is dashboards, reporting, metrics, and analysis (not running day-to-day transactions).

* **Examples:** BI/reporting tools, dashboard platforms, enterprise reporting suites, governed self-service analytics, metrics/semantic layers
* **Typical Traits:** focused on trusted metrics, consistent reporting, controlled access, performance for reporting and queries
* **Primary Purpose:** support decision-making with consistent, reliable insight
* **Obligations:** make results trustworthy: define and govern metrics, validate data quality and refresh logic, manage lineage and access, and ensure dashboards/answers are explainable enough that leaders can act with confidence.

**One‑Liner Test:** *If its main output is reports, dashboards, or analytics used to make decisions, it belongs here.*

**AI Impact:** AI is shifting analytics from “find the right dashboard” to **ask a question and get the right answer**—which can increase adoption dramatically, but puts more emphasis on **governed definitions of metrics** and lightweight validation so leaders don’t act on a compelling narrative that isn’t supported by the numbers.

### 6) Non‑Human‑Intelligences (NHIs)

AI-driven copilots, agents, and “digital workers” that can interpret intent, generate outputs, and (in some cases) take actions across systems—sometimes with minimal human step-by-step direction.

* **Examples:** chat copilots for employees, AI agents that resolve tickets or coordinate onboarding, unattended automations that execute multi-step tasks, meeting/action assistants, customer support agents, research/analysis agents
* **Typical Traits:** operates more like a **helper or worker** than a traditional app; behavior can vary; requires controlled access to data and systems; needs supervision and traceability proportional to business risk
* **Primary Purpose:** augment people and automate knowledge work by executing tasks, producing outputs, and coordinating work across tools
* **Obligations:** run it like a managed service provider: define what it’s allowed to do (and not do), control identities/permissions and data access, require traceability (logs of inputs, tools used, actions taken), put human review where risk demands it, and establish monitoring + incident response for bad actions or unsafe outputs.

**One‑Liner Test:** *If it can take a goal (“handle this request”) and produce work or actions with limited instruction, it belongs here.*

* **AI Impact:** NHIs introduce a new “workforce layer” in the enterprise—so the big change is not just technology, but **operating model**: clear ownership, clear boundaries on what the NHI is allowed to do, and a practical way to review and learn from what it did.

