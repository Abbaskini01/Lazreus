#!/bin/bash

# This script adds a WhatsApp contact button to the remaining service HTML files

# Array of remaining service pages
service_pages=(
  "app-development.html"
  "devops-services.html"
  "ux-design.html"
  "creative-services.html"
  "promotional-assistance.html"
  "inventory-management.html"
  "wearables.html"
)

# WhatsApp button HTML
whatsapp_html='
    <a href="https://wa.me/919885887272" class="whatsapp-float" target="_blank" aria-label="Contact us on WhatsApp">
        <i class="fab fa-whatsapp"></i>
    </a>'

# WhatsApp button CSS
whatsapp_css='
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #25D366;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            text-align: center;
            font-size: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s;
        }
        .whatsapp-float:hover {
            transform: scale(1.1);
        }'

# Process each service page
for page in "${service_pages[@]}"; do
  echo "Processing $page..."
  
  # Add WhatsApp button HTML before </body> tag
  awk -v html="$whatsapp_html" '{
    if (match($0, "</body>")) {
      print html;
    }
    print $0;
  }' "$page" > "${page}.new"
  
  # Add WhatsApp button CSS before </style> tag
  awk -v css="$whatsapp_css" '{
    if (match($0, "</style>")) {
      print css;
    }
    print $0;
  }' "${page}.new" > "${page}.final"
  
  # Replace original file with the modified one
  mv "${page}.final" "$page"
  rm "${page}.new"
  
  echo "Added WhatsApp button to $page successfully!"
done

echo "WhatsApp button added to all remaining service pages successfully!"
