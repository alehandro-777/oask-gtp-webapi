const multer  = require('multer')
const path = require("path")

const maxUploadImgCount = 10;
const maxUploadFileSize = 1000000;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};



exports.uploadImage =  (req, res) => {    
    // 'profile_pic' - name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: imageFilter, limits:{files:1, fileSize: maxUploadFileSize} }).any();
    //let upload = multer({ dest: 'uploads/' }).single('profile_pic');

    upload(req, res, (err) => {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        services.uploadOneImage(req.files)
        .then( (result) => {
            res.send(result);    
        }
        )
        .catch( (error) => {
            res.status(500).send(error)
            }   
        );  
    });
}

exports.uploadManyImages = (req, res) => {
    // 'profile_pic' - name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: imageFilter, limits:{files:1, fileSize: maxUploadFileSize} }).any();
    //let upload = multer({ dest: 'uploads/' }).single('profile_pic');

    upload(req, res, (err) => {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        services.uploadManyImages(req.files)
        .then( (result) => {
            res.send(result);    
        }
        )
        .catch( (error) => {
            res.status(500).send(error)
            }   
        );  
    });
}

exports.findOneProductImage = (req, res) => {  
    services.getProductImage(req.params.id)    
    .then( (result) => {
        if (result) {

            res.sendFile(process.cwd() + '\\' + result.filename);    
        }
        else {
            res.status(404).send('Object not found')
        }
    }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );    
}

