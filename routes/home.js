let express = require('express');
let router = express.Router();


router.post('/', async (req, res, next) => {
    const {id, textAm, textRu, textEn} = req.body;
    
})