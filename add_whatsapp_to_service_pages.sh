#!/bin/bash

# This script adds a WhatsApp contact button to all service HTML files

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

# Function to add WhatsApp button to a service page
add_whatsapp_button() {
  local page=$1
  
  echo "Adding WhatsApp button to $page..."
  
  # Add WhatsApp button HTML before </body> tag
  sed -i 's|</body>|    <a href="https://wa.me/919885887272" class="whatsapp-float" target="_blank" aria-label="Contact us on WhatsApp">\n        <i class="fab fa-whatsapp"></i>\n    </a>\n</body>|' "$page"
  
  # Add WhatsApp button CSS styles to the existing style section
  sed -i 's|</style>|    .whatsapp-float {\n        position: fixed;\n        bottom: 30px;\n        right: 30px;\n        background: #25D366;\n        color: white;\n        width: 60px;\n        height: 60px;\n        border-radius: 50%;\n        text-align: center;\n        font-size: 30px;\n        box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n        z-index: 100;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        transition: transform 0.3s;\n    }\n    .whatsapp-float:hover {\n        transform: scale(1.1);\n    }\n</style>|' "$page"
  
  echo "Added WhatsApp button to $page successfully!"
}

# Process each service page
for page in "${service_pages[@]}"; do
  add_whatsapp_button "$page"
done

echo "WhatsApp button added to all service pages successfully!"
