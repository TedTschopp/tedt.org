---
layout: post
title: "Euclid's Algorithm in Ada"
title-url: null
subtitle: "A small CS 140 assignment, a durable algorithm, and a reminder that simple programs still teach real structure"
subtitle-url: null
quote: "The point of the assignment was not just to calculate a greatest common divisor. It was to learn how a program holds together."
excerpt: "A cleaned-up Ada version of an old CS 140 greatest common divisor assignment, with a short reflection on what Euclid's algorithm teaches about structure, scope, and clarity."
source: Original Content
source-url: ''
call-to-action: null
date: 2026-05-11 00:00:00-08:00
update: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
bullets:
  - Euclid's algorithm remains one of the cleanest examples of iterative problem solving.
  - Ada forces useful explicitness around structure, scope, and input handling.
  - Small assignments can still carry the shape of larger software discipline.
description: "A short reflection on an old Ada assignment that calculates the greatest common divisor using Euclid's algorithm."
seo-description: "Explore a cleaned-up Ada implementation of Euclid's greatest common divisor algorithm and what it teaches about programming fundamentals."
categories:
  - Computers
  - Personal Writing
tags: Ada, programming, computer science, algorithms, Euclid, GCD
keywords: Ada, Euclid's algorithm, greatest common divisor, GCD, programming fundamentals, computer science, CS 140
location:
  name: Bradbury, CA
coordinates:
  latitude: 34.147
  longitude: -117.9709

image: /img/2026-05/Euclids-algorithm.webp
image-alt: "Euclid's algorithm visualized as a series of rectangles representing the division process, with the greatest common divisor highlighted."
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-description: "A visualization of Euclid's algorithm, showing the iterative process of finding the greatest common divisor through a series of divisions."
image-title: "Euclid's Algorithm Visualization"
image_width: 1672 
image_height: 941

mastodon-post-id: null
---
_**Bottom Line Up Front:** This is a cleaned-up version of an old CS 140 assignment: compute the greatest common divisor of two positive integers using Euclid's algorithm. It is small code, but it still teaches the fundamentals that matter: name the work clearly, isolate the algorithm, validate input, control scope, and make the program's behavior visible._

Some programs are interesting because they are large. This one is interesting because it is small, and because I got a 70% on it.  Can you spot the problems? Can you see how to make it better?

The original assignment was due October 1, 1989. The task was straightforward: prompt for two positive integers, run Euclid's algorithm, and print the greatest common divisor. That is the kind of classroom problem that looks almost too simple until you notice what it is really teaching.

It teaches decomposition. The input and output belong in the main procedure. The mathematical work belongs in a function. The temporary state belongs inside the smallest possible scope. The validation belongs before the loop starts.

That is the shape of software discipline in miniature.

## The Ada Program

Here is the cleaned-up version of the program.

