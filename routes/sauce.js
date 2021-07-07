const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer.config');

router.post('/', auth, multer, sauceCtrl.createSauces);
router.post('/:id/like', auth, sauceCtrl.likes);
router.put('/:id', auth, multer, sauceCtrl.modifySauces);
router.delete('/:id', auth, sauceCtrl.deleteSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;
