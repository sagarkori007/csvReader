const express = require('express');
const router = express.Router();

//importing the file controller
const fileController = require('../controllers/fileController');

//routing the home page
router.get('/',fileController.home);

//router for uploading the csv 
router.post('/upload-csv',fileController.uploadCSV, fileController.processCSV);

//router for displaying the content 
router.get('/display/:filename', fileController.displayFile);

//check, message
console.log('router loaded!!')

module.exports = router;
