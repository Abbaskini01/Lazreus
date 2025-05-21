#!/bin/bash

# This script updates the styling for all service pages

# List of all service pages (excluding the ones we've already updated)
SERVICE_PAGES=(
    "devops-services.html"
    "ux-design.html"
    "creative-services.html"
    "promotional-assistance.html"
    "inventory-management.html"
    "wearables.html"
)

# New styles for h2
H2_STYLE='        .description-section h2 {
            font-family: var(--font-heading);
            font-size: clamp(2.2rem, 4vw, 3rem);
            margin-bottom: 2rem;
            background: linear-gradient(45deg, #4e8cff, #ff6f61, #a64dff);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 2px 15px rgba(78, 140, 255, 0.7);
            font-weight: 800;
            letter-spacing: -0.5px;
            position: relative;
            display: inline-block;
            padding-bottom: 10px;
            animation: gradientShift 8s ease infinite;
        }
        
        .description-section h2::after {
            content: \x27\x27;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #4e8cff, #ff6f61, #a64dff);
            border-radius: 3px;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }'

# New styles for paragraph
P_STYLE='        .description-section p {
            font-size: clamp(1.05rem, 2vw, 1.2rem);
            line-height: 1.8;
            margin-bottom: 1.5rem;
            letter-spacing: 0.2px;
        }'

# New styles for list items
LI_STYLE='        .key-features li {
            padding: 0.5rem 0;
            position: relative;
            padding-left: 2rem;
            font-size: clamp(1rem, 2vw, 1.15rem);
            letter-spacing: 0.2px;
        }'

# New styles for CTA
CTA_STYLE='        .cta p {
            font-size: clamp(1.2rem, 2.5vw, 1.4rem);
            margin-bottom: 0;
            font-weight: 500;
        }'

# Loop through each service page and update the styles
for page in "${SERVICE_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "Updating $page..."
        
        # Update h2 style
        sed -i '/\.description-section h2 {/,/}/c\'"$H2_STYLE" "$page"
        
        # Update paragraph style
        sed -i '/\.description-section p {/,/}/c\'"$P_STYLE" "$page"
        
        # Update list item style
        sed -i '/\.key-features li {/,/}/c\'"$LI_STYLE" "$page"
        
        # Update CTA style
        sed -i '/\.cta p {/,/}/c\'"$CTA_STYLE" "$page"
        
        echo "Updated $page successfully."
    else
        echo "Warning: $page not found, skipping."
    fi
done

echo "All service pages have been updated."
