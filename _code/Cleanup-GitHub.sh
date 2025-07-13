#!/bin/bash

echo "🎨 Professional GitHub Label Color Scheme Implementation (macOS)"
echo "=============================================================="

# GitHub CLI path for macOS Homebrew installation
GH_CLI="/opt/homebrew/bin/gh"

# Check if GitHub CLI is available and authenticated
if ! command -v "$GH_CLI" &> /dev/null; then
    echo "❌ GitHub CLI not found at $GH_CLI"
    echo "Please install it with: brew install gh"
    exit 1
fi

echo "✅ Using GitHub CLI at: $GH_CLI"

# Check if authenticated
if ! "$GH_CLI" auth status &> /dev/null; then
    echo "❌ GitHub CLI not authenticated"
    echo "Please run: $GH_CLI auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Function to URL encode label names
url_encode() {
    local string="${1}"
    local strlen=${#string}
    local encoded=""
    local pos c o

    for (( pos=0 ; pos<strlen ; pos++ )); do
        c=${string:$pos:1}
        case "$c" in
            [-_.~a-zA-Z0-9] ) o="${c}" ;;
            * ) printf -v o '%%%02x' "'$c" ;;
        esac
        encoded+="${o}"
    done
    echo "${encoded}"
}

# Function to create label if it doesn't exist
create_label_if_missing() {
    local label_name="$1"
    local color="$2"
    local description="$3"
    local encoded_name=$(url_encode "$label_name")
    
    echo "Checking label: $label_name"
    local check_result
    check_result=$("$GH_CLI" api repos/TedTschopp/tedt.org/labels/"$encoded_name" 2>&1)
    local check_status=$?
    
    if [ $check_status -eq 0 ]; then
        echo "✅ Label '$label_name' exists"
    else
        echo "🆕 Creating label '$label_name'"
        local create_result
        create_result=$("$GH_CLI" api repos/TedTschopp/tedt.org/labels \
            --method POST \
            --field "name=$label_name" \
            --field "color=$color" \
            --field "description=$description" 2>&1)
        local create_status=$?
        
        if [ $create_status -eq 0 ]; then
            echo "✅ Created: $label_name"
        else
            echo "❌ Failed to create: $label_name"
            echo "   Error: $create_result"
        fi
    fi
}

echo ""
echo "🏗️  PHASE 1: Creating Missing Labels"
echo "===================================="

echo ""
echo "📍 Creating Priority Labels..."
create_label_if_missing "critical" "b60205" "Urgent issues requiring immediate attention"
create_label_if_missing "high-priority" "d93f0b" "High priority issues"
create_label_if_missing "high" "d93f0b" "High priority issues"
create_label_if_missing "medium-high" "f39c12" "Medium-high priority issues"
create_label_if_missing "medium-priority" "fbca04" "Medium priority issues"
create_label_if_missing "medium" "fbca04" "Medium priority issues"
create_label_if_missing "low-priority" "0e8a16" "Low priority issues"
create_label_if_missing "low" "0e8a16" "Low priority issues"

echo ""
echo "🔧 Creating Technical Area Labels..."
create_label_if_missing "performance" "0052cc" "Performance optimization and improvements"
create_label_if_missing "accessibility" "1f77b4" "Accessibility improvements and compliance"
create_label_if_missing "a11y" "1f77b4" "Accessibility improvements and compliance"
create_label_if_missing "wcag" "2980b9" "WCAG compliance and standards"
create_label_if_missing "security" "1d76db" "Security-related issues and improvements"
create_label_if_missing "xss" "e74c3c" "XSS security vulnerabilities"
create_label_if_missing "csp" "c0392b" "Content Security Policy issues"
create_label_if_missing "compliance" "54aeff" "Compliance and standards adherence"
create_label_if_missing "SEO" "0366d6" "Search engine optimization"
create_label_if_missing "optimization" "3498db" "General optimization improvements"

