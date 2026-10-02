// App State
let currentImageSrc = null;
let currentDetections = [];
let pendingAdjustments = [];
let activeInventoryFilter = 'all';
let inventorySearchQuery = '';
let appPreviewSearchQuery = '';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    renderCustomerApp();
    
    // Bind global event listeners
    const imageUpload = document.getElementById('image-upload-input');
    if(imageUpload) imageUpload.addEventListener('change', handleImageUpload);
    const cameraUpload = document.getElementById('camera-upload-input');
    if(cameraUpload) cameraUpload.addEventListener('change', handleImageUpload);
    
    const inventorySearch = document.getElementById('inventory-search');
    if(inventorySearch) {
        inventorySearch.addEventListener('input', (e) => {
            inventorySearchQuery = e.target.value.toLowerCase();
            renderDashboard();
        });
    }
    
    const appSearch = document.getElementById('app-preview-search');
    if(appSearch) {
        appSearch.addEventListener('input', (e) => {
            appPreviewSearchQuery = e.target.value.toLowerCase();
            renderCustomerApp();
        });
    }

    // Initial page setup
    switchPage('dashboard');
});

// Fix link jumps in HTML by intercepting switchPage calls or making sure they return false
window.switchPage = function(pageId, event) {
    if (event) event.preventDefault();
    
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hide'));
    
    // Show target page
    const targetPage = document.getElementById(`page-${pageId}`);
    if(targetPage) targetPage.classList.remove('hide');
    
    // Update sidebar active states
    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('active', 'bg-[#252538]', 'text-primary', 'border-primary');
        el.classList.add('text-textMuted', 'border-transparent');
        if(el.querySelector('i')) el.querySelector('i').classList.remove('text-white');
    });
    
    const activeNav = document.getElementById(`nav-${pageId}`);
    if (activeNav) {
        activeNav.classList.remove('text-textMuted', 'border-transparent');
        activeNav.classList.add('active', 'bg-[#252538]', 'text-primary', 'border-primary');
        if(activeNav.querySelector('i')) activeNav.querySelector('i').classList.add('text-white');
    }
    
    // Update mobile bottom nav active states
    document.querySelectorAll('.mob-nav-link').forEach(el => {
        el.classList.remove('text-primary');
        el.classList.add('text-textMuted');
    });
    const activeMobNav = document.getElementById(`mob-nav-${pageId}`);
    if (activeMobNav) {
        activeMobNav.classList.remove('text-textMuted');
        activeMobNav.classList.add('text-primary');
    }
    
    // Update Title
    const titles = {
        'dashboard': 'Store Overview',
        'inventory': 'Inventory Management',
        'demand': 'Demand Forecasting',
        'alerts': 'Actionable Alerts',
        'analytics': 'Store Performance',
        'integrations': 'POS & Integrations'
    };
    const titleEl = document.getElementById('page-title');
    if(titleEl) titleEl.textContent = titles[pageId] || 'Dashboard';
    
    // Ensure dashboard numbers are up to date
    if (pageId === 'dashboard' || pageId === 'inventory') renderDashboard();
};

window.setInventoryFilter = function(filterType, btnElement) {
    activeInventoryFilter = filterType;
    
    // Update button styles
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-[#252538]', 'text-white');
        btn.classList.add('bg-darkBg', 'text-textMuted');
    });
    
    btnElement.classList.remove('bg-darkBg', 'text-textMuted');
    btnElement.classList.add('bg-[#252538]', 'text-white');
    
    renderDashboard();
};

