import multer from 'multer';

const storage = multer.diskStorage({
    destination: './Media/',
    filename: async function(req, file, cb) {
        cb(null, file.originalname.replace(/\W+/g, '-').toLowerCase() + Date.now() + '.' + file.mimetype.split('/')[1]);
        //console.log(file.mimetype.split('/')[1])
    }
});

const fileFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(PDF|pdf|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

export {
    storage,
    fileFilter
}