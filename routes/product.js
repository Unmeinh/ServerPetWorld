var express = require('express');
var ProductCtrl = require('../controller/product.controller');
var router = express.Router();

router.get('/', ProductCtrl.listProduct);

router.get('/detail', ProductCtrl.detailProduct);//bổ sung /:idUser khi làm 

router.get('/add',ProductCtrl.addProduct);
router.post('/add', ProductCtrl.addProduct);

router.get('/edit', ProductCtrl.editProduct);//bổ sung /:idUser khi làm 
router.put('/edit', ProductCtrl.editProduct);//bổ sung /:idUser khi làm 

router.get('/delete',ProductCtrl.deleteProduct);//bổ sung /:idUser khi làm 
router.delete('/delete',ProductCtrl.deleteProduct);//bổ sung /:idUser khi làm 

module.exports = router;