function renderDashboard() {
    const tbody = document.getElementById('inventory-tbody');
    let totalItems = inventory.length;
    let outOfStock = 0;
    let lowStock = 0;

    // Calculate global stats first
    inventory.forEach(item => {
        if (item.systemStock === 0) outOfStock++;
        else if (item.systemStock <= 3) lowStock++;
    });

    if (tbody) {
        tbody.innerHTML = '';
        
        let displayItems = inventory;
        
        // Apply Filters
        if (activeInventoryFilter === 'out') {
            displayItems = displayItems.filter(i => i.systemStock === 0);
        } else if (activeInventoryFilter === 'low') {
            displayItems = displayItems.filter(i => i.systemStock > 0 && i.systemStock <= 3);
        }
        
        // Apply Search
        if (inventorySearchQuery) {
            displayItems = displayItems.filter(i => 
                i.name.toLowerCase().includes(inventorySearchQuery) || 
                i.brand.toLowerCase().includes(inventorySearchQuery) ||
                i.category.toLowerCase().includes(inventorySearchQuery)
            );
        }

        displayItems.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-darkBorder/30 transition';
            
            let statusBadge = '';
            if (item.systemStock === 0) {
                statusBadge = '<span class="px-2 py-1 bg-danger/20 border border-danger/30 text-danger text-[11px] font-bold rounded-full shadow-[0_0_8px_rgba(255,82,82,0.2)]">Out of Stock</span>';
            } else if (item.systemStock <= 3) {
                statusBadge = '<span class="px-2 py-1 bg-warning/20 border border-warning/30 text-warning text-[11px] font-bold rounded-full">Low Stock</span>';
            } else {
                statusBadge = '<span class="px-2 py-1 bg-success/20 border border-success/30 text-success text-[11px] font-bold rounded-full">In Stock</span>';
            }

            tr.innerHTML = `
                <td class="p-4">
                    <div class="font-medium text-textMain">${item.name}</div>
                    <div class="text-xs text-textMuted">${item.brand} • ${item.unit}</div>
                </td>
                <td class="p-4 text-textMuted">${item.category}</td>
                <td class="p-4 text-textMuted font-medium">₹${item.price}</td>
                <td class="p-4 text-center">
                    <span class="font-bold ${item.systemStock === 0 ? 'text-danger drop-shadow-[0_0_5px_rgba(255,82,82,0.4)]' : 'text-textMain'} text-lg">${item.systemStock}</span>
                    <div class="text-[10px] text-textMuted/70">Synced: ${timeAgo(item.lastSyncedAt)}</div>
                </td>
                <td class="p-4 text-right">${statusBadge}</td>
            `;
            tbody.appendChild(tr);
        });
        
        if (displayItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-textMuted italic">No products found matching your search or filters.</td></tr>`;
        }
    }

    // Update Dashboard Cards
    const elTotal = document.getElementById('stat-total');
    const elOut = document.getElementById('stat-out');
    const elLow = document.getElementById('stat-low');
    const elSync = document.getElementById('stat-last-sync');
    
    if(elTotal) elTotal.textContent = totalItems;
    if(elOut) elOut.textContent = outOfStock;
    if(elLow) elLow.textContent = lowStock;
    
    if (syncHistory.length > 0 && elSync) {
        elSync.textContent = timeAgo(syncHistory[syncHistory.length-1].timestamp);
    }
}

function renderCustomerApp() {
    const container = document.getElementById('customer-app-products');
    if (!container) return;
    
    container.innerHTML = '';
    
    let appItems = inventory;
    if (appPreviewSearchQuery) {
        appItems = appItems.filter(i => i.name.toLowerCase().includes(appPreviewSearchQuery));
    }
    
    appItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3 relative overflow-hidden transition-all duration-300';
        
        let stockMsg = '';
        let opacity = 'opacity-100';
        let btnDisabled = '';
        let btnClass = 'bg-green-50 text-green-600 border border-green-200 cursor-pointer hover:bg-green-100';
        
        if (item.systemStock === 0) {
            stockMsg = '<div class="text-xs text-red-500 font-bold mt-1">Out of Stock</div>';
            opacity = 'opacity-50 grayscale-[80%]';
            btnDisabled = 'disabled';
            btnClass = 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed';
        } else if (item.systemStock <= 3) {
            stockMsg = `<div class="text-xs text-amber-500 font-bold mt-1">Only ${item.systemStock} left</div>`;
        }
        
        div.innerHTML = `
            <div class="w-12 h-12 bg-slate-100 rounded flex items-center justify-center ${opacity}">
                <i class="fas fa-box text-slate-300 text-xl"></i>
            </div>
            <div class="flex-1 ${opacity}">
                <div class="font-bold text-sm text-slate-800 leading-tight">${item.name}</div>
                <div class="text-xs text-slate-500">${item.unit}</div>
                <div class="font-bold text-sm mt-1">₹${item.price}</div>
                ${stockMsg}
            </div>
            <button class="w-8 h-8 rounded-md flex items-center justify-center font-bold transition ${btnClass}" ${btnDisabled}>
                +
            </button>
            ${item.systemStock === 0 ? '<div class="absolute inset-0 bg-slate-100/40 pointer-events-none"></div>' : ''}
        `;
        container.appendChild(div);
    });
    
    if (appItems.length === 0) {
        container.innerHTML = `<div class="text-center p-4 text-slate-500 text-sm">No items found.</div>`;
    }
}

