# Prompt Engineering Techniques

## Level 1 - Basic Requests
At this level, you’re just basically mindlessly telling ChatGPT what you want out of it, with no real thought behind it. Sometimes you get good results, sometimes you don’t. For example, you might tell ChatGPT to summarize a Wikipedia article—a pretty easy task, and it does fine. But there are a lot of ways you can improve on this.

## Level 2 - Using Formatting
Small things like formatting can make a surprisingly big difference. For instance, just adding some dashes to separate your prompt can greatly help ChatGPT understand the different sections of your prompt. Right now, it might not make that big of a difference, but as your prompts get more complex, it’s huge. Other simple formatting tips that make a big difference are being nice, avoiding negatives, and even begging and pleading. Some research indicates that being polite in your prompts helps large language models with their accuracy. Even if being nice didn’t improve responses, you’d probably still do it anyway just because you don’t want to get in the habit of being a demanding jerk. No one’s quite sure why, but large language models seem to perform better when you tell them to do something rather than not do something. For instance, “Don’t think of an elephant,” and you thought of an elephant.

## Level 3 - Focused Requests
Here’s where you really start to see an uptick in quality responses. Level three is all about being clear and focused with what you want out of the chatbot. For instance, you don’t want to say, “Make the response pretty.” Instead, write, “Please respond with headings, subheadings, and tables,” for instance. Or maybe you only want certain information. Tell it what you do and don’t want in the response. Take a look at this specific request: “Here is some data; put it in a table. I only want the columns class, CL level, name, major. Order it by class level, and then at the very end, tell me what Carl’s major is.” Boom! Got exactly what you wanted.

## Level 4 - Give Examples
This is your first somewhat advanced prompting technique, and if you’ve heard the term “few-shot,” this is what they’re talking about. Basically, you want to give ChatGPT some example inputs and some example outputs. Let’s take an example of putting together a career overview. You give ChatGPT input from LinkedIn. You then give it a properly formatted career overview for that same person from their corporate biography page. Finally, you give it your LinkedIn profile and ask it to output a career overview for your data like the one from the public figure. Finally, make sure you look at that career overview and ensure it didn’t miss anything or add anything. If it did, you need to use the next technique.

## Level 5 - Self-Reflection
Hey ChatGPT, did you miss anything? This one is almost too easy. Large language models are statistically better at evaluating than generating, so by asking this question, you’re really playing to ChatGPT’s strengths.

## Level 6 - System Prompt / Custom Instructions
This is a big one. There isn’t enough space to dive deeply into this one, but the gist is that you try to give as much context to ChatGPT about yourself and what you want out of it. You tell it: "I am a software engineer, I prefer X programming language, and I prefer short answers with follow-up questions rather than huge walls of text," etc., etc. Once you do this, you can add this to any prompt you use, and it will increase the relevancy of the output ChatGPT gives you.

## Level 7 - Use Personas
Say you have a simple riddle: “I see a glass door with ‘push’ written on it in mirror writing. Should I push or pull the door?” Most of us intuitively know that because it’s in mirror writing, you should probably pull the door. ChatGPT, however, confidently gets this wrong. Well, sometimes it’s as easy as telling ChatGPT to just be an expert in whatever you’re asking about. A few studies have shown that just by using personas, large language models improved 6 to 20% in the accuracy of their response. And it just blows the mind that you can get that much better results just by saying, “Act as [an expert].”

## Level 8 - Chain of Thought
Another way to get ChatGPT to handle tough problems is to ask it to explain its thought process. Use this in almost all of your prompts—it works so well. There has been a lot of research around this one. It seems like the most bang for your buck is just to add the phrase, “Let’s think step by step.” Telling ChatGPT to look at all angles of the problem also provides better outcomes.

## Level 9 - Self-Prompting
So you’ve learned all these techniques, and you’re still with this. Now throw it all out. It turns out large language models are better at prompting themselves than humans are, so you just need to ask ChatGPT to make a prompt to get you the answer that you want. You tell ChatGPT that you are going to want to use it to solve a riddle and for it to come up with a prompt that can help you solve that riddle. Take the prompt ChatGPT gives you, insert it into a new conversation, and give it the riddle. Then watch it work away at the problem.

## Level 10 - CO-STAR Framework
This is the final technique. 

- **C** stands for **Context**. This is where you give it any relevant background information, for instance, information about you or the task that you want it to do.
- **O** is for **Objective**. This is where you give crystal-clear instructions on what you want ChatGPT to do. You learned this way back in level three.
- **S** is for **Style**. In this section, you tell ChatGPT the style of writing that you want. It could be something silly like, “We want it in the style of a Snoop Dogg rap,” or something like, “Write it in the style of top CEOs.”
- **T** is **Tone**. What tone do you want the response in? Funny, emotional, threatening—you decide.
- **A** is for **Audience**. This is where you tell ChatGPT who the audience is. For instance, if the audience is 5-year-olds, it will be wildly different than if the audience is world-leading physicists.
- Lastly, **R** stands for **Response**. Here is where you tell ChatGPT the format of the response that you want. Do you want a detailed report? Do you want it in a table? Do you want a fancy programming format like JSON or just one giant wall of text? Here’s where you put it.

Let’s take a look at an example. First, you give it the context that you run a magic carpet business. Then, you tell it the objective is to write a Facebook post to get people to buy it. You tell it the style you want—basically to just copy successful companies. You tell it to have an elegant, persuasive tone. You say the target audience is people in their 30s. And lastly, you tell the pattern of the response: four sentences, no hashtags, and put in some emojis.