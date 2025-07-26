#!/bin/bash

# Jekyll Include Usage Analysis Script
# This script analyzes all include usage across the Jekyll site

echo "# Jekyll Include Usage Analysis"
echo "Generated on: $(date)"
echo ""

# Create output file
OUTPUT_FILE="include-usage-analysis.md"

cat > "$OUTPUT_FILE" << 'EOF'
# Jekyll Include Usage Analysis

This document provides a comprehensive analysis of how includes are used throughout the Jekyll site.

## Summary Statistics

EOF

echo "Analyzing include usage..."

# Function to analyze includes in a directory
analyze_includes() {
    local dir="$1"
    local description="$2"
    
    echo "" >> "$OUTPUT_FILE"
    echo "### $description" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    if [ -d "$dir" ]; then
        find "$dir" -name "*.html" -o -name "*.md" | while read file; do
            if grep -q "{% include" "$file" 2>/dev/null; then
                echo "**$file:**" >> "$OUTPUT_FILE"
                grep "{% include" "$file" | sed 's/^/- /' >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
            fi
        done
    else
        echo "Directory not found: $dir" >> "$OUTPUT_FILE"
    fi
}

# Analyze different sections
analyze_includes "_layouts" "Layout Files"
analyze_includes "_posts" "Blog Posts"
analyze_includes "." "Root Files (index.html, etc.)"

# Count usage of each include file
echo "" >> "$OUTPUT_FILE"
echo "## Individual Include Usage Statistics" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Get all include files
find "_includes" -name "*.html" -o -name "*.xml" | sort | while read include_file; do
    # Extract just the path part after _includes/
    include_path=${include_file#_includes/}
    
    # Count how many times this include is used
    count=$(grep -r "{% include $include_path" _layouts/ _posts/ . --include="*.html" --include="*.md" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$count" -gt 0 ]; then
        echo "### $include_path" >> "$OUTPUT_FILE"
        echo "**Usage count:** $count" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "**Used in:**" >> "$OUTPUT_FILE"
        grep -r "{% include $include_path" _layouts/ _posts/ . --include="*.html" --include="*.md" 2>/dev/null | cut -d: -f1 | sort | uniq | while read file; do
            echo "- $file" >> "$OUTPUT_FILE"
        done
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Create directory usage summary
echo "" >> "$OUTPUT_FILE"
echo "## Directory Usage Summary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for dir in analytics assets content feeds gaming layout personal pwa seo social themes utility; do
    if [ -d "_includes/$dir" ]; then
        total_files=$(find "_includes/$dir" -name "*.html" -o -name "*.xml" | wc -l | tr -d ' ')
        used_files=0
        total_usage=0
        
        find "_includes/$dir" -name "*.html" -o -name "*.xml" | while read include_file; do
            include_path=${include_file#_includes/}
            count=$(grep -r "{% include $include_path" _layouts/ _posts/ . --include="*.html" --include="*.md" 2>/dev/null | wc -l | tr -d ' ')
            if [ "$count" -gt 0 ]; then
                used_files=$((used_files + 1))
                total_usage=$((total_usage + count))
            fi
        done
        
        echo "### $dir/" >> "$OUTPUT_FILE"
        echo "- **Total files:** $total_files" >> "$OUTPUT_FILE"
        echo "- **Files in use:** $used_files" >> "$OUTPUT_FILE"
        echo "- **Total usage count:** $total_usage" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

echo "Analysis complete! Results saved to $OUTPUT_FILE"
