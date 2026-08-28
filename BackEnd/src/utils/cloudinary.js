import cloudinary from "../config/cloudinary.js"

const uploadCloudinary = async (file,folder,height,quality)=>{

    const options = {
        folder:folder,
        resource_type: 'auto',
    }
    if(height){
        options.height = height
    }
    if(quality){
        options.quality = quality
    }
  
      
  const response = await cloudinary.uploader.upload(file.tempFilePath,options)

  return response
}


export default uploadCloudinary