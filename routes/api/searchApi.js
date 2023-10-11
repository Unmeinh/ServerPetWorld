var express = require('express');
var mdJWT= require('../../middlewares/api.auth');
var SearchController = require('../../controller/api/searchApi')
var router = express.Router();

router.get('/:name',mdJWT.api_auth,SearchController.searchApi)

module.exports = router;