```ada
------------------------------------------------------------------------------------------------------------------------------
-- CS 140 - Introduction to Computer Science
-- Assignment 1
-- Student Name: Ted Tschopp
-- Professor: Doctor Bell
-- Due Date: October 1st, 1989
-- Description: This program computes the greatest common divisor (GCD) of two positive integers using Euclid's algorithm.
--    The program prompts the user for two positive integers and then calculates and displays their GCD.
--    The GCD is calculated using a loop that continues until the second number becomes zero.
--    The program ensures that both inputs are positive integers and raises an error if they are not.
--    The GCD is returned as an integer value.
--    The program uses Ada's text I/O package for input and output operations.
--    The program is structured with a main procedure that contains the GCD function and handles user input and output.
--    The program is designed to be simple and efficient, demonstrating the use of loops and functions in Ada.
--    The program is written in Ada programming language and follows its syntax and conventions.
--    The program is intended for educational purposes and serves as an example of how to implement a basic algorithm in Ada.
--    The program is not intended for production use and may require additional error handling and validation for real-world applications.
--    The program is a simple implementation of the GCD algorithm and does not include advanced features or optimizations.
------------------------------------------------------------------------------------------------------------------------------

with Ada.Text_IO; use Ada.Text_IO;                                         -- Import Ada text I/O functionality

------------------------------------------------------------------------------------------------------------------------------
procedure Main is

   ------------------------------------------------------------------------------------------------------------------------------
   -- Function to compute GCD of two positive integers 
   -- using Euclid's algorithm
   ------------------------------------------------------------------------------------------------------------------------------
   function GCD(A, B: Integer) return Integer is                           -- Function signature
      X : Integer := A;                                                    -- Copy of first input
      Y : Integer := B;                                                    -- Copy of second input
   begin                                                                   -- Function body
      if X <= 0 or Y <= 0 then                                             -- Ensure both numbers are positive
         raise Constraint_Error with "Inputs must be positive integers.";  -- Raise an error if not
      end if;
      while Y /= 0 loop                                                    -- Repeat until remainder is zero
         declare                                                           --   declair a block to limit scope         
            Temp : Integer := Y;                                           --     Temporary variable to hold Y
         begin                                                             --   Begin block to limit scope
            Y := X mod Y;                                                  --     Set Y to remainder of X divided by Y
            X := Temp;                                                     --     Set X to prevous value of Y
         end;                                                              --   End block
      end loop;                                                            -- End loop when Y is zero
      return X;                                                            -- Return the greatest common divisor
   end GCD;                                                                
   ------------------------------------------------------------------------------------------------------------------------------

   A, B : Integer;                                                         -- Declare variables for user input

   ------------------------------------------------------------------------------------------------------------------------------
begin                                                                      
   Put("Enter first number: ");                                            -- Requst user for first input
   Get(A);                                                                 -- Read first number
   Put("Enter second number: ");                                           -- Prompt user for second input
   Get(B);                                                                 -- Read second number
   Put_Line("GCD is: " & Integer'Image(GCD(A, B)));                        -- Display result with formatting

end Main;
```

## What The Algorithm Does

Euclid's algorithm rests on a simple fact:

If two numbers share a greatest common divisor, that same divisor also divides the remainder after one number is divided by the other.

So instead of trying to factor both numbers, the program keeps replacing the pair:

```text
(A, B) becomes (B, A mod B)
```

The loop stops when the second number becomes zero. At that point, the first number is the greatest common divisor.

For example:

```text
GCD(48, 18)
48 mod 18 = 12
18 mod 12 = 6
12 mod 6  = 0

GCD = 6
```

It is elegant because it reduces the problem without losing the answer. Each step makes the numbers smaller. Each step preserves the truth of the result. That is good algorithm design.

## What Ada Makes Visible

Ada is not a casual language. It wants structure to be visible.

That can feel heavy when the program is tiny, but the pressure is useful. The program has to say what it imports. It has to say what the procedure is. It has to say what the function returns. It has to say where the temporary variable lives.

That explicitness is the lesson.

The `declare` block around `Temp` is a small example. The temporary value is only needed during one loop iteration, so the program gives it only that much life. That is a habit worth keeping. Scope is not just syntax. Scope is a statement about responsibility.

## The Real Lesson

This is not production code. It is a teaching artifact.

But the fundamentals hold up:

- Put the algorithm behind a clear function boundary.
- Validate assumptions before doing the work.
- Keep temporary state local.
- Make the loop condition easy to reason about.
- Let the code express the shape of the problem.

That is why assignments like this still matter. They are not really about calculating the greatest common divisor. They are about learning how to make a machine do one small thing clearly.

And clarity scales.

> Did you spot the problems in the original code? Did you see how to make it better? If so, you are already on the right track. If not, that is okay too.  I didn't see them at first either. The point was to learn how to be a good programmer and a good team player.  The problems were that the code had 3 spelling errors in the comments.  The code was mostly correct, but the comments were not.  The comments are important because they explain what the code is doing and why.  If the comments don't exist or they create a cognitive load on someone else, they are not very valuable because it can lead to confusion and mistakes.  That is why I got a 70% on the assignment.  I had the right function, but I didn't pay enough attention to the details in the comments.  That is a lesson that still matters today: details matter, especially when communicating with others.
