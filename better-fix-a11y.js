const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Add aria-hidden to fontawesome icons
content = content.replace(/<i\s+class="fas\s+fa-[^>]*"(?!.*?aria-hidden)[^>]*>/gi, match => {
    return match.replace('<i ', '<i aria-hidden="true" ');
});

// Add loading="lazy" to images
content = content.replace(/<img(?!.*?loading="lazy")[^>]*>/gi, match => {
    return match.replace('<img ', '<img loading="lazy" ');
});

// Scope for table headers
content = content.replace(/<th\s+class="([^"]*)"([^>]*)>/gi, '<th scope="col" class="$1" $2>');

fs.writeFileSync(indexPath, content, 'utf8');

const appPath = path.join(__dirname, 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Same for app.js
appContent = appContent.replace(/<i\s+class="fas\s+fa-[^>]*"(?!.*?aria-hidden)[^>]*>/gi, match => {
    return match.replace('<i ', '<i aria-hidden="true" ');
});

fs.writeFileSync(appPath, appContent, 'utf8');

console.log('Advanced A11y and Efficiency applied!');
