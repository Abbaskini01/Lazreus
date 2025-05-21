#!/bin/bash

# This script updates the footer in all service pages to match the new footer in website-development.html

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

# Source file with new footer
SOURCE_FILE="website-development.html"

# Function to update a service page
update_service_page() {
    local target_file=$1
    
    echo "Updating $target_file..."
    
    # 1. Add Font Awesome to head section if not already present
    if ! grep -q "font-awesome" "$target_file"; then
        echo "Adding Font Awesome to $target_file..."
        sed -i '/<link href="https:\/\/fonts.googleapis.com\/css2?family=Fira+Code&display=swap" rel="stylesheet">/a\\n    <!-- \n        Font Awesome for Icons\n        Used for social media icons, contact information icons, and UI elements.\n        \n        Note for backend developers:\n        - Consider downloading and hosting these files locally for better performance\n        - Only the solid style is being loaded for better performance\n        - For production, consider using a package manager to include only needed icons\n    -->\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">' "$target_file"
    fi
    
    # 2. Replace the footer section
    echo "Replacing footer in $target_file..."
    
    # Extract the new footer from the source file
    NEW_FOOTER=$(sed -n '/<!--\n    Footer Section/,/<\/footer>/p' "$SOURCE_FILE")
    
    # Replace the old footer with the new one
    awk -v new_footer="$NEW_FOOTER" '
    BEGIN { in_footer = 0; footer_found = 0; }
    /<!--\n    Footer Section/ || /<!-- Footer Section/ { 
        in_footer = 1; 
        footer_found = 1;
        print new_footer;
        next;
    }
    in_footer && /<\/footer>/ { 
        in_footer = 0; 
        next;
    }
    !in_footer { print; }
    END {
        if (!footer_found) {
            print "Footer section not found in the file.";
            exit 1;
        }
    }' "$target_file" > "${target_file}.new"
    
    # Check if the new file was created successfully
    if [ -f "${target_file}.new" ]; then
        mv "${target_file}.new" "$target_file"
        echo "Footer updated successfully in $target_file."
    else
        echo "Failed to update footer in $target_file."
        return 1
    fi
    
    return 0
}

# Process each service page
for page in "${SERVICE_PAGES[@]}"; do
    if [ -f "$page" ]; then
        update_service_page "$page"
    else
        echo "Warning: $page not found, skipping."
    fi
done

echo "All service pages have been updated with the new footer."
