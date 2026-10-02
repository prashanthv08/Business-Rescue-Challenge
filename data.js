// Mock Database
let inventory = [
    // Dairy & Fridge
    { id: 1, name: "Amul Taaza Milk 1L", brand: "Amul", category: "Dairy", unit: "1L", price: 68, systemStock: 12, lastSyncedAt: "2026-10-01T10:00:00Z" },
    { id: 2, name: "Amul Butter 500g", brand: "Amul", category: "Dairy", unit: "500g", price: 285, systemStock: 2, lastSyncedAt: "2026-09-28T14:30:00Z" },
    { id: 3, name: "Mother Dairy Curd 400g", brand: "Mother Dairy", category: "Dairy", unit: "400g", price: 35, systemStock: 0, lastSyncedAt: "2026-10-01T09:15:00Z" },
    { id: 4, name: "Amul Cheese Slices", brand: "Amul", category: "Dairy", unit: "200g", price: 135, systemStock: 3, lastSyncedAt: "2026-09-25T11:00:00Z" },
    { id: 5, name: "Britannia Brown Bread", brand: "Britannia", category: "Dairy", unit: "400g", price: 45, systemStock: 8, lastSyncedAt: "2026-10-01T18:00:00Z" },
    { id: 18, name: "Epigamia Greek Yogurt", brand: "Epigamia", category: "Dairy", unit: "90g", price: 40, systemStock: 15, lastSyncedAt: "2026-10-02T08:00:00Z" },
    { id: 19, name: "Milky Mist Paneer", brand: "Milky Mist", category: "Dairy", unit: "200g", price: 105, systemStock: 5, lastSyncedAt: "2026-10-01T14:00:00Z" },
    
    // Snacks
    { id: 6, name: "Lays Classic Salted", brand: "Lays", category: "Snacks", unit: "50g", price: 20, systemStock: 15, lastSyncedAt: "2026-09-29T12:00:00Z" },
    { id: 7, name: "Parle-G Biscuits", brand: "Parle", category: "Snacks", unit: "130g", price: 10, systemStock: 0, lastSyncedAt: "2026-09-29T12:00:00Z" },
    { id: 8, name: "Maggi 2-Min Noodles", brand: "Nestle", category: "Snacks", unit: "140g", price: 28, systemStock: 3, lastSyncedAt: "2026-09-30T10:00:00Z" },
    { id: 9, name: "Haldiram's Bhujia", brand: "Haldiram's", category: "Snacks", unit: "400g", price: 110, systemStock: 8, lastSyncedAt: "2026-09-25T11:00:00Z" },
    { id: 20, name: "Kurkure Masala Munch", brand: "Kurkure", category: "Snacks", unit: "90g", price: 20, systemStock: 12, lastSyncedAt: "2026-10-01T10:00:00Z" },
    { id: 21, name: "Britannia Good Day", brand: "Britannia", category: "Snacks", unit: "250g", price: 40, systemStock: 6, lastSyncedAt: "2026-09-28T09:00:00Z" },
    { id: 22, name: "Bingo Mad Angles", brand: "Bingo", category: "Snacks", unit: "72g", price: 20, systemStock: 0, lastSyncedAt: "2026-09-27T16:00:00Z" },
    { id: 23, name: "Nutella Hazelnut Spread", brand: "Ferrero", category: "Snacks", unit: "350g", price: 349, systemStock: 4, lastSyncedAt: "2026-10-01T11:00:00Z" },
    
    // Beverages
    { id: 10, name: "Coca Cola", brand: "Coca Cola", category: "Beverages", unit: "750ml", price: 40, systemStock: 24, lastSyncedAt: "2026-10-01T10:00:00Z" },
    { id: 11, name: "Red Bull Energy Drink", brand: "Red Bull", category: "Beverages", unit: "250ml", price: 125, systemStock: 5, lastSyncedAt: "2026-09-28T14:30:00Z" },
    { id: 12, name: "Nescafe Classic Coffee", brand: "Nestle", category: "Beverages", unit: "100g", price: 320, systemStock: 2, lastSyncedAt: "2026-09-25T11:00:00Z" },
    { id: 13, name: "Taj Mahal Tea", brand: "Brooke Bond", category: "Beverages", unit: "250g", price: 160, systemStock: 9, lastSyncedAt: "2026-10-01T18:00:00Z" },
    { id: 24, name: "Thumbs Up", brand: "Coca Cola", category: "Beverages", unit: "1.25L", price: 65, systemStock: 18, lastSyncedAt: "2026-10-01T14:00:00Z" },
    { id: 25, name: "Frooti Mango Drink", brand: "Parle Agro", category: "Beverages", unit: "1.2L", price: 70, systemStock: 0, lastSyncedAt: "2026-09-29T10:00:00Z" },
    { id: 26, name: "Kinley Water Bottle", brand: "Kinley", category: "Beverages", unit: "1L", price: 20, systemStock: 45, lastSyncedAt: "2026-10-02T08:00:00Z" },
    
    // Staples & Grocery
    { id: 14, name: "Aashirvaad Atta", brand: "Aashirvaad", category: "Staples", unit: "5kg", price: 240, systemStock: 15, lastSyncedAt: "2026-10-01T10:00:00Z" },
    { id: 15, name: "India Gate Basmati Rice", brand: "India Gate", category: "Staples", unit: "1kg", price: 150, systemStock: 10, lastSyncedAt: "2026-09-28T14:30:00Z" },
    { id: 16, name: "Fortune Sunflower Oil", brand: "Fortune", category: "Staples", unit: "1L", price: 135, systemStock: 8, lastSyncedAt: "2026-09-25T11:00:00Z" },
    { id: 17, name: "Tata Salt", brand: "Tata", category: "Staples", unit: "1kg", price: 25, systemStock: 30, lastSyncedAt: "2026-10-01T18:00:00Z" },
    { id: 27, name: "Toor Dal (Premium)", brand: "Loose", category: "Staples", unit: "1kg", price: 180, systemStock: 0, lastSyncedAt: "2026-09-28T10:00:00Z" },
    { id: 28, name: "Sugar", brand: "Madhur", category: "Staples", unit: "1kg", price: 45, systemStock: 22, lastSyncedAt: "2026-10-01T09:00:00Z" },
    
    // Personal Care
    { id: 29, name: "Dettol Liquid Handwash", brand: "Dettol", category: "Personal Care", unit: "200ml", price: 99, systemStock: 12, lastSyncedAt: "2026-10-01T11:00:00Z" },
    { id: 30, name: "Colgate MaxFresh", brand: "Colgate", category: "Personal Care", unit: "150g", price: 110, systemStock: 8, lastSyncedAt: "2026-09-25T15:00:00Z" },
    { id: 31, name: "Dove Soap Bar", brand: "Dove", category: "Personal Care", unit: "100g", price: 65, systemStock: 1, lastSyncedAt: "2026-09-22T10:00:00Z" },
    { id: 32, name: "Head & Shoulders Shampoo", brand: "H&S", category: "Personal Care", unit: "180ml", price: 165, systemStock: 5, lastSyncedAt: "2026-09-28T12:00:00Z" }
];

