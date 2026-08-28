// const { model } = require('mongoose');

const cloudinary = require('cloudinary').v2



const deleteFileFromCloudinary = async (publicId) => {
    try {
      // Call the Cloudinary destroy API
      // need to pass resource_type: dynamicaly to delete  files <---- remainder
      const result = await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
      // console.log(result);
      
  
      // Check response
      if (result.result === "ok") {
    
        return true;
    }
    else {
       return false;
      }
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
      return false;
    }
  };


  module.exports = deleteFileFromCloudinary
  
