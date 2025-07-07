#!/usr/bin/env python3
"""
Extract transcript from YouTube video using youtube-transcript-api
Supports both manual and auto-generated captions
"""

import json
import re
import sys
from urllib.parse import urlparse, parse_qs

def extract_video_id(url):
    """Extract video ID from various YouTube URL formats"""
    # Handle different YouTube URL formats
    if 'youtu.be/' in url:
        return url.split('youtu.be/')[-1].split('?')[0].split('&')[0]
    elif 'youtube.com/watch' in url:
        parsed_url = urlparse(url)
        return parse_qs(parsed_url.query)['v'][0]
    elif 'youtube.com/embed/' in url:
        return url.split('youtube.com/embed/')[-1].split('?')[0]
    else:
        # Assume it's just a video ID
        return url

def get_transcript(video_url, language='en'):
    """
    Extract transcript from YouTube video
    
    Args:
        video_url (str): YouTube video URL or video ID
        language (str): Language code for transcript (default: 'en')
    
    Returns:
        list: Transcript entries with start time, duration, and text
    """
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        print("Error: youtube-transcript-api not installed.")
        print("Install with: pip install youtube-transcript-api")
        return None
    
    video_id = extract_video_id(video_url)
    print(f"Extracting transcript for video ID: {video_id}")
    
    try:
        # Try to get transcript in specified language
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        # First try manual captions
        try:
            transcript = transcript_list.find_manually_created_transcript([language])
            print(f"Found manually created transcript in {language}")
        except:
            # Fall back to auto-generated captions
            try:
                transcript = transcript_list.find_generated_transcript([language])
                print(f"Found auto-generated transcript in {language}")
            except:
                # Try any available transcript
                available_transcripts = list(transcript_list)
                if available_transcripts:
                    transcript = available_transcripts[0]
                    print(f"Using available transcript: {transcript.language}")
                else:
                    print("No transcripts available for this video")
                    return None
        
        # Fetch the transcript
        transcript_data = transcript.fetch()
        print(f"Successfully fetched {len(transcript_data)} transcript entries")
        
        # Clean up the transcript entries
        cleaned_transcript = []
        for entry in transcript_data:
            # Clean up text - transcript entries have .text, .start, .duration attributes
            text = str(entry.text)
            # Remove newlines and excessive whitespace
            text = re.sub(r'\s+', ' ', text.strip())
            # Remove music notations like [Music]
            text = re.sub(r'\[.*?\]', '', text)
            # Remove empty entries
            if text:
                cleaned_transcript.append({
                    'start': float(entry.start),
                    'duration': float(entry.duration),
                    'text': text
                })
        
        return cleaned_transcript
        
    except Exception as e:
        print(f"Error extracting transcript: {e}")
        return None

def save_transcript(transcript_data, video_url, output_file='youtube_transcript.json'):
    """Save transcript data to JSON file"""
    if not transcript_data:
        print("No transcript data to save")
        return False
    
    # Add metadata
    video_id = extract_video_id(video_url)
    output_data = {
        'video_id': video_id,
        'video_url': video_url,
        'transcript_count': len(transcript_data),
        'transcript': transcript_data
    }
    
    # Save to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Transcript saved to {output_file}")
    print(f"Total entries: {len(transcript_data)}")
    
    # Calculate total duration
    if transcript_data:
        total_duration = transcript_data[-1]['start'] + transcript_data[-1]['duration']
        minutes = int(total_duration // 60)
        seconds = int(total_duration % 60)
        print(f"Video duration: {minutes:02d}:{seconds:02d}")
    
    return True

def extract_and_save_transcript(video_url, output_file='youtube_transcript.json', language='en'):
    """Extract transcript from YouTube and save to file"""
    print(f"Extracting transcript from: {video_url}")
    
    # Extract transcript
    transcript_data = get_transcript(video_url, language)
    
    if transcript_data:
        # Save to file
        success = save_transcript(transcript_data, video_url, output_file)
        if success:
            print("\nNext steps:")
            print("1. Review the extracted transcript in the JSON file")
            print("2. Run clean_transcript.py to create a cleaned markdown version")
            print("3. Further edit the markdown file as needed")
        return transcript_data
    else:
        print("Failed to extract transcript")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        video_url = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else 'youtube_transcript.json'
        language = sys.argv[3] if len(sys.argv) > 3 else 'en'
    else:
        video_url = input("Enter YouTube video URL: ").strip()
        output_file = input("Output filename (default: youtube_transcript.json): ").strip() or 'youtube_transcript.json'
        language = input("Language code (default: en): ").strip() or 'en'
    
    extract_and_save_transcript(video_url, output_file, language)
