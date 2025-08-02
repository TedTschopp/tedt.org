workspace "Ted Tschopp's Personal Website" "TedT.org" {
    model {
        !identifiers hierarchical
        
        # External Users and Systems
        user = person "Website Visitor" "Visitors browsing Ted's personal website" "External"
        reader = person "Blog Reader" "Regular readers of blog posts and content" "External"
        promptUser = person "Prompt User" "Users utilizing AI prompts and templates" "External"
        developer = person "Developer" "Contributors and maintainers of the website" "Internal"
        seoBot = softwareSystem "Search Engine Bots" "Google, Bing, and other search engine crawlers" "External"
        socialMedia = softwareSystem "Social Media Platforms" "Mastodon, Twitter, and other social platforms" "External"
        analytics = softwareSystem "Analytics Services" "Google Analytics, Microsoft Clarity tracking" "External"
        
        # Core Website System
        website = softwareSystem "TedT.org Website" "Personal website showcasing Ted's work, thoughts, and projects" {
            
            # Frontend Layer
            frontend = container "Frontend Web Application" "Static Jekyll-generated website with responsive design" "HTML5, CSS3, Bootstrap 5.3.0, JavaScript ES6+" {
                homepage = component "Homepage" "Main landing page with hero section and navigation" "Jekyll Layout"
                blogSystem = component "Blog System" "Multi-category blog with posts and pagination" "Jekyll Layouts & Liquid"
                promptLibrary = component "Prompt Library" "AI prompt templates with dynamic series workflows and variable substitution" "JavaScript, HTML Forms, Liquid Templating"
                promptSeries = component "Prompt Series System" "Dynamic multi-step workflow navigation for related prompts" "Liquid Templating, YAML Front Matter"
                projectPortfolio = component "Project Portfolio" "Showcase of technical projects and work" "Jekyll Collections"
                categorySystem = component "Category System" "Organized content categorization and filtering" "Jekyll Categories"
                searchInterface = component "Search Interface" "Site-wide search functionality" "JavaScript, Google Custom Search"
                commentSystem = component "Comment System" "Mastodon-based commenting integration" "JavaScript API"
                webmentions = component "Webmentions" "Social web interaction and mentions" "Webmention.io Integration"
                pwaFeatures = component "PWA Features" "Progressive Web App functionality" "Service Workers, Web Manifest"
            }
            
            # Content Management Layer
            contentManagement = container "Content Management System" "Jekyll-based static site generator with automated builds" "Jekyll 4.3.2, Ruby, Liquid Templating" {
                jekyllEngine = component "Jekyll Engine" "Static site generation and build process" "Jekyll Core"
                liquidTemplates = component "Liquid Templates" "Dynamic content templating system" "Liquid Templating"
                markdownProcessor = component "Markdown Processor" "Content processing and rendering" "Kramdown"
                sassProcessor = component "SASS Processor" "CSS preprocessing and compilation" "SASS/SCSS"
                dataLayer = component "Data Layer" "Structured data and content configuration" "YAML, JSON"
                includeSystem = component "Include System" "Reusable component architecture" "Jekyll Includes"
                assetPipeline = component "Asset Pipeline" "CSS/JS optimization and delivery" "Jekyll Assets"
            }
            
            # Data Storage Layer  
            dataStorage = container "Content Storage" "Git-based content management and version control" "Git, Markdown, YAML, JSON" {
                posts = component "Blog Posts" "Markdown files organized by category with series workflow metadata" "Markdown, YAML Front Matter"
                promptContent = component "Prompt Content" "AI prompt templates with series definitions and workflow steps" "Markdown, YAML Front Matter"
                pages = component "Static Pages" "About, contact, and other static content" "Markdown, HTML"
                dataFiles = component "Data Files" "Structured content and configuration" "YAML, JSON, CSV"
                assets = component "Media Assets" "Images, documents, and downloadable content" "Static Files"
                includes = component "Template Includes" "Reusable HTML/Liquid components" "HTML, Liquid"
                layouts = component "Page Layouts" "Template structure definitions" "HTML, Liquid"
                configuration = component "Site Configuration" "Jekyll and build configuration" "YAML"
            }
            
            # Analytics & Tracking Layer
            analytics = container "Analytics & Tracking" "User behavior tracking and site performance monitoring" "JavaScript, Third-party APIs" {
                googleAnalytics = component "Google Analytics" "Visitor tracking and behavior analysis" "GA4"
                clarityTracking = component "Microsoft Clarity" "User session recording and heatmaps" "Clarity API"
                performanceMonitoring = component "Performance Monitoring" "Site speed and Core Web Vitals" "Web APIs"
                seoTracking = component "SEO Tracking" "Search engine optimization monitoring" "Meta Tags, Structured Data"
            }
            
            # Integration Layer
            integrations = container "External Integrations" "Third-party service integrations and APIs" "JavaScript APIs, Webhooks" {
                mastodonIntegration = component "Mastodon Integration" "Comment system and social sharing" "Mastodon API"
                webmentionIntegration = component "Webmention Integration" "Social web interactions" "Webmention.io API"
                searchIntegration = component "Search Integration" "Google Custom Search integration" "Google CSE API"
                feedGeneration = component "Feed Generation" "RSS/Atom/JSON feed creation" "Jekyll Plugins"
                socialSharing = component "Social Sharing" "Content sharing to social platforms" "Web Share API"
            }
        }
        
        # External Services
        github = softwareSystem "GitHub" "Code hosting, CI/CD, and collaboration platform" "External"
        githubPages = softwareSystem "GitHub Pages" "Static site hosting and deployment" "External"
        cdn = softwareSystem "Content Delivery Network" "Global content distribution and caching" "External"
        mastodonInstance = softwareSystem "Mastodon Instance" "Decentralized social media platform for comments" "External"
        webmentionService = softwareSystem "Webmention.io" "Webmention processing and storage service" "External"
        
        # Development Environment
        devEnvironment = softwareSystem "Development Environment" "Local development and testing setup" {
            localJekyll = container "Local Jekyll Server" "Development server for testing" "Jekyll, Ruby"
            buildTools = container "Build Tools" "Asset compilation and optimization" "Jekyll, SASS, JavaScript"
            testingSuite = container "Testing Suite" "HTML/CSS/JS validation and testing" "Validation Tools"
        }
        
        # Relationships - User Interactions
        user -> website.frontend "Visits website, reads content, uses features"
        reader -> website.frontend.blogSystem "Reads blog posts and articles"
        promptUser -> website.frontend.promptLibrary "Uses AI prompt templates and variables"
        developer -> devEnvironment "Develops and tests changes"
        developer -> github "Commits code changes"
        
        # Frontend Component Relationships
        website.frontend.homepage -> website.frontend.categorySystem "Links to categorized content"
        website.frontend.blogSystem -> website.frontend.commentSystem "Enables reader engagement"
        website.frontend.promptLibrary -> website.frontend.searchInterface "Searchable prompt collection"
        website.frontend.promptLibrary -> website.frontend.promptSeries "Uses dynamic series navigation"
        website.frontend.promptSeries -> website.dataStorage.promptContent "Reads series workflow definitions"
        website.frontend.commentSystem -> mastodonInstance "Fetches comments via API"
        website.frontend.webmentions -> webmentionService "Processes social mentions"
        
        # Content Management Relationships
        website.contentManagement.jekyllEngine -> website.dataStorage "Processes content files"
        website.contentManagement.liquidTemplates -> website.dataStorage.includes "Uses reusable components"
        website.contentManagement.markdownProcessor -> website.dataStorage.posts "Renders blog content"
        website.contentManagement.sassProcessor -> website.frontend "Compiles stylesheets"
        website.contentManagement.assetPipeline -> website.frontend "Optimizes and delivers assets"
        
        # Data Storage Relationships
        website.dataStorage.posts -> website.frontend.blogSystem "Provides blog content"
        website.dataStorage.promptContent -> website.frontend.promptLibrary "Provides prompt templates"
        website.dataStorage.promptContent -> website.frontend.promptSeries "Provides series workflow data"
        website.dataStorage.dataFiles -> website.frontend.categorySystem "Provides categorization data"
        website.dataStorage.includes -> website.contentManagement.includeSystem "Reusable component library"
        website.dataStorage.layouts -> website.contentManagement.liquidTemplates "Page structure templates"
        website.dataStorage.configuration -> website.contentManagement.jekyllEngine "Build configuration"
        
        # Analytics Relationships
        website.analytics.googleAnalytics -> analytics "Sends usage data"
        website.analytics.clarityTracking -> analytics "Sends session data"
        website.analytics.seoTracking -> seoBot "Provides structured data"
        website.frontend -> website.analytics "Triggers tracking events"
        
        # Integration Relationships
        website.integrations.mastodonIntegration -> mastodonInstance "Fetches comment data"
        website.integrations.webmentionIntegration -> webmentionService "Processes mentions"
        website.integrations.searchIntegration -> seoBot "Provides search functionality"
        website.integrations.socialSharing -> socialMedia "Shares content"
        website.integrations.feedGeneration -> website.dataStorage "Generates syndication feeds"
        
        # External Service Relationships
        github -> githubPages "Triggers automatic deployment"
        githubPages -> cdn "Serves content through CDN"
        cdn -> website.frontend "Delivers optimized content"
        developer -> github "Version control and collaboration"
        
        # Development Workflow
        devEnvironment.localJekyll -> website.contentManagement "Local development testing"
        devEnvironment.buildTools -> website.contentManagement "Asset processing"
        devEnvironment.testingSuite -> website.frontend "Quality assurance"
        
        # SEO and Performance
        website.frontend -> seoBot "Crawlable content and metadata"
        website.analytics.performanceMonitoring -> analytics "Core Web Vitals data"
        website.frontend.pwaFeatures -> user "Offline functionality"
        
        # Content Creation Workflow
        developer -> website.dataStorage.posts "Creates new blog content"
        developer -> website.dataStorage.includes "Develops reusable components"
        developer -> website.dataStorage.layouts "Designs page templates"
        website.contentManagement -> website.frontend "Generates static site"
        
        # Technology Stack Details
        deploymentEnvironment "production" {
            deploymentNode "GitHub Pages" {
                deploymentNode "Global CDN" {
                    softwareSystemInstance website
                }
            }
        }
        
        deploymentEnvironment "development" {
            deploymentNode "Local Machine" {
                deploymentNode "Jekyll Server" {
                    containerInstance devEnvironment.localJekyll
                }
                deploymentNode "Build Environment" {
                    containerInstance devEnvironment.buildTools
                    containerInstance devEnvironment.testingSuite
                }
            }
        }
    }
    
    views {
        systemLandscape "SystemLandscape" {
            include *
            autoLayout
        }
        
        systemContext website "WebsiteContext" {
            include *
            autoLayout
        }
        
        container website "WebsiteContainers" {
            include *
            autoLayout
        }
        
        component website.frontend "FrontendComponents" {
            include *
            autoLayout
        }
        
        component website.contentManagement "ContentManagementComponents" {
            include *
            autoLayout  
        }
        
        component website.dataStorage "DataStorageComponents" {
            include *
            autoLayout
        }
        
        deployment website "production" "ProductionDeployment" {
            include *
            autoLayout
        }
        
        deployment website "development" "DevelopmentDeployment" {
            include *
            autoLayout
        }
        
        styles {
            element "Person" {
                color #ffffff
                fontSize 22
                shape Person
            }
            element "External" {
                background #999999
                color #ffffff
            }
            element "Internal" {
                background #1168bd
                color #ffffff
            }
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Component" {
                background #85bbf0
                color #000000
            }
            relationship "Relationship" {
                dashed false
            }
            relationship "Async" {
                dashed true
            }
        }
    }
    
    configuration {
        scope softwaresystem
    }
}
