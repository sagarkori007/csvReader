const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');

router.get('/',fileController.home);

router.post('/upload-csv',fileController.uploadCSV, fileController.processCSV);
router.get('/display/:filename', fileController.displayFile);

//check, message
console.log('router loaded!!')

module.exports = router;
