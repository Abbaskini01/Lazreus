#!/bin/bash

# This script updates all service pages with the same hero section styling

# List of all service pages
SERVICE_PAGES=(
    "website-development.html"
    "app-development.html"
    "devops-services.html"
    "ux-design.html"
    "creative-services.html"
    "promotional-assistance.html"
    "inventory-management.html"
    "wearables.html"
)

# The new hero section styling
NEW_HERO_STYLE='        .service-hero h1 {
            font-family: var(--font-heading);
            font-size: clamp(2.5rem, 5vw, 4rem);
            margin-bottom: 2rem;
            background: linear-gradient(to right, #4e8cff, #ff6f61); /* Changed to a more vibrant gradient */
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
            font-weight: bold; /* Added bold font weight */
            text-align: center; /* Center-aligned */
            text-decoration: underline; /* Added underline */
            text-underline-offset: 10px; /* Space between text and underline */
            text-decoration-color: rgba(255, 255, 255, 0.5); /* Underline color */
            text-decoration-thickness: 2px; /* Underline thickness */
        }'

# Loop through each service page and update the hero section styling
for page in "${SERVICE_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "Updating $page..."
        
        # Use sed to replace the hero section styling
        # The pattern looks for lines between .service-hero h1 { and the closing }
        sed -i '/\.service-hero h1 {/,/}/c\'"$NEW_HERO_STYLE" "$page"
        
        echo "Updated $page successfully."
    else
        echo "Warning: $page not found, skipping."
    fi
done

echo "All service pages have been updated."
