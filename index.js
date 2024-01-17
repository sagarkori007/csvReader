const express = require('express');
const app = express();
const port = 8000;

const db = require('./config/mongoose');

//set static file
app.use(express.static('./assets'));
//set view engine 
app.set('view engine','ejs');
//set the dynamic view folder
app.set('views', './views');

app.use('/',require('./routes/index'));



app.listen(port,(error)=>{
    if (error){
        console.log(`Error in starting the server ${port}`);
        return ;
    }
    console.log(`Server is up and running ${port}`);
})