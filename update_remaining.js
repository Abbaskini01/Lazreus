// This script updates the styling for the remaining service pages
const fs = require('fs');

// List of remaining service pages to update
const servicePages = [
    'ux-design.html',
    'creative-services.html',
    'promotional-assistance.html',
    'inventory-management.html',
    'wearables.html'
];

// New styles
const h2Style = `        .description-section h2 {
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
            content: '';
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
        }`;

const pStyle = `        .description-section p {
            font-size: clamp(1.05rem, 2vw, 1.2rem);
            line-height: 1.8;
            margin-bottom: 1.5rem;
            letter-spacing: 0.2px;
        }`;

const liStyle = `        .key-features li {
            padding: 0.5rem 0;
            position: relative;
            padding-left: 2rem;
            font-size: clamp(1rem, 2vw, 1.15rem);
            letter-spacing: 0.2px;
        }`;

const ctaStyle = `        .cta p {
            font-size: clamp(1.2rem, 2.5vw, 1.4rem);
            margin-bottom: 0;
            font-weight: 500;
        }`;

// Function to update a file
function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace h2 style
        content = content.replace(
            /\.description-section h2 \{[^}]*\}/s,
            h2Style
        );
        
        // Replace p style
        content = content.replace(
            /\.description-section p \{[^}]*\}/s,
            pStyle
        );
        
        // Replace li style
        content = content.replace(
            /\.key-features li \{[^}]*\}/s,
            liStyle
        );
        
        // Replace cta style
        content = content.replace(
            /\.cta p \{[^}]*\}/s,
            ctaStyle
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath} successfully.`);
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
    }
}

// Update all remaining service pages
servicePages.forEach(page => {
    updateFile(page);
});

console.log('All remaining service pages have been updated.');
