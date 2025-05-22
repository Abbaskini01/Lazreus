#!/bin/bash

# This script reverts the z-index value of the WhatsApp button back to 100 on remaining service pages

# Array of remaining service pages
service_pages=(
  "ux-design.html"
  "creative-services.html"
  "promotional-assistance.html"
  "inventory-management.html"
  "wearables.html"
)

# Process each service page
for page in "${service_pages[@]}"; do
  echo "Updating WhatsApp button z-index in $page..."
  
  # Use sed to replace the z-index value
  sed -i 's/z-index: 9999;/z-index: 100;/g' "$page"
  
  echo "Updated WhatsApp button z-index in $page successfully!"
done

echo "WhatsApp button z-index updated on all remaining service pages successfully!"
