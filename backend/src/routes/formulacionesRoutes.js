const express = require('express');
const router = express.Router();
const formulacionesController = require('../controllers/formulacionesController');

router.get('/', formulacionesController.getAllFormulaciones);

router.post('/calculate-costs/:itemId', formulacionesController.calculateCostsWithNewVolume);
router.put('/update-costs/:itemId', formulacionesController.updateCalculatedCosts);

module.exports = router;