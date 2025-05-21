#!/bin/bash

# This script manually updates the remaining service pages with the new footer

# List of remaining service pages
SERVICE_PAGES=(
    "devops-services.html"
    "ux-design.html"
    "creative-services.html"
    "promotional-assistance.html"
    "inventory-management.html"
    "wearables.html"
)

# Process each service page
for page in "${SERVICE_PAGES[@]}"; do
    echo "Updating $page..."
    
    # Copy the app-development.html file to a temporary file
    cp "app-development.html" "temp.html"
    
    # Get the title from the current service page
    TITLE=$(grep -A1 '<section class="service-hero">' "$page" | tail -n1 | sed 's/.*<h1>\(.*\)<\/h1>.*/\1/')
    
    # Replace the title in the temporary file
    sed -i "s/<h1>App Development<\/h1>/<h1>$TITLE<\/h1>/g" "temp.html"
    
    # Replace the current service page with the temporary file
    cp "temp.html" "$page"
    
    echo "Updated $page successfully."
done

# Remove the temporary file
rm "temp.html"

echo "All remaining service pages have been updated with the new footer."
