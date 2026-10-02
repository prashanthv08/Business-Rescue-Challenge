const request = require('supertest');
const app = require('./server');

describe('StoreSync API', () => {
    it('GET /api/inventory should fetch inventory data', async () => {
        const res = await request(app).get('/api/inventory');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/inventory/update should update inventory', async () => {
        const payload = {
            updates: [
                { productId: 1, newStock: 15 }
            ]
        };
        const res = await request(app)
            .post('/api/inventory/update')
            .send(payload);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Inventory updated successfully");
        
        // Verify update
        const fetchRes = await request(app).get('/api/inventory');
        const updatedItem = fetchRes.body.data.find(i => i.id === 1);
        expect(updatedItem.stock).toEqual(15);
    });

    it('POST /api/ai/scan-shelf should return 400 if no image is uploaded', async () => {
        const res = await request(app).post('/api/ai/scan-shelf');
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('No image captured.');
    });

    it('POST /api/ai/scan-shelf should process image successfully', async () => {
        const buffer = Buffer.from('test image data');
        const res = await request(app)
            .post('/api/ai/scan-shelf')
            .attach('shelfImage', buffer, 'test.jpg');
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.detections)).toBe(true);
    });

    it('POST /api/integrations/pos-sync should process POS data', async () => {
        const payload = {
            source: 'Tally',
            syncData: { sales: 100 }
        };
        const res = await request(app)
            .post('/api/integrations/pos-sync')
            .send(payload);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain('Synced with Tally');
    });
});
