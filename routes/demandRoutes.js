const express = require('express');
const router = express.Router();
const demandController = require('../controllers/demandController');
const authenticateToken = require('../middlewares/authentication');

router.get('/', authenticateToken, demandController.getAllDemands);
router.get('/:id', authenticateToken, demandController.getDemandById);
router.post('/', authenticateToken, demandController.createDemand);
router.put('/:id', authenticateToken, demandController.updateDemand);
router.delete('/:id', authenticateToken, demandController.deleteDemand);
router.patch('/:id', authenticateToken, demandController.finishedDemand);

module.exports = router;
