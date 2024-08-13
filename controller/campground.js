const Campground = require('../models/campground')
const {getResizedImage, deleteImage} = require('../cloudinary/index.js')

module.exports.index = async(req,res)=>{
    const allCampgrounds = await Campground.find({})
    res.render('index.ejs',{allCampgrounds,title:'All Campgrounds'})
}
module.exports.renderNewForm =  (req,res)=>{   
    res.render('create.ejs', {title: 'Create'});
}
module.exports.renderDetailsPage = async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate({
        path: 'Review',
        populate:{
            path: 'author'
        }}       
    ).populate('author')
    if(!campground){
        req.flash('error','Cannot find the campground!')
        return res.redirect('/campground')
    }
    const imageList = campground.image
    // imageList.forEach(element => {
    //     console.log(getResizedImage(element,540,360))
        
    // });
    res.render("show.ejs",{campground, title:campground.title, getResizedImage: getResizedImage})
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findOne({_id:id})
    if(!campground){
        req.flash('error','Cannot find the campground!')
    }
    if(!campground.author._id.equals(req.user._id)){   
        return res.redirect(`/campground/${campground._id}`)
    }
    res.render('edit.ejs',{campground, getResizedImage: getResizedImage ,title:`${campground.title}-edit`})
}
module.exports.createNewCampground = async(req,res,next)=>{
    const campground = new Campground(req.body.campground)
    campground.image = req.files.map(f=>({url:f.path, 
                                        filename: f.filename}))
    campground.author = req.user._id
    await campground.save()
    req.flash('success','Successfully added new campground!')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.editCampground = async(req,res)=>{
   // if(!req.body.campground) throw new ExpressError('Invalid campground data', 404)
    console.log(req.body.campground)
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate({_id:id}, {...req.body.campground})
    const newImage = req.files.map(f=>({url:f.path, 
        filename: f.filename}))
        campground.image.push(...newImage)
      await  campground.save()
      
    if(req.body.removeImg ){
        console.log(req.body.removeImg)
        await campground.updateOne({$pull: {image: {filename:{$in: req.body.removeImg}}}})
        await req.body.removeImg.forEach(img => {
            deleteImage(img)
        });
    } 
   
   
    req.flash('success','Successfully edited campground!')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete({_id:id})
    await campground.image.forEach(element => {
        deleteImage(element.filename)
    });
    req.flash('success','Campground deleted!')
    res.redirect('/campground')
}