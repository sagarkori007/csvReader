const mongoose = require('mongoose');

//connect to the local database 
mongoose.connect("mongodb://127.0.0.1/csvUploadApp")
    .then(()=>{console.log('connected to the data base!')})
    .catch((error)=>{console.log(`Unable to connect to the data base!! ${error}`)});

