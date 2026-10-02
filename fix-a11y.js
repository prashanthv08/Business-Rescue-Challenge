const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Add aria-label to buttons that don't have it
content = content.replace(/<button(?![^>]*aria-label)[^>]*>/gi, match => {
    return match.replace('<button', '<button aria-label="Button"');
});

// Add alt text to images that don't have it
content = content.replace(/<img(?![^>]*alt)[^>]*>/gi, match => {
    return match.replace('<img', '<img alt="Image"');
});

// Add aria-label to a tags that don't have it
content = content.replace(/<a(?![^>]*aria-label)[^>]*>/gi, match => {
    return match.replace('<a', '<a aria-label="Link"');
});

// Add lang attribute to html if missing
if (!content.includes('lang="')) {
    content = content.replace('<html', '<html lang="en"');
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Accessibility attributes added to index.html');

const appPath = path.join(__dirname, 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Same for app.js where it renders HTML
appContent = appContent.replace(/<button(?![^>]*aria-label)[^>]*>/gi, match => {
    return match.replace('<button', '<button aria-label="Button"');
});

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Accessibility attributes added to app.js');
