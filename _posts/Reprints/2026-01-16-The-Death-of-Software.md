---

layout: post

title: "The Death of Software 2.0"
subtitle: "Why the memory hierarchy is the right analogy for agentic software"
quote: "Claude Code is DRAM."
excerpt: "Using the memory hierarchy as an analogy, this essay argues that AI agents will become the fast, non-persistent layer for information work—while durable systems of record (data, state, APIs) become the true value layer."
source: "Original Content"
source-url: ""
call-to-action: "Discuss on Mastodon"

date: 2026-01-16 07:00:00 -0800
update: 2026-01-16 07:00:00 -0800

author:
	avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g"
	name: "Ted Tschopp"
	url: "https://tedt.org/"

bullets:
	- Agentic systems shift value from UI workflows to durable sources of truth.
	- The context window is fast memory; outputs get compacted into persistence.
	- SaaS pricing power weakens as interfaces become generated and disposable.
	- APIs, data, and infrastructure become the "NAND" layer of the stack.

description: "An essay on why agentic AI changes software economics: interfaces become ephemeral, while durable systems of record (data, state, and APIs) become the high-value layer—using the memory hierarchy as the guiding analogy."
seo-description: "The Death of Software 2.0: why AI agents make UI-driven SaaS less defensible, and why APIs, data, and infrastructure become the durable value layer—explained via the memory hierarchy analogy."

categories:
	- AI
	- Opinion
	- Computers
	- Reprint

tags:
	- AI
	- Agents
	- Claude
	- SaaS
	- APIs
	- Infrastructure
	- Product strategy
	- Memory hierarchy

keywords:
	- death of software
	- agentic ai
	- ai agents software economics
	- memory hierarchy analogy
	- saas price to sales
	- systems of record apis

location:
	name: Bradbury, CA
	coordinates:
		latitude: 34.1470
		longitude: -117.9709

image: /img/2026-01/Memory-vs-Software.webp
image-alt: "Diagram comparing agentic AI workflows to the memory hierarchy, mapping ephemeral computation to fast memory and durable systems of record to persistent storage"
image-description: "A conceptual graphic that uses the memory hierarchy as a metaphor for the future software stack: AI agents as fast, non-persistent compute and APIs/data as persistent storage."
image-title: "AI and Software as a Memory Hierarchy"

mathjax: false
mastodon-post-id:

---

The age of PDF is over. The time of markdown has begun. Why Memory Hierarchies are the best analogy for how software must change. And why Software it's unlikely to command the most value.
 
When I last wrote about software, I received significant pushback. Today, I believe that Claude Code is confirming the original case I had all along. Software is going to become an output of hardware and an extension of current hardware designs. With this in mind, I want to write today about how I see software changing from here.

But let’s start with one core conviction. Claude Code is the glimpse of the future. Assuming it improves, has harnesses, and can continue to scale large context windows and only become marginally more intelligent, I believe this is enough to really take us to the next state of AI. I cannot stress enough that Claude Code is the ChatGPT moment repeated. You must try it to understand.

One day, the successor to Claude Code will make a superhuman interface available to everyone. And if Tokens were TCP/IP, Claude Code is the first genuine website built in the age of AI. And this is going to hurt a large part of the software industry.

## Software (Especially Seat Based) is in for a Much Rougher Ride

The environment may be rough at OpenAI, but at a traditional SaaS company, there is likely no greater whiplash than SaaS is eating the world in 2012 to Saas is screwed today. The stocks reflect it; multiple compression in the companies has been painful and will persist.

![Price-to-Sales ratio for SaaS companies]({% link img/2026-01/Price-to-Sales-Ratio-for-SaaS.webp %})
Source: EODHD

This is structural. I believe it’s time to rethink software’s value proposition, and I have what I consider the best analogy for what the future holds. Afterwards, we will digest what Software will look like as an extension of computing, because I believe that Claude Code resembles the memory hierarchy in computing. Let’s explain.

## The New Model of Software

Claude Code (and subsequent innovations) clearly will change a lot about software, but the typical (and right) pushback is that you cannot use “deterministic software” for defined business practices. However, there is a persistent design pattern in hardware that addresses this difference: the memory hierarchy. No one can rely on anything in a computer's non-persistent memory, yet it is one of the most valuable components of the entire stack.

For those unfamiliar with computer science, there is a memory hierarchy that trades capacity and persistence for speed, and the system works because there are handoffs between levels. In the traditional stack, SRAM sits at the top; overflow is to DRAM, which is non-persistent (if you turn it off, it goes away), and then to NAND, which is persistent (if you turn it off, it persists).

I don’t think it’s worth matching the hierarchy too closely, but I believe that Claude Code and Agent Next will be the non-persistent memory stack in the compute stack. Claude Code is DRAM.


![Memory hierarchy diagram]({% link img/2026-01/Memory.webp %})

Source: <https://computerscience.chemeketa.edu/cs160Reader/ComputerArchitecture/MemoryHeirarchy.html>

I believe that AI and software will be an extension of this, and we can already identify which layers correspond to which. The “CPU” in the hierarchy comprises raw information, and the fast memory in the hierarchy corresponds to the context window. This level of context is very fast information, not persistent, and gets cleared systematically. The output of work performed in non-persistent memory is passed to the NAND, which is stored for the long term.

Now that the code is merely an output of hardware, I believe this analogy applies.

AI Agents and their context windows are going to be the new “fast memory”, and I believe that infrastructure software is going to look a lot closer to persistent memory. It will have high value, structured output, and will be accessed and transformed at a much slower rate. I believe the way to think of software, and the “software of the future,” looks a lot more like NAND, and that is persistent, accurate, and information that needs to be stored. In software parlance, it will be the “single source of truth” that AI agents will interact with and manipulate information from.

