const Campground = require('../models/campground')
const { getResizedImage, deleteImage } = require('../cloudinary/index.js')
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const myURL = new URL(req.url, `http://${req.headers.host}`);
    const searchResult = Object.fromEntries(myURL.searchParams).query || ''; 
   // console.log( myURL.searchParams);
    if(!searchResult){
        const allCampgrounds = await Campground.find({})
        res.render('index.ejs', { allCampgrounds, title: 'All Campgrounds' })
    }
    else{
        const allCampgrounds = await Campground.find( { 'title' : { '$regex' : searchResult } } )
        // console.log(allCampgrounds)
        res.render('index.ejs', { allCampgrounds, title: 'All Campgrounds' })
    }

}
module.exports.renderNewForm = (req, res) => {
    res.render('create.ejs', { title: 'Create' });
}
module.exports.renderDetailsPage = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'Review',
        populate: {
            path: 'author'
        }
    }
    ).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find the campground!')
        return res.redirect('/campground')
    }
    res.render("show.ejs", { campground, title: campground.title, getResizedImage })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findOne({ _id: id })
    if (!campground) {
        req.flash('error', 'Cannot find the campground!')
    }
    if (!campground.author._id.equals(req.user._id)) {
        return res.redirect(`/campground/${campground._id}`)
    }
    res.render('edit.ejs', { campground, getResizedImage: getResizedImage, title: `${campground.title}-edit` })
}
module.exports.createNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.image = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 })
    //console.log(geoData.features[0].geometry)
    campground.geometry = geoData.features[0].geometry
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully added new campground!')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate({ _id: id }, { ...req.body.campground })
    const newImage = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    campground.image.push(...newImage)
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 })
    campground.geometry = geoData.features[0].geometry
    await campground.save()

    if (req.body.removeImg) {
        console.log(req.body.removeImg)
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.removeImg } } } })
        await req.body.removeImg.forEach(img => {
            deleteImage(img)
        });
    }
    req.flash('success', 'Successfully edited campground!')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete({ _id: id })
    await campground.image.forEach(element => {
        deleteImage(element.filename)
    });
    req.flash('success', 'Campground deleted!')
    res.redirect('/campground')
}