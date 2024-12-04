const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

const { isLoggedIn, isAuthor, validateShramik } = require('../middleware');
const shramiks = require('../controllers/shramiks');

const multer = require('multer');
const { storage } = require('../cloudinary')

const upload = multer({ storage });

//fancy way to restructure
router.route('/')  //code 01
    .get(catchAsync(shramiks.index))
    .post(isLoggedIn, upload.array('image'), validateShramik, catchAsync(shramiks.createShramik))
// .post(upload.single('image'), (req, res) => {
//     console.log(req.body, req.file);

//     res.send('It worked!')
// })
//or
// router.get('/', catchAsync(campgrounds.index)) //code 01
router.get('/new', isLoggedIn, shramiks.renderNewForm)
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)) //code 01

router.route('/:id')  //code 02
    .get(catchAsync(shramiks.showShramik))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateShramik, catchAsync(shramiks.updateShramik))
    .delete(isLoggedIn, isAuthor, catchAsync(shramiks.deleteShramik))

// router.get('/:id', catchAsync(campgrounds.showCampground));   //code 02

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(shramiks.renderEditForm))

// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds. updateCampground))  //code 02

// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) //code 02

module.exports = router;