If you’re so visually inclined, here’s a diagram of a Claude code context window being compacted over and over. Another way to think about this is that it is an identity for a compute cycle; once the task is finished, it is transferred to slower memory and continues.

![Context window compaction diagram]({% link img/2026-01/Context-Length.webp %})

Source: Weka

Each time an AI agent's computation cycle occurs, this is a scratchpad. Each context window is a clock cycle: cached state accumulates until the cache is flushed, after which information is processed. Afterward, the entire context is discarded, leaving only the output. Computation is ephemeral, and information processing by a higher tier of computation largely abstracts away most of human reasoning.

Importantly, I think there is a world in which software doesn’t go away, but its role must change. In this analogy, data, state, and APIs will be persistent storage, akin to NAND, whereas human-oriented consumption software will likely become obsolete. All horizontal software companies oriented at human-based consumption are obsolete. The entire model will be focused on fast information processors (AI Agents), using tokens to transform them and depositing the answers back into memory. Software itself must change to support this core mechanism, as the compute engine at the top of the hierarchy is primarily nonhuman, namely an AI agent.

I believe that next-generation software companies must completely shift their business models to prepare for an AI-driven future of consumption; otherwise, they will be left behind.

## Glimpses of the Future

So what does this future look like? I believe that all software must leave information work as soon as possible. I believe that the future role of software will not have much “information processing”, i.e., analysis. Claude Code or Agent-Next will be doing the information synthesis, the GUI, and the workflow. That will be ephemeral and generated for the use at hand. Anyone should be able to access the information they want in the format they want and reference the underlying data.

What I’m trying to say is that the traditional differentiation metrics will change. Faster workflows, better UIs, and smoother integrations will all become worthless, while persistent information, a la an API, will become extremely valuable. Software and infrastructure software will become the “NAND” portion of the memory hierarchy.

And since I’m going to be heavily relying on the history of memory, the last time a new competitive technology came out, it was an extinction event for the magnetic cores that DRAM replaced, and I think this is probably going to be the case for UI companies or companies like Tableau or other visualization software. Zapier / Make as connectors, UiPath, or RPA companies, etc. These are all facing an extinction-level event.

Other companies that I think could be significantly affected include Notion and Airtable. Monday, Asana, and Smartsheet are merely UIs for tasks; why should they exist? Figma could be significantly disrupted if UIs, as a concept humans create for other humans, were to disappear.

Companies that are interesting are “sources of truth,” but many of them need to change. An example might even be Salesforce, a SaaS company. I don’t think the UI is that great, and most of the custom projects are just hardening workflows in the CRM. For Salesforce to make the leap, it needs to focus its product on being consumed by an AI agent, with manipulation and maintenance, while being the best possible NAND in this stack. The problem is that Salesforce will want to try to go up the stack, and by doing so, maybe miss the shift completely.

Most SaaS companies today need to shift their business models to more closely resemble API-based models to align with the memory hierarchy of the future of software. Data’s safekeeping and longer-term storage are largely the role of software companies now, and they must learn to look much more like infrastructure software to be consumed by AI Agents. I believe that is what’s next.

This raises the question: what does this look like for the industry as a whole in the near future? I believe the next 3-5 years will be a catastrophic sea change.

If we focus directly on NAND, I believe the value of AI Agents will quickly surpass that of all software, and software will undergo massive consolidation, akin to the consolidation in the memory industry. Who knows what the ratio will look like, but I think the AI agent portion will have at least as much value as the software portion today.

I also believe that this transition will be detrimental to all of software. It is time to acknowledge that the software industry is not growing; it is mature, with few competitors, and needs to generate cash. Software should look like railroads, a few scale players in core markets that are sources of truth for APIs. I expect massive consolidation or death.

There are many rich metaphors we can use, and I think software will be like a core banking business; it must have high reliability and accuracy, but it will grow slowly, and most of the functions of other companies will be built on top of it. That, I think, is almost the best case, as IBM achieved a positive CAGR in the mainframe business unit. But even great IBM had a terribly hard transition period.

Here’s a generated graphic.

![AI and software mapped to a memory hierarchy metaphor]({% link img/2026-01/Memory-vs-Software.webp %})

But in this diagram, the companies I really want to highlight are Adobe’s PDF and Microsoft’s docx, Excel, and PowerPoint. These are the big horizontal software companies that are focused on human-based information processing. Why do we need to open an Excel file to make a graph? I believe that is pretty much an obsolete information transformation. If a human is consuming the software, there is no purpose.

Everything that remains will look like infrastructure. A CRM will exist, but it will be accessed via your agent, which connects to its API. The Agent will figure out how to integrate it into your workflow. This will likely take years, but you can see a glimpse of the future today.

Anyways, we are clearly in a new era of AI. I believe Claude Code will be the next leg. OpenAI will soon be forced to respond in a major way. This is the future and soul of what AI will deliver.

Another thing I want to mention: OpenAI spending a trillion dollars on a chatbot always felt a bit foolish and drew skeptics. It is a useful tool, but it is not “AGI” or something that we all knew was a prototype, not the final form. Claude Code, as it currently sits, in my view, is enough to really kick off a whole bubble. AI progress could meaningfully slow down, and I think this is enough to kick off a whole new round of spending. This is the glimpse of the future.

With a fully loaded Claude Code, I’m able to transform data at a rate I’ve never been able to do before. It is the future; try it. Until then, goodbye UI and human consumption software companies, you’re pretty toast.
