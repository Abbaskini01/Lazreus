#!/bin/bash

# List of service pages to update
service_pages=(
  "app-development.html:App Development"
  "devops-services.html:DevOps Services"
  "ux-design.html:UX Design"
  "creative-services.html:Creative Services"
  "promotional-assistance.html:Promotional Assistance"
  "inventory-management.html:Inventory Management"
  "wearables.html:Wearables"
)

# Loop through each service page
for page_info in "${service_pages[@]}"; do
  # Split the page_info into filename and service name
  IFS=':' read -r filename service_name <<< "$page_info"
  
  echo "Updating $filename for $service_name..."
  
  # Create the dropdown menu HTML with the current service marked as active
  dropdown_menu='                <ul class="navbar-nav" role="menubar">
                    <li class="nav-item" role="none"><a class="nav-link" href="index.html" role="menuitem">Home</a></li>
                    <li class="nav-item" role="none"><a class="nav-link" href="index.html#about" role="menuitem">About</a></li>
                    <li class="nav-item dropdown" role="none">
                        <a class="nav-link dropdown-toggle active" href="index.html#services" role="menuitem" aria-haspopup="true" aria-expanded="false" aria-current="page">Services</a>
                        <div class="dropdown-menu" aria-labelledby="servicesDropdown">
                            <a class="dropdown-item" href="website-development.html">Website Development</a>
                            <a class="dropdown-item" href="app-development.html">App Development</a>
                            <a class="dropdown-item" href="devops-services.html">DevOps Services</a>
                            <a class="dropdown-item" href="ux-design.html">UX Design</a>
                            <a class="dropdown-item" href="creative-services.html">Creative Services</a>
                            <a class="dropdown-item" href="promotional-assistance.html">Promotional Assistance</a>
                            <a class="dropdown-item" href="inventory-management.html">Inventory Management</a>
                            <a class="dropdown-item" href="wearables.html">Wearables</a>
                        </div>
                    </li>
                    <li class="nav-item" role="none"><a class="nav-link" href="index.html#contact" role="menuitem">Contact</a></li>
                </ul>'
  
  # Mark the current service as active in the dropdown menu
  dropdown_menu=$(echo "$dropdown_menu" | sed "s|<a class=\"dropdown-item\" href=\"$filename\">$service_name</a>|<a class=\"dropdown-item active\" href=\"$filename\">$service_name</a>|")
  
  # Replace the navbar in the file
  sed -i "/<ul class=\"navbar-nav\" role=\"menubar\">/,/<\/ul>/c\\$dropdown_menu" "$filename"
done

echo "All service pages updated successfully!"
