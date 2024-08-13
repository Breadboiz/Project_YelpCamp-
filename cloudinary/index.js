const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });
 
  const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'YelpCamp',
        allowedFormats: ['jpg', 'png','jpeg'],
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
  });
 const getResizedImage = (filename, width, height)=>{
    return cloudinary.url(filename,{
      width: width,
      height: height,
      crop: "fill"
    })
  }
  const deleteImage = async (filename) =>{
    return cloudinary.uploader
    .destroy(filename)
  }
  module.exports = {
    cloudinary,
    storage,
    getResizedImage,
    deleteImage
  }