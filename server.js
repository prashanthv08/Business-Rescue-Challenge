/**
 * STORESYNC - PERFECT BACKEND ARCHITECTURE (Node.js / Express)
 * 
 * NOTE ON CONSTRAINTS: 
 * As per your strict ₹25 Lakh budget and prototype requirements, building and 
 * deploying a real Computer Vision AI model and PostgreSQL database would consume 
 * the entire budget instantly. 
 * 
 * Instead, this is the "Perfect Backend Blueprint". It provides a fully functional 
 * Node.js/Express mock server that defines the exact RESTful API architecture 
 * needed for production. You can use this to prove to investors exactly how 
 * the frontend will connect to the AI microservices once seed funding is secured.
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

app.use(cors({ origin: process.env.FRONTEND_URL || '*' })); // Default restricted origin or wildcard fallback
app.use(express.json());

// Block access to sensitive files
app.use((req, res, next) => {
    const forbidden = ['/server.js', '/server.test.js', '/package.json', '/vercel.json', '/.env', '/upload_github.js', '/better-fix-a11y.js', '/fix-a11y.js'];
    if (forbidden.includes(req.path)) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
});

// Serve the frontend prototype files directly from the backend
app.use(express.static(path.join(__dirname, './'), { index: 'index.html', maxAge: '1d' }));
// Multer config for handling mobile camera/gallery image uploads in memory
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ==========================================
// MOCK DATABASE (In-Memory for Prototype)
// ==========================================
let inventoryDB = [
    { id: 1, name: "Britannia Brown Bread", category: "Dairy", price: 45, stock: 8 },
    { id: 2, name: "Nandini Milk (500ml)", category: "Dairy", price: 24, stock: 15 },
    { id: 3, name: "Parle-G Biscuits", category: "Snacks", price: 10, stock: 0 }
];

// ==========================================
// 1. INVENTORY API
// ==========================================
app.get('/api/inventory', (req, res) => {
    // Fetches all current stock for the dashboard
    res.json({ success: true, data: inventoryDB });
});

app.post('/api/inventory/update', (req, res) => {
    // Updates stock counts after an AI scan or manual entry
    const { updates } = req.body;
    
    if (!Array.isArray(updates)) {
        return res.status(400).json({ success: false, error: "Invalid payload format" });
    }

    updates.forEach(update => {
        if (typeof update.productId !== 'number' || typeof update.newStock !== 'number') return;
        const item = inventoryDB.find(i => i.id === update.productId);
        if (item) item.stock = update.newStock;
    });

    res.json({ success: true, message: "Inventory updated successfully" });
});

// ==========================================
// 2. AI COMPUTER VISION API (Simulated)
// ==========================================
// In production, this endpoint acts as a proxy, sending the `req.file.buffer` 
// to a dedicated PyTorch/TensorFlow Python microservice via gRPC or HTTP.
app.post('/api/ai/scan-shelf', upload.single('shelfImage'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image captured.' });
        // SIMULATION: removed delay for efficiency

        // Simulated Object Detection Results returned by the CV model
        const aiDetections = [
            { productId: 1, label: "Britannia Brown Bread", count: 5, confidence: 98.5 },
            { productId: 3, label: "Parle-G Biscuits", count: 12, confidence: 92.1 },
            { productId: null, label: "Unknown Item", count: 2, confidence: 45.0 }
        ];

        res.json({ 
            success: true, 
            message: "Shelf image analyzed successfully",
            detections: aiDetections 
        });
    } catch (error) {
        console.error("AI Service Error:", error);
        res.status(500).json({ error: "AI Processing pipeline failed." });
    }
});

// ==========================================
// 3. POS INTEGRATION WEBHOOKS (Tally/Marg)
// ==========================================
app.post('/api/integrations/pos-sync', (req, res) => {
    // Endpoint for legacy POS systems to push daily sales data
    const { source, syncData } = req.body;
    
    if (typeof source !== 'string' || typeof syncData !== 'object' || !syncData) {
        return res.status(400).json({ success: false, error: "Invalid payload format" });
    }

    console.log(`[SYNC] Received incoming ledger data from ${source} POS.`);
    
    // Implementation to merge POS ledger with StoreSync database would go here
    
    res.json({ success: true, message: `Synced with ${source} successfully.` });
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`=================================================`);
        console.log(`🚀 StoreSync Backend running on http://localhost:${PORT}`);
        console.log(`📦 Architecture ready for PostgreSQL & PyTorch.`);
        console.log(`=================================================`);
    });
}

module.exports = app;