echo ""
echo "🚀 Creating Work Type Labels..."
create_label_if_missing "enhancement" "28a745" "New features and enhancements"
create_label_if_missing "feature" "2ea043" "New feature implementation"
create_label_if_missing "development" "23a636" "Development and implementation work"
create_label_if_missing "automation" "196f3d" "Automation and workflow improvements"
create_label_if_missing "testing" "27ae60" "Testing and quality assurance"
create_label_if_missing "monitoring" "229a54" "Monitoring and observability"
create_label_if_missing "documentation" "138b3e" "Documentation improvements"

echo ""
echo "🐛 Creating Issue Type Labels..."
create_label_if_missing "bug" "ee0701" "Something isn't working correctly"
create_label_if_missing "refactoring" "ff6600" "Code refactoring and cleanup"
create_label_if_missing "code-quality" "ff8800" "Code quality improvements"
create_label_if_missing "code-organization" "ffaa00" "Code organization and structure"
create_label_if_missing "maintainability" "fd7e14" "Code maintainability improvements"
create_label_if_missing "dependencies" "f39c12" "Dependency management and updates"

echo ""
echo "🏷️ Creating GitHub Standard Labels..."
create_label_if_missing "duplicate" "cfd3d7" "This issue or pull request already exists"
create_label_if_missing "help wanted" "00a672" "Extra attention is needed"
create_label_if_missing "invalid" "e4e669" "This doesn't seem right"
create_label_if_missing "question" "d876e3" "Further information is requested"
create_label_if_missing "wontfix" "ffffff" "This will not be worked on"

echo ""
echo "💻 Creating Technology Stack Labels..."
create_label_if_missing "html" "7b68ee" "HTML markup and structure"
create_label_if_missing "css" "9370db" "CSS styling and layout"
create_label_if_missing "javascript" "8a2be2" "JavaScript functionality"
create_label_if_missing "liquid" "9932cc" "Liquid templating language"
create_label_if_missing "jekyll" "ba55d3" "Jekyll static site generator"
create_label_if_missing "bootstrap" "6a5acd" "Bootstrap framework"
create_label_if_missing "jquery" "483d8b" "jQuery library"

echo ""
echo "📝 Creating Content & UX Labels..."
create_label_if_missing "content" "00a0a0" "Content creation and management"
create_label_if_missing "user-interface" "20b2aa" "User interface improvements"
create_label_if_missing "user-experience" "48d1cc" "User experience enhancements"
create_label_if_missing "ui-ux" "66cccc" "User interface and experience"
create_label_if_missing "typography" "40e0d0" "Typography and font-related issues"
create_label_if_missing "font" "7fdbda" "Font loading and display issues"
create_label_if_missing "fonts" "b2dfdb" "Font management and optimization"
create_label_if_missing "images" "00ced1" "Image handling and optimization"
create_label_if_missing "image-optimization" "26a69a" "Image compression and optimization"
create_label_if_missing "lazy-loading" "4db6ac" "Lazy loading implementation"
create_label_if_missing "carousel" "80cbc4" "Carousel and slider components"

echo ""
echo "🔧 Creating DevOps & Infrastructure Labels..."
create_label_if_missing "ci-cd" "6c757d" "Continuous integration and deployment"
create_label_if_missing "build-process" "868e96" "Build process and tooling"
create_label_if_missing "configuration" "4a5057" "Configuration and settings"
create_label_if_missing "deployment" "5a6268" "Deployment and hosting"

echo ""
echo "📱 Creating Platform & Special Labels..."
create_label_if_missing "mobile" "e91e63" "Mobile-specific issues and features"
create_label_if_missing "pwa" "f06292" "Progressive Web App functionality"
create_label_if_missing "analytics" "ffc107" "Analytics and tracking"
create_label_if_missing "tracking" "ffca28" "User tracking and behavior analysis"
create_label_if_missing "privacy" "ff9800" "Privacy and data protection"
create_label_if_missing "legal" "8b4513" "Legal compliance and licensing"

