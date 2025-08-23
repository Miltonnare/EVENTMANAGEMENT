import multer from 'multer';
import path from 'path';

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const fileFilter=(req,file,cb)=>{
    const allowedTypes=/jpeg|jpg|png|gif/;
    const extname=allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=allowedTypes.test(file.mimetype);
    if(extname && mimetype){
        cb(null,true)
    }else{
        cb(new Error("Only Images are allowed!"),false);
    }
};

export const upload=multer({storage,fileFilter});