#!/bin/bash

# This script copies the comments from website-development.html to all other service pages

# List of all service pages (excluding the source file)
SERVICE_PAGES=(
    "app-development.html"
    "devops-services.html"
    "ux-design.html"
    "creative-services.html"
    "promotional-assistance.html"
    "inventory-management.html"
    "wearables.html"
)

# Source file with comments
SOURCE_FILE="website-development.html"

# Function to copy comments from source to target file
copy_comments() {
    local target_file=$1
    
    echo "Updating $target_file..."
    
    # Copy style section comments
    sed -i '/<style>/,/\/\* Service page specific styles \*\//c\    <style>\n        /**\n         * Service Page Specific Styles\n         * \n         * These styles are specific to the service detail pages and override\n         * or extend the global styles from style.css.\n         * \n         * @important For backend developers: If implementing a CMS,\n         * consider moving these styles to a separate CSS file that'"'"'s\n         * dynamically included for service pages.\n         */\n' "$target_file"
    
    # Copy background effect comments
    sed -i '/<!-- BACKGROUND EFFECT CODE STARTS HERE  -->/,/<!-- BACKGROUND EFFECT CODE ENDS HERE  -->/c\    <!-- \n    Background Animation\n    \n    This section creates the space-themed animated background with stars and nebulas.\n    The animation is handled by CSS and enhanced with JavaScript for parallax effects.\n    \n    Note for backend developers: This is purely decorative and doesn'"'"'t require\n    backend integration or dynamic content.\n    -->\n    <div class="space-background">\n        <div class="stars"></div>\n        <div class="stars stars-2"></div>\n        <div class="stars stars-3"></div>\n        <div class="nebula nebula-1"></div>\n        <div class="nebula nebula-2"></div>\n        <div class="nebula nebula-3"></div>\n    </div>\n    <!-- End of Background Animation -->' "$target_file"
    
    # Copy content wrapper and header comments
    sed -i '/<div class="content-wrapper">/,/<header>/c\    <!-- \n    Content Wrapper\n    \n    This div wraps all page content and ensures it appears above the animated background.\n    All dynamic content should be placed within this wrapper.\n    -->\n    <div class="content-wrapper">\n    \n    <!-- \n    Header Section with Navigation\n    \n    The main navigation bar appears on all pages and includes:\n    - Logo/brand\n    - Main navigation links\n    - Services dropdown menu\n    - CTA button\n    \n    Note for backend developers: \n    - The active class should be dynamically applied based on current page\n    - The dropdown menu items can be generated from a database/CMS\n    - The CTA button can be linked to a form submission handler\n    -->\n    <header>' "$target_file"
    
    # Copy service hero section comments
    sed -i '/<!-- Service Hero Section -->/,/<section class="description-section">/c\    <!-- \n    Service Hero Section\n    \n    This section displays the main title of the service page.\n    It uses a large, gradient-styled heading for visual impact.\n    \n    Note for backend developers: The title should be dynamically \n    populated from the service data in the CMS/database.\n    -->\n    <section class="service-hero">\n        <h1>'"$(grep -A1 '<section class="service-hero">' "$target_file" | tail -n1 | sed 's/.*<h1>\(.*\)<\/h1>.*/\1/')"'</h1>\n    </section>\n\n    <!-- \n    Service Description Section\n    \n    This section contains the detailed description of the service:\n    - Main headline (h2)\n    - Service description (p)\n    - Key features list (ul/li)\n    - Call-to-action (CTA)\n    - Decorative graphics\n    \n    Note for backend developers:\n    - All content should be dynamically populated from the service data\n    - The SVG graphics can be stored as base64 strings in the database\n    - The CTA link should be configurable in the admin panel\n    -->\n    <section class="description-section">' "$target_file"
    
    # Copy description content comments
    sed -i '/<!-- DESCRIPTION STARTS HERE -->/c\        <!-- \n        Service Description Content\n        \n        This is the main content area for the service description.\n        It includes a headline, descriptive text with highlighted keywords,\n        and a list of key features.\n        \n        Note for backend developers:\n        - The content should be stored in a structured format in the database\n        - Strong tags can be preserved in the database or added via a rich text editor\n        - The key features should be stored as an array/list in the database\n        -->' "$target_file"
    
    # Copy key features comments
    sed -i '/<div class="key-features">/i\        <!-- \n        Key Features List\n        \n        Highlights the main features of the service in an easy-to-scan format.\n        \n        Note for backend developers: This list should be dynamically generated\n        from an array of features in the service data.\n        -->' "$target_file"
    
    # Copy CTA comments
    sed -i '/<div class="cta">/i\        <!-- \n        Call to Action\n        \n        Encourages the user to take the next step.\n        \n        Note for backend developers:\n        - The CTA text and link should be configurable in the admin panel\n        - This could be connected to a form submission or booking system API\n        - Consider adding event tracking for analytics\n        -->' "$target_file"
    
    # Copy footer comments
    sed -i '/<!-- Footer Section -->/,/<\/footer>/c\    <!-- \n    Footer Section\n    \n    The footer appears on all pages and contains:\n    - Quick navigation links\n    - Contact information\n    - Copyright notice\n    \n    Note for backend developers:\n    - Contact information should be stored in a central configuration\n      and dynamically inserted into all pages\n    - The copyright year can be dynamically generated\n    - This section has the ID "contact" for direct linking\n    - Consider adding a contact form or newsletter signup here\n    -->\n    <footer id="contact">\n        <div>\n            <h3>Quick Links</h3>\n            <ul>\n                <li><a href="index.html">Home</a></li>\n                <li><a href="index.html#about">About</a></li>\n                <li><a href="index.html#services">Services</a></li>\n                <li><a href="index.html#contact">Contact</a></li>\n            </ul>\n        </div>\n        <div>\n            <h3>Contact Us</h3>\n            <!-- \n            Contact Information\n            \n            Note for backend developers:\n            - This information should be stored in a central configuration\n            - Email addresses can be obfuscated for spam protection\n            - Consider adding schema.org markup for better SEO\n            -->\n            <p>Email: contact@lazreustech.com</p>\n            <p>Phone: (123) 456-7890</p>\n            <p>Address: [Your Location]</p>\n        </div>\n        <div>\n            <!-- \n            Copyright Notice\n            \n            Note for backend developers:\n            - The year can be dynamically generated with:\n              <?php echo date("Y"); ?> or similar in your backend language\n            -->\n            <p>© 2025 Lazreus Tech. All Rights Reserved.</p>\n        </div>\n    </footer>\n    </div><!-- End of content-wrapper -->' "$target_file"
    
    echo "Updated $target_file successfully."
}

# Process each service page
for page in "${SERVICE_PAGES[@]}"; do
    if [ -f "$page" ]; then
        copy_comments "$page"
    else
        echo "Warning: $page not found, skipping."
    fi
done

echo "All service pages have been updated with comments."
