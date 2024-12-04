const Shramik = require('../models/shramik')
const { cloudinary } = require('../cloudinary');
module.exports.index = async (req, res) => {
    const shramiks = await Shramik.find({});
    res.render('shramiks/index', { shramiks })
}

module.exports.renderNewForm = (req, res) => {
    if (req.user.username == 'admin') {
        return res.render('shramiks/new');
    } else {
        req.flash('error', 'You are not allowed to create New Shramiks ')
        return res.redirect('/shramiks');
    }
}
module.exports.createShramik = async (req, res, next) => {
    const shramik = new Shramik(req.body.shramik);
    if (req.user.username == 'admin') {
        shramik.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
        shramik.author = req.user._id;
        await shramik.save();
        console.log(shramik);
        req.flash('success', 'Successfully made a new shramik!');
        return res.redirect(`/shramiks/${shramik._id}`)
    } else {
        req.flash('error', 'You are not allowed to create New Shramiks')
        return res.redirect('/shramiks');
    }

}

module.exports.showShramik = async (req, res) => {
    const shramik = await Shramik.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!shramik) {
        req.flash('error', 'Cannot find that Shramik!')
        return res.redirect('/shramiks');
    }
    res.render('shramiks/show', { shramik })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const shramik = await Shramik.findById(id);
    if (!shramik) {
        req.flash('error', 'Cannot find that shramiks!')
        return res.redirect('/shramiks');
    }
    res.render('shramiks/edit', { shramik })
}
module.exports.updateShramik = async (req, res) => {
    const { id } = req.params;
    const shramik = await Shramik.findByIdAndUpdate(id, { ...req.body.shramik })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    shramik.image.push(...imgs);
    await shramik.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await shramik.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
        console.log(shramik)
    }
    req.flash('success', 'Successfully updated');
    res.redirect(`/shramiks/${shramik._id}`)
}
module.exports.deleteShramik = async (req, res) => {
    const { id } = req.params;

    await Shramik.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted Shramik');
    res.redirect('/shramiks')
}