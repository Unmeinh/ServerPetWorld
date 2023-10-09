const fs = require('fs')
const sharp = require("sharp");
const axios = require("axios");

async function resizeImageByLink(path, imageFit = "fill", width = 235, height = 320,) {
    const readStream = await axios({ url: path, responseType: 'stream' })

    // const src = imageResponse.data.pipe(sharp())
    // console.log(readStream);

    const resizeOptions = {
        fit: imageFit,
    };
    const image = sharp(readStream.data).resize(width, height, resizeOptions)
        .withMetadata()
        .toBuffer({ resolveWithObject: true })
    return image;
    // let transform = sharp()
    // // if (format) {
    // //     transform = transform.toFormat(format)
    // // }
    // if (width || height) {
    //     transform = transform.resize(width, height, resizeOptions)
    // }
    // return readStream.data.pipe(transform)
}

module.exports = { resizeImageByLink }