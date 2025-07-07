#!/usr/bin/env python3
"""
Advanced transcript cleaning with better sentence structure and paragraph organization
"""

import re
import json

def clean_and_structure_transcript():
    """Create a highly polished transcript with proper structure"""
    
    # Load the raw transcript
    with open('youtube_transcript.json', 'r', encoding='utf-8') as f:
        transcript_data = json.load(f)
    
    # Combine all text with timestamps
    full_text = ""
    major_timestamps = []
    
    for i, entry in enumerate(transcript_data):
        text = entry['text'].strip()
        
        # Clean common transcription errors
        text = re.sub(r'\bum\b|\buh\b|\ber\b', '', text)
        text = re.sub(r'\byou know\b', '', text)
        text = re.sub(r'\bI mean\b', '', text)
        text = re.sub(r'\blike\b(?!\s+[A-Z])', '', text)  # Keep "like" before proper nouns
        text = text.replace('andreon', 'Andrew')
        text = text.replace('wenton', 'won')
        text = text.replace('D Co', 'Diary CEO')
        text = text.replace('DAR a', 'Diary of a')
        text = text.replace('ctim', 'centimillionaire')
        
        # Add to major timestamps every 5 minutes
        if i == 0 or entry['start'] % 300 < 30:
            minutes = int(entry['start'] // 60)
            seconds = int(entry['start'] % 60)
            timestamp = f"{minutes:02d}:{seconds:02d}"
            major_timestamps.append((len(full_text), timestamp))
        
        full_text += " " + text
    
    # Clean up the full text
    full_text = re.sub(r'\s+', ' ', full_text).strip()
    
    # Split into logical sections based on content
    sections = [
        {
            "title": "Opening & Introduction",
            "start_marker": "the majority of people",
            "end_marker": "what is it you're doing in this season"
        },
        {
            "title": "Personal Reflections on Loss & Mortality", 
            "start_marker": "what is it you're doing in this season",
            "end_marker": "what is everyday spy"
        },
        {
            "title": "Understanding Everyday Spy & The Mission",
            "start_marker": "what is everyday spy",
            "end_marker": "shattered the glass"
        },
        {
            "title": "The Shed Metaphor - Breaking Free from Conditioning",
            "start_marker": "can you tell me what your perspective",
            "end_marker": "how to see the world"
        },
        {
            "title": "CIA Training & Seeing Through Systems",
            "start_marker": "when I was growing up",
            "end_marker": "step outside of the system"
        }
    ]
    
    # Create the polished markdown
    markdown_content = """# The Diary of a CEO: Former CIA Officer on Breaking Mental Barriers

**Guest:** Andrew Bustamante (Former CIA Officer, Founder of Everyday Spy)  
**Host:** Steven Bartlett  
**Original Video:** [Watch on YouTube](https://www.youtube.com/watch?v=P_A8XElrAqA)  
**Transcript Status:** Cleaned & Formatted  
**Date:** July 3, 2025

---

## Summary

In this profound conversation, former CIA officer Andrew Bustamante reveals how most people live trapped in mental constructs - "sheds" - that limit their potential. Drawing from CIA training methods, he explains how to break free from societal conditioning, build genuine influence, and see the world as it really is rather than through the lens others have built for us.

Key topics covered:
- The "shed" metaphor for societal conditioning
- CIA frameworks for influence and persuasion (RICE method)
- Perspective vs. perception in human relationships
- The four C's of building professional influence
- Leadership principles from intelligence work
- Breaking free from limiting belief systems

---

## Key Quotes

> "The majority of people are still seeing the world through a lens that was built for them. They want more but just don't know how to do it. What I teach, which is what the CIA teaches, is how to see the world the way it really is."

> "All you have to do to step outside of the system is stop believing in it, or believe in a different system."

> "You can't be a leader without having the courage to hurt 80% of the people that you talk to."

---

"""
    
    # Process the text into readable paragraphs
    sentences = re.split(r'(?<=[.!?])\s+', full_text)
    current_paragraph = ""
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
            
        # Capitalize first letter
        sentence = sentence[0].upper() + sentence[1:] if len(sentence) > 1 else sentence.upper()
        
        # Add to current paragraph
        current_paragraph += sentence + " "
        
        # Create paragraph breaks at natural points
        if (len(current_paragraph) > 400 or 
            any(marker in sentence.lower() for marker in [
                "that's what", "so then", "but what", "the reality is", 
                "what happens is", "here's the thing", "let me", "so if you"
            ])):
            markdown_content += current_paragraph.strip() + "\n\n"
            current_paragraph = ""
    
    # Add any remaining content
    if current_paragraph.strip():
        markdown_content += current_paragraph.strip() + "\n\n"
    
    # Add footer
    markdown_content += """---

## About the Speakers

**Andrew Bustamante** is a former CIA intelligence officer who worked as a covert operative for seven years. He now runs Everyday Spy, teaching intelligence skills to entrepreneurs and business leaders. He's also the author of the upcoming book "Red Cell" about his operational history.

**Steven Bartlett** is the founder and former CEO of Social Chain, host of The Diary of a CEO podcast, and author of "Happy Sexy Millionaire" and "The 33 Laws of Business & Life."

---

*This transcript has been edited for clarity and readability while preserving the original meaning and conversational tone.*
"""
    
    # Write the final polished transcript
    with open('youtube_transcript_final.md', 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print("Final polished transcript created!")
    print("Saved as: youtube_transcript_final.md")
    print(f"Word count: approximately {len(markdown_content.split())}")

if __name__ == "__main__":
    clean_and_structure_transcript()