window.toggleCustomerAppPanel = function() {
    const panel = document.getElementById('customer-app-panel');
    const overlay = document.getElementById('customer-app-overlay');
    
    if (panel.classList.contains('translate-x-full')) {
        panel.classList.remove('translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        renderCustomerApp();
    } else {
        closeCustomerAppPanel();
    }
};

window.closeCustomerAppPanel = function() {
    document.getElementById('customer-app-panel').classList.add('translate-x-full');
    document.getElementById('customer-app-overlay').classList.add('opacity-0', 'pointer-events-none');
};

window.openSyncModal = function() {
    document.getElementById('sync-modal-overlay').classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        document.getElementById('sync-modal').classList.remove('scale-95');
    }, 10);
    resetUpload();
    setStep(1);
};

window.closeSyncModal = function() {
    document.getElementById('sync-modal').classList.add('scale-95');
    document.getElementById('sync-modal-overlay').classList.add('opacity-0', 'pointer-events-none');
};

function setStep(stepNum) {
    document.querySelectorAll('.step-content').forEach(el => el.classList.add('hide'));
    
    const progress = (stepNum - 1) * 50;
    document.getElementById('step-progress').style.width = `${progress}%`;
    
    document.querySelectorAll('.step-indicator').forEach((el, idx) => {
        const circle = el.querySelector('.step-circle');
        const text = el.querySelector('span');
        if (idx < stepNum) {
            circle.classList.add('bg-primary', 'text-white', 'shadow-[0_0_10px_rgba(109,91,238,0.5)]');
            circle.classList.remove('bg-darkBg', 'text-textMuted', 'border', 'border-darkBorder');
            text.classList.add('text-textMain');
            text.classList.remove('text-textMuted');
        } else {
            circle.classList.remove('bg-primary', 'text-white', 'shadow-[0_0_10px_rgba(109,91,238,0.5)]');
            circle.classList.add('bg-darkBg', 'text-textMuted', 'border', 'border-darkBorder');
            text.classList.remove('text-textMain');
            text.classList.add('text-textMuted');
        }
    });

    document.getElementById('btn-cancel').classList.remove('hide');
    document.getElementById('btn-next-scan').classList.add('hide');
    document.getElementById('btn-confirm-sync').classList.add('hide');
    document.getElementById('btn-done').classList.add('hide');

    if (stepNum === 1) {
        document.getElementById('step-upload').classList.remove('hide');
        document.getElementById('btn-next-scan').classList.remove('hide');
        document.getElementById('btn-next-scan').disabled = !currentImageSrc;
    } else if (stepNum === 2) {
        document.getElementById('step-scanning').classList.remove('hide');
        document.getElementById('btn-cancel').classList.add('hide');
    } else if (stepNum === 3) {
        document.getElementById('step-review').classList.remove('hide');
        document.getElementById('btn-confirm-sync').classList.remove('hide');
    } else if (stepNum === 4) {
        document.getElementById('step-success').classList.remove('hide');
        document.getElementById('btn-cancel').classList.add('hide');
        document.getElementById('btn-done').classList.remove('hide');
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    currentImageSrc = URL.createObjectURL(file);
    showImagePreview();
}

window.useDemoImage = function() {
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0F0F1A'; ctx.fillRect(0, 0, 800, 600); // Dark fridge bg
    ctx.fillStyle = '#2D2D3F'; ctx.fillRect(0, 200, 800, 20); ctx.fillRect(0, 400, 800, 20); // Dark shelves
    
    ctx.fillStyle = '#6D5BEE';
    for(let i=0; i<12; i++) ctx.fillRect(20 + (i*60), 60, 50, 140);
    
    ctx.fillStyle = '#FFB74D';
    for(let i=0; i<3; i++) ctx.fillRect(50 + (i*80), 320, 60, 80);

    currentImageSrc = canvas.toDataURL('image/jpeg');
    document.getElementById('shelf-category').value = "Dairy";
    showImagePreview();
};

function showImagePreview() {
    document.getElementById('upload-area').classList.add('hide');
    document.getElementById('image-preview-container').classList.remove('hide');
    document.getElementById('image-preview').src = currentImageSrc;
    document.getElementById('btn-next-scan').disabled = false;
}

window.resetUpload = function() {
    currentImageSrc = null;
    const iu = document.getElementById('image-upload-input');
    if(iu) iu.value = "";
    const cu = document.getElementById('camera-upload-input');
    if(cu) cu.value = "";
    document.getElementById('upload-area').classList.remove('hide');
    document.getElementById('image-preview-container').classList.add('hide');
    document.getElementById('btn-next-scan').disabled = true;
};

window.startScan = async function() {
    setStep(2);
    document.getElementById('scan-target-image').src = currentImageSrc;
    
    const statusText = document.getElementById('scan-status-text');
    const category = document.getElementById('shelf-category').value;
    
    const statuses = ["Connecting to AI...", "Detecting items...", "Counting products...", "Comparing with inventory..."];
    let i = 0;
    const statusInterval = setInterval(() => {
        i = (i + 1) % statuses.length;
        statusText.textContent = statuses[i];
    }, 600);

    currentDetections = await simulateShelfScan(currentImageSrc, category);
    clearInterval(statusInterval);
    processDetections();
    setStep(3);
};

function processDetections() {
    document.getElementById('review-image').src = currentImageSrc;
    const category = document.getElementById('shelf-category').value;
    const catItems = inventory.filter(i => i.category === category);
    
    pendingAdjustments = [];
    const boxesContainer = document.getElementById('bounding-boxes-container');
    boxesContainer.innerHTML = '';
    
    const tbody = document.getElementById('diff-tbody');
    tbody.innerHTML = '';
    
    const actionList = document.getElementById('action-items-list');
    actionList.innerHTML = '';
    let hasActionItems = false;

    // Draw rows with steppers for EVERY item in that category
    catItems.forEach(systemItem => {
        const detection = currentDetections.find(d => d.productId === systemItem.id);
        const detectedCount = detection ? detection.count : 0;
        const diff = detectedCount - systemItem.systemStock;
        
        if (diff !== 0) {
            pendingAdjustments.push({
                productId: systemItem.id,
                name: systemItem.name,
                before: systemItem.systemStock,
                after: detectedCount,
                delta: diff
            });
        }
        
        const tr = document.createElement('tr');
        tr.className = 'border-b border-darkBorder last:border-0 hover:bg-darkBorder/30';
        
        let diffHtml = '';
        if (diff > 0) diffHtml = `<span class="text-success font-bold bg-success/20 px-2 py-0.5 rounded text-xs">+${diff}</span>`;
        else if (diff < 0) diffHtml = `<span class="text-danger font-bold bg-danger/20 px-2 py-0.5 rounded text-xs">${diff}</span>`;
        else diffHtml = `<span class="text-textMuted font-medium text-xs">OK</span>`;
        
        tr.innerHTML = `
            <td class="px-4 py-2 font-medium text-textMain">${systemItem.name}</td>
            <td class="px-4 py-2 text-center text-textMuted">${systemItem.systemStock}</td>
            <td class="px-4 py-2 text-center">
                <div class="inline-flex items-center gap-1 bg-darkBg rounded border border-darkBorder shadow-sm mx-auto">
                    <button onclick="updateCount(${systemItem.id}, -1)" class="px-2 py-0.5 text-textMuted hover:bg-darkBorder/50 border-r border-darkBorder">-</button>
                    <span id="detected-count-${systemItem.id}" class="font-bold text-sm min-w-[24px] text-center text-textMain">${detectedCount}</span>
                    <button onclick="updateCount(${systemItem.id}, 1)" class="px-2 py-0.5 text-textMuted hover:bg-darkBorder/50 border-l border-darkBorder">+</button>
                </div>
            </td>
            <td class="px-4 py-2 text-right" id="diff-col-${systemItem.id}">${diffHtml}</td>
        `;
        tbody.appendChild(tr);
    });

    currentDetections.forEach(det => {
        if (det.boxes) {
            det.boxes.forEach(box => {
                const boxEl = document.createElement('div');
                let boxClass = 'bounding-box';
                if (det.status === 'low_confidence') boxClass += ' low-confidence';
                if (det.status === 'unknown') boxClass += ' unknown';
                boxEl.className = boxClass;
                boxEl.style.left = `${box.x}%`;
                boxEl.style.top = `${box.y}%`;
                boxEl.style.width = `${box.w}%`;
                boxEl.style.height = `${box.h}%`;
                boxEl.innerHTML = `<div class="absolute -top-6 left-0 bg-darkCard border border-darkBorder text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition shadow-lg">${det.label} (${det.confidence}%)</div>`;
                boxesContainer.appendChild(boxEl);
            });
        }
        
        if (det.status === 'low_confidence' || det.status === 'unknown') {
            hasActionItems = true;
            const actionEl = document.createElement('div');
            
            if (det.status === 'low_confidence') {
                actionEl.className = `p-3 rounded-lg border bg-warning/10 border-warning/30 flex justify-between items-center`;
                actionEl.innerHTML = `
                    <div>
                        <div class="text-sm font-bold text-warning"><i class="fas fa-exclamation-triangle mr-1"></i> Low Confidence (${det.confidence}%)</div>
                        <div class="text-xs text-warning/80">Verify count for: ${det.label}</div>
                    </div>
                    <div class="flex items-center gap-2 bg-darkBg rounded border border-warning/30">
                        <button onclick="updateCount(${det.productId}, -1)" class="px-3 py-1 text-textMuted hover:bg-darkBorder/50">-</button>
                        <span id="action-count-${det.productId}" class="font-bold text-sm min-w-[20px] text-center text-textMain">${det.count}</span>
                        <button onclick="updateCount(${det.productId}, 1)" class="px-3 py-1 text-textMuted hover:bg-darkBorder/50">+</button>
                    </div>
                `;
            } else {
                const safeId = det.label.replace(/[^a-zA-Z0-9]/g, '-');
                actionEl.className = `p-3 rounded-lg border bg-danger/10 border-danger/30 flex flex-col gap-2`;
                actionEl.innerHTML = `
                    <div id="unknown-view-${safeId}" class="flex justify-between items-center w-full">
                        <div>
                            <div class="text-sm font-bold text-danger"><i class="fas fa-question-circle mr-1"></i> New Product Detected</div>
                            <div class="text-xs text-danger/80">Found ${det.count}x "${det.label}"</div>
                        </div>
                        <button onclick="showAddProductForm('${safeId}')" class="text-xs bg-darkBg border border-danger/30 text-danger px-3 py-1.5 rounded hover:bg-danger/20 font-medium transition cursor-pointer">
                            Add to Inventory
                        </button>
                    </div>
                    <div id="unknown-form-${safeId}" class="hide w-full bg-darkBg/50 border border-darkBorder p-3 rounded mt-1">
                        <div class="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-wider">Register New Item</div>
                        <div class="grid grid-cols-3 gap-2 mb-3">
                            <input type="text" id="new-name-${safeId}" value="${det.label}" class="col-span-2 bg-darkCard border border-darkBorder rounded px-2 py-1.5 text-sm text-textMain focus:border-primary outline-none">
                            <input type="number" id="new-price-${safeId}" placeholder="Price ₹" class="bg-darkCard border border-darkBorder rounded px-2 py-1.5 text-sm text-textMain focus:border-primary outline-none">
                        </div>
                        <div class="flex justify-end gap-2">
                            <button onclick="cancelAddProduct('${safeId}')" class="text-xs text-textMuted hover:text-white px-3 py-1.5 transition">Cancel</button>
                            <button onclick="confirmAddProduct('${det.label}', '${safeId}', ${det.count})" class="text-xs bg-success hover:bg-success/80 text-white px-4 py-1.5 rounded font-medium transition shadow-[0_0_10px_rgba(76,175,80,0.3)]">Save Product</button>
                        </div>
                    </div>
                `;
            }
            actionList.appendChild(actionEl);
        }
    });

    document.getElementById('action-required-container').classList.toggle('hide', !hasActionItems);
}

window.updateCount = function(productId, delta) {
    let detection = currentDetections.find(d => d.productId === productId);
    if (!detection) {
        detection = { productId: productId, count: 0, status: 'matched' };
        currentDetections.push(detection);
    }
    
    const item = inventory.find(i => i.id === productId);
    const systemStock = item ? item.systemStock : 0;
    
    detection.count = Math.max(0, detection.count + delta);
    
    const diff = detection.count - systemStock;
    const existingAdjIndex = pendingAdjustments.findIndex(a => a.productId === productId);
    
    if (diff !== 0) {
        if (existingAdjIndex >= 0) {
            pendingAdjustments[existingAdjIndex].after = detection.count;
            pendingAdjustments[existingAdjIndex].delta = diff;
        } else if (item) {
            pendingAdjustments.push({
                productId: productId,
                name: item.name,
                before: systemStock,
                after: detection.count,
                delta: diff
            });
        }
    } else {
        if (existingAdjIndex >= 0) pendingAdjustments.splice(existingAdjIndex, 1);
    }

    const tableSpan = document.getElementById(`detected-count-${productId}`);
    if (tableSpan) tableSpan.textContent = detection.count;
    
    const actionSpan = document.getElementById(`action-count-${productId}`);
    if (actionSpan) actionSpan.textContent = detection.count;
    
    const diffCol = document.getElementById(`diff-col-${productId}`);
    if (diffCol) {
        if (diff > 0) diffCol.innerHTML = `<span class="text-success font-bold bg-success/20 px-2 py-0.5 rounded text-xs">+${diff}</span>`;
        else if (diff < 0) diffCol.innerHTML = `<span class="text-danger font-bold bg-danger/20 px-2 py-0.5 rounded text-xs">${diff}</span>`;
        else diffCol.innerHTML = `<span class="text-textMuted font-medium text-xs">OK</span>`;
    }
};

window.applySync = function() {
    if (pendingAdjustments.length === 0) {
        showToast("No adjustments needed. Inventory is accurate.");
        closeSyncModal();
        return;
    }
    
    const now = new Date().toISOString();
    
    pendingAdjustments.forEach(adj => {
        const item = inventory.find(i => i.id === adj.productId);
        if (item) {
            item.systemStock = adj.after;
            item.lastSyncedAt = now;
        }
    });
    
    syncHistory.push({
        id: "SYNC-" + Math.floor(Math.random() * 10000),
        timestamp: now,
        category: document.getElementById('shelf-category').value,
        adjustments: [...pendingAdjustments],
        status: "applied"
    });
    
    renderDashboard();
    renderCustomerApp();
    
    const successList = document.getElementById('success-adjustments-list');
    successList.innerHTML = '';
    let totalSynced = inventory.filter(i => i.category === document.getElementById('shelf-category').value).length;
    
    pendingAdjustments.forEach(adj => {
        const li = document.createElement('li');
        li.className = 'py-2 flex justify-between items-center';
        let deltaHtml = '';
        if (adj.delta > 0) deltaHtml = `<span class="text-success font-medium text-xs">+${adj.delta}</span>`;
        else deltaHtml = `<span class="text-danger font-medium text-xs">${adj.delta}</span>`;
        
        li.innerHTML = `
            <div>
                <div class="font-medium text-textMain">${adj.name}</div>
                <div class="text-xs text-textMuted">${adj.before} <i class="fas fa-arrow-right text-[10px] mx-1"></i> ${adj.after}</div>
            </div>
            <div class="bg-darkBg border border-darkBorder px-2 py-1 rounded">
                ${deltaHtml}
            </div>
        `;
        successList.appendChild(li);
    });
    
    document.getElementById('success-summary').textContent = `${totalSynced} products scanned, ${pendingAdjustments.length} adjusted.`;
    setStep(4);
};

window.showToast = function(message) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    document.getElementById('toast-message').textContent = message;
    
    // Animate In
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    setTimeout(() => {
        // Animate Out
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }, 3000);
};

