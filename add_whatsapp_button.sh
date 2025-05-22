#!/bin/bash

# This script adds a WhatsApp contact button to all HTML files

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

# WhatsApp button HTML code
whatsapp_html='<a href="https://wa.me/919885887272" class="whatsapp-float" target="_blank" aria-label="Contact us on WhatsApp">
  <i class="fab fa-whatsapp"></i>
</a>'

# WhatsApp button CSS styles
whatsapp_css='.whatsapp-float {
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

# Function to add WhatsApp button to an HTML file
add_whatsapp_button() {
  local file=$1
  
  echo "Adding WhatsApp button to $file..."
  
  # Add WhatsApp button HTML before </body> tag
  sed -i "s|</body>|$whatsapp_html\n</body>|" "$file"
  
  # Add WhatsApp button CSS styles
  # Check if the file has a <style> section
  if grep -q "<style>" "$file"; then
    # Add CSS to existing style section
    sed -i "s|</style>|$whatsapp_css\n</style>|" "$file"
  else
    # Add new style section in the head
    sed -i "s|</head>|<style>\n$whatsapp_css\n</style>\n</head>|" "$file"
  fi
  
  echo "Added WhatsApp button to $file successfully!"
}

# Process each HTML file
for file in "${html_files[@]}"; do
  add_whatsapp_button "$file"
done

echo "WhatsApp button added to all HTML files successfully!"
