const express = require('express');
const app = express();
const books = require('../data.json')
const router = express.Router()

router.get('/', (req,res) =>{
    
    
    
    
    res.render("index", { books })
    
});




module.exports = router