echo ""
echo "🎯 Creating Metadata & System Labels..."
create_label_if_missing "meta-data" "8d6e63" "Metadata and structured data"
create_label_if_missing "structured-data" "a1887f" "Structured data and schema markup"
create_label_if_missing "schema" "bcaaa4" "Schema.org markup and validation"
create_label_if_missing "rich-snippets" "d7ccc8" "Rich snippets and search result enhancements"
create_label_if_missing "social-media" "a1887f" "Social media integration"
create_label_if_missing "navigation" "bcaaa4" "Site navigation and menus"
create_label_if_missing "footer" "d7ccc8" "Footer-related issues"
create_label_if_missing "headers" "8d6e63" "Header and navigation issues"
create_label_if_missing "includes" "a1887f" "Jekyll includes and partials"
create_label_if_missing "GitHub_copilot_found" "f5f5f5" "Issues found by GitHub Copilot"

echo ""
echo "📊 Creating Content Management Labels..."
create_label_if_missing "feeds" "16a085" "RSS and Atom feed management"
create_label_if_missing "rss" "27ae60" "RSS feed functionality"
create_label_if_missing "categories" "2ecc71" "Category organization and management"
create_label_if_missing "search" "58d68d" "Search functionality and indexing"
create_label_if_missing "content-discovery" "85c1e9" "Content discovery and navigation"
create_label_if_missing "site-functionality" "bb8fce" "Core site functionality"
create_label_if_missing "data-management" "d2b4de" "Data management and processing"
create_label_if_missing "structure" "f8c471" "Site structure and organization"
create_label_if_missing "webmentions" "f7dc6f" "Webmention functionality"

echo ""
echo "🔍 Creating Development & Quality Labels..."
create_label_if_missing "automated-scan" "85929e" "Automated security or quality scans"
create_label_if_missing "third-party" "a569bd" "Third-party integrations and services"
create_label_if_missing "DRY" "6c5ce7" "Don't Repeat Yourself - code deduplication"

echo ""
echo "✅ PHASE 1 COMPLETE: All labels created/verified"
echo ""
echo "🎨 PHASE 2: Updating Label Colors and Descriptions"
echo "================================================="

# Function to update existing labels with new colors and descriptions
update_label() {
    local label_name="$1"
    local color="$2"
    local description="$3"
    local encoded_name=$(url_encode "$label_name")
    
    echo "Updating label: $label_name"
    local update_result
    update_result=$("$GH_CLI" api repos/TedTschopp/tedt.org/labels/"$encoded_name" \
        --method PATCH \
        --field "color=$color" \
        --field "description=$description" 2>&1)
    local update_status=$?
    
    if [ $update_status -eq 0 ]; then
        echo "✅ Updated: $label_name"
    else
        echo "❌ Failed to update: $label_name"
        echo "   Error: $update_result"
    fi
}

echo ""
echo "📍 Updating Priority Labels (Red Family)..."

update_label "critical" "b60205" "Urgent issues requiring immediate attention"
update_label "high-priority" "d93f0b" "High priority issues"
update_label "high" "d93f0b" "High priority issues"
update_label "medium-high" "f39c12" "Medium-high priority issues"
update_label "medium-priority" "fbca04" "Medium priority issues"
update_label "medium" "fbca04" "Medium priority issues"
update_label "low-priority" "0e8a16" "Low priority issues"
update_label "low" "0e8a16" "Low priority issues"

echo ""
echo "🔧 Updating Technical Area Labels (Blue Family)..."

update_label "performance" "0052cc" "Performance optimization and improvements"
update_label "accessibility" "1f77b4" "Accessibility improvements and compliance"
update_label "a11y" "1f77b4" "Accessibility improvements and compliance"
update_label "wcag" "2980b9" "WCAG compliance and standards"
update_label "security" "1d76db" "Security-related issues and improvements"
update_label "xss" "e74c3c" "XSS security vulnerabilities"
update_label "csp" "c0392b" "Content Security Policy issues"
update_label "compliance" "54aeff" "Compliance and standards adherence"
update_label "SEO" "0366d6" "Search engine optimization"
update_label "optimization" "3498db" "General optimization improvements"

echo ""
echo "🚀 Updating Work Type Labels (Green Family)..."