window.handleReorder = function(productName) {
    showToast(`Reorder request sent for ${productName}`);
};

window.handleViewItem = function(productName) {
    switchPage('inventory', null);
    const searchInput = document.getElementById('inventory-search');
    if (searchInput) {
        searchInput.value = productName;
        inventorySearchQuery = productName.toLowerCase();
        renderDashboard();
    }
};

window.showAddProductForm = function(safeId) {
    document.getElementById(`unknown-view-${safeId}`).classList.add('hide');
    document.getElementById(`unknown-form-${safeId}`).classList.remove('hide');
};

window.cancelAddProduct = function(safeId) {
    document.getElementById(`unknown-view-${safeId}`).classList.remove('hide');
    document.getElementById(`unknown-form-${safeId}`).classList.add('hide');
};

window.confirmAddProduct = function(originalLabel, safeId, count) {
    const name = document.getElementById(`new-name-${safeId}`).value || originalLabel;
    const priceStr = document.getElementById(`new-price-${safeId}`).value;
    const price = priceStr ? parseInt(priceStr) : 50; 
    const category = document.getElementById('shelf-category').value;
    
    // Create new product
    const newId = Math.max(...inventory.map(i => i.id)) + 1;
    const newProduct = {
        id: newId,
        name: name,
        brand: "Local Brand",
        category: category,
        unit: "1 pc",
        price: price,
        systemStock: 0, 
        lastSyncedAt: new Date().toISOString()
    };
    
    // Add to main inventory
    inventory.push(newProduct);
    
    // Update the detection from 'unknown' to 'matched'
    let detection = currentDetections.find(d => d.label === originalLabel && d.status === 'unknown');
    if (detection) {
        detection.productId = newId;
        detection.status = 'matched';
        detection.label = name; 
    }
    
    showToast(`Successfully added ${name} to database!`);
    
    // Re-render the UI so it moves from "Needs Attention" to the Diff Table
    processDetections();
};

