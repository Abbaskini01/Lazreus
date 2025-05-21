#!/bin/bash

# This script updates the footer in all service pages to match the new footer in index.html

# List of all service pages
SERVICE_PAGES=(
    "website-development.html"
    "app-development.html"
    "devops-services.html"
    "ux-design.html"
    "creative-services.html"
    "promotional-assistance.html"
    "inventory-management.html"
    "wearables.html"
)

# Source file with new footer
SOURCE_FILE="index.html"

# Extract the new footer HTML from index.html
NEW_FOOTER=$(sed -n '/<footer id="contact" class="footer">/,/<\/footer>/p' "$SOURCE_FILE")

# Function to update footer in target file
update_footer() {
    local target_file=$1
    
    echo "Updating footer in $target_file..."
    
    # Add Font Awesome CDN to head section
    if ! grep -q "font-awesome" "$target_file"; then
        sed -i '/<link href="https:\/\/fonts.googleapis.com\/css2?family=Fira+Code&display=swap" rel="stylesheet">/a\
    <!-- \n        Font Awesome for Icons\n        Used for social media icons, contact information icons, and UI elements.\n        \n        Note for backend developers:\n        - Consider downloading and hosting these files locally for better performance\n        - Only the solid style is being loaded for better performance\n        - For production, consider using a package manager to include only needed icons\n    -->\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">' "$target_file"
    fi
    
    # Replace old footer with new footer
    sed -i '/<footer id="contact">/,/<\/footer>/c\'"$NEW_FOOTER" "$target_file"
    
    echo "Updated footer in $target_file successfully."
}

# Process each service page
for page in "${SERVICE_PAGES[@]}"; do
    if [ -f "$page" ]; then
        update_footer "$page"
    else
        echo "Warning: $page not found, skipping."
    fi
done

echo "All service pages have been updated with the new footer."
