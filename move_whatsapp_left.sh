#!/bin/bash

# This script moves the WhatsApp button from the right side to the left side on all HTML files

# Array of HTML files
html_files=(
  "index.html"
  "website-development.html"
  "app-development.html"
  "devops-services.html"
  "ux-design.html"
  "creative-services.html"
  "promotional-assistance.html"
  "inventory-management.html"
  "wearables.html"
)

# Function to update the WhatsApp button position
update_whatsapp_position() {
  local file=$1
  
  echo "Updating WhatsApp button position in $file..."
  
  # Replace 'right: 30px;' with 'left: 30px;' in the WhatsApp float CSS
  sed -i 's/right: 30px;/left: 30px;/' "$file"
  
  echo "Updated WhatsApp button position in $file successfully!"
}

# Process each HTML file
for file in "${html_files[@]}"; do
  update_whatsapp_position "$file"
done

echo "WhatsApp button moved to the left side on all HTML files successfully!"