window.openManualAddModal = function() {
    document.getElementById('manual-add-overlay').classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        document.getElementById('manual-add-modal').classList.remove('scale-95');
    }, 10);
};

window.closeManualAddModal = function() {
    document.getElementById('manual-add-modal').classList.add('scale-95');
    document.getElementById('manual-add-overlay').classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('manual-name').value = '';
    document.getElementById('manual-price').value = '';
    document.getElementById('manual-stock').value = '0';
    document.getElementById('manual-unit').value = '';
};

window.submitManualProduct = function() {
    const name = document.getElementById('manual-name').value;
    const category = document.getElementById('manual-category').value;
    const priceStr = document.getElementById('manual-price').value;
    const stockStr = document.getElementById('manual-stock').value;
    const unit = document.getElementById('manual-unit').value || "1 pc";

    if (!name) {
        showToast("Product name is required!");
        return;
    }

    const newId = Math.max(...inventory.map(i => i.id), 0) + 1;
    const newProduct = {
        id: newId,
        name: name,
        brand: "Local Brand",
        category: category,
        unit: unit,
        price: priceStr ? parseInt(priceStr) : 0,
        systemStock: stockStr ? parseInt(stockStr) : 0,
        lastSyncedAt: new Date().toISOString()
    };

    inventory.unshift(newProduct); 
    
    closeManualAddModal();
    showToast(`${name} has been added successfully!`);
    
    renderDashboard();
    renderCustomerApp();
};

window.handleIntegration = function(name) {
    showToast(`Connecting to ${name} POS system...`);
    setTimeout(() => {
        showToast(`${name} POS Beta requested. Our support team will contact you for setup.`);
    }, 2500);
};

// --- Mobile View Preview Toggle ---
window.isMobileView = false;
window.toggleMobileView = function() {
    isMobileView = !isMobileView;
    const btn = document.getElementById('view-toggle-btn');
    
    if (isMobileView) {
        document.body.classList.add('force-mobile');
        if(btn) btn.innerHTML = '<i class="fas fa-desktop group-hover:animate-pulse"></i> <span>Desktop View Preview</span>';
    } else {
        document.body.classList.remove('force-mobile');
        if(btn) btn.innerHTML = '<i class="fas fa-mobile-alt group-hover:animate-bounce"></i> <span>Mobile View Preview</span>';
    }
};
