#!/bin/bash

# This script updates the footer in the remaining service pages

# List of remaining service pages
SERVICE_PAGES=(
    "ux-design.html"
    "creative-services.html"
    "promotional-assistance.html"
    "inventory-management.html"
    "wearables.html"
)

# Process each service page
for page in "${SERVICE_PAGES[@]}"; do
    echo "Updating $page..."
    
    # Create a temporary file
    cp "$page" "${page}.tmp"
    
    # Replace the footer section
    awk '
    BEGIN { 
        in_footer = 0; 
        print_line = 1;
    }
    
    # When we find the footer section start, mark that we are in the footer
    /<!-- *\n *Footer Section/ { 
        in_footer = 1; 
        print_line = 0;
        
        # Print the new footer
        print "    <!--";
        print "    Footer Section";
        print "";
        print "    A responsive 3-column footer with branding, services, and contact information.";
        print "    Includes a separate copyright section at the bottom.";
        print "";
        print "    Note for backend developers:";
        print "    - All content should be stored in a central configuration for easy updates";
        print "    - The services list should be dynamically generated from the same data source as the navigation";
        print "    - Contact information should be consistent across the site";
        print "    - The copyright year should be dynamically generated";
        print "    - Consider adding schema.org markup for the organization and contact information";
        print "    -->";
        print "    <footer id=\"contact\" class=\"footer\">";
        print "        <div class=\"footer-content\">";
        print "            <!-- ";
        print "            Branding Section";
        print "";
        print "            Contains company name and tagline.";
        print "";
        print "            Note for backend developers:";
        print "            - This content should be stored in a central configuration";
        print "            - Consider adding social media links here";
        print "            -->";
        print "            <div class=\"footer-branding\">";
        print "                <h3>Lazreus Tech</h3>";
        print "                <p>Explore with us to access world-class technology solutions that will transform your business and software requirements.</p>";
        print "            </div>";
        print "";
        print "            <!-- ";
        print "            Services Section";
        print "";
        print "            Contains links to all service pages.";
        print "";
        print "            Note for backend developers:";
        print "            - This list should be dynamically generated from the services database";
        print "            - The active service should be highlighted if on a service page";
        print "            - Track clicks on these links for conversion analytics";
        print "            -->";
        print "            <div class=\"footer-services\">";
        print "                <h4>Services</h4>";
        print "                <ul>";
        print "                    <li><a href=\"website-development.html\">Website Development</a></li>";
        print "                    <li><a href=\"app-development.html\">App Development</a></li>";
        print "                    <li><a href=\"devops-services.html\">DevOps Services</a></li>";
        print "                    <li><a href=\"ux-design.html\">UX Design</a></li>";
        print "                    <li><a href=\"creative-services.html\">Creative Services</a></li>";
        print "                    <li><a href=\"promotional-assistance.html\">Promotional Assistance</a></li>";
        print "                    <li><a href=\"inventory-management.html\">Inventory Management</a></li>";
        print "                    <li><a href=\"wearables.html\">Wearables</a></li>";
        print "                </ul>";
        print "            </div>";
        print "";
        print "            <!-- ";
        print "            Contact Section";
        print "";
        print "            Contains contact information with icons.";
        print "";
        print "            Note for backend developers:";
        print "            - This information should be stored in a central configuration";
        print "            - Phone numbers should have click-to-call functionality";
        print "            - Email addresses should be protected from spam harvesters";
        print "            - Consider adding a contact form that submits to your backend API";
        print "            -->";
        print "            <div class=\"footer-contact\">";
        print "                <h4>Contact</h4>";
        print "                <div class=\"contact-info\">";
        print "                    <div class=\"contact-item\">";
        print "                        <div class=\"contact-icon\">";
        print "                            <i class=\"fas fa-phone-alt\"></i>";
        print "                        </div>";
        print "                        <div class=\"contact-text\">";
        print "                            <a href=\"tel:+919863717100\">+91 9863717100</a>";
        print "                        </div>";
        print "                    </div>";
        print "";
        print "                    <div class=\"contact-item\">";
        print "                        <div class=\"contact-icon\">";
        print "                            <i class=\"fas fa-envelope\"></i>";
        print "                        </div>";
        print "                        <div class=\"contact-text\">";
        print "                            <a href=\"mailto:info@lazarusinfotech.com\">info@lazarusinfotech.com</a>";
        print "                        </div>";
        print "                    </div>";
        print "";
        print "                    <div class=\"contact-item\">";
        print "                        <div class=\"contact-icon\">";
        print "                            <i class=\"fas fa-map-marker-alt\"></i>";
        print "                        </div>";
        print "                        <div class=\"contact-text\">";
        print "                            Bangalore";
        print "                        </div>";
        print "                    </div>";
        print "                </div>";
        print "            </div>";
        print "        </div>";
        print "";
        print "        <!-- ";
        print "        Copyright Section";
        print "";
        print "        Contains copyright notice and legal links.";
        print "";
        print "        Note for backend developers:";
        print "        - The year should be dynamically generated";
        print "        - Legal pages should be properly linked";
        print "        - Consider adding a language selector here for multilingual sites";
        print "        -->";
        print "        <div class=\"footer-copyright\">";
        print "            <p>Copyright &copy;2023 Lazarus Info Tech</p>";
        print "            <div class=\"footer-links\">";
        print "                <a href=\"terms.html\">Terms & Conditions</a>";
        print "                <a href=\"privacy.html\">Privacy Policy</a>";
        print "            </div>";
        print "        </div>";
        print "    </footer>";
    }
    
    # When we find the end of the footer section, mark that we are no longer in the footer
    # and fix the duplicate content-wrapper closing div
    /^    <\/div><!-- End of content-wrapper -->$/ {
        if (in_footer) {
            in_footer = 0;
            print_line = 1;
            print "    </div><!-- End of content-wrapper -->";
            next;
        }
    }
    
    # Print all lines that are not part of the footer section
    { if (print_line) print; }
    ' "$page" > "${page}.tmp"
    
    # Replace the original file with the modified one
    mv "${page}.tmp" "$page"
    
    echo "Updated $page successfully."
done

echo "All remaining service pages have been updated with the new footer."
