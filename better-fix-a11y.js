const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Use regex with replacer function to give context-aware aria-labels
let btnCounter = 1;
content = content.replace(/<button[^>]*>/gi, (match) => {
    let newAria = "Action button";
    
    // Determine a better aria-label based on contents or id or onclick
    if (match.includes('toggle-customer-app-mobile')) newAria = 'Toggle Customer App Preview';
    else if (match.includes("switchPage('alerts')")) newAria = 'View Alerts';
    else if (match.includes('toggleCustomerAppPanel()')) newAria = 'Preview App';
    else if (match.includes("setInventoryFilter('all'")) newAria = 'Filter All Items';
    else if (match.includes("setInventoryFilter('low'")) newAria = 'Filter Low Stock Items';
    else if (match.includes("setInventoryFilter('out'")) newAria = 'Filter Out of Stock Items';
    else if (match.includes('openManualAddModal()')) newAria = 'Add Product Manually';
    else if (match.includes('openSyncModal()')) newAria = 'AI Shelf Sync';
    else if (match.includes('handleViewItem')) newAria = 'View Item Details';
    else if (match.includes('handleReorder')) newAria = 'Reorder Item';
    else if (match.includes('closeSyncModal()')) newAria = 'Close Sync Modal';
    else if (match.includes('closeManualAddModal()')) newAria = 'Close Add Product Modal';
    else if (match.includes('submitManualProduct()')) newAria = 'Submit Product';
    else if (match.includes('btn-next-scan')) newAria = 'Next Scan Step';
    else if (match.includes('btn-cancel')) newAria = 'Cancel Scan';
    else if (match.includes('btn-confirm-sync')) newAria = 'Confirm Sync';
    else if (match.includes('btn-done')) newAria = 'Done Syncing';
    else if (match.includes('toggleMobileView()')) newAria = 'Toggle Mobile View';
    else newAria = 'Button'; // Fallback
    
    // Replace any existing aria-label or insert one
    if (match.includes('aria-label=')) {
        return match.replace(/aria-label="[^"]*"/, `aria-label="${newAria}"`);
    } else {
        return match.replace('<button', `<button aria-label="${newAria}"`);
    }
});

let aCounter = 1;
content = content.replace(/<a[^>]*>/gi, (match) => {
    let newAria = "Navigation link";
    if (match.includes("switchPage('dashboard')")) newAria = "Dashboard page";
    else if (match.includes("switchPage('inventory')")) newAria = "Inventory page";
    else if (match.includes("switchPage('demand')")) newAria = "Demand Forecast page";
    else if (match.includes("switchPage('alerts')")) newAria = "Alerts page";
    else if (match.includes("switchPage('analytics')")) newAria = "Analytics page";
    else if (match.includes("switchPage('integrations')")) newAria = "Integrations page";
    
    if (match.includes('aria-label=')) {
        return match.replace(/aria-label="[^"]*"/, `aria-label="${newAria}"`);
    } else {
        return match.replace('<a', `<a aria-label="${newAria}"`);
    }
});

fs.writeFileSync(indexPath, content, 'utf8');

const appPath = path.join(__dirname, 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

appContent = appContent.replace(/<button[^>]*>/gi, (match) => {
    let newAria = "Action button";
    
    if (match.includes('updateCount(')) {
        if (match.includes('-1')) newAria = 'Decrease quantity';
        else newAria = 'Increase quantity';
    } else if (match.includes('showAddProductForm')) {
        newAria = 'Add new product';
    } else if (match.includes('cancelAddProduct')) {
        newAria = 'Cancel adding product';
    } else if (match.includes('confirmAddProduct')) {
        newAria = 'Confirm adding product';
    } else if (match.includes('+')) {
        newAria = 'Add to cart';
    }
    
    if (match.includes('aria-label=')) {
        return match.replace(/aria-label="[^"]*"/, `aria-label="${newAria}"`);
    } else {
        return match.replace('<button', `<button aria-label="${newAria}"`);
    }
});

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Fixed accessibility labels intelligently!');
