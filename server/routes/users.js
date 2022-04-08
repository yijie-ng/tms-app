const express = require('express');
const { Router } = require('express');
const router = Router();
const db = require('../database');

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
})

module.exports = router;