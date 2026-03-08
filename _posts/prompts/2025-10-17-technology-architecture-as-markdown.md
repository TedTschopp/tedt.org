---
layout: prompt-details
permalink: /prompts/:slug/

title: "Work In Progress: Technology Architecture Generator"
subtitle: "Solution Architecture"
quote: ""
excerpt: "A specialized prompt for architecture technology architecture as markdown with advanced AI capabilities and structured output formatting."
source: "Original Content"
source-url: ""
call-to-action: ""

date: 2025-10-17
update:
author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
    name: Ted Tschopp
    url: https://tedt.org/

bullets:
    - Advanced prompt engineering techniques
    - Structured approach to content generation
    - Customizable templates and frameworks
    - Best practices for AI interaction
    - Professional-grade output formatting

description: "Professional technology architecture as markdown prompt designed for high-quality content generation and structured analysis."

seo-description: "Master technology architecture as markdown with this comprehensive AI prompt featuring structured templates and best practices."

categories:
- Prompts
- Projects

tags: 
    - Architecture
    - Requirements Engineering
    - Documentation

keywords:
  - documentation
  - markdown
  - prompt engineering
  - solution architecture
  - system architecture
  - technology architecture
location:
    name: Bradbury, CA
coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: /img/prompts/architecture-product-requirements-document.png
image-alt: "Abstract architectural sketch of an enterprise workspace with layered blueprints, technical annotations, and interconnected systems representing a structured product requirements document."
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-description: "A detailed architectural illustration depicting an enterprise workspace overlaid with hand-drawn blueprints, system diagrams, and technical annotations. The image visually represents the complexity and rigor of an Architecture Product Requirements Document (PRD), emphasizing structure, traceability, and disciplined design thinking across people, processes, and technology."
image-title: "Architectural Blueprint of Enterprise Product Requirements"
image_width: 1456
image_height: 816

