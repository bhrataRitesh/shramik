const Shramik = require('../models/shramik')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const shramik = await Shramik.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    shramik.reviews.push(review);
    await review.save()
    await shramik.save()
    req.flash('success', 'created new review');
    res.redirect(`/shramiks/${shramik._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Shramik.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })

    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfully deleted review');
    res.redirect(`/shramiks/${id}`);


}