update_label "enhancement" "28a745" "New features and enhancements"
update_label "feature" "2ea043" "New feature implementation"
update_label "development" "23a636" "Development and implementation work"
update_label "automation" "196f3d" "Automation and workflow improvements"
update_label "testing" "27ae60" "Testing and quality assurance"
update_label "monitoring" "229a54" "Monitoring and observability"
update_label "documentation" "138b3e" "Documentation improvements"

echo ""
echo "🐛 Updating Issue Type Labels (Orange Family)..."

update_label "bug" "ee0701" "Something isn't working correctly"
update_label "refactoring" "ff6600" "Code refactoring and cleanup"
update_label "code-quality" "ff8800" "Code quality improvements"
update_label "code-organization" "ffaa00" "Code organization and structure"
update_label "maintainability" "fd7e14" "Code maintainability improvements"
update_label "dependencies" "f39c12" "Dependency management and updates"

echo ""
echo "🏷️ Updating GitHub Standard Labels (Neutral Family)..."

update_label "duplicate" "cfd3d7" "This issue or pull request already exists"
update_label "help wanted" "00a672" "Extra attention is needed"
update_label "invalid" "e4e669" "This doesn't seem right"
update_label "question" "d876e3" "Further information is requested"
update_label "wontfix" "ffffff" "This will not be worked on"

echo ""
echo "💻 Updating Technology Stack Labels (Purple Family)..."

update_label "html" "7b68ee" "HTML markup and structure"
update_label "css" "9370db" "CSS styling and layout"
update_label "javascript" "8a2be2" "JavaScript functionality"
update_label "liquid" "9932cc" "Liquid templating language"
update_label "jekyll" "ba55d3" "Jekyll static site generator"
update_label "bootstrap" "6a5acd" "Bootstrap framework"
update_label "jquery" "483d8b" "jQuery library"

echo ""
echo "📝 Updating Content & UX Labels (Teal Family)..."

update_label "content" "00a0a0" "Content creation and management"
update_label "user-interface" "20b2aa" "User interface improvements"
update_label "user-experience" "48d1cc" "User experience enhancements"
update_label "ui-ux" "66cccc" "User interface and experience"
update_label "typography" "40e0d0" "Typography and font-related issues"
update_label "font" "7fdbda" "Font loading and display issues"
update_label "fonts" "b2dfdb" "Font management and optimization"
update_label "images" "00ced1" "Image handling and optimization"
update_label "image-optimization" "26a69a" "Image compression and optimization"
update_label "lazy-loading" "4db6ac" "Lazy loading implementation"
update_label "carousel" "80cbc4" "Carousel and slider components"

echo ""
echo "🔧 Updating DevOps & Infrastructure Labels (Gray Family)..."

update_label "ci-cd" "6c757d" "Continuous integration and deployment"
update_label "build-process" "868e96" "Build process and tooling"
update_label "configuration" "4a5057" "Configuration and settings"
update_label "deployment" "5a6268" "Deployment and hosting"

echo ""
echo "📱 Updating Platform & Special Labels (Pink/Yellow Family)..."

update_label "mobile" "e91e63" "Mobile-specific issues and features"
update_label "pwa" "f06292" "Progressive Web App functionality"
update_label "analytics" "ffc107" "Analytics and tracking"
update_label "tracking" "ffca28" "User tracking and behavior analysis"
update_label "privacy" "ff9800" "Privacy and data protection"
update_label "legal" "8b4513" "Legal compliance and licensing"

echo ""
echo "🎯 Updating Metadata & System Labels (Brown/Neutral Family)..."

update_label "meta-data" "8d6e63" "Metadata and structured data"
update_label "structured-data" "a1887f" "Structured data and schema markup"
update_label "schema" "bcaaa4" "Schema.org markup and validation"
update_label "rich-snippets" "d7ccc8" "Rich snippets and search result enhancements"
update_label "social-media" "a1887f" "Social media integration"
update_label "navigation" "bcaaa4" "Site navigation and menus"
update_label "footer" "d7ccc8" "Footer-related issues"
update_label "headers" "8d6e63" "Header and navigation issues"
update_label "includes" "a1887f" "Jekyll includes and partials"
update_label "GitHub_copilot_found" "f5f5f5" "Issues found by GitHub Copilot"

