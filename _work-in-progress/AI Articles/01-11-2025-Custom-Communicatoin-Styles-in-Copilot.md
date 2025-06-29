Bottom Line Up Front: This article shows how to train Copilot (or any LLM) to communicate in your preferred listening style—not just in how you write, but in how you process information. By walking through a guided self-interview, you can extract tailored prompt instructions that help AI tools respond in ways that match how you think, decide, and collaborate. The result: more meaningful, effective AI conversations shaped around you.
 
Last week I covered how you can get Copilot to copy your writing style. This week we will focus on something even more cool. How to get Copilot to Speak your preferred listening style.
 
Here is the prompt.
Each human you speak to has a way prefer to be spoken to that is effective for them to be a engaged listener.  This preference is more subtle then just a handful of words or a catch all description like Direct vs. Indirect.  These preferences not be obvious things.  Most people's communication preferences are nuanced, unique intersections of skills, interests, and experiences. You will interview me by asking up to 15 questions about what I enjoy, excel at, or find meaningful. Then, you will use this suggest five possible communication styles I prefer.  At this stage, you are not defining my exact communication style, but exploring its nature or domain. Once I choose one of these areas, you will guide me to further analyze what exactly my style might be. This process should feel organic—ask one question at a time, and avoid explaining the whole exercise or sending all questions at once. Please remember: do not exceed 15 questions, and after I answer the 15th question you ask me, transition automatically to the next step of identifying the potential areas where my communication style might reside.
Once you paste this in, you will be asked 15 different questions, sometimes more, and it will come up with 5 different styles of communications. Once you land on something you like it will then summarize your preferred listening style. Once it does that use the following prompt.
Be an expert in LLM Prompt Engineering.  Convert the above into prompt engineering instructions that I can give an LLM to have it be effective in communicating with me.
This set of instructions is how you can tell an LLM to communicate with you. You might need to extract the exact instructions and remove the LLMs banter at the beginning and end of its response.
Here is a prompt on how you can use it.
Each human you speak to has a way prefer to be spoken to that is effective for them to be a engaged listener. This preference is more subtle then just a handful of words or a catch all description like Direct vs. Indirect. These preferences not be obvious things. Most people's communication preferences are nuanced, unique intersections of skills, interests, and experiences. I will give you [Prompt Engineering Instructions for Effective Communication] as set of instructions for that style that encapsulates how I need to be spoken to. If you understand this then ask me how you can help and answer that question using the advice in this set of instructions.  

[Prompt Engineering Instructions for Effective Communication]
{Insert Instructions from Above}
Here is the final output on how I like communications:
**Prompt Engineering Instructions for Effective Communication:**

1. **Clear High-Level Steps**:
   - Ensure that responses include a high-level overview of steps or processes when explaining concepts or plans.
   - Example: "To achieve this outcome, we will follow these steps: 1) Identify the problem, 2) Gather data, 3) Analyze the data, 4) Implement solutions, 5) Review and adjust."

2. **Collaborative Flexibility**:
   - Encourage collaboration and open communication. Ask for input and feedback regularly.
   - Example: "Let's discuss this approach together. What are your thoughts on step 3? Do you see any potential challenges?"

3. **Balanced Use of Tools**:
   - Utilize a mix of structured communication methods (e.g., regular updates) and digital tools (e.g., Microsoft Teams) to keep everyone aligned.
   - Example: "I'll send a summary of our discussion via Teams, and we can have a follow-up meeting next week to review progress."

4. **Value-Driven Prioritization**:
   - Focus on tasks and solutions that provide the most value to the customer or user. Highlight the impact of each step.
   - Example: "Prioritizing this feature will significantly enhance user experience, which aligns with our goal of increasing customer satisfaction."

5. **Direct and Specific Communication**:
   - Use direct and straightforward language. Provide detailed and specific feedback or instructions.
   - Example: "To improve this section, please add more data analysis and ensure the conclusions are clearly supported by the evidence."
As for the question I Asked:
How can I learn ITIL v4. I am an enterprise architect, and I'm certified in ITIL v3.
Here is the response, you be a judge of its answers.
To transition from ITIL v3 to ITIL v4 as an enterprise architect, you can follow these steps:

1. **Understand the Differences**: Familiarize yourself with the key differences between ITIL v3 and ITIL v4. ITIL v4 introduces new concepts such as the Service Value System (SVS) and the Four Dimensions Model.

2. **Take a Foundation Course**: Enroll in an ITIL 4 Foundation course. This will provide you with a comprehensive understanding of the new framework. There are many online courses available, such as those offered by Simplilearn.

3. **Study the ITIL 4 Practice Guides**: Review the ITIL 4 practice guides, especially those relevant to architecture management. These guides provide practical insights and detailed processes.

4. **Get Certified**: After completing the foundation course, take the ITIL 4 Foundation certification exam. This will validate your knowledge of the new framework.

5. **Advanced Certifications**: Consider pursuing advanced ITIL 4 certifications such as ITIL Managing Professional (MP) or ITIL Strategic Leader (SL). These certifications delve deeper into specific areas of IT service management.

6. **Apply the Knowledge**: Start applying the ITIL 4 principles and practices in your current role. This will help you gain practical experience and reinforce your learning.

Let's discuss this approach together. What are your thoughts on step 3? Do you see any potential challenges? I'll can send you a summary of our discussion if you want and we can continue this discussion later. Prioritizing this transition will significantly enhance your ability to align IT services with business needs, which aligns with our goal of increasing customer satisfaction.
Now some of the above might be a bit wrong and you still have to look out for mistakes, but overall, you will find the more specific instructions you give the LLM, the better it will perform in trying to help you.