mastodon-post-id:
models-supported:
- gpt-4
- gpt-4-turbo
- gpt-4-mini
- claude-3-sonnet
- microsoft-copilot
- github
prompt_content: |
  # Technology Architecture Template 
  
  1. [Technology Architecture Template](#technology-architecture-template)
     1. [Introduction and Scope](#introduction-and-scope)
        1. [Purpose](#purpose)
     2. [Introduction and Scope](#introduction-and-scope-1)
        1. [Purpose](#purpose-1)
        2. [Scope Inclusions \& Exclusions](#scope-inclusions--exclusions)
     3. [Baseline and Target Architecture](#baseline-and-target-architecture)
        1. [Baseline Architecture:](#baselinearchitecture)
        2. [Target Architecture:](#target-architecture)
        3. [Gap Analysis:](#gap-analysis)
     4. [Platform Services](#platformservices)
        1. [Compute Services](#computeservices)
        2. [Storage Services](#storageservices)
        3. [Network Services](#networkservices)
        4. [End‑User Compute Services](#endusercomputeservices)
        5. [End‑User Compute Services](#endusercomputeservices-1)
           1. [Common Platforms](#commonplatforms)
           2. [Provisioning \& Deployment](#provisioningdeployment)
           3. [Device Management](#devicemanagement)
           4. [User Services](#userservices)
        6. [Operational Endpoint Device Services](#operational-endpoint-device-services)
           1. [Device Types](#device-types)
           2. [Connectivity \& Network](#connectivity--network)
           3. [Management \& Integration](#management--integration)
           4. [Platform Services for OT](#platform-services-for-ot)
        7. [Other Platform Components](#other-platform-components)
     5. [Asset Management](#asset-management)
        1. [Compute Services Asset Management](#compute-services-asset-management)
           1. [Asset Inventory and Tracking](#asset-inventory-and-tracking)
           2. [Lifecycle and Refresh Planning](#lifecycle-and-refresh-planning)
           3. [Spare Compute Capacity](#spare-compute-capacity)
           4. [Asset Disposal and Secure Decommissioning](#asset-disposal-and-secure-decommissioning)
        2. [Storage Services Asset Management](#storage-services-asset-management)
           1. [Asset Tracking and Inventory](#asset-tracking-and-inventory)
           2. [Capacity Planning and Expansion](#capacity-planning-and-expansion)
           3. [Spare Storage Equipment](#spare-storage-equipment)
           4. [Data Retention and Archiving Policies](#data-retention-and-archiving-policies)
        3. [Network Services Asset Management](#network-services-asset-management)
           1. [Network Asset Inventory and Documentation](#network-asset-inventory-and-documentation)
           2. [Lifecycle and Upgrade Planning](#lifecycle-and-upgrade-planning)
           3. [Spare Networking Equipment](#spare-networking-equipment)
           4. [Configuration and Change Management](#configuration-and-change-management)
        4. [End-User Device Asset Management](#end-user-device-asset-management)
           1. [Device Classification \& Ownership](#device-classification--ownership)
           2. [Inventory Tracking](#inventory-tracking)
           3. [Lifecycle Management](#lifecycle-management)
           4. [Software/Firmware Management](#softwarefirmware-management)
        5. [Operational Device Asset Management](#operational-device-asset-management)
           1. [Device Classification \& Ownership](#device-classification--ownership-1)
           2. [Inventory Tracking](#inventory-tracking-1)
           3. [Lifecycle Management](#lifecycle-management-1)
           4. [Asset Ownership \& Roles](#asset-ownership--roles)
     6. [Resilience and Recovery](#resilience-and-recovery)
        1. [Compute Services Resilience](#compute-services-resilience)
           1. [Failover and Redundancy](#failover-and-redundancy)
           2. [Backup and Rapid Restore](#backup-and-rapid-restore)
           3. [Disaster Recovery Strategy](#disaster-recovery-strategy)
           4. [Testing and Drills](#testing-and-drills)
        2. [Storage Services Resilience](#storage-services-resilience)
           1. [Data Redundancy and Replication](#data-redundancy-and-replication)
           2. [Backup and Recovery](#backup-and-recovery)
           3. [Disaster Recovery Planning](#disaster-recovery-planning)
           4. [Integrity and Validation](#integrity-and-validation)
        3. [Network Services Resilience](#network-services-resilience)
           1. [Failover and Redundant Connectivity](#failover-and-redundant-connectivity)
           2. [Network Segmentation and Isolation](#network-segmentation-and-isolation)
           3. [Disaster Recovery and Alternate Connectivity](#disaster-recovery-and-alternate-connectivity)
           4. [Regular Testing and Validation](#regular-testing-and-validation)
        4. [Field Device and Edge Services](#field-device-and-edge-services)
           1. [Failover and Redundancy](#failover-and-redundancy-1)
           2. [Edge Computing Recovery](#edge-computing-recovery)
           3. [Spare Asset Strategy](#spare-asset-strategy)
           4. [Disaster Recovery for OT Systems](#disaster-recovery-for-ot-systems)
           5. [Testing and Drills](#testing-and-drills-1)
        5. [End-User Device Services](#end-user-device-services)
           1. [User Device Backup](#user-device-backup)
           2. [User Device Recovery](#user-device-recovery)
           3. [Policies and Training](#policies-and-training)
           4. [Resilience for User Services](#resilience-for-user-services)
           5. [Testing and Improvement](#testing-and-improvement)
     7. [Infrastructure Topology and Deployment View](#infrastructure-topology-and-deployment-view)
        1. [Topology Diagram](#topology-diagram)
        2. [Deployment Architecture](#deployment-architecture)
        3. [Environments](#environments)
        4. [Network and Endpoint Layouts](#network-and-endpoint-layouts)
     8. [Integration and Middleware](#integration-and-middleware)
        1. [Integration Approach](#integration-approach)
        2. [Middleware and Integration Services](#middleware-and-integration-services)
        3. [Interfaces and Data Flows](#interfaces-and-data-flows)
     9. [Technology Standards and Product Mapping](#technology-standards-and-product-mapping)
        1. [Computing and OS Standards](#computing-and-os-standards)
        2. [End User Computing Standards](#end-user-computing-standards)
        3. [Application and Software Standards](#application-and-software-standards)
        4. [Middleware and Integration Products](#middleware-and-integration-products)
        5. [Storage and Database Standards](#storage-and-database-standards)
        6. [Networking Standards](#networking-standards)
        7. [Security Standards](#security-standards)
     10. [Technology Roadmap and Lifecycle States](#technology-roadmap-and-lifecycle-states)
         1. [Roadmap Timeline](#roadmap-timeline)
         2. [Technology Lifecycle Status](#technology-lifecycle-status)
         3. [Future Evolution](#future-evolution)
     11. [Infrastructure Resilience and Performance](#infrastructure-resilience-and-performance)
         1. [Resiliency and Availability](#resiliency-and-availability)
         2. [Performance and Scalability](#performance-and-scalability)
         3. [Capacity and Growth Planning](#capacity-and-growth-planning)
         4. [Monitoring and Performance Tuning](#monitoring-and-performance-tuning)
     12. [Security Architecture](#security-architecture)
         1. [Asset Management (Identify)](#asset-management-identify)
         2. [Identity and Access Control (Protect)](#identity-and-access-control-protect)
         3. [Threat Detection and Response (Detect/Respond)](#threat-detection-and-response-detectrespond)
         4. [Data Protection and Encryption (Protect)](#data-protection-and-encryption-protect)
         5. [System and Communications Protection (Protect)](#system-and-communications-protection-protect)
         6. [Security Continuous Monitoring (Detect)](#security-continuous-monitoring-detect)
         7. [Recovery Planning (Recover)](#recovery-planning-recover)
  
  ## Introduction and Scope
  
  ### Purpose
  
  ## Introduction and Scope
  
  ### Purpose
  
  <Purpose>  
  This section defines **why** the Technology Architecture Document exists and **what** it must accomplish. It clarifies the infrastructure, platform, and shared technology services required to deliver the target solution. By doing so, it sets the foundation for design, procurement, deployment, and ongoing operations, ensuring every technology choice is traceable to the solution’s functional and non‑functional requirements, enterprise principles, and strategic objectives.
  
  <Instructions>  
  1. **State the Business & Solution Context** – Describe how the technology stack enables the solution’s business capabilities and application services (identified in the preceding Business and Application Architectures).  
  2. **Highlight Architectural Principles** – Reference principles such as cloud‑first, automation, resilience, observability, security‑by‑design, and cost optimisation.  
  3. **Define Scope & Boundaries** – Specify which layers (compute, storage, network, platform, middleware, tooling) are in scope, including integrations with existing enterprise services and external providers.  
  4. **Clarify Outcomes & Benefits** – Summarise the tangible results expected (e.g. improved availability, faster time‑to‑market, reduced technical debt).  
  5. **Tie Back to Enterprise Strategy** – Demonstrate alignment with published IT roadmaps, standards, and investment priorities.
  
  <Example>  
  The technology architecture is **capability‑driven** and **cloud‑native**, ensuring that every infrastructure component directly supports an application or business capability without unnecessary complexity. For the **Customer Experience Platform (CEP)** initiative:
  
  * **Compute & Container Platform** – A managed Kubernetes service (EKS/AKS/GKE) provides elastic, multi‑AZ compute for all microservices, enabling horizontal scalability during seasonal traffic spikes.
  * **Storage** – Tiered storage is selected: an object store (e.g. Amazon S3) for immutable assets, a managed relational database (Aurora PostgreSQL) for transactional data, and a distributed cache (Redis) for low‑latency reads.
  * **Networking** – A hub‑and‑spoke virtual network with segregated subnets protects workloads while allowing controlled east‑west traffic. Integration with an existing SD‑WAN provides secure hybrid connectivity to on‑prem systems.
  * **Security & Identity** – Centralised IAM with SAML/OIDC enforces single sign‑on and least‑privilege access; secrets are managed with a vault service and rotated automatically. All data in transit uses TLS 1.3, and at‑rest encryption keys are customer‑managed.
  * **Observability** – Unified logging, metrics, and tracing feed a cloud‑native observability stack (OpenTelemetry → managed ElasticSearch + Grafana). SLO dashboards enable real‑time health insights and proactive incident response.
  * **Automation & CICD** – Infrastructure‑as‑Code (Terraform modules) standardise environments. A CICD pipeline (GitHub Actions → Artifactory → Argo CD) provides immutable deployments, blue‑green releases, and automated rollbacks.
  * **Resilience & DR** – Services are deployed across three availability zones with automated multi‑region failover for critical data stores, meeting an RPO of ≤ 15 minutes and RTO of ≤ 1 hour.
  
  **Benefits & Outcomes:**
  
  * 99.9 % availability for customer‑facing APIs.
  * Average environment‑provisioning time reduced from weeks to < 1 hour.
  * 40 % lower total infrastructure cost through right‑sizing, spot capacity, and managed services.
  * Continuous compliance with ISO 27001 and CIS controls through policy‑as‑code.
  
  <Prerequisites>  
  
  * **Completed Application Architecture** – Workloads, interfaces, and runtime characteristics must be defined to size and design the technology stack accurately.
  * **Enterprise Principles & Guardrails** – Cloud strategy, security baseline, and approved technology catalog are published and accessible.
  * **Current Technology Portfolio Assessment** – An inventory of existing data centres, cloud accounts, toolchains, and licensing agreements identifies reuse and rationalisation opportunities.
  * **Capacity & Performance Forecasts** – Expected transaction volumes, growth rates, and peak‑load scenarios are estimated to drive sizing decisions.
  * **Stakeholder Alignment** – Infrastructure, security, networking, and operations teams (plus finance for costing) agree on objectives, SLAs, and funding.
  
  <Standards>  
  
  * **Architecture Principles Catalog** – Adheres to principles such as *Cloud‑First*, *Automate Everything*, *Secure by Default*, *Design for Failure*, and *Measure to Improve*.
  * **Reference Architectures & Blueprints** – Aligns with the organisation’s Cloud Landing Zone, Zero‑Trust Network, and Platform Engineering blueprints.
  * **Naming & Tagging Conventions** – All resources follow the enterprise tagging schema (e.g. `CostCenter`, `Env`, `AppID`) to enable chargeback and governance.
  * **Compliance & Regulatory Standards** – Meets ISO 27001, NIST 800‑53 Moderate, SOC 2 Type II, and industry‑specific regulations (e.g. PCI‑DSS if processing payments).
  * **Operational Excellence Framework** – Conforms to ITIL/ITSM processes for change, incident, and problem management, integrating with the corporate CMDB and ticketing system.
  
  ### Scope Inclusions & Exclusions
  
  <Purpose>  
  This section **draws the line** around what is, and is not, part of the Technology Architecture for the target solution. It names every infrastructure layer, platform service, integration, and environment **inside** the remit of this document, while explicitly pointing to what is **outside**—either because it is governed at the enterprise level (e.g. corporate identity service), covered in a separate domain architecture (e.g. Data Architecture), or belongs to a different project altogether. Clear scope boundaries prevent ambiguity, control effort, and keep stakeholders aligned on deliverables and accountabilities.
  
  <Instructions>  
  1. **Enumerate In‑Scope Technology Domains** – List the specific compute, storage, network, platform, middleware, security, observability, automation, and DR components governed by this document.  
  2. **Identify Integration Touchpoints** – Describe inbound/outbound interfaces with existing enterprise services, external partners, or third‑party platforms that must be designed or consumed.  
  3. **State Explicit Exclusions** – Declare items managed elsewhere (e.g. enterprise WAN backbone, corporate PKI, HR systems) and reference the authoritative documents or teams.  
  4. **Clarify Environment Coverage** – Specify whether scope includes dev, test, staging, prod, disaster‑recovery, and/or edge locations.  
  5. **Reference Governing Artefacts** – Link to Statements of Architecture Work (SoAW), program charters, or enterprise guidelines that formalise scope decisions.
  
  <Example>  
  For the **Customer Experience Platform (CEP)** initiative, the Technology Architecture scope is defined as follows:
  
  **In‑Scope**
  
  | Domain                           | Components / Services Included                                                                     | Notes                         |
  |----------------------------------|----------------------------------------------------------------------------------------------------|-------------------------------|
  | **Compute & Container Platform** | Managed Kubernetes clusters (prod, non‑prod), node groups, cluster add‑ons (Ingress, service mesh) | Multi‑AZ, auto‑scaling        |
  | **Storage & Data**               | Object store buckets, relational DBaaS (PostgreSQL), distributed cache, secrets vault              | Sized for 3‑year growth       |
  | **Networking**                   | Virtual networks, subnets, route tables, ingress/egress gateways, app‑level WAF, API gateway       | Peered to enterprise hub      |
  | **Security & IAM**               | Solution‑specific roles/policies, MFA enforcement, service accounts, KMS keys                      | Integrates with corp SSO      |
  | **Integration**                  | REST/GraphQL APIs, event bus topics, partner B2B gateway endpoints                                 | Contracts defined in API spec |
  | **Observability**                | Centralised logging pipelines, metrics collectors, APM tracers, alerting rules                     | 30‑day log retention          |
  | **Automation & CICD**            | IaC repositories, pipeline templates, artefact registries, deployment orchestrators                | Git‑based workflows           |
  | **Resilience & DR**              | Multi‑AZ failover, cross‑region replicated DB, backup schedules, runbook automation                | RPO ≤ 15 min, RTO ≤ 1 hr      |
  | **Operational Management**       | Run‑books, config management, patching schedule, capacity monitoring                               | On‑call rotation defined      |
  
  **Out of Scope / Exclusions**
  
  * **Enterprise Core Services** – Corporate identity provider (Okta), global DNS, NTP, and outbound Internet proxy are owned by the Infrastructure Platform Team and governed by the Enterprise Service Catalog.
  * **Data Warehouse & Analytics** – Long‑term analytical storage, BI tooling, and ML workloads are addressed in the separate Data Architecture Document (see DA‑DOC‑042).
  * **End‑User Computing** – Laptops, VDI, and mobile device management are excluded; these fall under Workplace Services.
  * **Payment Processing** – Handled by the Finance Platform; CEP only integrates via a PCI‑certified payment API.
  * **Organisational Change & Training** – Non‑technical adoption activities are managed by the Business Transformation Office.
  
  **Environment Coverage** – Scope includes **Dev, QA, Staging, Production, and DR** accounts. Sandbox or personal developer environments are excluded.
  
  By fixing these boundaries, the project team can plan resources, time, and governance checkpoints precisely, while stakeholders know which deliverables to expect from this architecture workstream.
  
  <Prerequisites>  
  * **Approved Statement of Architecture Work (SoAW)** specifying project goals, funding, and high‑level scope.  
  * **Current‑State Technology Inventory** identifying reusable services and compliance obligations.  
  * **Signed Interface Control Documents (ICDs)** for any external integrations (e.g. payment gateway SLA).  
  * **Enterprise Service Catalog Access** to verify which shared platforms are mandatory or optional.  
  * **Stakeholder Sign‑Off** from infrastructure, security, networking, and operations leaders confirming inclusions and exclusions.
  
  <Standards>  
  * **Scope Governance** – Changes to inclusions/exclusions follow the Architecture Change Management (ADM Phase H) process with Architecture Review Board (ARB) approval.  
  * **Naming & Tagging** – All in‑scope resources use the enterprise tagging schema (`AppID`, `Env`, `Owner`, `Scope=CEP`).  
  * **Boundary Controls** – Data crossing defined boundaries must traverse authorised gateways and comply with zero‑trust network controls.  
  * **Documentation Traceability** – Each scoped component is traced to corresponding rows in the *Technology Portfolio Catalog* and linked in the CMDB.  
  * **Compliance Alignment** – In‑scope assets must meet CIS benchmarks, ISO 27001 Annex A controls, and any project‑specific regulatory requirements (e.g. PCI for payment API endpoints).
  
  ## Baseline and Target Architecture
  
  <Purpose>  
  This section **compares today’s reality with tomorrow’s vision** for the technology landscape that supports the solution. It documents:  
  
  * **Baseline (Current‑State) Architecture** – the existing infrastructure, platforms, and services in use, including known limitations.
  * **Target (Future‑State) Architecture** – the desired end‑state that meets functional and non‑functional requirements, architectural principles, and strategic goals.
  * **Gap Analysis** – the delta between baseline and target, clarifying what must be introduced, changed, retired, or migrated, and why.
  
  Clear articulation of these elements provides stakeholders with a shared understanding of what will change, the rationale, and the scale of effort required.
  
  <Instructions>  
  1. **Describe Baseline** – Summarise key compute, storage, network, security, integration, and operations components as they exist today. Note age, support status, performance, and compliance issues.  
  2. **Describe Target** – Outline the planned architecture, emphasising improvements (e.g. cloud‑native patterns, automation, zero‑trust security, observability).  
  3. **Highlight Gaps** – Identify specific technology changes (e.g. “upgrade SQL Server 2012 → managed PostgreSQL”), capability gaps (e.g. “no built‑in disaster recovery”), or process gaps (e.g. “manual deployments → CICD”).  
  4. **Prioritise Remediation** – Indicate which gaps are critical‑path, high‑risk, or easy wins.  
  5. **Reference Roadmap** – Link to migration waves or transition architectures where gaps will be closed.
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Domain                 | **Baseline (As‑Is)**                                      | **Target (To‑Be)**                                                      | **Gap / Required Change**                                        |
  |------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------|------------------------------------------------------------------|
  | **Compute**            | On‑prem VMware cluster, 60 % utilised, single data‑centre | Managed Kubernetes (multi‑AZ) + serverless functions                    | Migrate VMs to containers; adopt IaC; decommission ageing blades |
  | **Storage & Data**     | SQL Server 2012 on SAN; unmanaged file share              | Managed PostgreSQL, object storage (versioned), encrypted secrets vault | Data migration & schema refactor; implement encryption‑at‑rest   |
  | **Networking**         | Flat L2 network; firewalls at perimeter only              | Hub‑and‑spoke VPC with micro‑segmentation, WAF, API gateway             | Re‑architect network; apply zero‑trust controls and service mesh |
  | **Security & IAM**     | Local AD groups; manual key rotation                      | Centralised IAM (SAML/OIDC), KMS, automated secrets rotation            | Integrate with enterprise SSO; enforce MFA and least privilege   |
  | **Integration**        | Point‑to‑point SOAP, batch file drops                     | REST/GraphQL APIs, event streaming bus                                  | Build API gateway; convert batch → real‑time events              |
  | **Observability**      | Basic VM syslogs; no tracing                              | Unified log/metrics/tracing stack with SLO dashboards                   | Deploy observability platform; instrument code and infra         |
  | **Automation & CI-CD** | Manual deployments via RDP                                | GitOps pipelines, blue‑green deployments                                | Create pipelines; train teams on Git workflows                   |
  | **Resilience & DR**    | Single DC; nightly tape backup                            | Multi‑AZ + cross‑region failover; RPO 15 min, RTO 1 hr                  | Implement continuous replication; automate failover drills       |
  | **Compliance**         | Ad‑hoc audits; configs drift                              | Policy‑as‑Code, CIS‑hardened images, continuous compliance scans        | Embed compliance in pipeline; remediate baseline drift           |
  
  **Gap Summary**
  
  * **Technical Debt Hotspots** – End‑of‑support databases, flat network, manual ops undermine security and agility.
  * **Capability Shortfalls** – No automated scaling, limited observability, and fragile DR fail compliance and SLO targets.
  * **Opportunity Areas** – Container platform, IaC, and event‑driven architecture offer rapid value and pave the way for further modernisation.
  
  **Remediation Priorities**
  
  1. **Security & Compliance** (Critical) – IAM uplift, network segmentation, and encryption must precede cloud cut‑over.
  2. **Foundational Platform** (High) – Stand up managed Kubernetes and object storage to host refactored services.
  3. **Data & Integration Modernisation** (Medium) – Migrate relational data, introduce API gateway and event bus.
  4. **Observability & Automation** (Medium) – Implement monitoring stack and CICD to support day‑2 operations.
  5. **Retire Legacy** (Low) – Decommission on‑prem hardware post‑migration to release OPEX.
  
  <Prerequisites>  
  
  * **Verified Current‑State Inventory** of all servers, DBs, network segments, and licences.
  * **Performance Benchmarks & SLAs** to measure improvement.
  * **Risk Assessment** identifying compliance and availability gaps.
  * **Approved Migration Strategy** (e.g. lift‑and‑shift vs. refactor) with staged timelines.
  * **Budget & Resource Allocation** for tooling, training, and change management.
  
  <Standards>  
  
  * **Baseline Documentation** – Captured in the CMDB and validated quarterly.
  * **Target Blueprint Compliance** – Aligns with the enterprise Cloud Landing Zone, Zero‑Trust guidelines, and Platform Engineering standards.
  * **Gap Closure Governance** – Each remediation item enters the Architecture Roadmap and is tracked via the Architecture Review Board (ARB).
  * **Metric‑Driven Validation** – Success measured by SLO attainment (availability ≥99.9 %, latency ≤200 ms), security posture (no critical CVEs), and compliance audit pass rates.
  
  ### Baseline Architecture:
  
  <Purpose>  
  Document the **current‑state technology landscape** for the solution so stakeholders share a fact‑based understanding of where we are starting. This inventory reveals technical debt, operational risks, and capability gaps that must be addressed in the target state and migration roadmap.
  
  <Instructions>  
  1. **Catalogue Assets** – List all compute, storage, network, platform, middleware, integration, security, and management components that currently run or support the solution. Include vendor/edition, version, deployment model (on‑prem, VM, container, SaaS, etc.), and environment (dev, test, prod).  
  2. **Map Integrations** – Identify key inbound/outbound interfaces (APIs, messaging, file transfers) and the protocols or tools used (e.g., SOAP, MQ, SFTP).  
  3. **Highlight Operational Characteristics** – Note utilisation, performance baselines, resilience mechanisms, monitoring coverage, and support status.  
  4. **Record Limitations & Pain Points** – Capture known issues: end‑of‑support software, scalability bottlenecks, manual processes, security gaps, and compliance findings.  
  5. **Validate with Stakeholders** – Ensure the baseline is reviewed and confirmed by infrastructure, security, operations, and application owners.
  
  <Example> – **Customer Experience Platform (CEP) – Current State**
  
  | Domain                 | Technology Components (Version / Vendor)                                  | Deployment & Ops                                            | Known Issues & Risks                                                            |
  |------------------------|---------------------------------------------------------------------------|-------------------------------------------------------------|---------------------------------------------------------------------------------|
  | **Compute**            | 22 × VMware ESXi 6.5 VMs (Ubuntu 18.04 LTS), 4 vCPU/8 GB each             | Single on‑prem data‑centre; manual provisioning via vSphere | 80 % CPU at peak, no auto‑scaling; ESXi 6.5 reaches EoS in Oct 2025             |
  | **Storage**            | SAN array (NetApp FAS2552) for DB & file shares; 45 TB used               | Weekly full + nightly incremental backups to tape           | Thin provisioning exhausted; restores exceed 6 hrs; tape media nearing capacity |
  | **Database**           | Microsoft SQL Server 2012 Standard                                        | Active‑Passive failover cluster                             | Out of extended support; no encryption‑at‑rest; 300 ms P99 query latency        |
  | **Networking**         | Flat VLAN; perimeter firewall (Cisco ASA) only                            | Static IPs; manual FW rule changes                          | East‑west traffic unsegmented; change windows ≥ 4 weeks                         |
  | **Integration**        | Point‑to‑point SOAP web services (Axis2), nightly CSV file drops via SFTP | Scripts scheduled via Windows Task Scheduler                | High coupling; batch delays up to 8 hrs; brittle scripts frequently fail        |
  | **Security & IAM**     | Local AD domain; service accounts with shared passwords                   | Password rotation is manual; no MFA                         | NIST audit flagged excessive privileges and weak rotation controls              |
  | **Observability**      | VM syslogs to Graylog; basic host metrics; no APM                         | Manual dashboard creation; alerts via email only            | Limited root‑cause analysis; mean‑time‑to‑detect ≥ 3 hrs                        |
  | **Deployment & CI/CD** | MSI packages copied over RDP; change tickets raised manually              | Monthly release window; rollback = restore VM snapshot      | High deployment effort; average 20 % failure rate; downtime \~2 hrs             |
  | **Resilience & DR**    | Secondary tape backup site 300 mi away; manual recovery                   | Annual DR test only                                         | RPO = 24 hrs, RTO = 72 hrs (misses business SLO of 4 hrs)                       |
  | **Compliance**         | Ad‑hoc security patches; quarterly vulnerability scans                    | Findings tracked in spreadsheets                            | 17 critical CVEs outstanding; patch backlog of 90 days                          |
  
  **Pain‑Point Summary**
  
  * End‑of‑support software (SQL Server 2012, ESXi 6.5) increases vulnerability and vendor risk.
  * Lack of auto‑scaling and flat network topology limit performance and security.
  * Manual deployments, backups, and DR create lengthy outage windows and operational toil.
  * Compliance gaps (unencrypted data, shared credentials) jeopardise regulatory obligations.
  
  <Prerequisites>  
  * **Configuration Management Database (CMDB)** extracted and verified for accuracy.  
  * **Performance Monitoring Reports** for the last 6 months to substantiate utilisation data.  
  * **Security & Compliance Assessments** identifying outstanding findings and deadlines.  
  * **License & Support Contracts** to determine renewal pressures or cost impacts.  
  * **Stakeholder Sign‑Off** confirming that the baseline accurately reflects production reality.
  
  <Standards>  
  * **Baseline Refresh Cycle** – Inventory must be revalidated every 90 days or before major change.  
  * **Version Notation** – Use `<Product> <Major>.<Minor>.<Patch>` format for consistency.  
  * **Data Sensitivity Tags** – Flag assets handling PII, PCI, or other regulated data per policy.  
  * **Source‑of‑Truth** – All baseline artefacts stored in the Architecture Repository under *Baseline\TA\CEP\2025‑Q3*.  
  
  ### Target Architecture:
  
  <Purpose>  
  Define the **future‑state technology landscape** that will realise the solution’s functional and non‑functional requirements, align with enterprise principles, and deliver measurable business value. This vision sets the engineering north‑star, guiding design decisions, funding, and migration sequencing.
  
  <Instructions>  
  1. **Describe Future Components** – Enumerate compute, storage, network, security, integration, observability, automation, and DR capabilities that will exist once the solution is fully implemented.  
  2. **Highlight Improvements** – Explain how each component addresses baseline pain points (e.g., scalability, availability, compliance, cost).  
  3. **Align to Business & EA Principles** – Show direct linkage to business objectives (e.g., customer experience, operational resilience) and enterprise guardrails (cloud‑first, zero‑trust, automation‑by‑default).  
  4. **Indicate Technology Choices & Rationale** – State preferred products/services (managed vs. self‑hosted, vendor vs. open‑source) and why they are selected (TCO, maturity, integration fit).  
  5. **Reference Target KPIs** – Include key performance, availability, security, and cost targets that the architecture must meet.  
  
  <Example> – **Customer Experience Platform (CEP) – Future State**
  
  | Domain                      | **Target Components & Services**                                                                                                         | **Key Improvements over Baseline**                                              | **Business / NFR Alignment**                                                       |
  |-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
  | **Compute**                 | Managed **Kubernetes Service** (EKS/AKS/GKE) with autoscaling node groups; **FaaS** layer for event‑driven tasks                         | Elastic scaling; no patching of OS/VMs; canary & blue‑green deployments         | Handles seasonal traffic surges; supports CI/CD velocity; reduces Ops toil         |
  | **Storage & Data**          | **Aurora PostgreSQL** (multi‑AZ), **Object Storage** (S3) with lifecycle & versioning, **Secrets Vault** (HSM‑backed), **Redis Cluster** | Managed, encrypted‑at‑rest; automated backups; microsecond latency cache        | Meets data privacy, RPO ≤ 15 min; accelerates page loads to < 150 ms               |
  | **Networking**              | **Hub‑and‑Spoke VPC** with **Service Mesh** (mTLS), **API Gateway**, **Global WAF/CDN**, private link to SaaS partners                   | Zero‑trust segmentation; edge DDoS protection; consistent traffic observability | Reduces lateral‑movement risk; improves end‑user latency 30 %                      |
  | **Security & IAM**          | **Centralised IAM** (OIDC/SAML) with conditional MFA, **KMS** CMKs, **Policy‑as‑Code** (OPA) integrated in pipelines                     | Fine‑grained least privilege; automated drift detection                         | Passes ISO 27001, SOC 2 audit controls; avoids privileged escalations              |
  | **Integration**             | **REST & GraphQL APIs** fronted by gateway, **Event Streaming Platform** (Kafka/managed service) for async integration                   | Decouples services; supports real‑time updates; no nightly batches              | Enables omni‑channel CX with sub‑second consistency; simplifies partner onboarding |
  | **Observability**           | **OpenTelemetry** instrumented code → **Managed Elastic & Grafana**; AIOps alerting                                                      | Unified tracing; SLO dashboards; proactive anomaly detection                    | MTTR < 30 min; supports customer‑facing SLA of 99.9 %                              |
  | **Automation & CICD**       | **GitOps Pipeline** (GitHub Actions → Artifactory → Argo CD), **IaC** (Terraform modules)                                                | Push‑button environment builds; immutable releases; auto‑rollback               | Cuts deploy lead‑time from weeks to < 1 hr; failure rate < 5 %                     |
  | **Resilience & DR**         | **Multi‑AZ + Multi‑Region** failover, continuous DB replication, periodic chaos testing                                                  | RPO 15 min, RTO 1 hr; validated through quarterly drills                        | Meets critical business continuity targets; protects brand reputation              |
  | **Compliance & Governance** | **Continuous Compliance Scans**, CIS‑hardened images, automated evidence collection                                                      | Near‑real‑time posture reporting; eliminates manual spreadsheets                | Audit readiness; fewer non‑conformities; regulatory confidence                     |
  | **Cost Management**         | **FinOps Dashboards**, rightsizing policies, spot instances where applicable                                                             | 30 % infra cost reduction vs. baseline; real‑time chargeback                    | Aligns spend with value; supports CFO transparency                                 |
  
  **Architectural Highlights**
  
  * **Cloud‑Native & Container‑First** – All new workloads run as containers or serverless functions to maximise portability and scalability.
  * **Zero‑Trust Security** – Every service authenticated, authorised, and encrypted (mTLS) by default.
  * **Platform Engineering** – Shared golden paths (IaC modules, pipeline templates, run‑books) accelerate developer onboarding and standardise environments.
  * **Observability‑as‑Code** – Telemetry configuration lives in the same repo as service code, ensuring every deployment is measurable.
  * **Resilience by Design** – Distributes critical components across fault domains and performs automated chaos experiments to validate recovery procedures.
  
  **Target KPIs / SLOs**
  
  * **Availability:** ≥ 99.9 % for public APIs
  * **Latency:** P95 < 200 ms for core transactions
  * **Deployment Lead Time:** ≤ 1 hr from merge to production
  * **MTTR:** ≤ 30 min for Sev‑1 incidents
  * **Security Compliance:** 0 critical/unpatched CVEs > 14 days
  
  <Prerequisites>  
  * **Approved Cloud Landing Zone** with guardrails enforced.  
  * **Funding & Licensing** for managed services (K8s, Aurora, Kafka, Grafana).  
  * **Skilled Resources** trained in container, IaC, and GitOps practices.  
  * **Updated Risk Register** reflecting target‑state controls.  
  * **Stakeholder Buy‑In** on new operating model (DevSecOps, FinOps, Platform Team).  
  
  <Standards>  
  * **Alignment with Enterprise Reference Architectures** – Cloud, Zero‑Trust, and Data Protection blueprints.  
  * **Resource Tagging** – `CostCenter`, `Env`, `AppID`, `Owner`, `Criticality`.  
  * **Performance Benchmarks** – Load‑test thresholds codified in CICD gates.  
  * **Change Governance** – All target‑state components subject to ARB review and Service Introduction Checklist.  
  * **Documentation** – Target artefacts stored in Architecture Repository under *Target\TA\CEP\2025‑Q3* and kept version‑controlled.  
  
  ### Gap Analysis:
  
  <Purpose>  
  Convert the **delta between “as‑is” and “to‑be”** into a clear, actionable list of gaps. Each gap records *what is missing or deficient*, *why it matters*, and *how it will be addressed* (new capability, upgrade, decommission, or process change). The resulting catalogue feeds the migration roadmap, funding requests, and project charters.
  
  <Instructions>  
  1. **Identify Gaps** – For every technology domain compare baseline vs. target and flag mismatches (e.g., EoS software, missing observability, manual deployments).  
  2. **Classify Gap Type** – Tag as *Add* (net‑new capability), *Enhance* (upgrade/scale), *Retire* (decommission), or *Process* (people/process/tool change).  
  3. **Describe Remediation** – Summarise the action required (e.g., “Migrate SQL Server 2012 → Aurora PostgreSQL”).  
  4. **Link to Work Packages** – Reference projects, epics, or waves that will close the gap; include priority and target completion.  
  5. **Capture Dependencies/Risks** – Note prerequisite actions (e.g., IAM overhaul before cloud lift) and material risks (skill gaps, cut‑over windows).  
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | #  | Domain          | **Gap Description**                                     | **Type**          | **Remediation / Action**                                                              | **Work Package / Wave**          | **Priority** | **Dependencies / Risks**              |
  |----|-----------------|---------------------------------------------------------|-------------------|---------------------------------------------------------------------------------------|----------------------------------|--------------|---------------------------------------|
  | 1  | Compute         | On‑prem VMs lack elastic scaling; ESXi 6.5 EoS Oct 2025 | Retire / Add      | Containerise workloads; deploy to managed K8s                                         | WP‑01 “Platform Foundation”      | Critical     | Landing Zone provisioned; K8s skills  |
  | 2  | Database        | SQL Server 2012 unsupported & unencrypted               | Enhance           | Schema refactor; migrate to Aurora PostgreSQL (TLS & KMS)                             | WP‑02 “Data Modernisation”       | High         | Data mapping; downtime window         |
  | 3  | Networking      | Flat VLAN → no micro‑segmentation; manual FW updates    | Enhance           | Build hub‑and‑spoke VPC, service mesh (mTLS), IaC FW rules                            | WP‑01 “Platform Foundation”      | High         | IAM uplift; change‑control approvals  |
  | 4  | Integration     | Point‑to‑point SOAP & nightly batch files               | Add               | Establish API Gateway + Kafka event bus; develop REST/GraphQL services                | WP‑03 “API & Event Backbone”     | High         | Database migration; partner contracts |
  | 5  | Security & IAM  | Shared passwords, no MFA, manual key rotation           | Enhance / Process | Integrate with enterprise SSO (OIDC), enforce MFA, automate secret rotation via Vault | WP‑04 “Zero‑Trust Security”      | Critical     | User onboarding; policy sign‑off      |
  | 6  | Observability   | No tracing; fragmented logs; MTTR ≥ 3 hrs               | Add               | Deploy OpenTelemetry pipelines, central log/metrics stack, AIOps alerts               | WP‑05 “Observability Enablement” | Medium       | K8s platform availability             |
  | 7  | CI/CD           | RDP + MSI; manual tickets; 20 % deploy failure          | Add / Process     | Implement GitOps pipeline (GitHub Actions → Argo CD); blue‑green releases             | WP‑06 “DevSecOps Pipeline”       | High         | IAM roles; container registry         |
  | 8  | Resilience & DR | Single DC; tape backup; RTO 72 hrs                      | Add               | Multi‑AZ + cross‑region replication; automated failover drills                        | WP‑07 “Resilience & DR”          | High         | Platform foundation; data migration   |
  | 9  | Compliance      | 17 critical CVEs, manual audit evidence                 | Enhance / Process | CIS‑hardened images; policy‑as‑code scans; auto evidence capture                      | Integrated across all WPs        | Critical     | Pipeline implementation               |
  | 10 | Cost Mgmt       | No chargeback; over‑provisioned SAN                     | Add               | FinOps dashboards; rightsizing & spot instance policies                               | WP‑08 “FinOps Enablement”        | Medium       | Tagging standards; exec reporting     |
  
  **Gap Closure Roadmap (Summary)**
  
  * **Wave 1 – Platform Foundation (Months 0–3):** Build landing zone, managed K8s, micro‑segmented network.
  * **Wave 2 – Data & Security (Months 3–6):** Migrate databases, integrate IAM & secrets management.
  * **Wave 3 – Integration & Observability (Months 6–9):** Stand‑up API gateway, event bus, full telemetry stack.
  * **Wave 4 – DevSecOps & DR (Months 9–12):** GitOps pipelines, blue‑green deploys, automated DR drills.
  * **Wave 5 – Optimisation (Months 12+):** FinOps, continuous compliance, legacy hardware decommission.
  
  **Key Risks & Mitigations**
  
  * **Skill Gaps** – Upskill teams on K8s, IaC, and event streaming; augment with vendor PS.
  * **Cut‑over Downtime** – Adopt blue‑green and replication‑based migration to minimise outages.
  * **Data Integrity** – Perform dual‑run validation during DB migration; maintain fallback snapshots.
  * **Change Saturation** – Phase deployments to avoid peak business periods; communicate early with stakeholders.
  
  <Standards>  
  * **Gap Tracking** – All gaps tracked in the Architecture Roadmap Kanban (Jira board `TA‑CEP‑Roadmap`).  
  * **Priority Codes** – *Critical*, *High*, *Medium*, *Low* based on business impact and risk exposure.  
  * **Work Package Definition** – Each WP must include scope, success metrics, budget, and owner, approved by the Architecture Review Board (ARB).  
  * **Risk Register** – Gaps with residual risk recorded in Enterprise Risk Management system and reviewed quarterly.  
  
  ## Platform Services
  
  <Purpose>  
  This section catalogues the **core infrastructure platform services**—compute, storage, network, and related shared capabilities—that underpin the solution. It gives architects, engineers, and operators a single reference for *what* foundational services exist (or will exist), *where* they run (cloud, on‑prem, edge), and *how* they are consumed (IaaS, PaaS, SaaS). By documenting both **IT data‑centre services** and **OT / field‑device platforms**, the organisation gains a holistic view of the technology bedrock on which all higher‑level applications and business capabilities rely.
  
  <Instructions>  
  1. **Structure by Domain** – Break the inventory into **Compute**, **Storage & Data**, **Network & Connectivity**, and optional domains such as **Edge / OT Platforms**, **Security Services**, and **Management & Automation** if relevant.  
  2. **Capture Current vs. Target** – For each component, note its *Baseline* (today) and *Target* (future) status to show evolution.  
  3. **Include Deployment & Consumption Model** – Specify whether the service is on‑prem virtualisation, public cloud IaaS/PaaS, managed SaaS, or embedded edge device.  
  4. **Document Key Attributes** – Version, capacity, availability zone/region, tenancy model, service owner, and support SLA.  
  5. **Reference Integrations** – Call out critical dependencies (e.g., VPN to plant network, Direct Connect to cloud, or database replication links).  
  6. **Indicate Non‑Functional Alignment** – Map each service to the non‑functional requirements it satisfies (e.g., scalability, durability, compliance).  
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Domain                      | **Service / Component**            | **Baseline (As‑Is)**              | **Target (To‑Be)**                                                      | **Key Attributes & Notes**                                 |
  |-----------------------------|------------------------------------|-----------------------------------|-------------------------------------------------------------------------|------------------------------------------------------------|
  | **Compute**                 | Virtual Machines (VMware ESXi 6.5) | 22 VMs, manual patching           | **Managed Kubernetes** (EKS) + **Lambda** functions                     | K8s v1.30, autoscaling node groups; FaaS for event workers |
  |                             | On‑Prem Blade Servers              | 5 × Dell R730                     | *Retire*                                                                | Decommission after container cut‑over                      |
  | **Storage & Data**          | SAN (NetApp FAS2552)               | 45 TB used, thick‑provisioned     | **S3 Object Storage** + **Aurora PostgreSQL**                           | S3 with versioning & lifecycle; Aurora multi‑AZ, TLS, KMS  |
  |                             | Tape Backup Library                | LTO‑6 off‑site                    | *Replace*                                                               | Cloud‑native backup & cross‑region replication             |
  | **Network & Connectivity**  | Flat VLAN, Cisco ASA               | Single subnet, manual ACLs        | **Hub‑and‑Spoke VPC** with **Transit Gateway**, **Service Mesh (mTLS)** | /16 CIDR per env; network policy‑as‑code; WAF at edge      |
  |                             | MPLS Link to Branches              | 100 Mbps                          | **SD‑WAN** (SilverPeak)                                                 | Dynamic path selection; QoS for CX traffic                 |
  | **Edge / OT Platforms**     | Retail POS Devices                 | Windows 10 IoT, local SQL Express | **Containerised POS App** on ARM‑based edge gateways                    | Secure boot, OTA updates via IoT Hub                       |
  |                             | Digital Signage Players            | Proprietary firmware              | **Chrome‑OS Devices** centrally managed                                 | Schedules pulled from CEP API                              |
  | **Security Services**       | Active Directory                   | Local domain, NTLM auth           | **Azure AD / OIDC**, **Conditional MFA**                                | Hybrid‑joined; Just‑In‑Time admin                          |
  |                             | Secrets Storage                    | Text files on jump server         | **HashiCorp Vault (HSM‑backed)**                                        | Auto‑rotation, audit trail                                 |
  | **Management & Automation** | Manual Change Tickets              | Email‑driven                      | **GitOps Pipelines** (GitHub Actions → Argo CD)                         | IaC modules, policy checks, automated rollbacks            |
  |                             | Monitoring                         | Graylog syslogs                   | **OpenTelemetry → Managed Grafana/Elastic**                             | 30‑day log retention, 14‑day metrics, AIOps alerts         |
  
  **Improvements & Rationale**
  
  * **Elasticity & Cost Efficiency** – Shift from fixed‑capacity VMs to managed K8s and serverless trims 30 % infrastructure spend and auto‑scales during holiday peaks.
  * **Resilience** – Multi‑AZ storage and compute remove single‑DC dependency, meeting RPO 15 min / RTO 1 hr.
  * **Security Posture** – Zero‑trust network, mTLS service mesh, and HSM‑backed secrets vault close audit findings and achieve ISO 27001 controls.
  * **Operational Agility** – GitOps pipelines and observability‑as‑code cut deployment lead time to < 1 hour while slashing MTTR to ≤ 30 min.
  * **OT/Edge Convergence** – Unified management of field devices (POS, signage) via containerised workloads and secure OTA updates reduces truck rolls and security risk.
  
  **Service Ownership & SLAs**
  
  | Service            | Owner         | SLA (Target) | Support Model                  |
  |--------------------|---------------|--------------|--------------------------------|
  | Managed Kubernetes | Platform Team | 99.9 %       | 24×7 DevOps on‑call            |
  | Aurora PostgreSQL  | Data Services | 99.95 %      | Cloud provider premium support |
  | SD‑WAN             | Network Ops   | 99.5 %       | Co‑managed with carrier        |
  | Vault              | Security Ops  | 99.9 %       | Internal SOC                   |
  
  <Prerequisites>  
  * **Cloud Landing Zone ready**, with guardrails and service quotas approved.  
  * **Connectivity baseline** (Direct Connect / VPN) operational for hybrid traffic.  
  * **License alignment** for Kubernetes add‑ons, SD‑WAN, and Vault Enterprise features.  
  * **Platform Team resourcing** (SRE, DevSecOps) to run shared services.  
  
  <Standards>  
  * **Tagging Scheme** – All resources tagged `[AppID]`, `[Env]`, `[CostCenter]`, `[Owner]`.  
  * **Configuration as Code** – Terraform/Helm artefacts stored in version control; changes via pull request.  
  * **Endpoint Encryption** – TLS 1.3 everywhere; mTLS inside service mesh; AES‑256 at rest.  
  * **Capacity Planning Review** – Quarterly right‑sizing and FinOps analysis.  
  * **Edge Device Hardening** – FIPS‑validated crypto modules, secure boot, and signed firmware only.  
  
  ### Compute Services
  
  <Purpose>  
  Capture the **processing layer** that powers the solution—virtual machines, containers, serverless runtimes, and edge devices—so that architects and operators understand *what compute resources exist*, *where they run*, and *how they are sized and managed*. A clear compute inventory ensures capacity, performance, security, and cost are all planned and governed in line with enterprise principles.
  
  <Instructions>  
  1. **List Compute Domains** – Distinguish between *core data‑centre/cloud*, *platform (Kubernetes / PaaS)*, *serverless / function‑as‑a‑service*, and *edge / field device* compute if relevant.  
  2. **Specify Baseline vs. Target** – For each domain, summarise the current implementation and the future state, highlighting gaps closed.  
  3. **Detail Technical Attributes** – Include OS/firmware, vCPU & memory profiles, scaling policies, availability zones/regions, and tenancy (single‑ vs. multi‑tenant).  
  4. **Align to NFRs** – Indicate how compute choices satisfy performance, scalability, resilience, and compliance requirements.  
  5. **Reference Management & Security Controls** – Note patching cadence, configuration‑as‑code, runtime security, and monitoring coverage.
  
  <Example> – **Customer Experience Platform (CEP) – Compute Overview**
  
  | Domain                 | **Baseline (As‑Is)**                                                        | **Target (To‑Be)**                                                                                                                 | **Key Improvements & Rationale**                                                                         |
  |------------------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
  | **Virtual Machines**   | 22 × VMware ESXi 6.5 VMs (Ubuntu 18.04), 4 vCPU / 8 GB RAM; manual patching | *Retire* – workload lifted to containers                                                                                           | Eliminates EoS hypervisor, reduces patch toil, enables autoscaling                                       |
  | **Container Platform** | N/A                                                                         | **Managed Kubernetes** (EKS v1.30) across 3 AZs; 2 node groups: *GP* (8 vCPU/32 GB) & *HI‑MEM* (16 vCPU/64 GB); Cluster Autoscaler | Horizontal & vertical autoscaling meets 99.9 % availability; pod security policies enforce CIS hardening |
  | **Serverless / FaaS**  | N/A                                                                         | **AWS Lambda** (ARM Graviton2), 512 MB–3 GB memory range; provisioned concurrency for latency‑sensitive functions                  | Event‑driven tasks scale to zero; lower cost for burst workloads                                         |
  | **Batch / Data Jobs**  | Windows Server 2012 VM running SQL Agent jobs                               | **K8s CronJobs** + **AWS Batch** with Spot instances                                                                               | Modern schedulers, no legacy OS, cost‑optimised spare capacity                                           |
  | **Edge / OT**          | 150 Retail POS devices (Win10 IoT)                                          | **ARM‑based Edge Gateway** running containerised POS on K3s; 4‑core CPU, 8 GB RAM; OTA updates                                     | Secure boot, signed images, central fleet management, reduces onsite visits                              |
  | **Build & CI Runners** | Jenkins on single VM                                                        | **Ephemeral GitHub Actions self‑hosted runners** on K8s; 8 vCPU/16 GB per pod                                                      | Parallel builds, auto‑scale, no single point of failure                                                  |
  
  **Compute Sizing & Scaling Policy**
  
  | Environment | Baseline Capacity    | Target Initial Capacity                                | Scaling Strategy                                  |
  |-------------|----------------------|--------------------------------------------------------|---------------------------------------------------|
  | Dev & QA    | 8 vCPU / 32 GB (VMs) | 2 GP nodes (spot) + 1 HI‑MEM node                      | 1 → 4 nodes based on CPU > 60 %                   |
  | Staging     | 16 vCPU / 64 GB      | 3 GP + 2 HI‑MEM nodes                                  | 3 → 6 nodes, HPA on requests > 70 %               |
  | Production  | 64 vCPU / 128 GB     | 6 GP + 3 HI‑MEM nodes + 200 provisioned Lambda conc.   | 6 → 12 nodes; provisioned conc. auto‑tuned weekly |
  | DR          | Tape restore only    | Warm K8s cluster (1 GP + 1 HI‑MEM) in secondary region | Scales to prod size in < 60 min on failover       |
  
  **Non‑Functional Alignment**
  
  * **Performance & Latency** – High‑mem node group isolates JVM‑heavy services, FaaS handles bursty workloads to hold P95 < 200 ms.
  * **Scalability** – Cluster Autoscaler + Karpenter ensure sub‑minute node provisioning; Lambda scales to 10 000 conc. invocations.
  * **Resilience** – Multi‑AZ control plane & node pools; managed spot interruptions automatically rescheduled by K8s.
  * **Security** – Immutable AMIs, CIS benchmarked container runtime, runtime scanning with AWS Inspector & Falco.
  * **Cost Optimisation** – 40 % GP node capacity via Spot; FaaS pay‑per‑use; right‑sizing reviewed quarterly.
  
  <Prerequisites>  
  
  * **Cloud Landing Zone** with EKS‑specific guardrails (Prowler, SCPs).
  * **Container Registry** (ECR) with image signing and provenance metadata.
  * **Kubernetes Platform Team** staffed (SRE, Platform Ops) and on‑call rota defined.
  * **Edge Gateway Procurement** finalised, including LTE fail‑over SIMs for connectivity redundancy.
  
  <Standards>  
  
  * **Node Image Baseline** – Hardened AMI (Ubuntu 22.04 LTS) rebuilt monthly via Packer.
  * **Naming & Tagging** – `eks-[env]-[az]-gp/hi` for nodes; tags: `AppID`, `Env`, `Owner`, `CostCenter`.
  * **Capacity Planning Review** – Bi‑annual load test informs node flavour adjustments.
  * **Patch Management** – Managed K8s + Bottlerocket OS auto‑patch weekly; edge gateways patch quarterly via OTA.
  * **Runtime Security** – Falco ruleset v0.38 enforced; alerts feed central SIEM within 30 seconds.
  
  ### Storage Services
  
  <Purpose>  
  Document the **data‑persistence layer** for the solution, covering relational and NoSQL databases, analytical stores, object and file repositories, in‑memory caches, and backup/archival facilities. A clear inventory—baseline and target—ensures capacity, performance, resilience, security, and cost are planned and governed in line with enterprise data‑management principles.
  
  <Instructions>  
  1. **Categorise Storage Domains:** Transactional DBs, Analytical Stores, Object & File Storage, In‑Memory Cache, Backup/DR.  
  2. **Show Baseline vs. Target:** Highlight upgrades, migrations, replication, encryption changes.  
  3. **Capture Technical Attributes:** Engine/version, capacity, IOPS/throughput, replication mode, encryption, retention, RPO/RTO.  
  4. **Link to Non‑Functionals:** Map choices to performance, scalability, durability, compliance, and cost requirements.  
  5. **Reference Governance Controls:** Classification, masking, IAM roles, audit logging, lifecycle rules.
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Domain                     | **Baseline (Current State)**                      | **Target (Future State)**                                  | **Key Improvements & Rationale**                            |
  |----------------------------|---------------------------------------------------|------------------------------------------------------------|-------------------------------------------------------------|
  | **Transactional Database** | SQL Server 2012 Std, 2‑node cluster on SAN (2 TB) | **Aurora PostgreSQL 15** (multi‑AZ), auto‑scales 3 → 12 TB | Eliminates EoS risk; continuous backup; 4× read throughput  |
  | **Object & File Storage**  | NetApp CIFS share (15 TB)                         | **Amazon S3 Standard** → S3 IA / Glacier                   | 11×9’s durability; lifecycle tiering cuts cost \~40 %       |
  | **In‑Memory Cache**        | None                                              | **ElastiCache Redis 7.2** (cluster mode, 3 × 6 GB)         | P95 response < 150 ms; multi‑AZ failover < 30 s             |
  | **Analytics / Reporting**  | SSRS on nightly CSV dumps                         | **Redshift Serverless** + Spectrum (S3)                    | Real‑time BI; pay‑per‑query; removes ETL batch window       |
  | **Shared File Config**     | Windows SMB share on VM                           | **Amazon EFS** (regional, bursting)                        | 99.99 % avail.; scales to PB; encrypted                     |
  | **Secrets Management**     | Text files on jump box                            | **AWS Secrets Manager** + KMS CMKs                         | Auto‑rotation; granular IAM; full audit trail               |
  | **Backup & DR**            | Weekly full + nightly inc. tapes, off‑site vault  | **AWS Backup** + cross‑region copy (RPO 15 min, RTO 1 hr)  | Removes tape ops; immutable backups; ransomware protection  |
  | **Edge Storage**           | POS devices local SQL Express; nightly VPN sync   | Local SQLite + IoT Jobs delta‑sync to Aurora               | Offline resilience; OTA schema updates; conflict resolution |
  
  **Capacity, Performance & Durability Targets**
  
  | Metric                   | Baseline    | Target                       |
  |--------------------------|-------------|------------------------------|
  | DB Read Throughput       | 3 k r/s     | 15 k r/s (Aurora + replicas) |
  | Object Retrieval Latency | 80 ms       | 30 ms (S3 + CDN)             |
  | Data Durability          | 99.9 %      | 99.999999999 %               |
  | Backup RPO / RTO         | 24 h / 72 h | 15 min / 1 h                 |
  | Storage \$ / GB‑month    | \$0.19      | \$0.023 (S3 IA)              |
  
  <Prerequisites>  
  * **Data‑Classification Matrix** approved (PII, PCI, Public).  
  * **Schema‑Refactor Plan** for SQL Server → Aurora migration.  
  * **Direct Connect/VPN Bandwidth** sized for 3 TB initial migration.  
  * **IAM Role Mapping** complete for least‑privilege access.  
  * **Retention Schedule** aligned with GDPR, CCPA, corporate policy.
  
  <Standards>  
  * **Naming & Tagging:** `DataClass`, `Compliance`, `Owner`, `Env`, `CostCenter`.  
  * **Encryption:** AES‑256 at rest, TLS 1.3 in transit, customer‑managed KMS keys rotated annually.  
  * **Lifecycle Rules:** S3 lifecycle JSON in Git, applied via Terraform.  
  * **Backup Verification:** Monthly restore drills logged in CMDB.  
  * **Data‑Quality Monitoring:** Automated drift checks; alerts to central SIEM.
  
  ### Network Services
  
  <Purpose>  
  Define the **connectivity layer**—LAN/WAN, cloud VPCs, load balancers, DNS, CDN, security perimeters, and observability—that links users, workloads, data stores, and edge devices. A clear baseline‑and‑target inventory ensures bandwidth, latency, security, and availability needs are met while aligning with enterprise **zero‑trust** and **cloud‑first** principles.
  
  <Instructions>  
  1. **Break Down Domains** – Core LAN, Cloud VPC / VNET, WAN / SD‑WAN, Internet Edge & CDN, Load Balancing, DNS & Discovery, Service Mesh / East‑West Security, Observability.  
  2. **Show Baseline vs. Target** – Highlight topology, segmentation, routing, encryption, and security‑control changes.  
  3. **Capture Technical Attributes** – CIDR ranges, link bandwidth, latency targets, HA mode, inspection points, logging scope.  
  4. **Connect to NFRs** – Explain how the design satisfies performance, resilience, security, compliance, and cost requirements.  
  5. **Reference Governance** – IaC modules, change‑control, tagging, and monitoring standards.
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Domain                     | **Baseline (Current State)**                            | **Target (Future State)**                                                            | **Key Improvements & Rationale**                                           |
  |----------------------------|---------------------------------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
  | **Core LAN / Data‑Centre** | Flat VLAN; 1 Gb switches; north‑south ASA firewall only | *Retire workload* (cloud migration); keep small mgmt VLAN                            | Shrinks attack surface; reduces on‑prem OPEX                               |
  | **Cloud VPC**              | N/A                                                     | **Hub‑and‑Spoke VPC** (10.10.0.0/16) with env‑spoke /24 subnets; **Transit Gateway** | Centralised routing, inspection, and segmentation; simplifies multi‑region |
  | **WAN / Hybrid**           | MPLS 100 Mbps + IPSec VPN to AWS                        | **SD‑WAN overlay** + **Direct Connect 1 Gb** (VPN fail‑over)                         | 10× bandwidth, 40 % cost reduction, dynamic latency routing                |
  | **Internet Edge & CDN**    | On‑prem ASA ACLs                                        | **CloudFront CDN** + **AWS Shield Adv.** + **Global Accelerator**                    | Anycast ingress, 60 % latency cut, automated DDoS protection               |
  | **Load Balancing**         | F5 BIG‑IP LTM                                           | **ALB (Layer 7)** + **NLB (Layer 4)**, cross‑AZ                                      | Integrated with autoscaling & blue‑green; removes hardware lifecycle       |
  | **Service Mesh**           | None                                                    | **AWS App Mesh** (Envoy, mTLS, SPIFFE IDs)                                           | Zero‑trust east‑west traffic; observability, resiliency patterns           |
  | **Firewall / IDS**         | Perimeter only                                          | **AWS Network Firewall** inline IDS/IPS, rule‑sets IaC                               | Layer‑7 inspection; centralised logging to SIEM                            |
  | **DNS & Discovery**        | Windows AD DNS                                          | **Route 53 Private Zones**, split‑horizon; **Consul** for service discovery          | DNSSEC, low‑latency lookups, automated via Terraform                       |
  | **Observability**          | SNMP & ad‑hoc NetFlow                                   | **VPC Flow Logs**, **Transit Gateway Network Manager**, Grafana dashboards           | Real‑time visibility, anomaly alerts, SLA tracking                         |
  
  **Performance, Resilience & Security Targets**
  
  | Metric                            | Baseline    | Target                   |
  |-----------------------------------|-------------|--------------------------|
  | Public API Latency (P95, US‑East) | 320 ms      | ≤ 150 ms                 |
  | East‑West Encryption Coverage     | 0 %         | 100 % (mTLS)             |
  | WAN Bandwidth to Cloud            | 100 Mbps    | 1 Gb + 200 Mbps backup   |
  | DDoS Mitigation Capacity          | Manual ACLs | ≥ Tb scale (Shield Adv.) |
  | Network SLA (Prod VPC)            | 99.5 %      | 99.95 %                  |
  
  <Prerequisites>  
  * **CIDR Plan Approved** – Conflict‑free across all environments and regions.  
  * **Landing‑Zone Guardrails** – SCPs & Config rules enforcing network policy.  
  * **DX Circuit Provisioned** – LOA/CFA complete; cross‑connect scheduled.  
  * **IaC Modules Reviewed** – VPC, TGW, SG, Route 53 Terraform modules security‑audited.  
  * **SOC Playbooks Updated** – Shield/Firewall alerts integrated into incident response.
  
  <Standards>  
  * **Naming & Tagging:** `vpc-[env]-[region]`, `tgw-[purpose]`, tags `Owner`, `Criticality`, `CostCenter`, `DataClass`.  
  * **Encryption:** TLS 1.3 externally; SPIFFE‑based mTLS internally; IPSec AES‑256‑GCM for WAN.  
  * **Firewall Rule Governance:** Policy‑as‑Code via Terraform; pull‑request review by NetSec; automated smoke tests post‑deploy.  
  * **Change Windows:** High‑risk network changes Tue/Thu 02:00‑04:00 UTC; automatic validation.  
  * **Monitoring & Alerting:** Flow‑log anomaly → PagerDuty (sev‑2); DX utilisation > 80 % triggers scaling review.  
  * **Documentation:** Diagrams & IaC docs stored in *Architecture Repo → Network / CEP / v2* with version control.
  
  ### End‑User Compute Services
  
  <Purpose>  
  Capture how **employee devices and workspaces**—laptops, desktops, tablets, smartphones, and virtual desktops—are selected, provisioned, secured, and supported. A clear baseline‑and‑target view ensures user productivity, security posture, and support efficiency align with enterprise standards and the overall technology strategy.
  
  <Instructions>  
  1. **Break Down Domains** – Physical End‑Points, Virtual Desktops / DaaS, Mobile Devices & MDM, Collaboration & Productivity Suite, Endpoint Security, Support & Lifecycle.  
  2. **Show Baseline vs. Target** – Highlight hardware/OS standards, management tooling, zero‑touch provisioning, security enhancements, and support model changes.  
  3. **Capture Technical Attributes** – Device models, OS versions, patch cadence, encryption, MDM policies, VDI footprint, collaboration license tiers.  
  4. **Map to Business & NFRs** – Explain how the target improves user experience, security compliance, remote‑work enablement, and TCO.  
  5. **Reference Governance** – Asset‑management system, configuration‑as‑code (Intune/Workspace ONE), endpoint‑security baselines, lifecycle refresh policy.
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Domain                           | **Baseline (Current State)**                                                    | **Target (Future State)**                                                                                           | **Key Improvements & Rationale**                                                                   |
  |----------------------------------|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
  | **Laptop / Desktop Fleet**       | Dell Latitude 5480 (2017), Windows 10 21H2 Pro; imaged manually by Service Desk | **Dell Latitude 5450 + MacBook Air M3** (choice); Windows 11 23H2 or macOS 15; **Autopilot / Apple DEP zero‑touch** | Hardware refresh → +35 % battery life; self‑service enrolment cuts setup time from 90 min → 10 min |
  | **Mobile Devices**               | BYOD iOS/Android; basic ActiveSync email profile                                | **Corporate‑issued iPhone 15 & Samsung S24** (role‑based); **Intune MDM** with Conditional Access, per‑app VPN      | Full device encryption, remote wipe, phishing‑resistant MFA; reduces data‑loss risk                |
  | **Virtual Desktop / DaaS**       | On‑prem Citrix 7.15; 200 persistent VDIs; VPN required                          | **Azure Virtual Desktop (AVD)** pooled host pools; FSLogix profiles; 300 seats; HTML5 client                        | Elastic scaling for contractors; global PoP access; 25 % cost reduction vs. on‑prem                |
  | **Productivity & Collaboration** | Office 2016 + Skype for Business                                                | **Microsoft 365 E5** (Office 365, Teams, Viva); Power Platform enabled                                              | Cloud co‑authoring, Teams voice replaces PBX, built‑in DLP & eDiscovery                            |
  | **Endpoint Security**            | McAfee ENS, manual signature updates; local admin accounts                      | **Defender for Endpoint P2**, EDR + attack‑surface reduction, LAPS enrolled                                         | Zero‑day coverage within hours; removes persistent admin privileges                                |
  | **Patch & Config Mgmt**          | WSUS monthly, GPO drift; manual Mac patching                                    | **Intune + Autopatch** rings; Mac OS via Jamf; CIS Level 1 baselines as code                                        | Patch compliance ≥ 95 % within 7 days; configuration drift ≤ 2 %                                   |
  | **Asset Lifecycle & Support**    | 4‑yr refresh, break‑fix via Service Desk; tickets by phone/email                | **3‑yr refresh** with buy‑back; ServiceNow portal, self‑service KB, AI chatbot; Smart Locker parts vending          | MTTR ↓ 30 %; 15 % capex saved via resale; 40 % tickets deflected by self‑help                      |
  | **Remote Access**                | Cisco AnyConnect VPN for all traffic                                            | **Zscaler Zero Trust Network Access (ZTNA)**; split‑tunnel for SaaS                                                 | Least‑privilege app access; 60 % bandwidth reduction on VPN concentrators                          |
  
  **Experience, Security & Cost Metrics**
  
  | Metric                                       | Baseline | Target                |
  |----------------------------------------------|----------|-----------------------|
  | Device Deployment Time                       | 90 min   | ≤ 10 min (zero‑touch) |
  | Patch Compliance (≤ 7 days)                  | 62 %     | ≥ 95 %                |
  | Mean Time to Resolve EUC Ticket              | 6 h      | ≤ 4 h                 |
  | Endpoint Ransomware Protection Score (MITRE) | 45 %     | ≥ 85 %                |
  | Total Cost per User / Year                   | \$2 150  | \$1 820 (‑15 %)       |
  
  <Prerequisites>  
  * **Autopilot / DEP Tenant Enrollment** and device‑serial pre‑registration.  
  * **Intune & Conditional‑Access Policies** approved by Security Ops.  
  * **Enterprise Agreement Upgrade** to Microsoft 365 E5 and Defender P2.  
  * **ServiceNow Digital Workplace Catalog** configured with EUC request items.  
  * **Asset Disposal Vendor Contract** for 3‑year buy‑back program.
  
  <Standards>  
  * **Hardware Tiers:** Tier 1 (developers/power users) vs. Tier 2 (standard staff) specs published in EUC catalog.  
  * **OS Baseline:** Windows 11 23H2 Enterprise; macOS 15.x; iOS 18; Android 15—all encrypted (BitLocker/FileVault).  
  * **MDM Compliance Rules:** Device health attestation, jailbreak/root detection, password complexity, screen‑lock ≤ 5 min.  
  * **Endpoint Configuration‑as‑Code:** Intune JSON policies, Jamf profiles, and Defender EDR settings stored in Git; PR approval required.  
  * **Refresh & Disposal Policy:** 3‑year laptop lifecycle; drives wiped to NIST SP 800‑88; certificates of destruction archived in CMDB.  
  * **Software License Governance:** Automated reclamation of idle M365 seats after 30 days inactivity.
  
  ### End‑User Compute Services
  
  #### Common Platforms
  
  <Purpose>  
  Define the **standard device and workspace platforms** offered to employees—laptops, desktops, tablets, smartphones, and virtual desktops—so that procurement, IT operations, and information‑security teams share an authoritative catalogue. By documenting both the **baseline (current state)** and **target (future state)** platforms, we ensure user productivity, security posture, and total cost of ownership (TCO) align with enterprise strategy.
  
  <Instructions>  
  1. **Identify Primary Device Classes** – Include physical laptops/desktops, mobile handsets/tablets, virtual desktop infrastructure (VDI) or desktop‑as‑a‑service (DaaS), and any thin‑client form factors.  
  2. **State Baseline vs. Target** – Summarise current hardware/OS mix and the desired standard platforms (models, OS versions, lifecycle).  
  3. **Highlight Management & Security Stack** – Note endpoint‑management tools (Intune, Jamf, Workspace ONE), zero‑touch provisioning (Autopilot/DEP), and embedded security controls (EDR, disk encryption).  
  4. **Map to User Segments** – Indicate which workforce personas consume each platform (e.g., knowledge worker, developer, field technician, contact‑centre agent).  
  5. **Reference Lifecycle & Support** – Provide refresh cadence, warranty coverage, and support channels.
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Device Class                 | **Baseline (Current State)**                   | **Target Standard**                                                                                                               | **User Personas**                          | **Management & Security**                                                                    |
  |------------------------------|------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|----------------------------------------------------------------------------------------------|
  | **Laptop**                   | Dell Latitude 5480 (2017), Windows 10 21H2 Pro | **Dell Latitude 5450** (Intel i7, 16 GB) **or** **MacBook Air M3** (16 GB) running **Windows 11 23H2 Enterprise** or **macOS 15** | Knowledge workers, execs, devs             | Windows: Intune + Autopilot, BitLocker, Defender EDR; Mac: Jamf Pro, FileVault, Defender EDR |
  | **Desktop / Workstation**    | Dell OptiPlex 7060, Windows 10                 | **HP Z2 G9** Workstation, Windows 11 23H2                                                                                         | CAD/graphics power users                   | Intune co‑management, Nvidia drivers via ConfigMgr                                           |
  | **Mobile (Corporate‑Owned)** | Mixed BYOD, ActiveSync only                    | **iPhone 15 (iOS 18)** or **Samsung S24 (Android 15)**; 128 GB                                                                    | Field sales, managers                      | Intune MDM, Conditional Access, per‑app VPN; full‑device encryption                          |
  | **Mobile (BYOD)**            | Allowed with basic email profile               | **BYOD Allowed** with Intune Mobile Application Management (MAM‑WD)                                                               | General staff                              | App‑level DLP, no device enrolment; Office 365 apps with app protection policies             |
  | **Virtual Desktop / DaaS**   | On‑prem Citrix 7.15, 200 VDIs                  | **Azure Virtual Desktop (AVD)** pooled host pools, FSLogix                                                                        | Contractors, offshore devs, contact‑centre | Azure AD‑joined, Intune policies, Defender for Endpoint onboarding                           |
  | **Thin Client / Kiosk**      | Wyse 3040 on Windows Embedded 7                | **IGEL UD3 LX 12** (Linux‑based)                                                                                                  | Shop‑floor terminals                       | IGEL UMS centralized config, read‑only OS                                                    |
  
  **Key Improvements & Rationale**
  
  * **Productivity** – Modern hardware (Intel 14th gen / Apple M3) and Windows 11/macOS 15 reduce boot times by 40 %.
  * **Security** – Unified EDR coverage (Defender P2) and mandatory disk encryption close audit gaps; BYOD sandboxing prevents corporate‑data leakage.
  * **Lifecycle & Cost** – Transition to three‑year refresh with vendor buy‑back saves 15 % capex; standardised models cut spare‑parts inventory by 25 %.
  * **Remote Work Enablement** – AVD provides elastic desktops globally; zero‑touch provisioning slashes device deployment from 90 min to 10 min.
  
  <Prerequisites>  
  * **Vendor Master Agreements** signed with Dell, Apple, HP, and IGEL including next‑business‑day on‑site warranty.  
  * **Microsoft 365 E5** licensing activated for Intune, AVD, and Defender for Endpoint.  
  * **Jamf Cloud Tenant** provisioned and integrated with Azure AD for Mac‑fleet SSO.  
  * **Intune Compliance & Conditional‑Access Policies** approved by Security Ops.  
  * **ServiceNow Asset & CMDB** updated with new model SKUs and lifecycle statuses.
  
  <Standards>  
  * **Hardware Naming Convention:** `[Model]-[CPU]-[Year]` (e.g., *LAT‑5450‑I7‑25*).  
  * **OS Baseline Versions:** Windows 11 23H2 Enterprise, macOS 15, iOS 18, Android 15—patched within 7 days of release.  
  * **MDM / MAM Policy IDs** stored in Git (`euc‑policies/` repo) and version‑controlled through pull requests.  
  * **Refresh Cadence:** Laptops/Tablets – 3 yrs; Desktops – 4 yrs; Thin Clients – 5 yrs; Mobile Phones – 30 months.  
  * **Disposal & Data Sanitisation:** Drives wiped to NIST SP 800‑88; certificates archived in CMDB; e‑waste recycled via ISO 14001 vendor.
  
  #### Provisioning & Deployment
  
  <Purpose>  
  Define **how workforce devices are sourced, imaged/enrolled, configured, and kept compliant**—from day‑one onboarding through ongoing application distribution—so that productivity, security, and support efforts are predictable and automated.
  
  <Instructions>  
  1. **Describe Acquisition Flows** – OEM direct‑ship vs. warehouse stock; zero‑touch vs. desk‑side imaging.  
  2. **Detail Enrollment / Imaging** – Autopilot, Apple DEP, Google Zero‑Touch, legacy PXE (if any).  
  3. **Outline Configuration Management** – Intune, Jamf, Workspace ONE, Configuration Manager, or scripting pipelines.  
  4. **Explain Application Deployment** – Self‑service portals, mandatory baseline apps, packaging standards (MSIX, PKG, APK).  
  5. **Address BYOD** – Approval, sandboxing (MAM‑WD), conditional access, and data‑separation controls.  
  6. **Highlight Automation & Self‑Service** – Service portal catalogues, ChatOps, and automated certificate issuance.
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Step                               | **Baseline (As‑Is)**                                            | **Target Process & Tooling**                                                                                            | **Benefit / Rationale**                                                   |
  |------------------------------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
  | **1. Sourcing**                    | Bulk orders delivered to IT warehouse; manual asset tag & image | **Drop‑ship direct from Dell / Apple** to employee’s address; serial pre‑registered in Autopilot / DEP                  | 4‑day reduction in device lead time; eliminates warehouse touch           |
  | **2. Enrollment / Imaging**        | MDT PXE imaging (90 min); GPO joins domain                      | **Windows Autopilot** or **Apple DEP** zero‑touch; Azure AD Join; device‑based cert pushed via Intune SCEP              | Setup time ↓ 90 min → 10 min; consistent build; remote‑work ready         |
  | **3. Configuration Baseline**      | GPO & login scripts; Mac manually configured                    | **Intune** (Windows/iOS/Android) & **Jamf Cloud** (macOS) deliver CIS Level 1 baseline and OEM firmware updates         | Policy‑as‑code; drift detection; firmware patched within 48 h             |
  | **4. Application Stack**           | SCCM push of Office 2016 MSI; ad‑hoc installs via Service Desk  | **Intune Win32 / MSIX** + **Company Portal** self‑service catalog; **winget pipelines** for dev tools; Jamf PKG for Mac | 40 % ticket deflection; version control; phased releases with kill‑switch |
  | **5. BYOD Onboarding**             | Exchange ActiveSync profile only                                | **MAM‑Without‑Device‑Enrollment**; app‑protection (DLP), PIN, conditional access                                        | Corporate data containerised; no personal device inventory burden         |
  | **6. Mobile Provisioning**         | Manual email profile; no MDM                                    | **Intune MDM** auto‑enrolled via Apple DEP / Knox Mobile Enrollment; per‑app VPN                                        | Remote wipe, lost‑device protections, zero‑touch for field ops            |
  | **7. Software Patching**           | WSUS + Mac patching ad‑hoc                                      | **Intune Autopatch** rings (Windows) & **Jamf patch** policies (Mac); 3 rings: Canary‑5 %, Pilot‑20 %, Prod‑75 %        | 95 % patch compliance ≤ 7 days; staged rollback capability                |
  | **8. Certificate & Wi‑Fi Profile** | Manual installation by Service Desk                             | Intune Wi‑Fi & SCEP certificates auto‑delivered at enrollment                                                           | Seamless network access; removes weak PSKs                                |
  | **9. De‑Provisoning**              | Manual wipe, asset return, ticket closure                       | **ServiceNow workflow** triggers remote wipe, Intune retire, CMDB update, and asset resale request                      | Ensures data sanitisation, audit trail, and capex recovery                |
  
  <Prerequisites>  
  * **OEM Direct‑Ship Contracts** with serial‑number feeds to Autopilot/DEP.  
  * **Intune Tenant Hardening** and RBAC roles defined.  
  * **Jamf Cloud & Azure AD Integration** enabled for macOS SSO.  
  * **ServiceNow Digital Workplace Catalog** configured with EUC request items.  
  * **Conditional‑Access Policies** approved (require compliant device, MFA).
  
  <Standards>  
  * **Zero‑Touch Enrollment:** 100 % of new Windows/macOS/iOS/Android endpoints by FY‑2026.  
  * **Baseline Policy Source‑of‑Truth:** Intune/Jamf JSON in Git; changes via pull request & peer review.  
  * **Application Packaging:** Windows – MSIX or Win32 (Intune); macOS – Signed PKG; Mobile – Private App Store.  
  * **Patch Cadence:** Critical ≤ 48 h; Security ≤ 7 days; Feature updates on semi‑annual channel.  
  * **BYOD Controls:** No device MDM; corporate data limited to protected apps; wipe corporate container on user off‑boarding.  
  * **Audit & Reporting:** Monthly compliance dashboard (patch, encryption, EDR status) published to CISO; exceptions remediated or risk‑accepted within 14 days.
  
  #### Device Management
  
  <Purpose>  
  Establish a **single, authoritative framework** for authenticating, configuring, securing, patching, and monitoring all workforce endpoints—laptops, desktops, mobile devices, and virtual desktops—through their full lifecycle. A clear baseline‑and‑target view of device‑management services ensures that every endpoint is compliant with security policy, consistently configured for user productivity, and efficiently supported at scale.
  
  <Instructions>  
  1. **Catalogue Core Management Services** – Directory & identity (AD/Azure AD), Unified Endpoint Management (Intune, Jamf, Workspace ONE), client configuration & patching (Autopatch, Jamf Patch, ConfigMgr), and security tooling (EDR, disk‑encryption enforcement).  
  2. **Show Baseline vs. Target** – Identify existing tooling, gaps (e.g., split Windows vs. Mac stacks), and the converged target state (single UEM plane, Zero‑Trust posture).  
  3. **Describe Policy Enforcement** – Password complexity, MFA, disk encryption, firewall, VPN, Wi‑Fi, compliance & conditional‑access rules.  
  4. **Map to Personas & Device Types** – Explain how policies differ (or don’t) for corporate vs. BYOD, knowledge worker vs. field tech, Windows vs. macOS vs. mobile.  
  5. **Highlight Automation & Reporting** – Zero‑touch enrolment, policy‑as‑code, compliance dashboards, alerting to SOC.  
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Domain                          | **Baseline (Current State)**                                    | **Target Device‑Management Service**                                                                         | **Policy Highlights & Benefits**                                                                        |
  |---------------------------------|-----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
  | **Identity & Directory**        | On‑prem AD (2012 R2); AD FS for cloud SSO                       | **Azure AD (Entra ID) P1** – password‑less MFA, Conditional Access, Hybrid Join                              | Unified cloud/hybrid auth, phishing‑resistant credentials (FIDO2), device compliance gates              |
  | **Unified Endpoint Management** | SCCM for Windows, Jamf On‑Prem for macOS, AirWatch for Mobile   | **Intune (Windows 11/iOS/Android) + Jamf Cloud (macOS)**; connected via Intune‑Jamf integration              | Single compliance score per device, cross‑platform policy reporting, zero‑touch DEP/Autopilot           |
  | **Patching & Update Rings**     | WSUS manual approval; Macs patched ad‑hoc                       | **Windows Autopatch** rings (Canary/Pilot/Prod); **Jamf Patch** Smart Groups; **Intune MDM** for iOS/Android | 95 % critical‑patch compliance within 7 days; automated rollback; staged rollouts minimise blast radius |
  | **Security / EDR**              | McAfee ENS (signature‑based)                                    | **Defender for Endpoint P2** (Windows/macOS/iOS/Android) integrated with Intune compliance                   | Real‑time telemetry to SOC; automated containment; device risk influences Conditional Access            |
  | **Encryption Enforcement**      | BitLocker via GPO; Macs user‑enabled FileVault; mobile optional | **Intune policy** requires BitLocker/FileVault; mobile encryption enforced; keys escrowed in Azure AD        | 100 % devices encrypted; key lifecycle managed; audit proofs for compliance                             |
  | **Configuration & Hardening**   | GPO for Windows; shell scripts for Mac; mobile unmanaged        | **Intune & Jamf Baselines** codified in Git (CIS Level 1/2); per‑platform compliance policies                | Policy‑as‑code, peer‑reviewed; drift auto‑remediation; detailed posture dashboards                      |
  | **VPN & ZTNA**                  | Cisco AnyConnect full‑tunnel                                    | **Zscaler ZTNA** with per‑app micro‑tunnels; Intune config profile deploys cert & app                        | 60 % drop in VPN bandwidth; least‑privilege access; seamless user experience                            |
  | **Wi‑Fi & Cert Mgmt**           | PSK SSID; manual certs                                          | Intune SCEP Wi‑Fi profile; WPA‑EAP‑TLS; auto‑rotate certs                                                    | Eliminates shared secrets; frictionless onboarding; revocation on off‑boarding                          |
  | **BYOD Governance**             | Exchange ActiveSync only                                        | **MAM‑Without‑Enrollment** (Intune); corporate data encrypted, no device control                             | Protects data, respects privacy; reduces device inventory overhead                                      |
  | **Reporting & Alerting**        | Excel exports; manual audit prep                                | **PowerBI & Defender dashboards**; Intune/AAD data lake; SOC alerts via Sentinel                             | Real‑time compliance view; automated evidence collection for audits                                     |
  
  **Key Outcomes & KPI Targets**
  
  | Metric                                | Baseline      | Target   |
  |---------------------------------------|---------------|----------|
  | Critical Patch Compliance (≤ 7 days)  | 62 %          | ≥ 95 %   |
  | Devices with Full‑Disk Encryption     | 71 %          | 100 %    |
  | Endpoint EDR Coverage                 | 45 %          | 100 %    |
  | Mean Time to Contain Endpoint Threat  | 2 h           | ≤ 15 min |
  | BYOD Corporate‑Data Leakage Incidents | 3 per quarter | 0        |
  
  <Prerequisites>  
  * **Azure AD Connect Cloud Sync** cut‑over completed; legacy AD FS decommission plan approved.  
  * **Intune Tenant Hardening** (RBAC, enrollment restrictions, compliance policies) signed off by CISO.  
  * **Jamf‑Intune Integration** enabled for unified compliance signal (macOS).  
  * **Defender for Endpoint Licensing** upgraded to Plan 2 (includes macOS/iOS/Android).  
  * **SOC Run‑Books** updated to cover new EDR and Intune alerts.
  
  <Standards>  
  * **Policy Source‑of‑Truth:** All Intune & Jamf JSON/PLIST profiles stored in Git (`endpoint‑config/`) and deployed via CI pipeline.  
  * **Compliance Rules:** Password‑less MFA, full‑disk encryption, EDR active, OS ≤ 1 release behind, patches ≤ 7 days.  
  * **Certificate Management:** SCEP/NDES integrated with Azure AD, cert rotation ≤ 365 days.  
  * **Audit Logging:** Intune, AAD, Defender logs streamed to Microsoft Sentinel with 13‑month retention.  
  * **Change Governance:** Endpoint policies changed via pull request; CAB approval for high‑impact items; automated regression tests in non‑prod tenant.  
  * **Lifecycle Policy:** Devices non‑compliant > 14 days trigger service desk escalation; non‑responsive > 30 days trigger remote wipe/retire.
  
  #### User Services
  
  <Purpose>  
  Describe the **digital‑workspace services**—productivity, collaboration, storage, identity, and connectivity—that employees consume on their endpoints. By capturing both the **baseline** and **target** offerings, we ensure user experience, security posture, and cost efficiency align with enterprise collaboration strategy and technology principles (cloud‑first, zero‑trust, automation‑by‑default).
  
  <Instructions>  
  1. **List Core User Services** – Office suite, email/calendar, collaboration (chat/meetings/voice), enterprise file sharing, identity & access, remote connectivity (VPN/ZTNA), and print/scan if relevant.  
  2. **Show Baseline vs. Target** – Identify current tools and planned cloud/SaaS migrations or consolidations.  
  3. **Highlight Access Paths** – Direct internet, VPN, ZTNA, or split‑tunnel; include network access controls (NAC, Wi‑Fi auth).  
  4. **Map to End‑Point Types** – Note differences for corporate vs. BYOD, mobile vs. desktop, on‑site vs. remote.  
  5. **Reference SLAs & Governance** – Availability, RPO/RTO, data‑retention, and security/compliance controls.
  
  <Example> – **Customer Experience Platform (CEP)**
  
  | Service Domain                  | **Baseline (Current State)**          | **Target Service / Platform**                                 | **Access Path & Controls**                                   | **Key Benefits & Rationale**                                      |
  |---------------------------------|---------------------------------------|---------------------------------------------------------------|--------------------------------------------------------------|-------------------------------------------------------------------|
  | **Office Productivity**         | Office 2016 ProPlus (on‑prem KMS)     | **Microsoft 365 Apps for Enterprise** (semi‑annual channel)   | Direct internet via split‑tunnel; Intune app config          | Cloud co‑authoring, evergreen updates, 35 % fewer support tickets |
  | **Email & Calendar**            | Exchange 2016 on‑prem                 | **Exchange Online** (E5)                                      | Direct internet (M365 optimized); MFA & Conditional Access   | 99.9 % SLA, 100 GB mailbox, zero server maintenance               |
  | **Chat, Meetings & Voice**      | Skype for Business on‑prem; Cisco PBX | **Microsoft Teams Phone** with Operator Connect               | Direct internet; Intune‑managed Teams client; QoS via SD‑WAN | Unified comms; retire PBX; 25 % telco cost reduction              |
  | **Enterprise File Sharing**     | Windows DFS shares on SAN             | **OneDrive for Business** (1 TB/user) + **SharePoint Online** | Direct internet; Files‑On‑Demand; sensitivity labels         | Anywhere access, versioning, DLP, 40 % less NAS capacity          |
  | **Collaboration & Low‑Code**    | SharePoint 2013, Access DB apps       | **Power Platform (Power Apps, Automate, BI)**                 | Browser/mobile; Azure AD auth; data‑loss policies            | Citizen dev, automate manual tasks, governed environment          |
  | **Identity & SSO**              | AD FS; disparate SaaS logins          | **Azure AD (Entra ID)** with SAML/OIDC SSO catalogue          | Conditional Access, MFA, password‑less (FIDO2)               | One identity plane, reduced phishing risk                         |
  | **Remote Connectivity**         | Full‑tunnel Cisco AnyConnect VPN      | **Zscaler ZTNA + Split‑Tunnel VPN (fallback)**                | Per‑app micro‑tunnels; device compliance check               | 60 % bandwidth saving, least‑privilege access                     |
  | **Wi‑Fi / NAC**                 | WPA2‑PSK guest & corp SSIDs           | **802.1X EAP‑TLS** via Intune SCEP; guest captive portal      | Cert‑based auth; VLAN assignment by role                     | Removes shared secrets; dynamic segmentation                      |
  | **Print & Scan**                | Local print servers, unmanaged queues | **Universal Print (Azure)** + Follow‑Me printing badges       | Direct IPP‑over‑HTTPS; Intune deployed printers              | Serverless, secure release, 15 % paper waste reduction            |
  | **Enterprise Password Manager** | None; browser‑saved passwords         | **1Password Business** with Azure AD SSO                      | Intune‑pushed extension; enforced MFA                        | Reduces credential reuse, audit trail for shared vaults           |
  
  **Experience, Security & Compliance Targets**
  
  | Metric                            | Baseline             | Target                                 |
  |-----------------------------------|----------------------|----------------------------------------|
  | Availability (core collaboration) | 99.5 %               | ≥ 99.9 % (M365 SLA)                    |
  | Email Phishing Click‑Through Rate | 12 %                 | ≤ 4 % (MFA + Safe Links)               |
  | Remote Meeting Join Success       | 88 %                 | ≥ 98 %                                 |
  | File Recovery Point Objective     | 24 h (NAS snapshots) | 30 min (M365 versioning + recycle bin) |
  | Telco/Collaboration OPEX          | \$1.8 M / yr         | ≤ \$1.35 M / yr (‑25 %)                |
  
  <Prerequisites>  
  * **Microsoft 365 E5 Licensing** & tenant hardening (Secure Score ≥ 75 %).  
  * **Mail Flow Cut‑Over Plan** with staged hybrid coexistence.  
  * **SD‑WAN QoS Policies** updated for Teams real‑time media.  
  * **Data‑Classification Labels** published for OneDrive/SharePoint sensitivity.  
  * **Zero‑Trust Network Access Policies** approved by NetSec & CISO.
  
  <Standards>  
  * **Naming & Tagging:** Teams sites `TEAM‑<Dept>`, SharePoint sites `SP‑<BU>`, OneDrive `OD‑<UPN>`.  
  * **Conditional‑Access Baseline:** MFA + compliant device for all cloud apps; high‑risk sign‑ins blocked.  
  * **Data‑Retention:** Email – 7 yrs; Teams chat – 3 yrs; OneDrive – 90‑day retention post‑termination.  
  * **Acceptable‑Use Policy Enforcement:** Intune App Protection (WIP) for BYOD; block copy/paste out of corp context.  
  * **Service Catalogue & SLA Reporting:** Monthly M365 service‑health review; incident metrics fed to ITSM.  
  * **Change Governance:** M365 feature releases monitored via Message Center; adoption communications scheduled; opt‑out process for critical periods.
  
  ### Operational Endpoint Device Services
  
  > **Guidance:** Describe the technology environment for operational endpoint devices – e.g. smart grid and field equipment. Include the hardware/software platforms, networks, and any edge computing infrastructure that support these devices.
  
  #### Device Types
  
  Define the classes of *operational technology (OT) endpoint devices* used in the utility. Examples include smart meters, IoT sensors (distributed grid sensors, environmental monitors), SCADA/industrial controllers (RTUs, PLCs), intelligent electronic devices (IEDs) in substations, and edge computing gateways. These are part of the OT systems that **monitor or control physical devices, processes, and events** in the power infrastructure. Mention the typical operating environment of these devices (embedded real-time OS, firmware-based devices, or specialized industrial computers).
  
  #### Connectivity & Network
  
  Outline the communication networks and protocols that link operational devices. For instance, smart meters might connect via a RF mesh or power-line network to data concentrators, then to the head-end; field sensors or reclosers may use wireless (LTE/5G, radio) or wired links to communicate. List relevant protocols and standards (e.g. DNP3 or IEC 60870-5-104 for SCADA, MQTT for IoT telemetry, Zigbee for HAN devices, cellular LTE for remote sites). Describe the field network infrastructure (Field Area Network – FAN, substation networks, edge IoT gateways) that forms the platform for these endpoints. Ensure to include any edge computing layer – e.g. gateway devices or edge servers at substations that aggregate data, perform local processing, and interface with cloud or data center systems.
  
  #### Management & Integration
  
  Explain how operational endpoints are managed and integrated with enterprise systems. Identify the groups or tools responsible for managing OT devices (which may be separate from IT’s device management). For example, SCADA systems or IoT platform software might centrally manage configurations and data from field devices. Note any remote management capabilities (e.g. the ability to update firmware or configurations remotely) and constraints (many OT devices have limited remote management to ensure stability). Also mention how OT data flows into IT systems – for instance, through an integration platform or IoT hub that collects telemetry from field devices for analytics.
  
  #### Platform Services for OT
  
  Highlight any platform services specific to operational endpoints. This could include edge data processing applications, time-series data stores for sensor data, or cloud services used for IoT device management. Additionally, note any **converged IT/OT platform** considerations – for example, if the utility uses common identity or network services across IT and OT, or if they are intentionally segregated. Emphasize reliability and real-time requirements for these platforms, as many operational devices support critical grid functions (e.g. power distribution automation) where low latency and high availability are paramount.
  
  ### Other Platform Components
  
  *(Placeholder – include any additional foundational services such as messaging backbones, identity directory services, or container registries if they underlie the technical solution. For each platform service, ensure to list the technology and any relevant configurations.)*
  
  ## Asset Management
  
  *(The Asset Management section should be updated with the utility’s specific processes and tools. Ensuring a unified view or at least an aligned process for IT and OT asset tracking is often a goal to support enterprise risk management.)*
  
  **Guidance:** *Define how all technology assets – including both user devices and field/operational devices – are classified, tracked in inventory, and managed through their lifecycles. Incorporate ownership and responsibility for these assets.*
  
  Effective **Asset Management** ensures that both end-user and operational devices are accounted for, properly owned, and lifecycle-managed. This section should cover how the organization categorizes devices, maintains inventories (with relevant attributes), and handles asset lifecycle stages from procurement to retirement. A complete and accurate asset inventory is critical for managing risk, enabling activities like security assessments and patch management. The subsections below distinguish between end-user IT assets and field/OT assets, as their management processes may differ.
  
  ### Compute Services Asset Management
  
  #### Asset Inventory and Tracking
  
  Detail systems for tracking compute assets (servers, virtual machines, containers, cloud instances). Explain tagging strategies, CMDB integration, and lifecycle management practices.
  
  #### Lifecycle and Refresh Planning
  
  Document strategies for regular hardware/software refresh cycles, end-of-life asset replacement, firmware/software updates, patch management schedules.
  
  #### Spare Compute Capacity
  
  Describe policies regarding spare compute resources (physical servers, cloud compute reservations, standby virtual resources). Clarify how quickly spare resources can be provisioned during disruptions.
  
  #### Asset Disposal and Secure Decommissioning
  
  Outline secure procedures for decommissioning compute hardware or virtual resources, ensuring data sanitization and compliance with security/regulatory requirements.
  
  ### Storage Services Asset Management
  
  #### Asset Tracking and Inventory
  
  Explain methods for managing storage hardware/software assets (SAN, NAS, cloud storage). Describe how assets are recorded, classified, and tracked in asset management systems.
  
  #### Capacity Planning and Expansion
  
  Detail proactive strategies to forecast storage growth and manage capacity expansions. Include processes for regular capacity reviews and storage efficiency measures.
  
  #### Spare Storage Equipment
  
  Identify spare storage equipment kept on-hand (replacement drives, expansion shelves, cloud storage pools) to rapidly address failures. Specify deployment timeframes for critical storage replacements.
  
  #### Data Retention and Archiving Policies
  
  Outline policies for data retention, archiving, and deletion aligned with regulatory/compliance requirements, ensuring storage resources are effectively managed.
  
  ### Network Services Asset Management
  
  #### Network Asset Inventory and Documentation
  
  Explain approaches for documenting network assets (switches, routers, firewalls, load balancers, access points). Include details on management platforms and configuration tracking.
  
  #### Lifecycle and Upgrade Planning
  
  Detail processes for regular refreshes, firmware updates, and lifecycle management of network hardware. Include criteria for end-of-life replacement and software-defined network evolution.
  
  #### Spare Networking Equipment
  
  Describe spare network asset policies (switches, routers, transceivers, antennas). Outline procedures and timelines for deploying spares in response to outages.
  
  #### Configuration and Change Management
  
  Document practices for configuration backup, standardization, version control, and secure storage of network device configurations to facilitate rapid restoration or deployment.
  
  ### End-User Device Asset Management
  
  #### Device Classification & Ownership
  
  Describe how end-user devices are classified (e.g. by type, function, or sensitivity). For instance, laptops/desktops might be “Corporate-owned IT assets”, while personally-owned BYOD devices (if allowed) are a separate category with limited access. Clearly state ownership and accountability – typically, corporate IT owns and manages company-issued devices, while employees may own BYOD devices (with IT having oversight via policy and MDM). Classification can also consider sensitivity (devices handling confidential data vs. general use) to apply appropriate controls.
  
  #### Inventory Tracking
  
  Explain the systems and procedures to inventory all end-user computing devices. The inventory should maintain **unique identifiers** for each device and key details such as make/model, serial number, assigned user or location, operating system, and installed software. For example, the utility might use an IT Asset Management (ITAM) system or CMDB where each laptop and mobile device is recorded. Inventory data should be kept up-to-date when devices are issued, moved, or decommissioned. Regular audits (automated discovery via endpoint management tools or physical checks) help ensure no device is unaccounted for.
  
  #### Lifecycle Management
  
  Detail how user devices are managed through their life cycle: procurement, deployment, maintenance, and retirement. This includes refresh policies (e.g. laptops replaced every \~4-5 years or as needed), as well as processes for repairing or replacing broken devices. Address how devices are retired — for example, wiping data and **securely disposing** of or recycling old equipment. Ensure there are defined owners for each step (IT procurement for sourcing, IT support for deployment and fixes, etc.). **Tracking changes** (like hardware upgrades, or OS re-images) in the asset records is important so inventory remains accurate.
  
  #### Software/Firmware Management
  
  (Tie-in with Security but also asset perspective.) Note that managing the asset includes tracking what software and firmware versions are on each device. For user devices, this means keeping an inventory of OS versions and critical software versions. If the utility uses automated tools, they likely update the inventory when a device is patched or re-imaged. This ensures awareness of vulnerable or outdated systems as part of asset status. Link this with the security patch management process described later.
  
  ### Operational Device Asset Management
  
  #### Device Classification & Ownership
  
  Describe how field and operational devices are categorized. For example, categories might include smart meters, substation controllers, line sensors, generation plant control systems, etc. It may be useful to classify by criticality (e.g. “critical OT assets” that have significant impact on grid operations vs. ancillary sensors). Specify ownership of these assets – typically, the operations or engineering departments “own” the operational equipment, though IT or a dedicated OT team may co-manage certain aspects (like networking gear or security). Note any regulatory ownership aspects (for instance, metering devices might fall under a specific department and regulation).
  
  #### Inventory Tracking
  
  Explain the approach to inventorying OT/field devices. Inventory for OT should capture hardware details (device type, model, vendor, serial number, physical location like substation or feeder ID) and firmware/software versions on each device. Maintaining this inventory is challenging but essential for risk management and maintenance. Document what tools or processes are used – e.g. periodic field audits, automated network discovery tools, or asset management modules within SCADA or GIS (Geographic Information System) for mapping field devices. If automated discovery is used, caution that active network scanning in OT environments must be carefully tested to avoid disrupting sensitive devices. In many cases, a combination of passive monitoring and manual updates is employed to keep the OT asset inventory current.
  
  #### Lifecycle Management
  
  Outline how the organization manages the lifecycle of operational devices. These devices often have long service lives (e.g. smart meters might be deployed for 10-15+ years; substation RTUs even longer) and require planning for maintenance and eventual replacement. Describe processes like: commissioning new devices (factory acceptance testing, configuration, then installation), maintenance (including periodic calibration or component replacement), and decommissioning (ensuring devices are securely wiped if they have memory, and disposed or recycled properly). Lifecycle tracking should include monitoring for **obsolescence** – e.g. if a device’s vendor support or firmware updates cease, triggering a plan to upgrade that asset. It’s also useful to keep **vendor information** (contacts, warranty, support status) linked to each asset in the inventory, so that recall notices or firmware updates can be managed proactively.
  
  #### Asset Ownership & Roles
  
  Identify roles responsible for OT asset management. For instance, an Asset Manager in the operations team may be tasked with updating the inventory when field devices are installed or removed. The cybersecurity team may also need insight into the asset inventory to perform risk assessments. NIST guidance suggests defining clear **roles and responsibilities** for asset ownership, operations, maintenance, and cybersecurity for OT assets. This ensures accountability (e.g. who authorizes changes to a device configuration, who responds if a device is found missing). Coordination between IT and OT teams is crucial if there’s overlap (for example, network equipment in substations might be managed by IT, but the devices they connect are OT domain).
  
  ## Resilience and Recovery
  
  *(The Resilience and Recovery section should be customized with the utility’s specific DR plans and technologies. The placeholders above ensure that both field operations continuity and enterprise IT continuity are considered, especially highlighting the often-overlooked area of endpoint devices. Engineering teams should fill in details such as RTOs, backup technologies, and roles/responsibilities in recovery scenarios.)*
  
  **Guidance:** *Detail how the architecture ensures continuity of operations and rapid recovery from failures or disasters, covering both field device resilience (operational technology) and end-user device recovery. Integrate endpoint-specific strategies: redundancy, failover, backup, and restore capabilities.*
  
  Resilience and Recovery focuses on maintaining essential functions during adverse events and restoring normal operations afterward. In an electric utility context, this includes ensuring that critical field devices (which support power delivery and safety) have failover or backup plans, and that enterprise IT services (including user devices) can be quickly recovered in event of loss. This section should cover both **architecture mechanisms** (redundancy, backups, alternate systems) and **processes** (disaster recovery plans, failover procedures, restoration workflows). The following subsections separate considerations for operational field infrastructure and end-user computing, though there may be overlaps.
  
  ### Compute Services Resilience
  
  #### Failover and Redundancy
  
  Detail strategies to maintain compute availability, such as clustering, N+1 or active/passive configurations, virtualization failover, and automatic workload redistribution (e.g., VMware HA, Kubernetes clusters, cloud auto-scaling).
  
  #### Backup and Rapid Restore
  
  Describe backup processes (e.g., snapshotting, VM-level backups, configuration state backups, container registries). Include recovery procedures for rapid redeployment of workloads on alternate compute resources.
  
  #### Disaster Recovery Strategy
  
  Outline how compute infrastructure supports larger-scale disaster recovery (e.g., geographically dispersed failover data centers, cloud regions). Specify how critical workloads transition to DR environments with documented RTOs/RPOs.
  
  #### Testing and Drills
  
  Explain regular testing procedures (failover drills, compute workload migration tests) to validate resilience strategies. Record key assumptions and documented test outcomes.
  
  ### Storage Services Resilience
  
  #### Data Redundancy and Replication
  
  Identify how data redundancy is maintained (RAID, erasure coding, synchronous/asynchronous replication, distributed storage solutions). Document configuration of replication across data centers/cloud regions.
  
  #### Backup and Recovery
  
  Detail storage-level backup methods, including incremental, snapshot, and archival strategies. Outline rapid restoration methods from backup media or cloud storage.
  
  #### Disaster Recovery Planning
  
  Document how storage infrastructure supports DR plans (e.g., off-site backups, cold/warm/hot DR storage facilities, cloud storage failover options), including RTOs/RPOs for critical data.
  
  #### Integrity and Validation
  
  Outline practices for validating storage integrity (regular health checks, checksums, automated recovery from corrupted states). Include periodic disaster recovery tests for storage restoration processes.
  
  ### Network Services Resilience
  
  #### Failover and Redundant Connectivity
  
  Describe redundancy in network infrastructure (multiple ISPs, diverse fiber paths, dual-homed WAN/LAN connections, dynamic routing protocols like BGP or OSPF).
  
  #### Network Segmentation and Isolation
  
  Explain use of VLANs, SD-WAN, or software-defined networking to isolate failures and minimize impact of network disruptions. Document rapid traffic rerouting and isolation of problematic network segments.
  
  #### Disaster Recovery and Alternate Connectivity
  
  Outline strategies to maintain connectivity in regional disasters (use of satellite links, LTE backup connections, out-of-band management via dedicated cellular networks).
  
  #### Regular Testing and Validation
  
  Describe testing and validation procedures, including simulated failover tests, periodic connectivity and redundancy drills, and regular assessments against defined RTOs/RPOs.
  
  ### Field Device and Edge Services
  
  #### Failover and Redundancy
  
  Describe how the architecture mitigates failures of critical field devices or communications. For example, in substation or distribution automation systems, important controllers (like protection relays or SCADA RTUs) might be deployed in redundant pairs – if one fails, the secondary takes over to continue operations seamlessly. Identify any such redundancy strategies (N+1 configurations, clustered control systems, dual communications links, etc.). Also mention network failover: e.g., if a primary communications network for field devices (such as fiber or radio) goes down, is there a backup path (cellular LTE or satellite link) for critical signals? For smart meters in a mesh network, the mesh itself provides some resilience (neighboring meters route around a failed meter); outline these capabilities to show the system can tolerate individual endpoint outages. In general, **design for no single point of failure** where feasible in the OT architecture.
  
  #### Edge Computing Recovery
  
  If the utility employs edge computing nodes (like data concentrators, substation gateways, or microgrid controllers), specify how those are made resilient. This could include local redundancy (multiple edge devices sharing load), as well as the ability for cloud or central systems to temporarily take over if an edge node fails. For instance, an IoT edge gateway might queue data locally (store-and-forward) – if it goes offline, data is buffered and sent when back up, or a secondary gateway picks up the devices. Document any **state synchronization or backup** for edge devices: do they regularly send config/state to a central repository so a replacement device can be loaded with the last known configuration quickly? Some modern OT platforms integrate with cloud services to backup configurations and enable rapid redeployment of edge functionality on new hardware. Additionally, mention the use of **automated failover**: e.g., if a substation control system detects a primary device failure, it switches to backup automatically.
  
  #### Spare Asset Strategy
  A practical aspect of resilience is having spares for critical endpoint devices. Note if the organization maintains an inventory of spare units (e.g. spare smart meters, extra gateway devices, or backup communication equipment) and how quickly they can be deployed. The recovery time objectives (RTOs) for various devices should inform how many spares and of what type are kept. For example, if a critical line sensor fails and must be replaced within 4 hours to restore grid visibility, a spare should be on hand nearby. NIST guidance suggests that for many smaller-scale interruptions, **keeping critical spares** is an effective way to meet recovery objectives. Document procedures to swap in spares (including how configurations are loaded onto the new device from backup). Also, if certain equipment is hard-to-obtain (long procurement lead times), highlight any strategies like long-term contracts or stockpiling to mitigate that risk.
  
  #### Disaster Recovery for OT Systems
  
  In addition to device-level resilience, cover how larger-scale disasters are handled for OT. For instance, if an entire substation is lost (due to wildfire or earthquake, as could happen in California), what is the recovery plan? This might involve system-wide actions like load rerouting, using mobile substations, etc., which is beyond pure IT scope but should be referenced. From an IT/OT architecture perspective, ensure that **critical configurations and data** for field systems are backed up off-site. This means SCADA databases, meter data, etc., have off-site replicas or cloud backups. If using cloud services for some OT data, describe how those enable rapid recovery (for example, meter data collection might fail over to a cloud-hosted head-end if the on-prem system is down). Emphasize **proactive planning and layered recovery strategies** – e.g., having both local and cloud backups, alternate communication paths, and manual fallback procedures as a last resort (like technicians reading meters manually if automated systems fail). The architecture should support flexibility so that the **minimum level of grid operation** can continue during disasters (identify what those minimum functions are, such as protective relays still functioning independently even if central SCADA is offline). Also mention out-of-band management capabilities: for instance, remote terminal units might have out-of-band connections (cellular or satellite) so admins can access devices even if primary networks fail. Out-of-band access can greatly speed up recovery by allowing remote diagnostics or reconfiguration without waiting for a site visit.
  
  #### Testing and Drills
  
  Include a note on how resilience is validated – for example, regular failover testing of redundant systems, disaster recovery drills that include field device scenarios, etc. Engineering teams should be guided to record any assumptions (e.g. relying on battery backup at field sites for X hours) and ensure those are tested. The architecture document can provide placeholders for listing the **RTO/RPO (Recovery Time and Point Objectives)** for key systems and how the design meets them. For edge and field systems, often **near-zero downtime** is desired for critical control functions, which might require innovative solutions (like rapid image-based restore of devices, or hot-standby units as mentioned). All these measures contribute to an OT environment that can quickly **recover from service disruptions** and maintain safety and reliability.
  
  ### End-User Device Services
  
  #### User Device Backup
  
  Outline the strategy for protecting data on end-user devices and restoring it in case of device failure or loss. At a baseline, every important user device (especially laptops which may store local data) should have an automated backup solution. Describe the chosen solution – it could be cloud-based endpoint backup software, regular sync to network drives, or reliance on cloud file storage for user documents. The best practice is to make backups **automatic and transparent** to the user, so include how often backups occur and to where. For example: “User MyDocuments and Desktop folders are redirected to OneDrive cloud storage, ensuring continuous backup; in addition, laptops are configured to perform full system backups to a cloud backup service weekly.” Emphasize using the cloud or off-site storage for backups, since cloud backups **minimize loss from physical disasters** like fire, flood, or theft that could destroy on-premise equipment. If both local and cloud backups are used (belt-and-suspenders approach), note that as well. Don’t forget mobile devices: if employees use tablets/phones for work data, ensure either cloud sync or mobile backup solutions are addressed (many MDM solutions include backup features or at least protection for corporate app data).
  
  #### User Device Recovery
  
  Describe the process for restoring a user’s productivity after a device failure, leveraging the backups above. This often includes having standard **images or device provisioning processes** so that a replacement device can be quickly prepared. For example, if a laptop dies, IT can grab a spare from inventory and use an automated provisioning service (like Autopilot or an image from SCCM/Intune) to configure it with the user’s apps and policies within hours. Then user data is restored from backup/cloud. If the organization has a virtual desktop infrastructure, mention that as a recovery option too (a user could use a virtual desktop from another machine while waiting for a replacement laptop). The template should prompt teams to include expected restoration times: e.g. “In the event of a laptop loss, a new device can be provisioned and user data restored within 4 hours,” assuming certain conditions. Also mention any **continuity tools**: for instance, if a widespread event affects many user devices (like ransomware or a natural disaster at HQ), the ability for staff to work from personal devices or a DR site using cloud apps might be the contingency – document those plans.
  
  #### Policies and Training
  
  Ensure reference to any policies that support resilience of user devices. For instance, a policy that all critical files must be saved on approved cloud storage (not just locally) so that they are backed up. And training users that if they suspect a device issue (or if they lose a device) to report immediately so IT can initiate recovery steps. Some organizations also formalize **device replacement procedures** (like having a pool of ready-to-go laptops). If relevant, include that the utility has support agreements or stock to replace X% of devices quickly.
  
  #### Resilience for User Services
  
  Beyond the device itself, consider the resilience of IT services accessed by endpoints. While this might be detailed in other architecture areas, it’s worth noting here: e.g., if email or critical applications are down, having endpoints isn’t useful – so outline that key end-user services are highly available (perhaps cloud-based or on redundant servers). This ties into IT disaster recovery plans where endpoints are one piece of the puzzle.
  
  #### Testing and Improvement
  
  Mention if the organization tests user device recovery (like periodic fire drills where backups are restored to test integrity). Also any metrics – e.g. track how long it takes to rebuild a laptop – to improve the process. User device backup/restore may seem routine, but in a utility during a major incident (like a cyberattack), having a well-oiled process to reimage machines can significantly reduce downtime.
  
  ## Infrastructure Topology and Deployment View
  
  *(Guidance: Provide an overview of **how the solution is deployed** across infrastructure. Include diagrams or descriptions showing environments, locations, and the arrangement of components. For example, you might present an **environment topology** diagram showing dev/test/prod, a **network architecture** diagram, and a **deployment diagram** illustrating how software components run on the infrastructure. Use this section to convey the physical or logical layout of the technology.)*
  
  ### Topology Diagram
  
  *(Placeholder – attach or describe a high-level network/infrastructure topology diagram. This should illustrate data centers or cloud regions, network zones (e.g., DMZ, internal network), and how servers or services are positioned within them. Show connectivity between major components and any external systems.)*
  
  ### Deployment Architecture
  
  *(Placeholder – describe how solution components (applications, databases, etc.) are deployed on the infrastructure. For example, “Web servers in cluster A (AWS autoscaling group in Region X), Application servers on Kubernetes cluster Y, Database on a managed cloud DB service,” etc. Include details of any geographic distribution or redundancy in deployment.)*
  
  ### Environments
  
   *(Placeholder – note the different environments (Development, QA, Staging, Production, etc.) and how the deployment differs across them. You might list the number of instances, any configuration differences, or separate topology diagrams if needed.)*
  
  ### Network and Endpoint Layouts
  
  > *SCADA zones, corporate IT, field area networks (FAN), DMZs.*
  
  ## Integration and Middleware
  
  *(Ensure the integration design supports **seamless connectivity** between components. For instance, use of standard APIs and middleware can facilitate smooth connections between the utility’s systems and external services.)*
  
  *(Guidance: Describe the **integration architecture** for the solution, including any middleware platforms. Identify how different systems or components communicate and what integration services or patterns are used. This section should cover APIs, message queues, ESBs, ETL processes, or other middleware technologies facilitating system integration.)*
  
  ### Integration Approach
  
  *(Placeholder – explain how the solution’s components integrate with each other and with external systems. For example, note if the architecture is API-centric, event-driven, uses a service bus, etc. Mention any data flow patterns like synchronous REST/HTTP calls, asynchronous messaging, file transfers, etc.)*
  
  ### Middleware and Integration Services
  
  *(Placeholder – list any middleware platforms or services in use. For example, API Gateway or API management platform, Enterprise Service Bus (ESB), message brokers (Kafka, MQ), integration Platform as a Service (iPaaS), or others. Include the role of each (e.g., “API Gateway for exposing REST services to partners” or “Message broker for decoupled event processing”). If the solution connects to a service bus or uses middleware for data transformation, document it here.)*
  
  ### Interfaces and Data Flows
  
  *(Placeholder – enumerate key interfaces/integrations. For each major external system or internal subsystem integration, specify what data is exchanged and via what mechanism. E.g., “Customer Information System – integrated via SOAP API over ESB,” or “Meter Data Management – events consumed via Kafka topic.” Include any batch integrations or scheduled jobs if relevant.)*
  
  ## Technology Standards and Product Mapping
  
  *(By mapping components to products and standards, you ensure alignment with enterprise guidelines. Adopt **industry standards** and best practices to guarantee interoperability. For example, using standard protocols (HTTP/HTTPS, MQTT, etc.) and data formats (JSON, XML) promotes consistency. Leverage the enterprise Technology Standards Catalog to reference approved technologies.)*
  
  *(Guidance: Define the **technology standards** adopted and map each major architecture component to specific products or technologies. This section ensures consistency with enterprise standards and makes explicit which technology product or service is used for each architecture element. Include versions where important. The template should list each technology domain and the chosen implementation (product or standard) for that domain.)*
  
  ### Computing and OS Standards
  
  *(Placeholder – e.g., Server OS Standard: **Red Hat Enterprise Linux 8**, Virtualization Standard: **VMware vSphere 7**, Containerization: **Docker & Kubernetes**. Describe the standard compute environment and any approved configurations.)*
  
  ### End User Computing Standards
  
  ### Application and Software Standards
  
  *(Placeholder – e.g., Programming language frameworks (Java/Spring Boot for services, Angular for web UI), cloud services (AWS Lambda, Azure Functions standards), and other relevant software technology standards used. Include security standards like **OAuth2** for auth, if relevant.)*
  
  ### Middleware and Integration Products
  
  *(Placeholder – e.g., **MuleSoft Anypoint** as ESB, **Apache Kafka** for event streaming, **IBM MQ** for messaging, **Apigee** for API management. List standards for integration patterns (REST/JSON for services, IEC CIM for utility data, etc.) where applicable.)*
  
  ### Storage and Database Standards
  
  (Placeholder – e.g., Relational Database: **Oracle 19c** (ANSI SQL Standard) or **PostgreSQL 15**, NoSQL: **MongoDB 6** for document store, File Storage: **NetApp NAS**. Note any data format standards like using **XML/JSON** for data interchange.)*
  
  ### Networking Standards 
  
  *(Placeholder – e.g., Network equipment vendor standards (Cisco switches/routers), Protocol standards such as **HTTP/HTTPS, TLS 1.3** for communications, **IPv6** readiness, VPN standards for remote access, etc. List the products and versions for major network components like firewalls, load balancers.)*
  
  ### Security Standards
  
  | Domain             | Standard Product/Technology     | Version | Notes                 |
  |--------------------|---------------------------------|---------|-----------------------|
  | End-User Device OS | Windows 11, macOS, iOS, Android | -       | Managed via MDM/UEM   |
  | IoT Protocols      | MQTT, Zigbee, DNP3, LTE Cat-M   | -       | Used in AMI/FAN/SCADA |
  
  ## Technology Roadmap and Lifecycle States
  
  *(Overall, the roadmap and lifecycle section ensures stakeholders understand **when** changes will happen and the **status** of each technology (new, mature, or end-of-life) in the enterprise. It connects the architecture to a timeline and portfolio management view.)*
  
  *(Guidance: Provide a **roadmap** for implementing or evolving this technology architecture, and indicate the **lifecycle stage** of key technologies. This section merges timeline considerations with the status (e.g., emerging, mainstream, or retiring) of each technology component.)*
  
  ### Roadmap Timeline
  
  *(Placeholder – outline the phases or milestones to move from the current state to the target state. Use a bulleted or numbered list of steps with rough timeframes. For example:)*
  
    1. *Phase 1 (Q1 2025): Deploy foundational cloud infrastructure and migrate core applications.*
    2. *Phase 2 (Q2 2025): Implement new integration middleware and refactor interfaces.*
    3. *Phase 3 (Q3 2025): Migrate legacy databases to new platform and decommission old systems.*
    4. *Phase 4 (Q4 2025): Finalize security enhancements and conduct performance tuning.*
  
    *(Each phase should briefly describe the key technology changes and their timing. Align these steps with business planning, and ensure they address the gaps identified between baseline and target.)*
  
  ### Technology Lifecycle Status
  
  *(Placeholder – for each major technology or platform in this architecture, indicate its lifecycle state within the organization. For example, note if a technology is **“Strategic (Growing)”**, **“Tactical (Current)”**, **“Contain (Limited use)”**, or **“Retiring”**. Alternatively, use classifications like **Emerging**, **Current**, **Obsolescent**. Provide a table or list, e.g.:)*
  
    | Technology Component            | Lifecycle State    | Notes                                                         |
    |---------------------------------|--------------------|---------------------------------------------------------------|
    | Mainframe Batch System          | Retiring           | To be decommissioned by 2026 (replaced by cloud solution).    |
    | Customer Info Database (Oracle) | Current (Standard) | Standard platform, will upgrade to latest version in Phase 3. |
    | Cloud Analytics Platform        | Emerging/Adopt     | New introduction, pilot in progress (strategic direction).    |
    | Mobile Workforce App            | Current (Growing)  | In wide use; plan to expand features next year.               |
  
    *(This helps in planning by showing which technologies are moving forward and which are being phased out. A **Lifecycle Model** can identify required lifecycle attributes for the infrastructure portfolio, ensuring longevity and support considerations are documented.)*
  
  ### Future Evolution
  
  *(Placeholder – briefly mention any known future technology trends or upgrades beyond the current target state. For example, “Plan to incorporate IoT sensor networks in 2026” or “Evaluate quantum-safe encryption by 2027”. This provides forward-looking context to the roadmap.)*
  
  ## Infrastructure Resilience and Performance
  
  *(Guidance: Specify the **non-functional requirements** related to resilience and performance that the technology architecture must support. This includes availability, reliability, disaster recovery, and performance (throughput, latency) targets. Also describe how the architecture meets these requirements.)*
  
  ### Resiliency and Availability
  
  *(Placeholder – list the requirements for uptime and fault tolerance. For example: “System must achieve **99.99% availability** (maximum \~1 hour downtime/year).” Specify **redundancy** and failover needs: e.g., N+1 clustering, multi-data-center or multi-region deployments for disaster recovery, **Recovery Time Objective (RTO)** of X hours and **Recovery Point Objective (RPO)** of Y minutes for critical systems. Mention backup strategies and any high-availability configurations (redundant servers, clusters, etc.). Also note requirements to handle adverse events: e.g., *“In the event of a datacenter outage, critical services fail over to secondary site within 30 minutes.”* Include how **resilience is designed** into the architecture (e.g., use of auto-scaling cloud services, load balancers, and replicated data stores).)*\*
  
    *(Resilient technology is critical to maintaining uninterrupted power utility services even during peak demand or unexpected incidents. The architecture should be **agile, scalable, and recoverable by design** to handle component failures or disasters without major service disruption. For instance, ensure the infrastructure can absorb a server failure with no downtime, and that there are clear failover procedures.)*
  
  ### Performance and Scalability
  
  *(Placeholder – list performance targets such as system throughput, latency, and capacity. For example: “Support **5000 concurrent users** with page load time under 2 seconds,” or “Handle **1 million smart meter readings per hour** with no data loss.” Define peak load expectations (e.g., end-of-month billing, summer energy peak) and how the system scales to meet them (vertical scaling, horizontal scaling, auto-scaling in cloud). Note any response time SLAs for critical operations. Also mention capacity planning assumptions (initial volume and growth).*
  
    *Document how the architecture addresses these needs – e.g., “Using a load-balanced web farm and scalable microservices ensures the system can handle spikes in load.” If using cloud, note use of auto-scaling groups or managed services that can grow on demand. If on-premises, note sizing margins or clustering. Provide any performance test or modeling that informs the design.*)
  
    *(High performance components are essential for a good user experience; for example, using **fast, reliable databases and high-availability servers** to meet customer needs. The architecture should thus include not only resilience but also the **capacity for growth and peak performance**.)*
  
  ### Capacity and Growth Planning
  
  *(Placeholder – mention current capacity headroom and strategy for future growth. For example, “Database initially sized at 5TB, with scaling strategy to 10TB as data grows,” or “Application server cluster can scale out with 2 additional nodes to accommodate 2x current peak load.” Align this with the roadmap if capacity upgrades are expected in later phases.)*
  
  ### Monitoring and Performance Tuning
  
  *(Placeholder – note how the system’s performance and health will be monitored (e.g., APM tools, cloud monitoring dashboards) and any processes for tuning and optimizing. This might overlap with the **Continuous Monitoring** section in Security for infrastructure health monitoring, but here focus on performance metrics.)*
  
  *(In summary, this section makes explicit how the architecture will meet the utility’s demands for reliability and speed. For a critical infrastructure like an electric utility, designing for resilience (agile, recoverable systems) and for high performance under peak conditions is paramount.)*
  
  ## Security Architecture
  
  *(Guidance: Outline the security controls and considerations for the solution’s technology architecture, organized according to the NIST Cybersecurity Framework (CSF) functions and categories. The subsections below correspond to key security domains under the Identify, Protect, Detect, Respond, and Recover functions of NIST CSF 2.0. For each area, describe how the architecture addresses the security requirements, and include placeholders for specifics such as tools, policies, and configurations. This ensures the security architecture is comprehensive and aligns with industry best practices for critical infrastructure.)*
  
  ### Asset Management (Identify)
  
  *(All **physical and software assets** related to the system should be documented and prioritized. This provides the foundation for security management by knowing what exists and what is critical.)*
  
  *(Guidance: Document an inventory of all technology assets in scope. Identify hardware (servers, network devices), software applications, data repositories, and external services that are part of this solution. For each asset, capture relevant information: owner, location, purpose, and criticality. Ensure you include physical devices, virtual resources, cloud services, and data assets. This section should answer *“What needs to be protected?”* by listing and categorizing assets.*)
  
  * *Asset Inventory:* *(Placeholder – e.g., list or reference a configuration management database entry for all servers, network gear, and endpoints supporting this solution. Include IDs or names, and roles like “App Server for Customer Portal”.)*
  * *Software and Data Assets:* *(Placeholder – e.g., list major software applications, databases, and sensitive data stores (customer data, operational data) used by the solution. Mention if data is classified (public, internal, confidential) and any regulatory implications (e.g., CIP compliance assets).)*
  * *Asset Ownership:* *(Placeholder – for each asset or category, note the responsible owner or custodian (could be an individual or team). E.g., “Database X – owned by Database Admin Team; Windows Servers – owned by Infrastructure Team”.)*
  * *Asset Lifecycle:* \*(Placeholder – note if assets are tracked through a lifecycle (commissioning, maintenance, decommissioning). Are there processes to keep the inventory updated when assets change?) \*
  
  ### Identity and Access Control (Protect)
  
  *(This section ensures that **identities and access privileges** are properly managed and protected. It should address **who/what can access the system** and **how that access is secured**. Identity and access control is crucial for meeting compliance like NERC CIP requirements in a utility context, though this template uses NIST CSF terminology.)*
  
  *(Guidance: Describe how **access to systems and data is controlled**. This covers both user identity management and system access. Include the authentication mechanisms, authorization schemes, and identity lifecycle processes. Align with NIST CSF’s Protect function by covering how the architecture ensures only authorized access to assets.)*
  
  * *User Authentication:* *(Placeholder – describe how users (both corporate users and any external users or partners) authenticate. E.g., “Single Sign-On via Active Directory and SAML/OAuth for cloud services,” or “Multifactor Authentication (MFA) enforced for all admin access.” Mention any identity providers or IAM systems (e.g., Azure AD, AWS IAM, LDAP).)*
  * *Access Management:* *(Placeholder – outline how access rights are provisioned and managed. For example, role-based access control (RBAC) definitions: list key roles (engineer, operator, admin) and their permissions in the system. State the principle of least privilege is applied – users get the minimum access needed. If applicable, mention privilege access management solutions for admin accounts and how access reviews are conducted.)*
  * *Device and Network Access:* *(Placeholder – mention controls for device access and network access. E.g., “Physical access to servers is restricted to authorized personnel,” and “Network access control (NAC) is implemented to ensure only managed devices connect to the network.” Note if remote access is allowed (VPN, jump host) and how it’s secured.)*
  * *Credential Management:* *(Placeholder – describe how credentials (passwords, keys, certificates) are managed. E.g., password policies (length, rotation), use of a secrets vault for application credentials, enforcement of strong encryption for credentials. Include how identities are proofed and bound to credentials if relevant.)*
  
  ### Threat Detection and Response (Detect/Respond)
  
  *(By having robust monitoring, the architecture ensures timely detection of anomalies or attacks. Coupled with a well-defined incident response process, the organization can **mitigate and contain threats** effectively when they occur. This is vital for a utility company to minimize disruptions.)*
  
  *(Guidance: Explain the capabilities for **detecting cybersecurity events** and for **responding** to incidents. This section combines the NIST CSF **Detect** and **Respond** functions to cover how the architecture monitors for threats and what processes/tools are in place to react when incidents occur. Outline the security monitoring infrastructure, incident response plan, and related tools.)*
  
  * *Security Monitoring & Detection:* *(Placeholder – describe the tools and processes for continuous security monitoring. E.g., “A Security Information and Event Management (**SIEM**) system aggregates logs from servers, network devices, and applications, providing real-time analysis and alerting.” Mention sources like IDS/IPS (Intrusion Detection/Prevention Systems), endpoint detection and response (EDR) agents on servers, anti-malware tools, and any anomaly detection systems. If using outsourced Security Operations Center (SOC) services, state that. Also note scheduled vulnerability scans or penetration tests as part of detecting potential weaknesses.)*
  * *Incident Response Plan:* *(Placeholder – summarize the incident response process. E.g., “An **Incident Response Plan** is in place, aligned to NIST guidelines, which defines how to classify incidents, roles and responsibilities, and communication flows.” Mention the existence of an incident response team (internal or external), and any runbooks or playbooks for likely scenarios (e.g., malware outbreak, data breach). Indicate that the plan covers containment, eradication, and recovery steps for incidents. Also mention if the architecture includes automation for response, like automated isolation of a compromised server.)*
  * *Response Tools and Capabilities:* *(Placeholder – list tools that aid in incident response, such as forensic analysis tools, incident tracking systems, or automated response platforms. E.g., “Use of EDR allows immediate isolation of infected hosts,” or “Backup and restore tools are in place to recover data quickly if ransomware is detected.”)*
  * *Communication and Reporting:* *(Placeholder – note how incidents are reported and escalated. E.g., “Alerts from the SIEM trigger notifications to on-call security personnel 24/7,” and “There is a defined communication plan to inform management, regulators, or customers as needed during significant incidents.” Include any integration with broader enterprise incident management.)*
  
  ### Data Protection and Encryption (Protect)
  
  *(These measures ensure that **data is securely handled and stored**. By encrypting data at rest and in transit, and by controlling access, the architecture reduces the risk of data breaches or leaks. Even in a breach scenario, encrypted data would be less likely to be usable by an attacker.)*
  
  *(Guidance: Describe how **data is protected** through its lifecycle (at rest, in transit, and in use). This includes encryption measures, data handling policies, and protective controls to prevent data leakage or alteration. Align with NIST CSF Protect by covering the **Data Security** aspects.)*
  
  * *Data-at-Rest Protection:* *(Placeholder – explain measures for encrypting data at rest. E.g., “Customer and operational data stored in databases and file systems is encrypted at rest using AES-256 encryption. Encryption keys are managed by a key management service (KMS) with strict access controls.” Note any database-specific encryption (TDE – Transparent Data Encryption) or disk-level encryption on servers. Also mention how backup data is protected – e.g., encrypted backups.)*
  * *Data-in-Transit Protection:* *(Placeholder – describe how data moving over networks is secured. E.g., “All internal service calls and external interfaces use **TLS 1.3** encryption for data in transit. HTTP APIs enforce HTTPS only. VPN tunnels are used for site-to-site data transfer between corporate and cloud networks.” If applicable, mention use of secure protocols (SSH, SFTP) for any file transfers or the use of message-level encryption for certain integrations.)*
  * *Access to Sensitive Data:* *(Placeholder – outline controls for restricting and monitoring access to sensitive information. E.g., role-based access to databases (only DBAs and app service accounts), use of data masking or tokenization for sensitive fields (like customer PII or financial data) in non-production environments. Mention if data stores maintain audit logs of access. Also, reference data classification: “Customer personal data is classified as Confidential and stored in segregated database schemas with additional access restrictions.”)*
  * *Data Loss Prevention (DLP):* *(Placeholder – if relevant, mention any DLP measures in place to prevent exfiltration or unauthorized copying of sensitive data. E.g., “Email and endpoint DLP solutions prevent sending of customer data outside authorized channels,” or “Cloud storage buckets have policies to prevent public exposure.”)*
  * *Integrity and Backup:* *(Placeholder – mention how data integrity is ensured. E.g., checksums or integrity monitoring on critical files, database consistency checks. Also, tie in backup strategy: “Regular backups are performed and encrypted. Backup restoration is tested periodically to ensure data integrity and availability in case of corruption or loss.”)*
  
  ### System and Communications Protection (Protect)
  
  *(By implementing these measures, the architecture **secures system boundaries and communications**. Network segments are protected by firewalls and only necessary traffic is allowed, reducing the attack surface. Systems are hardened and equipped with protective controls (like NAC, firewalls, anti-malware) to prevent and deter attacks on the infrastructure.)*
  
  *(Guidance: Describe how the architecture protects the **systems themselves and their communications**. This includes securing the network infrastructure, implementing system hardening, and using protective technologies to shield the environment. This aligns with NIST CSF categories like Protective Technology and also overlaps with NIST SP 800-53 families such as System & Communications Protection.)*
  
  * *Network Security:* *(Placeholder – detail the network-level protections. E.g., “**Firewalls** are deployed at network perimeters and between network zones to inspect and filter traffic. Default-deny policies restrict unnecessary communications.” Mention segmentation: “The OT network (operational technology) is segmented from IT corporate network, with only whitelisted communications via a firewall/diode.” If applicable, include use of demilitarized zones (DMZ) for any external-facing systems. Also note any Web Application Firewalls (WAF) protecting web services.)*
  * *Secure Communications:* *(Placeholder – ensure that protocols and ports used are secure. E.g., “All inter-service communication uses secure protocols (e.g., HTTPS, TLS-encrypted gRPC). Insecure protocols (telnet, FTP) are not permitted.” If the system uses wireless or field communications (common in utilities), mention encryption and auth for those channels as well.)*
  * *System Hardening:* *(Placeholder – describe how servers, network devices, and applications are hardened. E.g., “Standard build configurations are applied to servers (secure baseline images) disabling unnecessary services and enforcing secure configurations. Regular patch management is in place to keep systems updated against vulnerabilities.” Mention use of configuration benchmarks (CIS benchmarks or similar) if followed. If applicable, include that administrative interfaces are restricted (e.g., admin consoles only accessible from specific secure networks).)*
  * *Protective Technologies:* *(Placeholder – list any additional security tools deployed to protect systems. E.g., **Intrusion Prevention Systems (IPS)** on network ingress/egress, **anti-malware/endpoint protection** on servers, integrity monitoring tools (file integrity monitoring on critical systems), and DDoS protection services for public-facing endpoints. Note resiliency mechanisms as well: “The system design includes redundancy and failover mechanisms to achieve resilience against infrastructure attacks.”)*
  * *Communications Monitoring:* *(Placeholder – mention if communications are monitored for security purposes. E.g., “Network traffic is monitored for suspicious patterns using an IDS and anomalies trigger alerts in the SIEM.” This might overlap with the Detection section, but here emphasize protection of comm channels.)*
  
  ### Security Continuous Monitoring (Detect)
  
  *(This continuous monitoring ensures that the organization can **detect anomalies or malicious activity quickly**. It goes beyond reactive detection, by also keeping an eye on system health and compliance on an ongoing basis. For a critical infrastructure company, continuous monitoring is key to early warning of cyber threats.)*
  
  *(Guidance: Detail how the organization continuously monitors the environment to identify security issues proactively. While some monitoring was mentioned under Threat Detection, this section can expand on the broader continuous monitoring program for both security and compliance.)*
  
  * *Logging and Audit:* *(Placeholder – describe the logging strategy. E.g., “All servers, network devices, and security appliances send logs to a centralized log management system (or SIEM) for aggregation and analysis.” List key logs collected: authentication events, firewall logs, application logs (especially security-related events). Mention retention: logs are retained for X days to support investigations and compliance.)*
  * *Vulnerability Management:* *(Placeholder – explain how vulnerabilities are continuously assessed. E.g., “Automated vulnerability scans run monthly on all servers and network components. Critical vulnerabilities are tracked and remediated within Y days as per policy.” Mention any use of agent-based monitoring that checks system configurations for drift from baseline. If applicable, include monitoring of software dependencies for known vulnerabilities.)*
  * *Security Metrics and Dashboards:* *(Placeholder – note if there are metrics or dashboards that are regularly reviewed. E.g., “We track metrics like patch compliance percentage, number of intrusion attempts blocked, and time to remediate incidents. A security dashboard provides real-time status of these metrics to IT management.”)*
  * *Third-Party and Supply Chain Monitoring:* *(Placeholder – if relevant, mention oversight of third-party connections or services. E.g., “Connections to third-party service providers are monitored and those providers are required to report any security incidents. We also monitor software supply chain by using only vetted dependencies and scanning container images for vulnerabilities.”)*
  * *Continuous Improvement:* *(Placeholder – state that monitoring results feed back into improving security. E.g., “Regular security reviews are conducted using the data from monitoring to adjust firewall rules, update training, and improve response processes.”)*
  
  ### Recovery Planning (Recover)
  
  *(With a solid recovery capability, the organization can **restore normal operations quickly after an incident**. This includes having up-to-date recovery plans and regular drills. In the context of NIST CSF, this section ensures the **Recover** function is addressed by planning for various disaster/incident scenarios and how to bounce back from them.)*
  
  *(Guidance: Describe the capabilities and plans for **recovery and resilience** in case of a cybersecurity incident or major system failure. This aligns with the NIST CSF **Recover** function, ensuring the organization can restore operations and learn from incidents.)*
  
  * *Disaster Recovery (DR) Plan:* *(Placeholder – summarize the disaster recovery strategy for the technology components. E.g., “The DR plan stipulates that in case of primary data center loss, systems will be recovered in a secondary data center in Region B. Data is replicated in near-real-time to the secondary site, ensuring an RPO of 15 minutes. The DR failover process is documented and can be executed within 2 hours (RTO) for critical systems.” Mention the frequency of DR plan testing, e.g., full DR drill conducted annually with results documented.)*
  * *Backup and Restore:* *(Placeholder – detail the backup approach. E.g., “Nightly backups of databases and weekly full server backups are performed and stored encrypted offsite/cloud. Backup integrity is tested monthly. In the event of data corruption (e.g., ransomware), systems can be restored from backups within X hours.” Include any specific recovery tools or services, and ensure alignment with recovery time objectives.)*
  * *Recovery Procedures:* *(Placeholder – outline at a high level the procedures to recover each major component. For instance, “If application servers fail, rebuild from infrastructure-as-code scripts is possible in 1 hour.” Or “In case of cyberattack leading to system rebuild, documented hardening and deployment procedures ensure systems can be rebuilt from scratch using clean sources.” The idea is to show that for each major failure mode, there is a plan.)*
  * *Post-Incident Improvement:* *(Placeholder – mention how the architecture and processes are updated after incidents. E.g., “After any major incident or DR test, a lessons-learned meeting is held and the recovery plan is updated accordingly.” This shows continuous improvement in resilience.)*
  * *Coordination and Communication:* *(Placeholder – note roles and communication in recovery. E.g., “The Incident Response Team coordinates with the Infrastructure Team during recovery. Stakeholders (executives, affected business units) are kept informed of recovery progress as per the communication plan.” If public communication is needed (for outages), mention that as well.)*

---

THIS PROMPT IS A WORK IN PROGRESS AND WILL BE UPDATED OVER TIME.

This prompt is designed for professional solution architect who is developing a technology architecture for their project.  

## How to Use This Prompt

1. **Copy the prompt** from the prompt content section above
2. **Customize variables** if any are marked with placeholders like {variable_name}
3. **Paste into your AI tool** (ChatGPT, Claude, Copilot, etc.)
4. **Provide your specific input** as requested by the prompt
5. **Review and iterate** on the generated output as needed

## Best Practices

- Read through the entire prompt before using to understand its requirements
- Prepare any background information or context the prompt might need
- Consider the intended audience and adjust examples accordingly
- Test with different inputs to see the range of outputs possible

## Supported AI Models

This prompt has been tested and optimized for use with the supported models listed above. It may work with other AI systems but performance may vary.

## Customization Tips

- Modify the tone and style instructions to match your needs
- Add specific examples relevant to your domain or industry
- Adjust the output format requirements if needed
- Include additional constraints or requirements as necessary