echo ""
echo "📊 Updating Content Management Labels (Light Green Family)..."

update_label "feeds" "16a085" "RSS and Atom feed management"
update_label "rss" "27ae60" "RSS feed functionality"
update_label "categories" "2ecc71" "Category organization and management"
update_label "search" "58d68d" "Search functionality and indexing"
update_label "content-discovery" "85c1e9" "Content discovery and navigation"
update_label "site-functionality" "bb8fce" "Core site functionality"
update_label "data-management" "d2b4de" "Data management and processing"
update_label "structure" "f8c471" "Site structure and organization"
update_label "webmentions" "f7dc6f" "Webmention functionality"

echo ""
echo "🔍 Updating Development & Quality Labels (Light Purple Family)..."

update_label "automated-scan" "85929e" "Automated security or quality scans"
update_label "third-party" "a569bd" "Third-party integrations and services"
update_label "DRY" "6c5ce7" "Don't Repeat Yourself - code deduplication"

echo ""
echo "🎨 Professional GitHub Label Color Scheme Complete!"
echo "=================================================="
echo ""
echo "Color Scheme Summary:"
echo "🔴 Priority: Red family (critical → high → medium → low)"
echo "🔵 Technical: Blue family (performance, security, accessibility, SEO)"
echo "🟢 Work Types: Green family (enhancement, feature, development, testing)"
echo "🟠 Issues: Orange family (bug, refactoring, code quality, dependencies)"
echo "⚪ GitHub Standard: Neutral family (duplicate, help wanted, invalid, question, wontfix)"
echo "🟣 Tech Stack: Purple family (html, css, js, jekyll, frameworks)"
echo "🩵 Content/UX: Teal family (content, UI, UX, typography, images)"
echo "⚫ DevOps: Gray family (CI/CD, build, deployment, configuration)"
echo "🟡 Platform: Yellow family (mobile, PWA, analytics, tracking)"
echo "🟤 Metadata: Brown family (meta, social, navigation, structured data)"
echo "🟢 Content Mgmt: Light Green family (feeds, categories, search, webmentions)"
echo "🟣 Dev/Quality: Light Purple family (automated scans, third-party, DRY)"
echo ""
echo "All $(echo "critical high-priority high medium-high medium-priority medium low-priority low" | wc -w | tr -d ' ') priority labels updated"
echo "All $(echo "performance accessibility a11y wcag security xss csp compliance SEO optimization" | wc -w | tr -d ' ') technical labels updated"
echo "All $(echo "enhancement feature development automation testing monitoring documentation" | wc -w | tr -d ' ') work type labels updated"
echo "All $(echo "bug refactoring code-quality code-organization maintainability dependencies" | wc -w | tr -d ' ') issue type labels updated"
echo "All $(echo "duplicate help\ wanted invalid question wontfix" | wc -w | tr -d ' ') GitHub standard labels updated"
echo "All $(echo "html css javascript liquid jekyll bootstrap jquery" | wc -w | tr -d ' ') tech stack labels updated"
echo "All $(echo "content user-interface user-experience ui-ux typography font fonts images image-optimization lazy-loading carousel" | wc -w | tr -d ' ') content/UX labels updated"
echo "All $(echo "ci-cd build-process configuration deployment" | wc -w | tr -d ' ') DevOps labels updated"
echo "All $(echo "mobile pwa analytics tracking privacy legal" | wc -w | tr -d ' ') platform labels updated"
echo "All $(echo "meta-data structured-data schema rich-snippets social-media navigation footer headers includes GitHub_copilot_found" | wc -w | tr -d ' ') metadata labels updated"
echo "All $(echo "feeds rss categories search content-discovery site-functionality data-management structure webmentions" | wc -w | tr -d ' ') content management labels updated"
echo "All $(echo "automated-scan third-party DRY" | wc -w | tr -d ' ') development/quality labels updated"
echo ""
echo "🎯 Total: 75+ labels with professional colors and descriptions!"