let syncHistory = [];

// Simulated AI Logic
function simulateShelfScan(imageFile, category) {
    return new Promise((resolve) => {
        // Mock processing delay
        setTimeout(() => {
            const results = [];
            
            if (category === "Dairy") {
                results.push({ productId: 1, label: "Amul Taaza Milk 1L", count: 12, confidence: 96, status: "matched", boxes: generateRandomBoxes(12) });
                results.push({ productId: 2, label: "Amul Butter 500g", count: 3, confidence: 91, status: "matched", boxes: generateRandomBoxes(3) }); // System had 2, AI found 3
                results.push({ productId: 3, label: "Mother Dairy Curd 400g", count: 6, confidence: 88, status: "matched", boxes: generateRandomBoxes(6) }); // System had 0, AI found 6
                results.push({ productId: 4, label: "Amul Cheese Slices", count: 1, confidence: 65, status: "low_confidence", boxes: generateRandomBoxes(1) }); // Low confidence flag
                results.push({ productId: 18, label: "Epigamia Greek Yogurt", count: 15, confidence: 94, status: "matched", boxes: generateRandomBoxes(15) });
                results.push({ productId: null, label: "Unknown Energy Drink", count: 4, confidence: 45, status: "unknown", boxes: generateRandomBoxes(4) });
            } else if (category === "Snacks") {
                results.push({ productId: 6, label: "Lays Classic Salted", count: 15, confidence: 95, status: "matched", boxes: generateRandomBoxes(15) });
                results.push({ productId: 7, label: "Parle-G Biscuits", count: 12, confidence: 98, status: "matched", boxes: generateRandomBoxes(12) }); // System had 0
                results.push({ productId: 8, label: "Maggi 2-Min Noodles", count: 2, confidence: 85, status: "matched", boxes: generateRandomBoxes(2) });
                results.push({ productId: 9, label: "Haldiram's Bhujia", count: 8, confidence: 90, status: "matched", boxes: generateRandomBoxes(8) });
                results.push({ productId: 22, label: "Bingo Mad Angles", count: 5, confidence: 60, status: "low_confidence", boxes: generateRandomBoxes(5) }); 
                results.push({ productId: null, label: "Unknown Local Chips", count: 6, confidence: 30, status: "unknown", boxes: generateRandomBoxes(6) });
            } else {
                // Generic mock for other categories
                const catItems = inventory.filter(i => i.category === category);
                catItems.forEach(item => {
                    results.push({
                        productId: item.id,
                        label: item.name,
                        count: Math.max(0, item.systemStock + Math.floor(Math.random() * 5) - 2), // Randomly adjust count by -2 to +2
                        confidence: Math.floor(Math.random() * 20) + 80,
                        status: "matched",
                        boxes: generateRandomBoxes(1)
                    });
                });
            }
            
            resolve(results);
        }, 2500); // 2.5 second scan delay
    });
}

function generateRandomBoxes(count) {
    const boxes = [];
    for(let i=0; i<count; i++) {
        boxes.push({
            x: 10 + Math.random() * 70, // 10% to 80%
            y: 10 + Math.random() * 70, 
            w: 8 + Math.random() * 10,
            h: 12 + Math.random() * 15
        });
    }
    return boxes;
}

// Helper to format dates
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date(); 
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds/60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds/3600)} hours ago`;
    return `${Math.floor(diffInSeconds/86400)} days ago`;
}
