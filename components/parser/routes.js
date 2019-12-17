const express = require('express');
const router = express.Router();
const Queue = require('./services/queue');
const Database = require('../../db');

const db = new Database();
let queue = new Queue();

router.post('/services', async (req, res, next) => {
    const {q} = req.body;
    queue.push(new Date(), q, 'pendiente', 0, []);
    res.send({ok: true});
});

router.get('/services', async (req, res, next) => {
    await db.connect();
    let data = await db.getAllResults('busquedas');
    res.send({data});
});

router.get('/services/search', async (req, res, next) => {
    const nombre = req.query.nombre;
    const id = req.query.id
    let data;
    await db.connect();
    if (nombre) {
        data = await db.getResultBySearch('busquedas', nombre);
    } else {
        if (id) {
            data = await db.getResultById('busquedas', id);
        }
    }
    res.send({data});
});

module.exports = router;