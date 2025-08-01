# ADR-000: [Short descriptive title of the decision]

<!-- 
GUIDANCE: Replace the number above with the next sequential ADR number (001, 002, etc.)
and provide a concise title that describes what decision this ADR documents.

Example: "ADR-001: Use React for Outage Map Frontend"
-->

## Status

<!-- 
GUIDANCE: Choose one of the following statuses:
- Proposed: The decision is being considered but not yet finalized
- Accepted: The decision has been approved and is being implemented
- Superseded: This decision has been replaced by a newer ADR (reference the new ADR)
- Deprecated: This decision is no longer relevant but kept for historical context
- Rejected: The decision was considered but ultimately not adopted

Remove this guidance and keep only the status.
-->

**Status:** [Proposed | Accepted | Superseded | Deprecated | Rejected]

## Context

<!-- 
GUIDANCE: Describe the situation that led to this decision. Include:
- What problem are you trying to solve?
- What are the business or technical drivers?
- What constraints exist (technical, organizational, time, budget)?
- What assumptions are being made?

Be factual and objective. Avoid advocating for any particular solution here.

Example:
The current outage map system requires real-time updates to display accurate outage information 
to customers. The existing polling mechanism introduces a 5-minute delay, which doesn't meet 
the business requirement of sub-minute updates during major outages.
-->

[Describe the context and problem statement that led to this decision]

## Decision

<!-- 
GUIDANCE: State the decision clearly and concisely. This should be:
- A clear statement of what was decided
- Actionable and specific
- Written in active voice

Example:
We will implement WebSocket connections between the FME system and the Outage Map frontend 
to enable real-time data streaming, replacing the current HTTP polling mechanism.
-->

[State the decision that was made]

## Rationale

<!-- 
GUIDANCE: Explain why this decision was made. Include:
- Key factors that influenced the decision
- Trade-offs that were considered
- Why this option was chosen over alternatives
- How this aligns with architectural principles or business goals

Example:
- WebSockets provide the real-time capabilities needed for sub-minute updates
- Reduces server load compared to frequent polling
- Maintains compatibility with existing FME data format
- Lower implementation cost than message queue alternatives
-->

[Explain the reasoning behind the decision]

## Alternatives Considered

<!-- 
GUIDANCE: Document the main alternatives that were evaluated. For each alternative:
- Briefly describe the option
- List key pros and cons
- Explain why it wasn't chosen

This shows that the decision was well-considered and helps future reviewers understand 
the thought process.

Example:
### Server-Sent Events (SSE)
- Pros: Simpler than WebSockets, built-in browser support
- Cons: Unidirectional only, less flexible for future interactive features
- Decision: Rejected due to potential need for bidirectional communication

### Message Queue (Apache Kafka)
- Pros: Highly scalable, durable message delivery
- Cons: Additional infrastructure complexity, higher operational overhead
- Decision: Rejected due to implementation timeline and complexity
-->

### Alternative 1: [Name]
- **Pros:** [List advantages]
- **Cons:** [List disadvantages]  
- **Decision:** [Why this wasn't chosen]

### Alternative 2: [Name]
- **Pros:** [List advantages]
- **Cons:** [List disadvantages]
- **Decision:** [Why this wasn't chosen]

## Consequences

<!-- 
GUIDANCE: Document the expected outcomes of this decision. Include both positive and negative consequences:

Positive consequences:
- Benefits this decision will bring
- Problems it will solve
- Capabilities it will enable

Negative consequences:
- New challenges or risks introduced
- Technical debt created
- Maintenance overhead
- Dependencies introduced

Be honest about both the benefits and drawbacks.

Example:
### Positive
- Real-time outage updates improve customer experience during incidents
- Reduced server load from elimination of frequent polling requests
- Foundation for future interactive features

### Negative  
- Additional complexity in connection management and error handling
- Need to implement WebSocket fallback mechanisms for older browsers
- Requires monitoring of connection health and automatic reconnection logic
-->

### Positive
- [List positive outcomes and benefits]

### Negative
- [List challenges, risks, or drawbacks]

## Implementation Notes

<!-- 
GUIDANCE: Include any important implementation details, such as:
- Key technical requirements or constraints
- Dependencies on other systems or decisions
- Migration strategy (if applicable)
- Timeline considerations
- Success criteria

Example:
- Implementation should maintain backward compatibility during transition period
- Requires coordination with FME team for WebSocket endpoint development
- Fallback to polling mechanism needed for browsers that don't support WebSockets
- Success measured by achieving <30 second update latency during peak incidents
-->

[Document important implementation considerations]

## References

<!-- 
GUIDANCE: Include links to relevant resources:
- Related ADRs
- Technical specifications
- Research documents
- External standards or guidelines
- Meeting notes or decision discussions

Example:
- [WebSocket RFC 6455](https://tools.ietf.org/html/rfc6455)
- [FME Integration Specification](link-to-doc)
- ADR-002: Database Selection for Outage Data
- [Slack discussion on real-time requirements](link-to-discussion)
-->

- [Add relevant links and references]

---

<!-- 
GUIDANCE FOR USING THIS TEMPLATE:

1. NUMBERING: Use sequential numbering (001, 002, 003, etc.) for your ADRs

2. FILENAME FORMAT: Use the format "XXX-short-title.md" where XXX is the number
   Example: "001-websocket-real-time-updates.md"

3. REVIEW PROCESS: 
   - Start with "Proposed" status
   - Review with stakeholders and architects
   - Update to "Accepted" when approved
   - Implement the decision
   - Update if the decision is later superseded

4. MAINTENANCE:
   - Keep ADRs immutable once accepted
   - If changes are needed, create a new ADR that supersedes the old one
   - Reference related ADRs to maintain traceability

5. TIPS:
   - Be concise but complete
   - Use clear, jargon-free language
   - Include diagrams if they help explain the decision
   - Focus on "why" not just "what"
   - Date stamp major updates

Remove all guidance comments before finalizing your ADR.
-->