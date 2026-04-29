const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// Helper to read DB
const readDB = () => {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all data
app.get('/api/data', (req, res) => {
    try {
        const data = readDB();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error reading database' });
    }
});

// Update domains
app.post('/api/domains', (req, res) => {
    try {
        const { domains } = req.body;
        const data = readDB();
        data.domains = domains;
        writeDB(data);
        res.json({ message: 'Domains updated successfully', domains: data.domains });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domains' });
    }
});

// Update plans
app.post('/api/plans', (req, res) => {
    try {
        const { plans } = req.body;
        const data = readDB();
        data.plans = plans;
        writeDB(data);
        res.json({ message: 'Plans updated successfully', plans: data.plans });
    } catch (error) {
        res.status(500).json({ error: 'Error updating plans' });
    }
});

// Update status
app.post('/api/status', (req, res) => {
    try {
        const { status } = req.body;
        const data = readDB();
        data.status = { ...data.status, ...status, lastCheck: new Date().toISOString() };
        writeDB(data);
        res.json({ message: 'Status updated successfully', status: data.status });
    } catch (error) {
        res.status(500).json({ error: 'Error updating status' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
