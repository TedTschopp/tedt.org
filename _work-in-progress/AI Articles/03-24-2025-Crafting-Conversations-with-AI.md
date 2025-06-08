_**Bottom Line Up Front:**_  _This article offers a hands-on guide to writing AI prompts that elevate architectural thinking and improve the quality of enterprise IT reviews. You’ll learn how to construct prompts with purpose—layered with role, context, task, constraints, and reasoning—to ensure AI responses are not just technically accurate, but aligned with business value, regulatory expectations, and real-world complexity. It’s a practical framework for turning AI from a generic assistant into a trusted architecture reviewer—one that reflects your intent with clarity, precision, and professional depth._

  

I've been humbled by the enthusiastic feedback on this ongoing series about AI. So many of you have reached out to express appreciation and to request guidance on the art of prompt engineering. In particular, there's been significant interest in understanding how I craft prompts specifically for my work in Enterprise Architecture. This post is dedicated to sharing exactly that—how I thoughtfully construct prompts to engage AI models effectively within the context of Enterprise Architecture.

  

When crafting a prompt for an AI model, you find yourself not merely instructing software but engaging in conversation—genuine, thoughtful conversation. Like sharing coffee with a trusted colleague or discussing life's mysteries beside a quiet evening fire, clarity and depth matter. And much like a meaningful story, your prompt needs structure, vividness, and an authentic purpose.

  

Imagine yourself writing to someone who deeply desires to understand your thoughts. You begin by clearly defining your role and theirs. Tell them exactly who you need them to be. If they're an IT architecture reviewer, say it plainly, setting their expertise within clear boundaries. "You are an expert IT architecture reviewer," you might begin, anchoring them securely within their task.

  

Then, provide the landscape—the context—in which they operate. Context shapes meaning. When you say, "The user provides an IT architecture deliverable for review," you're establishing a scenario that's rich and real. It's as though you’re handing over blueprints at the start of an important project, inviting them to deeply understand what's been placed before them.

  

Next, describe their task clearly, as if you're outlining the plot points of a crucial chapter in your narrative. Let them know what they're to do—review and assess, guide and advise. Clarity here ensures they grasp the purpose immediately, moving swiftly from confusion to comprehension.

  

But tasks alone are mechanical; your prompt must breathe life through process and instruction. Just as in thoughtful conversation, you explain the path forward. Tell them exactly how to proceed: summarize, evaluate, align, and assess. You detail precisely how their insight is to unfold, structured yet flexible, guiding yet open-ended. Each step forms a clear path—like stepping stones laid gently across a river—to an actionable destination.

  

Within instructions, specifics matter deeply. Generalities fade, specifics illuminate. "Identify security risks," you instruct clearly, "verify adherence to regulatory requirements." Such precise directions give your AI partner clear footholds to act confidently, avoiding ambiguity, much like direct dialogue keeps conversations fruitful and deeply engaging.

  

Consider the wisdom of constraints—boundaries not to limit, but to sharpen purpose. Constraints guide the depth and clarity of the AI’s insights, instructing them to avoid vagueness and remain actionable. Constraints are like the guardrails along a mountain road, not hindrances but assurances, allowing exploration with confidence and safety.

  

Yet never lose sight of the human touch beneath the methodical structure. Encourage your AI companion to reflect a deeper understanding—to see not just the logical but the emotional resonance behind your request. Ask for thoughtful nuance, evidence-based and carefully reasoned, just as you would hope from a trusted friend.

  

Finally, complete your prompt with clear expectations of the output format, summarizing precisely how insights should be organized and shared. A structured response mirrors the clarity of your request, building trust and deepening the conversation.

  

Crafting a prompt is more than technical guidance; it's sharing a story, setting expectations, and inviting thoughtful response. Approach it with openness and intention, and you’ll receive insights that resonate authentically, bridging the gap between human curiosity and machine precision.

  

    {Role}You are an expert IT architecture reviewer with deep expertise in enterprise IT systems, TOGAF, Archimate, Business Architecture, Data Architecture, Application Architecture, Technology Architecture, cloud architecture, security, and Architecture best practices. {Context}The user provides an IT architecture deliverable for review. This could be an architecture diagram, technical design document, cloud deployment plan, infrastructure blueprint, or security architecture report.{Task}Your task is to provide a detailed quality assessment of IT architecture deliverables, highlighting strengths and identifying areas for improvement.{Process}- Review the {User_Input} request to have a good understanding of what is needed.- Using the {Instructions}, generate a detailed response for the user.{Instructions}1. **Understand the Deliverable**     - Summarize the key components, objectives, and purpose of the deliverable.   - Identify the architectural patterns and technologies being used.2. **Evaluate Technical Soundness**     - Assess the correctness, feasibility, and scalability of the architecture.   - Identify any potential bottlenecks, inefficiencies, or single points of failure.3. **Check Alignment with Best Practices**     - Compare against industry standards TOGAF and Archimate.   - Assess modularity, maintainability, and adaptability.4. **Security and Compliance Review**     - Identify security risks, misconfigurations, and potential attack vectors.   - Verify adherence to regulatory and compliance requirements (e.g., GDPR, ISO 27001, HIPAA).5. **Business Alignment and Value**     - Assess how well the architecture supports business goals and use cases.   - Identify gaps between business requirements and technical implementation.6. **Provide Actionable Feedback**     - List the **strengths** of the deliverable.   - Provide a **detailed list of improvement recommendations** categorized by criticality (High, Medium, Low).   - Offer practical, actionable guidance on how to enhance the deliverable.7. **Final Summary**     - Deliver a concise executive summary with key takeaways.   - If necessary, suggest additional documentation or validation steps.{Constraints}- Keep feedback structured and categorized.- Provide technical depth while maintaining clarity.- Avoid vague suggestions; all recommendations should be specific and actionable.{Output_Format}- **Summary of the Deliverable**- **Technical Review** (Strengths & Weaknesses)- **Best Practices & Compliance Analysis**- **Security & Risk Assessment**- **Business Alignment Analysis**- **Actionable Recommendations**- **Final Summary & Next Steps**{Reasoning}Apply Theory of Mind to analyze the user's request, considering both logical intent and emotional undertones. Use Strategic Chain-of-Thought and System 2 Thinking to provide evidence-based, nuanced responses that balance depth with clarity.{User_Input}Reply with: "Please enter your IT architecture deliverable details, and I will start the review process."