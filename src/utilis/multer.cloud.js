import multer,{diskStorage} from 'multer';
export const filterObject={
image:['image/png','image/jpg'],
pdf:['application/pdf'],
vedio:['vedio/mp4']
}

export const uploadCloud=(fileType)=>{
    const fileFilter=((req,file,cb)=>{
if(!fileType.includes(file.mimetype)){
return cb(new Error('invalid format'),false)}
return cb(null,true)
    })
const storage= diskStorage({})

const multerUpload=multer({storage,fileFilter})

return multerUpload;


}