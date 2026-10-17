---
layout: post
title: "Details on DeepSeek: Step 1 Through 5"
subtitle: "The R1-Zero Experiment and the Four Stages Behind DeepSeek-R1"
quote: "The useful question is what behavior we reward, and how we know that behavior is correct."
excerpt: "DeepSeek-R1 makes more sense when we separate pretraining, the R1-Zero experiment, and the four stages used to produce the final reasoning model."
source: Original Content
source-url: ''
call-to-action: "Choose a task where you can check the answer, then examine what your evaluation actually rewards."
date: 2025-02-02
update: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
bullets:
- "R1-Zero and R1 start from a pretrained model; neither begins with a blank slate."
- "The five-part explanation separates an experiment from the final training pipeline."
- "Reward design and verification deserve as much attention as the model."
- "Published benchmark results are a starting point for testing a business use case."
description: "A guide to DeepSeek-R1 training, with a dog-training analogy and practical questions about rewards, verification, and enterprise use."
seo-description: "Understand DeepSeek-R1, R1-Zero, supervised fine-tuning, GRPO, and why reliable verification matters for enterprise AI."
categories:
- Artificial Intelligence
- Computers
- Science
tags:
- "DeepSeek"
- "reinforcement learning"
- "AI training"
- "reasoning models"
- "R1-Zero"
- "supervised fine-tuning"
- "rejection sampling"
- "GRPO"
- "evaluation"
keywords: "DeepSeek R1, R1-Zero, reinforcement learning, GRPO, supervised fine-tuning, rejection sampling, reasoning models, evaluation"
location:
  name: Bradbury, CA
coordinates:
  latitude: 34.147
  longitude: -117.9709
image: /img/AI/Deep-Seek.webp
image-alt: "Illustration accompanying an explanation of DeepSeek-R1 training"
image-artist: Ted Tschopp
image-artist-URL: https://tedt.org/
image-credits: Ted Tschopp
image-credits-URL: https://tedt.org/
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image-credits-title: DeepSeek R1 Training Pipeline
image-description: "An illustration for a discussion of model training, rewards, and reasoning."
image-title: 'DeepSeek R1: Five Steps to Reasoning AI'
mastodon-post-id: '115017678056365520'
image_width: 1456
image_height: 816
---

DeepSeek's reasoning models are easier to understand if we separate two questions: what the model already learned, and what happens when we reward it for solving a problem.

The distinction matters. A model that improves through reinforcement learning has not necessarily learned everything through reinforcement learning. DeepSeek starts with an existing language model. The interesting work here is **post-training**: changing its behavior after that foundation is in place.

This explanation follows the [January 22, 2025 version of DeepSeek's R1 paper](https://arxiv.org/abs/2501.12948v1). Its five parts cover the R1-Zero experiment followed by the four stages used for R1. They are a reading guide, rather than five consecutive stages through which one model passes.

## Step 1: Understand the R1-Zero Experiment

R1-Zero applies reinforcement learning directly to DeepSeek-V3-Base, without a preliminary supervised fine-tuning stage. That is different from training a language model from scratch. The base model has already been pretrained.

Think of training a dog that already knows something about the world. A treat changes which behavior it repeats; it doesn't explain where all its earlier learning came from. This analogy helps with the idea of a reward, but it cannot tell us what a language model understands.

That distinction also keeps us from treating a convincing explanation as proof. A dog can learn to respond to the wrong cue. A model can produce an answer that satisfies a scoring rule while missing what we actually wanted. Before celebrating the reward, we need to inspect the rule.

## Step 2: Give R1 a Readable Starting Point

The final R1 pipeline begins by fine-tuning the base model on a small collection of readable reasoning examples. This is its **cold start**. R1-Zero outputs are one source of examples, alongside other collection and editing methods.

Supervised fine-tuning supplies demonstrations of a desired response. Reinforcement learning rewards attempts. Those are different kinds of instruction, and a useful training process can use both.

For an enterprise team, that raises a familiar question: can we show what good work looks like? If the examples disagree about required evidence, terminology, or the final deliverable, more examples may simply teach the disagreement. Cleaning up those expectations is useful work before any training begins.

## Step 3: Reward Reasoning on Checkable Problems

The next stage uses reasoning-oriented reinforcement learning. The algorithm is **Group Relative Policy Optimization**, or GRPO. Its reward baseline comes from a group of sampled answers, avoiding a separate critic model. The method was described in the earlier [DeepSeekMath paper, published in February 2024](https://arxiv.org/abs/2402.03300v1).

The attraction is straightforward: for some tasks, we can check the result. A calculation can be checked against its expected answer. A program can be run against tests. That gives the training process a firmer signal than whether an answer sounds persuasive.

But the check has boundaries. Passing a small test suite doesn't prove a program is useful under every condition. A correct numerical result doesn't establish that the inputs describe the right business problem. The quality of the verifier limits what the reward can teach.

This is the part of the dog-training analogy worth keeping: be precise about what earns the treat. Rewarding speed while asking for accuracy sends a different message from rewarding accurate completion.

## Step 4: Select Examples and Fine-Tune Again

DeepSeek then selects reasoning responses through rejection sampling, adds non-reasoning data, and fine-tunes DeepSeek-V3-Base again. Selection produces training examples; it is not itself another reward update.

That distinction is useful outside model training, too. Collecting outputs and declaring them successful is easy. Building a collection that can teach or test another system requires a reason for accepting each example.

Consider a proposed assistant that checks a purchase request. A reviewer should be able to explain why a response passes: it identifies the applicable policy, cites the right version, and handles a missing approval appropriately. “It looks good” is a weak acceptance rule. A polished response that uses the wrong policy should fail.

The same collection must not do every job. Keep separate examples for evaluating the result, or the team risks measuring familiarity with its training material instead of performance on new work.

## Step 5: Train for Broader Use

The last stage combines reasoning rewards with preference-based rewards for broader helpfulness and harmlessness. Producing a usable assistant requires more than improving performance on problems with a single checkable answer.

That leaves a practical tension. A user may prefer a confident, friendly response even when the evidence is incomplete. An evaluator may reward brevity when a qualification is necessary. These preferences need examination alongside the answer's correctness.

Copying model weights does not remove that tension. Nor does training a smaller model on a larger model's outputs guarantee that every capability transfers. Each resulting system still needs to be evaluated for its intended use.

## What an Enterprise Team Can Do With This

The immediate opportunity is to get better at specifying and checking work. A team does not need to begin by reproducing a frontier training run.

Choose one bounded task and build a small evaluation set. Include ordinary cases, missing information, and an answer that sounds plausible but is wrong. Define what a reviewer must check, then compare the model's result with the existing process. Record correction time as well as completion time.

Treat the paper's reported benchmarks as the researchers' results under their evaluation conditions. They can justify an experiment; they cannot establish whether a model will handle your documents, your permissions, or your exceptions.

The dog-training metaphor gets us started with rewards. The harder question is whether we are rewarding the right thing. That is where the enterprise work begins.
