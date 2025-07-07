#!/usr/bin/env python3
"""
Clean up YouTube transcript by:
1. Combining sentence fragments
2. Removing excessive filler words
3. Fixing capitalization and punctuation
4. Maintaining proper paragraph structure
5. Preserving timestamps for major sections
"""

import re
import json

def clean_transcript_entry(text):
    """Clean individual transcript text entry"""
    # Remove excessive spaces and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Fix common transcription issues
    text = text.replace(' um ', ' ')
    text = text.replace(' uh ', ' ')
    text = text.replace(' like ', ' ')
    text = text.replace(' you know ', ' ')
    text = text.replace(' I mean ', ' ')
    
    # Fix specific names and terms
    text = text.replace('andreon', 'Andrew')
    text = text.replace('wenton', 'won')
    text = text.replace('D Co', 'Diary CEO')
    text = text.replace('DAR a', 'Diary of a')
    
    return text

def combine_fragments(entries, min_sentence_length=15):
    """Combine short fragments into complete sentences"""
    combined = []
    current_text = ""
    current_start = None
    
    for entry in entries:
        text = clean_transcript_entry(entry['text'])
        
        if current_start is None:
            current_start = entry['start']
        
        current_text += " " + text
        
        # Check if we have a complete thought (ends with punctuation or is long enough)
        if (len(current_text.strip()) >= min_sentence_length and 
            (current_text.strip().endswith('.') or 
             current_text.strip().endswith('?') or 
             current_text.strip().endswith('!') or
             len(current_text.strip()) >= 100)):
            
            combined.append({
                'start': current_start,
                'text': current_text.strip()
            })
            current_text = ""
            current_start = None
    
    # Add any remaining text
    if current_text.strip() and current_start is not None:
        combined.append({
            'start': current_start,
            'text': current_text.strip()
        })
    
    return combined

def format_timestamp(seconds):
    """Convert seconds to MM:SS format"""
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02d}:{seconds:02d}"

def create_cleaned_transcript():
    """Create a cleaned transcript"""
    
    # Load the raw transcript
    with open('youtube_transcript.json', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    # Extract transcript entries from the new format
    transcript_data = raw_data.get('transcript', [])
    video_url = raw_data.get('video_url', '')
    video_id = raw_data.get('video_id', '')
    
    # Clean and combine entries
    cleaned_entries = combine_fragments(transcript_data)
    
    # Create markdown content
    markdown_content = f"""# AI and Chip Industry Discussion - Dylan Patel Interview

**Guest:** Dylan Patel (AI and Chip Industry Expert)
**Host:** [Host Name]
**Video URL:** {video_url}
**Video ID:** {video_id}
**Transcript extracted and cleaned on:** 2025-07-05

---

## Executive Summary

This interview features Dylan Patel, a leading expert in AI and the chip industry who provides insights into the current state and future of artificial intelligence, semiconductor technology, and the competitive landscape between major AI companies.

---

## Main Conversation

"""
    
    # Process entries in chunks to create natural paragraphs
    for i, entry in enumerate(cleaned_entries):
        timestamp = format_timestamp(entry['start'])
        text = entry['text']
        
        # Capitalize first letter and ensure proper sentence structure
        if text:
            text = text[0].upper() + text[1:] if len(text) > 1 else text.upper()
            
            # Add period if missing
            if not text.endswith(('.', '?', '!')):
                text += '.'
        
        # Add timestamp every 5 minutes or so (300 seconds)
        if i == 0 or entry['start'] % 300 < 30:
            markdown_content += f"\n**[{timestamp}]** {text}\n\n"
        else:
            markdown_content += f"{text} "
            
            # Add paragraph break occasionally for readability
            if i % 3 == 0:
                markdown_content += "\n\n"
    
    # Write cleaned transcript
    with open('youtube_transcript_cleaned.md', 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print(f"Cleaned transcript created with {len(cleaned_entries)} entries")
    print("Saved as: youtube_transcript_cleaned.md")

if __name__ == "__main__":
    create_cleaned_transcript()
