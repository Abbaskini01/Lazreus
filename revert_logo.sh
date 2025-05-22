#!/bin/bash

# This script reverts the logo back to photo.jpg in all service pages

# Array of service pages
service_pages=(
  "website-development.html"
  "app-development.html"
  "devops-services.html"
  "ux-design.html"
  "creative-services.html"
  "promotional-assistance.html"
  "inventory-management.html"
  "wearables.html"
)

# Function to revert logo in a service page
revert_logo() {
  local page=$1
  
  echo "Reverting logo in $page..."
  
  # Revert logo back to photo.jpg
  sed -i 's|<img src="images/logo.png" alt="Lazreus Tech Logo" class="navbar-logo">|<img src="photo.jpg" alt="Lazreus Tech Logo" class="navbar-logo">|' "$page"
  
  echo "Reverted logo in $page successfully!"
}

# Process each service page
for page in "${service_pages[@]}"; do
  revert_logo "$page"
done

echo "All logos reverted successfully!"
