This week's weekly prompt is going to be a bit different.  I had an employee reach out to me seeking help with using an AI to build a presentation of a workflow. 

They are planning to hand off some of their current responsibilities so they can focus on other tasks, and having a consistent, easy-to-follow format for documenting workflows would be invaluable. 

So here we go.  

One of the things you need to understand when you document a workflow is you need to create or document the overall process using a templated approach.  The idea here is to create a standard work package for the workflow documentation that can be easily understood and manipulated by others and the AI.  This is a common practice in business process management and workflow documentation, as it helps ensure consistency and clarity across different processes and teams.

The following template is a basic business process management workflow documentation template.  Once you have this template, you can apply all sorts of AI tools to it to generate the actual workflow diagrams, process maps, and other visualizations that can help communicate the workflow effectively.

The structure is as follows:


```markdown
## {Section Title}

[SECTION INSTRUCTIONS — DO NOT OUTPUT]

**Purpose:** {Describe the purpose of this section and how it contributes to the overall workflow documentation.}

**Instructions:** {Provide step-by-step instructions for completing this section, including any specific information that needs to be gathered or documented.  If there is any logic needed, describe it here in clear, non-ambiguous language that doesn't contradict itself.  You may need to break things down into smaller steps and sections if this gets too big.}

**Prerequisites:** {List any prerequisites or dependencies required for this section.  Reference any other sections of the workflow documentation that need to be completed before this section can be started.  Reference any data points that need to be collected or any stakeholders that need to be consulted.}

**Standards & Best Practices:** {List any standards, guidelines, or best practices that should be followed when completing this section.  Reference any relevant industry standards, organizational policies, or regulatory requirements.  Provide any tips or recommendations for ensuring the quality and consistency of the documentation in this section.  THIS NEEDS TO BE INDUSTRY BEST PRACTICES, NOT INTERNAL COMPANY STANDARDS OR BEST PRACTICES.  THE MODEL DOESN'T KNOW YOUR INTERNAL STANDARDS, BUT IT DOES KNOW INDUSTRY BEST PRACTICES.  THIS IS EXTREMELY IMPORTANT.  DO NOT REFERENCE INTERNAL STANDARDS OR BEST PRACTICES, AS THE MODEL DOES NOT KNOW THEM AND CANNOT APPLY THEM.  ONLY REFERENCE INDUSTRY BEST PRACTICES AND STANDARDS THAT ARE PUBLICLY AVAILABLE AND WELL-KNOWN IN THE FIELD.}

[END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

## {Output Header}

{Insert your output template here as markdown.  This should be a structured format that can be easily filled in with the relevant information for this section.  It should include any tables, charts, or other visualizations that are needed to effectively communicate the information in this section as long as you specify them in markdown.  The output template should be designed to be easily understood and manipulated by both humans and AI tools.  It should also be flexible enough to accommodate different types of workflows and processes, while still maintaining a consistent format across different sections of the documentation.}
[END SECTION OUTPUT TEMPLATE]
```

That's it.

Once you have a template like this, you can use it to document any workflow by filling in the relevant information for each section.  This structured approach will help ensure that all necessary information is captured and that the documentation is clear and consistent, making it easier for others to understand and follow the workflow.

A couple good prompts that you can then use with his are as follows:

```markdown
You are an expert in the {XXX} process.  

I need help documenting the workflow for this process using the following template.  

I want you to read over the template below and start asking me questions about the process to ensure all relevant information is captured.  Once you have enough information, Please fill in the relevant information for each section based on the information I gave you.  If I tell you I don't know, mark any sections that require this information as [UNCERTAIN][TBD] and list the role, title, and person who is best to answer this question based on your knowledge of what was given.  And your expertise and knowledge of the process.

[INSERT TEMPLATE HERE]
```

Once you do this for documenting your process you can save that off and then use it as a basis for generating workflow diagrams, process maps, and other visualizations using AI tools.  This will help you communicate the workflow effectively to others and ensure that everyone is on the same page when it comes to understanding the process.  Prompts like that look like

```markdown
You are an expert in the {XXX} process.  

I have a workflow document below.  I need you to give me a [workflow diagram, process map, power point presentation, training script, etc... ] based on the process flow diagram and the workflow documentation attached.

[INSERT WORKFLOW DOCUMENT HERE]
```

You could also do things like:

```markdown
You are an expert in the {XXX} process.  

I have a workflow document below.  Please develop a rubric to grade deliverables based on this workflow.  

[INSERT WORKFLOW DOCUMENT HERE]
```

Then once you have the Rubric you can do things like:

```markdown

You are an expert in the {XXX} process.

I have attached a grading Rubric, a workflow document, and an actual deliverable following that workflow.  Please grade the deliverable based on the rubric and provide feedback on how well it follows the workflow and where it can be improved.

In areas of improvement, please call out what needs to change, why it needs to change, and how it can be changed to better align with the workflow and the rubric.  Give me a list of the people who need to be involved in making these changes based on the workflow and the rubric, and the role they play in the process.

[INSERT RUBRIC, WORKFLOW DOCUMENT, AND DELIVERABLE HERE]
```
---

So what does this look like in practice?  Let's take a look at an actual document I built for the IT Department that we use for documenting business workflows.  This is probably too much, but you can see the flow and how it can be used to document a workflow in a consistent way that can then be used to generate diagrams, presentations, training materials, and more.  This is the first step you need to take in applying AI Agent Technology to the value stream you work on at your job. 

---

```mermaid

## Business Architecture

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Define the business
architecture context for the solution, including strategic goals, impacted
capabilities and processes, actor groups, information controls, complexity,
resiliency, and business risk so business and technology stakeholders share a
common view of scope, value, and change impact.

**Instructions:**

* Use the following subsections to document strategic alignment, operational
  impact, actor landscape, process controls, resiliency, and risk.
* Ensure all process-level sections align back to the business goals and
  impacted capabilities.
* Validate outputs with business owners, architecture, security, risk,
  compliance, and operational stakeholders as appropriate.
* Use measurable criteria and named owners wherever possible.
* If details are unknown, mark **TBD** and track them in the Open Questions /
  Issues Log.

**Prerequisites:**

* Business case / initiative charter
* Enterprise capability model and process inventory
* Stakeholder map and operating model context
* Applicable compliance, risk, privacy, and resiliency standards

**Standards & Best Practices:**

* TOGAF 10 — Business Architecture
* ISO/IEC/IEEE 42010 — Architecture Descriptions
* Alignment to internal business architecture, risk, privacy, security, and
  resilience policies [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]
This section documents the business architecture for **{{AI Solution / Product Name}}**, including business goals, impacted capabilities and processes, actor groups, information control requirements, complexity, resiliency expectations, and business process risks.
[END SECTION OUTPUT TEMPLATE]



### Goals, Objectives, and Key Results

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Define the business goals,
objectives, and key results (OKRs) the solution is intended to achieve so scope,
priorities, and success measures remain aligned to business strategy.

**Instructions:**

1. Document the high-level business goals the solution supports.
2. For each goal, define one or more SMART objectives.
3. For each objective, define measurable key results, milestones, and target
   dates.
4. Explicitly describe how the solution supports or enables each objective.
5. Validate goals, objectives, and key results with business stakeholders and
   solution owners.
6. If targets or baselines are unknown, mark **TBD** and add them to the Open
   Questions / Issues Log.

**Prerequisites:**

* Business strategy / initiative charter
* Business case and problem statement
* Current-state baseline measures
* Named business owners and stakeholders

**Standards & Best Practices:**

* Align goals, objectives, and key results to enterprise strategy and documented
  business directives.
* Ensure objectives and key results follow the SMART framework.
* Link each key result to measurable performance indicators and accountable
  owners.
* Obtain business-owner validation for scope and target-setting.
* Reference TOGAF 10 Business Architecture guidance and ISO/IEC/IEEE 42010 for
  completeness and traceability. [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Business Goals

| Goal ID | Business Goal | Strategic Driver / Initiative | Business Owner | Notes   |
| ------- | ------------- | ----------------------------- | -------------- | ------- |
| BG-01   | {{TBD}}       | {{TBD}}                       | {{TBD}}        | {{TBD}} |
| BG-02   | {{TBD}}       | {{TBD}}                       | {{TBD}}        | {{TBD}} |

### Objectives and Key Results

| Goal ID | Objective ID | SMART Objective | How the Solution Enables It | Key Result ID | Key Result / Measure | Baseline | Target  | Due Date | Owner   |
| ------- | ------------ | --------------- | --------------------------- | ------------- | -------------------- | -------- | ------- | -------- | ------- |
| BG-01   | OBJ-01       | {{TBD}}         | {{TBD}}                     | KR-01         | {{TBD}}              | {{TBD}}  | {{TBD}} | {{TBD}}  | {{TBD}} |
| BG-01   | OBJ-02       | {{TBD}}         | {{TBD}}                     | KR-02         | {{TBD}}              | {{TBD}}  | {{TBD}} | {{TBD}}  | {{TBD}} |
| BG-02   | OBJ-03       | {{TBD}}         | {{TBD}}                     | KR-03         | {{TBD}}              | {{TBD}}  | {{TBD}} | {{TBD}}  | {{TBD}} |

### Stakeholder Validation

* Business stakeholder review: {{Name, Role, Status}}
* IT / Architecture review: {{Name, Role, Status}}
* Final approval / sign-off: {{Name, Role, Status}}

[END SECTION OUTPUT TEMPLATE]



### Impacted Business Capabilities

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Identify and describe the
business capabilities directly or indirectly impacted by the solution so scope,
dependencies, and expected business change are clearly understood.

**Instructions:**

1. Identify and list each business capability directly or indirectly impacted by
   the solution.
2. Describe the current state of each capability, including strengths,
   weaknesses, and known gaps.
3. Document the expected changes or enhancements resulting from solution
   implementation.
4. Highlight dependencies or integration points between impacted capabilities.
5. Validate the impacted capability inventory with relevant business and IT
   stakeholders.

**Prerequisites:**

* Enterprise business capability model
* Current-state capability assessments
* Target-state operating model or transformation vision
* Stakeholder list for impacted business areas

**Standards & Best Practices:**

* Capabilities should align to the organization’s approved business capability
  model.
* Changes should clearly describe business value, benefit, and expected
  operating improvement.
* Documentation should align with TOGAF Business Architecture capability
  concepts.
* Reference recognized business architecture guidance such as the BIZBOK® Guide. [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Impacted Capability Inventory

| Capability | Impact Type (Direct / Indirect) | Current State | Strengths / Weaknesses / Gaps | Expected Changes / Enhancements | Dependencies / Integration Points | Expected Business Value | Owner / Stakeholders |
| ---------- | ------------------------------- | ------------- | ----------------------------- | ------------------------------- | --------------------------------- | ----------------------- | -------------------- |
| {{TBD}}    | {{TBD}}                         | {{TBD}}       | {{TBD}}                       | {{TBD}}                         | {{TBD}}                           | {{TBD}}                 | {{TBD}}              |
| {{TBD}}    | {{TBD}}                         | {{TBD}}       | {{TBD}}                       | {{TBD}}                         | {{TBD}}                           | {{TBD}}                 | {{TBD}}              |

### Capability Dependency Notes

* Cross-capability dependencies: {{TBD}}
* Key upstream / downstream relationships: {{TBD}}
* Validation status: {{TBD}}

[END SECTION OUTPUT TEMPLATE]



### Impacted Business Processes

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Document the business
processes associated with each impacted capability so workflow, ownership,
interactions, and operational metrics are consistently understood.

**Instructions:**

1. List and categorize business processes under their associated impacted
   business capabilities.
2. Provide clear and descriptive names for each process.
3. Identify and document the owner of each process.
4. Describe each process, including key steps, interactions, and handoffs.
5. Document baseline process metrics such as duration, throughput, quality
   indicators, and cost.
6. Provide standardized visualizations using **BPMN 2.0**, **SIPOC**, and
   **Value Stream Mapping (VSM)**.
7. Explicitly note that **Flowcharts** and **Customer Journey Maps** are
   non-standardized and require additional stakeholder dialogue to reduce
   ambiguity.

**Prerequisites:**

* Impacted capability inventory
* Process inventory or process hierarchy
* Named process owners
* Baseline operational metrics
* Diagramming standards / repository for BPMN, SIPOC, and VSM artifacts

**Standards & Best Practices:**

* Align process documentation to the associated business capabilities.
* Adhere to **BPMN 2.0** standards for process modeling.
* Use **SIPOC** and **Value Stream Mapping** for high-level and flow-efficiency
  representation.
* Call out when non-standard representations require additional stakeholder
  consensus.
* Reference **ISO 9001** for quality management and **ISO/IEC 19510** for BPMN
  notation. [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Process Inventory

| Capability | Process ID  | Process Name | Process Owner | Description | Key Steps / Interactions | Baseline Cycle Time | Baseline Throughput | Baseline Quality Indicator | Baseline Cost | Expected Changes |
| ---------- | ----------- | ------------ | ------------- | ----------- | ------------------------ | ------------------- | ------------------- | -------------------------- | ------------- | ---------------- |
| {{TBD}}    | {{PROC-01}} | {{TBD}}      | {{TBD}}       | {{TBD}}     | {{TBD}}                  | {{TBD}}             | {{TBD}}             | {{TBD}}                    | {{TBD}}       | {{TBD}}          |
| {{TBD}}    | {{PROC-02}} | {{TBD}}      | {{TBD}}       | {{TBD}}     | {{TBD}}                  | {{TBD}}             | {{TBD}}             | {{TBD}}                    | {{TBD}}       | {{TBD}}          |

### Standard Process Visualizations

#### Process: {{Process Name}}

* **BPMN 2.0 Diagram:** {{Link / Repository / Attachment ID}}
* **SIPOC Diagram:** {{Link / Repository / Attachment ID}}
* **Value Stream Map:** {{Link / Repository / Attachment ID}}
* **Additional non-standard visuals (optional):** {{Flowchart / Customer Journey Map}} — {{stakeholder alignment notes}}

### Process Metrics

| Process | Metric                   | Baseline | Target  | Unit / Period | Data Source | Owner   |
| ------- | ------------------------ | -------- | ------- | ------------- | ----------- | ------- |
| {{TBD}} | {{Cycle time}}           | {{TBD}}  | {{TBD}} | {{TBD}}       | {{TBD}}     | {{TBD}} |
| {{TBD}} | {{Throughput}}           | {{TBD}}  | {{TBD}} | {{TBD}}       | {{TBD}}     | {{TBD}} |
| {{TBD}} | {{Quality / Error Rate}} | {{TBD}}  | {{TBD}} | {{TBD}}       | {{TBD}}     | {{TBD}} |
| {{TBD}} | {{Cost}}                 | {{TBD}}  | {{TBD}} | {{TBD}}       | {{TBD}}     | {{TBD}} |

[END SECTION OUTPUT TEMPLATE]



### Business Process Information Attributes

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Identify and document the
information attributes associated with each business process that require
specific data controls so regulatory, legal, privacy, and security obligations
are explicit and actionable.

**Instructions:**

1. Identify each business process that handles or interacts with sensitive,
   regulated, or controlled information.
2. Specify the applicable control type from the approved control categories or
   identify another required control explicitly.
3. Provide a concise rationale for each control selected.
4. Validate applicability with compliance, legal, privacy, and security
   stakeholders as needed.
5. Clearly reference applicable internal and external standards or regulations.

**Prerequisites:**

* Process inventory and process data flow context
* Data classification matrix
* Applicable regulatory / compliance obligations
* Security, privacy, and legal stakeholder input

**Standards & Best Practices:**

* Align documented controls to internal policies and applicable external
  regulations.
* Confirm each control with the appropriate compliance and security
  stakeholders.
* Common control categories may include:

  * **Critical Energy Infrastructure Information (CEII)**
  * **FERC Standards of Conduct (SOC)**
  * **NERC CIP Confidential**
  * **Personally Identifiable Information (PII)**
  * **Sensitive Personal Information (High Risk)**
  * **Sarbanes-Oxley (SOX) Financial Reporting Data**
  * **CPUC Utility Data**
  * **PCI Compliance**
  * **IT General Computing Controls (ITGC)**
  * **CISR**
  * **Other** — specify explicitly [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Process Information Attribute Controls

| Process | Information Attribute / Data Class | Applicable Control | Rationale | Regulatory / Policy Reference | Additional Handling Requirements | Validation Stakeholders | Status  |
| ------- | ---------------------------------- | ------------------ | --------- | ----------------------------- | -------------------------------- | ----------------------- | ------- |
| {{TBD}} | {{TBD}}                            | {{TBD}}            | {{TBD}}   | {{TBD}}                       | {{TBD}}                          | {{TBD}}                 | {{TBD}} |
| {{TBD}} | {{TBD}}                            | {{TBD}}            | {{TBD}}   | {{TBD}}                       | {{TBD}}                          | {{TBD}}                 | {{TBD}} |

### Control Notes

* Additional control exceptions or special handling: {{TBD}}
* Required legal / compliance review: {{TBD}}
* Outstanding questions: {{TBD}}

[END SECTION OUTPUT TEMPLATE]



### Business Process Complexity

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Assess and document the
complexity of business processes associated with the solution so process risk,
coordination effort, and design robustness needs are understood.

**Instructions:**

1. For each business process, assess complexity based on the number of phases,
   stakeholders, and interactions across internal and external business areas.
2. Record both the qualitative level and quantitative score.
3. Clearly document the reason for the selected rating.
4. Validate each assessment with business process owners and appropriate risk,
   security, compliance, and technical stakeholders.

**Reference Scale**

| Qualitative Value | Quantitative Range (%) | Score (1–10) | Description                                                                                             |
| ----------------- | ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| Very High         | 96–100                 | 10           | Multiple phases and multiple stakeholders across multiple business areas inside and outside the company |
| High              | 80–95                  | 8            | Multiple phases and multiple stakeholders across multiple business areas inside the company             |
| Moderate          | 21–79                  | 5            | Multiple phases and multiple stakeholders within a single business area                                 |
| Low               | 5–20                   | 2            | Multiple phases and a single stakeholder within a single business area                                  |
| Very Low          | 0–4                    | 0            | Single phase and a single stakeholder within a single business area                                     |

**Prerequisites:**

* Process inventory
* Stakeholder map by process
* Business-area ownership and dependency context
* Input from business owners, risk, security, and compliance stakeholders

**Standards & Best Practices:**

* Clearly document the reason for each selected score.
* Validate each assessment with relevant business and technical stakeholders.
* Maintain traceable documentation for audit and compliance purposes. [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Process Complexity Assessment

| Process | Complexity Level | Score   | Reason for Rating | Key Drivers (Phases / Stakeholders / Interactions) | Validation Stakeholders |
| ------- | ---------------- | ------- | ----------------- | -------------------------------------------------- | ----------------------- |
| {{TBD}} | {{TBD}}          | {{TBD}} | {{TBD}}           | {{TBD}}                                            | {{TBD}}                 |
| {{TBD}} | {{TBD}}          | {{TBD}} | {{TBD}}           | {{TBD}}                                            | {{TBD}}                 |

### Complexity Notes

* Processes requiring special design attention due to complexity: {{TBD}}
* Escalations or unresolved complexity concerns: {{TBD}}

[END SECTION OUTPUT TEMPLATE]



### Business Process Resiliency

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Evaluate and document the
resiliency required to maintain business process operations during adverse
conditions or disruptions, including acceptable downtime and recovery
expectations for supporting IT systems.

**Instructions:**

1. For each business process, select the resiliency tier and required recovery
   time objective (RTO).
2. Ensure the selected tier aligns with business deferment tolerance and
   supporting system recovery expectations.
3. Document the business rationale for the selected tier.
4. Capture architecture, network, interface, backup, rollback/recovery, testing,
   and DR documentation requirements associated with the selected tier.
5. Validate tier alignment with the Business Process Owner and relevant upstream
   and downstream stakeholders, including risk, security, compliance, and DR/BCP
   teams.

**Reference Tier Model**

| Category                   | Tier | RTO            | Definition                                                                                                                                      |
| -------------------------- | ---- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Infrastructure / Platforms | 0    | 0–4 hours      | Shared infrastructure must support essential services and meet defined RTO/RPO through active replication or equivalent resilience capabilities |
| Essential / Critical       | 1–2  | <8 to 24 hours | Downtime beyond 24 hours creates significant operational or financial loss                                                                      |
| Important                  | 3    | 24–72 hours    | Recovery within 24–72 hours is required to avoid significant operational or financial impact                                                    |
| Deferrable                 | 4    | >72 hours      | Recovery beyond 72 hours is acceptable with limited operational or financial impact                                                             |

**Tier Considerations to Capture**

* Architecture requirements
* NERC CIP requirements where applicable
* Network requirements
* Interface requirements
* Backup requirements
* Roll-back / recovery requirements
* Testing requirements
* Disaster recovery documentation requirements

**Prerequisites:**

* Process inventory and owners
* Business impact analysis (BIA)
* Upstream / downstream dependency map
* Enterprise DR / BCP standards
* Supporting platform and service recovery capabilities

**Standards & Best Practices:**

* Clearly document the reason for each selected tier.
* Validate each assessment with business, technical, risk, security, compliance,
  and resiliency stakeholders.
* Ensure process resiliency aligns with supporting application and
  infrastructure recovery capabilities.
* Maintain documentation transparency for audit and resilience governance
  purposes. [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Shared Infrastructure / Platform Dependencies

| Infrastructure / Platform | Tier    | RTO     | Supported Processes | Notes   |
| ------------------------- | ------- | ------- | ------------------- | ------- |
| {{TBD}}                   | {{TBD}} | {{TBD}} | {{TBD}}             | {{TBD}} |
| {{TBD}}                   | {{TBD}} | {{TBD}} | {{TBD}}             | {{TBD}} |

### Process Resiliency Requirements

| Process | Tier    | RTO     | Reason / Business Impact | Architecture Requirements | Network / Interface Requirements | Backup / Recovery Requirements | Roll-Back Requirements | Testing Requirements | DR Documentation Requirements | Validation Stakeholders |
| ------- | ------- | ------- | ------------------------ | ------------------------- | -------------------------------- | ------------------------------ | ---------------------- | -------------------- | ----------------------------- | ----------------------- |
| {{TBD}} | {{TBD}} | {{TBD}} | {{TBD}}                  | {{TBD}}                   | {{TBD}}                          | {{TBD}}                        | {{TBD}}                | {{TBD}}              | {{TBD}}                       | {{TBD}}                 |
| {{TBD}} | {{TBD}} | {{TBD}} | {{TBD}}                  | {{TBD}}                   | {{TBD}}                          | {{TBD}}                        | {{TBD}}                | {{TBD}}              | {{TBD}}                       | {{TBD}}                 |

### Resiliency Notes

* Key upstream / downstream dependency assumptions: {{TBD}}
* Exceptions or variances from standard tier requirements: {{TBD}}

[END SECTION OUTPUT TEMPLATE]



### Business Process Risk

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Assess business process risk
from a **Confidentiality, Integrity, and Availability (CIA)** perspective so
risks are explicit, scored, monitored, and governed in alignment with
information security and project risk management practices.

**CIA Context**

* **Confidentiality:** Protect sensitive information against unauthorized access
  or disclosure.
* **Integrity:** Protect information from unauthorized modification or
  corruption.
* **Availability:** Ensure information and supporting services remain accessible
  and operational when needed.

**Instructions:**

1. Document each risk event or condition. **Technical debt is not a risk** for
   this section.
2. For each risk, capture the risk event and source.
3. Identify the internal and external stakeholders impacted.
4. Assess risk probability using the scale below.
5. Assess risk impact using the scale below.
6. Derive risk exposure using the exposure matrix below.
7. Define mitigation in formal requirements language.
8. Define trigger / monitoring thresholds in formal requirements language.
9. Identify the accountable risk owner.
10. Document review / audit details, including frequency and identifying party.

**Risk Probability Scale**

| Qualitative Value | Quantitative Range (%) | Score (1–10) | Description                                                               |
| ----------------- | ---------------------- | ------------ | ------------------------------------------------------------------------- |
| Very High         | 96–100                 | 10           | Almost certain; occurs more than 100 times per year                       |
| High              | 80–95                  | 8            | Highly likely; occurs 10–100 times per year                               |
| Moderate          | 21–79                  | 5            | Somewhat likely; occurs 1–10 times per year                               |
| Low               | 5–20                   | 2            | Unlikely; occurs less than once per year to more than once every 10 years |
| Very Low          | 0–4                    | 0            | Highly unlikely; occurs less than once every 10 years                     |

**Risk Impact Scale**

| Qualitative Value | Quantitative Range (%) | Score (1–10) | Description                                                                                                                        |
| ----------------- | ---------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Very High         | 96–100                 | 10           | Multiple severe adverse effects; catastrophic operational, safety, regulatory, reputational, financial, and legal consequences     |
| High              | 80–95                  | 8            | Severe adverse effects; major operational disruptions and significant regulatory, reputational, financial, or legal consequences   |
| Moderate          | 21–79                  | 5            | Serious adverse effects; notable operational degradation and meaningful regulatory, reputational, financial, or legal consequences |
| Low               | 5–20                   | 2            | Limited adverse effects; minor operational degradation and limited regulatory, reputational, financial, or legal consequences      |
| Very Low          | 0–4                    | 0            | Negligible adverse effects                                                                                                         |

**Risk Exposure Matrix**

| Likelihood \ Impact | Very Low      | Low           | Moderate      | High          | Very High      |
| ------------------- | ------------- | ------------- | ------------- | ------------- | -------------- |
| Very High           | Very Low Risk | Low Risk      | Moderate Risk | High Risk     | Very High Risk |
| High                | Very Low Risk | Low Risk      | Moderate Risk | High Risk     | Very High Risk |
| Moderate            | Very Low Risk | Low Risk      | Moderate Risk | Moderate Risk | High Risk      |
| Low                 | Very Low Risk | Low Risk      | Low Risk      | Low Risk      | Moderate Risk  |
| Very Low            | Very Low Risk | Very Low Risk | Very Low Risk | Low Risk      | Low Risk       |

**Prerequisites:**

* Process inventory and business context
* Applicable security, privacy, and compliance requirements
* Known incident patterns, audit findings, or control gaps
* Named risk owners and review forums

**Standards & Best Practices:**

* PMI PMBOK Guide for project risk management
* ISO 27001 information security management
* Formal requirements language for mitigation and monitoring controls
* Named ownership, traceable reviews, and recurring audit cadence [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Business Process Risk Register

| Risk ID | Process | Risk Event / Source | CIA Domain    | Stakeholders Impacted | Probability | Impact  | Exposure | Mitigation Requirement    | Trigger / Monitoring Threshold | Risk Owner | Review / Audit Requirement | Status   |
| ------- | ------- | ------------------- | ------------- | --------------------- | ----------- | ------- | -------- | ------------------------- | ------------------------------ | ---------- | -------------------------- | -------- |
| R-01    | {{TBD}} | {{TBD}}             | {{C / I / A}} | {{TBD}}               | {{TBD}}     | {{TBD}} | {{TBD}}  | {{The solution shall...}} | {{The system shall...}}        | {{TBD}}    | {{TBD}}                    | {{Open}} |
| R-02    | {{TBD}} | {{TBD}}             | {{C / I / A}} | {{TBD}}               | {{TBD}}     | {{TBD}} | {{TBD}}  | {{The solution shall...}} | {{The system shall...}}        | {{TBD}}    | {{TBD}}                    | {{Open}} |
| R-03    | {{TBD}} | {{TBD}}             | {{C / I / A}} | {{TBD}}               | {{TBD}}     | {{TBD}} | {{TBD}}  | {{The solution shall...}} | {{The system shall...}}        | {{TBD}}    | {{TBD}}                    | {{Open}} |

### Risk Governance Notes

* Identified by: {{TBD}}
* Review cadence: {{Monthly / Quarterly / Semi-Annual}}
* Escalation forum: {{TBD}}

[END SECTION OUTPUT TEMPLATE]



### Actors with Applicable Roles & Responsibilities

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Identify all human and
non-human actors in scope for the target architecture so ownership, stakeholder
alignment, access needs, support responsibilities, and change impacts are clear.

**Instructions:**

1. Identify all human actors in scope, including internal and external
   participants.
2. Record each actor’s organizational affiliation, such as department, business
   unit, affiliate, vendor, or regulator.
3. Identify non-human actors such as systems, services, APIs, integration
   endpoints, or automated agents.
4. Clarify whether each actor uses the solution directly, provides data,
   receives outputs, supports the platform, or governs outcomes.
5. Use structured formats such as tables or role matrices for clarity.
6. Validate the actor inventory with business and technical leads.

**Prerequisites:**

* Use cases / user journeys
* RACI or responsibility models
* Org charts / stakeholder maps
* System context and interface inventory
* Vendor / partner / regulator inventory

**Standards & Best Practices:**

* Use case definitions
* RACI diagrams
* Org charts with role descriptions
* Process documentation such as swimlane diagrams
* TOGAF Content Framework — Business Architecture Metamodel [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Human Actors

| Actor / Role | Internal / External | Organizational Affiliation | Primary Responsibilities | Interaction with Solution                                     | Special Notes / Constraints |
| ------------ | ------------------- | -------------------------- | ------------------------ | ------------------------------------------------------------- | --------------------------- |
| {{TBD}}      | {{TBD}}             | {{TBD}}                    | {{TBD}}                  | {{Direct use / Data provider / Output consumer / Governance}} | {{TBD}}                     |
| {{TBD}}      | {{TBD}}             | {{TBD}}                    | {{TBD}}                  | {{Direct use / Data provider / Output consumer / Governance}} | {{TBD}}                     |

### Non-Human Actors

| Actor / System | Type                                    | Owner / Affiliation | Interaction Type                       | Inputs / Outputs | Notes   |
| -------------- | --------------------------------------- | ------------------- | -------------------------------------- | ---------------- | ------- |
| {{TBD}}        | {{System / API / Service / Automation}} | {{TBD}}             | {{Inbound / Outbound / Bidirectional}} | {{TBD}}          | {{TBD}} |
| {{TBD}}        | {{System / API / Service / Automation}} | {{TBD}}             | {{Inbound / Outbound / Bidirectional}} | {{TBD}}          | {{TBD}} |

### Responsibility / Role Notes

* Roles with governance or approval authority: {{TBD}}
* Roles with support / operations responsibilities: {{TBD}}
* Roles requiring special access or segregation-of-duties considerations: {{TBD}}

[END SECTION OUTPUT TEMPLATE]



### Actor Population / Scale

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Estimate and document the
number of business and IT actors who will directly or indirectly interact with
each process supported by the solution so infrastructure sizing, UX design,
access management, and long-term scalability planning are informed.

**Instructions:**

1. Identify all processes in scope for the solution.
2. For each process, identify all categories of users who will require access to
   or interact with the solution.
3. Estimate the total number of users at solution maturity, typically five years
   post-implementation.
4. Express the five-year projection using base-10 logarithmic format.
5. Distinguish internal users from external users.
6. Document growth assumptions and adoption drivers.
7. Validate the projection with Business, IT, and Capacity Planning
   stakeholders.

**Prerequisites:**

* Process inventory
* Workforce / customer / partner growth assumptions
* Access model and role inventory
* Capacity planning assumptions
* Five-year adoption horizon or capitalization assumptions

**Standards & Best Practices:**

* Differentiate clearly between internal and external populations.
* Use the five-year horizon consistently across the solution.
* Use log10 values to normalize scale comparisons across user groups.
* Validate projections with business, IT, and capacity planning stakeholders.
* Align results to scalability, IAM, and support planning. [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Actor Population by Process

| Process | User Category | Actor Type (Business / IT) | Internal / External | Current Estimate (Year 1) | Five-Year Projection | Log10(Five-Year Projection) | Growth Assumptions / Drivers | Validation Stakeholders |
| ------- | ------------- | -------------------------- | ------------------- | ------------------------- | -------------------- | --------------------------- | ---------------------------- | ----------------------- |
| {{TBD}} | {{TBD}}       | {{TBD}}                    | {{TBD}}             | {{TBD}}                   | {{TBD}}              | {{TBD}}                     | {{TBD}}                      | {{TBD}}                 |
| {{TBD}} | {{TBD}}       | {{TBD}}                    | {{TBD}}             | {{TBD}}                   | {{TBD}}              | {{TBD}}                     | {{TBD}}                      | {{TBD}}                 |

### Population Notes

* Adoption assumptions: {{TBD}}
* Key drivers of user growth: {{TBD}}
* Capacity planning implications: {{TBD}}

[END SECTION OUTPUT TEMPLATE]



### Experience Level of Actors

[SECTION INSTRUCTIONS — DO NOT OUTPUT] **Purpose:** Assess and document the
collective experience level of actor groups who will interact with or be
impacted by the solution so training needs, adoption risk, support models, and
change-management requirements are understood.

**Instructions:**

1. Identify key actor groups, such as business users, IT staff, customer-facing
   roles, administrators, and external partners.
2. Assess the average experience level of each group using the scale below.
3. Consider both formal education and hands-on operational experience relevant
   to the process or domain.
4. Describe how experience levels may affect adoption, usability, and support
   needs.
5. Recommend training, onboarding, or transition strategies where appropriate.
6. Validate estimates with functional managers, HR, or workforce development
   partners as appropriate.

**Reference Scale**

| Qualitative Value | Score | Quantitative Range | Description                                                             |
| ----------------- | ----- | ------------------ | ----------------------------------------------------------------------- |
| Very Experienced  | 10    | 96–100             | Considered world-class experts in the process or system domain          |
| Experienced       | 8     | 80–95              | Advanced credentials or decades of relevant professional experience     |
| Moderate          | 5     | 21–79              | Professional background with solid operational familiarity              |
| Low               | 2     | 5–20               | Some applicable experience but lacking full operational depth           |
| Very Low          | 0     | 0–4                | No meaningful experience in the domain; significant onboarding required |

**Prerequisites:**

* Actor inventory
* Role definitions and job-family context
* Training / enablement assumptions
* Input from managers, HR, or workforce readiness teams

**Standards & Best Practices:**

* Use a consistent rubric across all actor groups.
* Align this section with organizational change management and workforce
  enablement planning.
* Include this information in readiness assessments and transition risk
  evaluations.
* Leverage HR or workforce development data where available. [END SECTION INSTRUCTIONS]

[SECTION OUTPUT TEMPLATE]

### Actor Experience Assessment

| Actor Group | Experience Level | Score   | Description / Basis | Adoption / Usability Impact | Training / Support Recommendation | Validation Source |
| ----------- | ---------------- | ------- | ------------------- | --------------------------- | --------------------------------- | ----------------- |
| {{TBD}}     | {{TBD}}          | {{TBD}} | {{TBD}}             | {{TBD}}                     | {{TBD}}                           | {{TBD}}           |
| {{TBD}}     | {{TBD}}          | {{TBD}} | {{TBD}}             | {{TBD}}                     | {{TBD}}                           | {{TBD}}           |
| {{TBD}}     | {{TBD}}          | {{TBD}} | {{TBD}}             | {{TBD}}                     | {{TBD}}                           | {{TBD}}           |

### Enablement Notes

* Readiness risks: {{TBD}}
* Recommended onboarding / job aids / training: {{TBD}}
* Transition support model: {{TBD}}

[END SECTION OUTPUT TEMPLATE]
```