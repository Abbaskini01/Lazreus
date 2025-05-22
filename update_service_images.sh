#!/bin/bash

# This script updates all service pages to include the new images

# Array of service pages
service_pages=(
  "app-development.html:app-dev.jpg:App Development"
  "devops-services.html:devops.jpg:DevOps Services"
  "ux-design.html:ux-design.jpg:UX Design"
  "creative-services.html:creative.jpg:Creative Services"
  "promotional-assistance.html:promotional.jpg:Promotional Assistance"
  "inventory-management.html:inventory.jpg:Inventory Management"
  "wearables.html:wearables.jpg:Wearables"
)

# Function to update a service page
update_service_page() {
  local page=$1
  local image=$2
  local alt=$3
  
  echo "Updating $page with image $image..."
  
  # Add images.css link
  sed -i 's|<link rel="stylesheet" href="style.css">|<link rel="stylesheet" href="style.css">\n    <link rel="stylesheet" href="images.css">|' "$page"
  
  # Update logo
  sed -i 's|<img src="photo.jpg" alt="Lazreus Tech Logo" class="navbar-logo">|<img src="images/logo.png" alt="Lazreus Tech Logo" class="navbar-logo">|' "$page"
  
  # Add hero image
  sed -i "s|<section class=\"service-hero\">|<section class=\"service-hero\">\n        <img src=\"images/$image\" alt=\"$alt\" class=\"service-hero-image\">|" "$page"
  
  echo "Updated $page successfully!"
}

# Process each service page
for service in "${service_pages[@]}"; do
  IFS=':' read -r page image alt <<< "$service"
  update_service_page "$page" "$image" "$alt"
done

echo "All service pages updated successfully!"
