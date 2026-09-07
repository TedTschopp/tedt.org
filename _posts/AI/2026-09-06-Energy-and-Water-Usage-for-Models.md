---
layout: post

title: "How Much Energy and Water Does AI Use?"
subtitle: "Putting model training, everyday answers, cooling, and heat recovery in context"
excerpt: "AI uses electricity and water, but the impact depends on the task, the model, and the facility. Familiar comparisons help explain the scale."
source: "Original Content"

date: 2026-09-06 00:00:00 -0700
update: 2026-09-06 00:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - "AI electricity use varies with the model, task, and computing system."
  - "Training and everyday responses have different resource footprints."
  - "Water estimates are comparable only when they count the same impacts."
  - "Cooling design and heat recovery can reduce demand and make better use of energy."

description: "How much electricity and water does AI use? Compare everyday answers, model training, cooling systems, and data-center heat recovery."

categories:
  - AI

tags:
  - AI energy use
  - AI water use
  - model training
  - AI inference
  - data centers
  - cooling
  - heat recovery
  - sustainability

image: "/img/2026-09/Energy-and-Water-Usage-for-Models.webp"
image-alt: "Cutaway illustration of a data center with server racks, blue cooling pipes, and a heat exchanger connected by pipes to nearby homes."
image-title: "Data Center Cooling and Heat Recovery"
image-description: "An illustration of data-center cooling infrastructure and a heat exchanger linking server cooling circuits to a heating network for neighboring homes."
image_width: 1672
image_height: 941

no_toc: true
---

I was asked how much electricity and water AI uses, and what that means. These are shared resources, and questions about their use deserve clear answers. The numbers vary, but familiar comparisons can help put them in context.

**For a short text answer, the electricity use can be quite small.** A 2026 study estimated about **0.3 watt-hours**, roughly enough to run a **10-watt LED lightbulb for two minutes**. A longer reasoning response in the same study was estimated to use about **4 watt-hours**, equivalent to keeping that bulb on for **24 minutes**. These estimates describe particular text-based tasks and computing systems; individual requests can use more or less. [Research study](https://doi.org/10.1016/j.joule.2026.102430)

At the shorter-response estimate, asking 100 questions every day for a year would use around **11 kilowatt-hours**—about what a 1,500-watt space heater uses in seven hours. A small amount per answer can still add up to substantial demand when millions of people use these services.

Training an AI model is a larger, separate undertaking. Training GPT-3, released in 2020, was estimated to require **1.3 million kilowatt-hours**: roughly a year’s electricity purchases for **120 average U.S. homes**, using the government’s 2022 household benchmark. Developing and updating a model can involve several training stages and experiments, but answering an ordinary question does not restart that process. [Training estimate](https://arxiv.org/pdf/2104.10350), [household benchmark](https://www.eia.gov/tools/faqs/faq.php?id=97&t=7)

**Water use is harder to describe with one number.** Google estimated about **five drops of cooling water** for its typical Gemini text response in May 2025. Mistral reported **45 milliliters—about three tablespoons—for a roughly 300-word response**, using a broader calculation that includes impacts beyond cooling, such as manufacturing equipment. These figures describe different systems and count different things, so they cannot establish which service uses less water overall. [Google study](https://arxiv.org/html/2508.15734v1), [Mistral disclosure](https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai/)

Training also has a water footprint. One research scenario estimated **5.4 million liters** for GPT-3’s training when cooling and electricity generation were included. That is **just over two Olympic-size swimming pools**, assuming 2.5 million liters per pool. Another way of thinking about this at SCE is that this is the amount of water it would take to fill the pools of water that cooled the spent fuel at SONGS Unit 2 4x when it was operational.  Another SONGS compairson is that this was the amount of salt water SONGS Unit 2 and 3 processed in roughly 51 seconds to generate power.  That 5.4 million liters of water is a research estimate, rather than a disclosed measurement of water consumed during the actual training run. [Water study](https://arxiv.org/html/2304.03271v5)

The water is **not destroyed**. Evaporated water enters the atmosphere and eventually returns as precipitation, but it may return somewhere else or much later. A community experiencing drought still needs water in its own reservoirs and groundwater supplies today. That local availability is an important part of the environmental impact. [USGS explanation](https://www.usgs.gov/mission-areas/water-resources/science/water-use-terminology)

There are practical ways to reduce demand. Some cooling systems circulate the same water repeatedly, much like a car’s radiator. Microsoft reports that more than 90 percent of its Fairwater facility’s capacity uses a system with **no evaporation losses**. That illustrates what newer facilities can achieve. [Microsoft’s description](https://blogs.microsoft.com/blog/2025/09/18/inside-the-worlds-most-powerful-ai-datacenter/)

Some escaping water can also be recovered. In 2021, MIT described demonstrations at its power facilities of equipment that collects water droplets from cooling-tower plumes and returns them for reuse. [MIT demonstration](https://news.mit.edu/2021/infinite-cooling-nuclear-0803)

**Cooling water can also carry useful heat from the computers.** Recovering that heat can warm buildings and reduce their need for other heating sources. In a 2024 report, Meta said its Odense data center supplied recovered heat through a local heating network to about **7,000 households**. This makes further use of the energy consumed by computers; it does not recover all that energy or turn it back into electricity. [Meta’s facility report](https://datacenters.atmeta.com/wp-content/uploads/2024/10/Denmark-Odense.pdf)

Pacific Gas and Electric Company and developer Westbank announced plans in April 2025 for a San Jose development with **three data centers and up to 4,000 homes**. The project would reuse data-center heat through a network serving surrounding buildings. [PG&E announcement](https://investor.pgecorp.com/news-events/press-releases/press-release-details/2025/PGE-Begins-Energy-Infrastructure-Upgrades-to-Bring-San-Joses-Net-Zero-Community-to-Life/default.aspx)

For text, “tokens” are the small pieces of words and punctuation an AI processes. Electricity and water use can be expressed per million tokens, but those figures depend on the model, the task, and the facilities serving it. They are useful accounting measures when those conditions are specified.
