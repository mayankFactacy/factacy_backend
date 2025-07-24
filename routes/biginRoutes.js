const express = require('express');
const router = express.Router();
const zohoAuthMiddleware = require('../middlewares/zohoAuthMiddleware'); 
const biginController = require('../controllers/biginController');
 

router.post("/contacts",zohoAuthMiddleware,biginController.searchOrCreateContact)

module.exports = router;
