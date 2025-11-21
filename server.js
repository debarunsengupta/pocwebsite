#!/usr/bin/env node

/**
 * Node.js Express Server
 * Basic REST API with Express
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==================== ROUTES ====================

// Home page - serve index-node.html
app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, 'index-node.html'));

res.sendFile(path.join(__dirname, 'FinalNewGDCAIUsageDashboardPreview.html'));
    
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        server: 'Node.js Express',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.version
    });
});

// User data API
app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer' },
        { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Designer' },
        { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Manager' }
    ];
    res.json({ users, count: users.length });
});

// Calculator API
app.post('/api/calculate', (req, res) => {
    try {
        const { operation, num1, num2 } = req.body;
        
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        
        if (isNaN(a) || isNaN(b)) {
            return res.status(400).json({ error: 'Invalid numbers provided' });
        }
        
        let result;
        switch (operation) {
            case 'add':
                result = a + b;
                break;
            case 'subtract':
                result = a - b;
                break;
            case 'multiply':
                result = a * b;
                break;
            case 'divide':
                if (b === 0) {
                    return res.status(400).json({ error: 'Cannot divide by zero' });
                }
                result = a / b;
                break;
            default:
                return res.status(400).json({ error: 'Invalid operation' });
        }
        
        res.json({
            operation,
            num1: a,
            num2: b,
            result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// String manipulation API
app.post('/api/text/process', (req, res) => {
    try {
        const { text, operation } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        
        let result;
        switch (operation) {
            case 'uppercase':
                result = text.toUpperCase();
                break;
            case 'lowercase':
                result = text.toLowerCase();
                break;
            case 'reverse':
                result = text.split('').reverse().join('');
                break;
            case 'capitalize':
                result = text.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                break;
            case 'count':
                result = {
                    characters: text.length,
                    words: text.split(/\s+/).filter(w => w.length > 0).length,
                    lines: text.split('\n').length
                };
                break;
            default:
                return res.status(400).json({ error: 'Invalid operation' });
        }
        
        res.json({
            original: text,
            operation,
            result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate random data
app.post('/api/random', (req, res) => {
    try {
        const { type, count = 10 } = req.body;
        
        let result;
        switch (type) {
            case 'numbers':
                result = Array.from({ length: count }, () => 
                    Math.floor(Math.random() * 100) + 1
                );
                break;
            case 'uuid':
                result = Array.from({ length: count }, () => 
                    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                        const r = Math.random() * 16 | 0;
                        const v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    })
                );
                break;
            case 'colors':
                result = Array.from({ length: count }, () => 
                    '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
                );
                break;
            default:
                return res.status(400).json({ error: 'Invalid type' });
        }
        
        res.json({
            type,
            count: result.length,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// System info
app.get('/api/system', (req, res) => {
    res.json({
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        memory: {
            total: Math.round(require('os').totalmem() / 1024 / 1024) + ' MB',
            free: Math.round(require('os').freemem() / 1024 / 1024) + ' MB',
            usage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
        },
        uptime: Math.round(process.uptime()) + ' seconds',
        cpus: require('os').cpus().length,
        hostname: require('os').hostname()
    });
});

// Echo endpoint - useful for testing
app.post('/api/echo', (req, res) => {
    res.json({
        received: req.body,
        headers: req.headers,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
        message: 'The requested resource was not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log('='.repeat(70));
    console.log('🚀 Node.js Express Server Started');
    console.log('='.repeat(70));
    console.log(`📁 Serving from: ${__dirname}`);
    console.log(`🌐 Server running at: http://localhost:${PORT}/`);
    console.log(`🔧 API Base URL: http://localhost:${PORT}/api/`);
    console.log('='.repeat(70));
    console.log('Available API Endpoints:');
    console.log('  GET  /api/health         - Health check');
    console.log('  GET  /api/users          - Get users list');
    console.log('  POST /api/calculate      - Calculator');
    console.log('  POST /api/text/process   - Text manipulation');
    console.log('  POST /api/random         - Generate random data');
    console.log('  GET  /api/system         - System information');
    console.log('  POST /api/echo           - Echo request data');
    console.log('='.repeat(70));
    console.log('Press Ctrl+C to stop the server');
    console.log('='.repeat(70));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

