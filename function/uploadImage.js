const cloudinary = require('cloudinary').v2;
const sharp = require("sharp");

cloudinary.config({
    cloud_name: 'dcf7f43rh',
    api_key: '225357545784279',
    api_secret: 'gCIS8V0xZxl60iza7rPhHGR8EVs'
});

exports.onUploadImages = async (files, folder) => {
    try {
        if (files && files.length > 0) {
            const folderName = 'images/upload/' + folder;
            let images = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = generateRandomFileName(10);
                let pathFile = './public/upload/' + fileName + ".jpg";
                await sharp(file.path).toFormat('jpg').toFile(pathFile);
                const result = await cloudinary.uploader.upload(pathFile, {
                    public_id: `${folderName}/${fileName}`,
                });
                if (folder == "blog") {
                    let pathHD = './public/upload/' + fileName + "_HDScale.jpg";
                    await sharp(file.path).toFormat('jpg').resize(1080, 1080)
                        .toFile(pathHD);
                    await cloudinary.uploader.upload(pathHD, {
                        public_id: `${'images/upload/blogHDScale'}/${fileName + "_HDScale"}`,
                    });
                }

                images.push(result.secure_url);
            }
            return images;
        } else {
            return [];
        }
    } catch (e) {
        console.log("Lỗi " + JSON.stringify(e));
        return [false, e];
    }
}

function generateRandomFileName(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let fileName = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        fileName += characters.charAt(randomIndex);
    }

    return fileName;
}