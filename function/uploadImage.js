const cloudinary = require('cloudinary').v2;
const sharp = require("sharp");
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require("path");

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
                    if (fs.existsSync(pathHD)) {
                        fs.unlink(pathHD, (err) => {
                            console.log(err);
                        });
                    }
                }

                images.push(result.secure_url);
                if (fs.existsSync(pathFile)) {
                    fs.unlink(pathFile, (err) => {
                        console.log(err);
                    });
                }
                if (fs.existsSync(file.path)) {
                    fs.unlink(file.path, (err) => {
                        console.log(err);
                    });
                }
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

exports.onCheckNSFW = async (file, body) => {
    return sightengineNSFW(file)
    //     status: sfw
    // -2: false
    // -1: unsafe
    // 0: pretty absolute
    // 1: probably
    // 2: not sure
    Promise.all([promise1, promise2, promise3]).then((values) => {
        console.log(values);
    });
}

async function rapidapiNSFWdetection(file) {
    const data = new FormData();
    data.append('image', fs.createReadStream(file.path));

    const options = {
        method: 'POST',
        url: 'https://nsfw-images-detection-and-classification.p.rapidapi.com/adult-content-file',
        headers: {
            'X-RapidAPI-Key': '4a61fe9649mshc3ef36c981af292p1330b6jsnaf2c55a88c4a',
            'X-RapidAPI-Host': 'nsfw-images-detection-and-classification.p.rapidapi.com',
            ...data.getHeaders(),
        },
        data: data
    };

    try {
        const response = await axios.request(options);
        let data = response.data;
        console.log(data);
        if (data) {
            if (!data.unsafe) {
                if (data?.objects.length > 0) {
                    let sum = data?.objects.reduce((n, { score }) => n + score, 0);
                    let averageScore = sum / data?.objects.length;
                    if (averageScore > 0.5) {
                        //sfw: not sure
                        return 2;
                    } else {
                        //sfw: probably
                        return 1;
                    }
                } else {
                    //sfw: pretty absolute
                    return 0;
                }
            } else {
                //sfw: false
                return -1;
            }
        }
        return -2;
    } catch (error) {
        console.error(error);
        return -2;
    }
}

async function rapidapiNSFWapi4ai(file) {
    const data = new FormData();
    data.append('image', fs.createReadStream(file.path));

    const options = {
        method: 'POST',
        url: 'https://nsfw3.p.rapidapi.com/v1/results',
        headers: {
            'X-RapidAPI-Key': '4a61fe9649mshc3ef36c981af292p1330b6jsnaf2c55a88c4a',
            'X-RapidAPI-Host': 'nsfw3.p.rapidapi.com',
            ...data.getHeaders(),
        },
        data: data
    };

    try {
        const response = await axios.request(options);
        let data = response.data;
        console.log(data);
        if (data && data?.status?.code == "ok"
            && data?.status?.message == "Success") {
            if (data.entities) {
                let check = data.entities[0]?.classes;
                if (Number(check?.sfw) > Number(check?.nsfw)) {
                    if (Number(check?.nsfw) > 0.4) {
                        return 1;
                    }
                    return 0;
                } else {
                    return -1;
                }
            } else {
                return -2;
            }
        } else {
            return -2;
        }
    } catch (error) {
        console.error(error);
        return -2;
    }
}

async function sightengineNSFW(file) {
    const data = new FormData();
    data.append('media', fs.createReadStream(file.path));
    data.append('models', 'nudity-2.0,wad,offensive,text-content,face-attributes,gore,tobacco');
    data.append('api_user', '659981077');
    data.append('api_secret', 'tKUSsxwgXbjt7ebWWXcAYNv7PJ');

    const options = {
        method: 'post',
        url: 'https://api.sightengine.com/1.0/check.json',
        data: data,
        headers: data.getHeaders()
    };

    try {
        const response = await axios.request(options);
        let data = response.data;
        console.log(data);
        if (data.status == 'success') {
            let check = 0;
            if (data?.nudity?.none < 0.6) {
                check = 2;
            }
            if (data?.nudity?.none < 0.4) {
                check = 1;
            }
            if (data?.gore?.prob > 0.3) {
                return -1;
            }
            if (data?.skull?.prob > 0.3) {
                return -1;
            }
            if (data?.tobacco?.prob > 0.3) {
                return -1;
            }
            if (data?.weapon > 0.5) {
                return 2;
            }
            if (data?.weapon_firearm > 0.5) {
                return 2;
            }
            if (data?.weapon_knife > 0.5) {
                return 2;
            }
            if (data?.drugs > 0.7) {
                return 2;
            }
            if (data?.alcohol > 0.3) {
                return 2;
            }
            if (data?.medical_drugs > 0.7) {
                return 2;
            }
            if (data?.recreational_drugs > 0.7) {
                return 2;
            }
            let sumOffensive = Object.values(data?.offensive).reduce((accumulator, value) => {
                return accumulator + value;
              }, 0);
            if (sumOffensive > 0.5) {
                return -1;
            }

            return check;
        } else {
            return -2;
        }
        // data {
        //     status: 'success',
        //     request: {
        //       id: 'req_f8Wx15mtsEg9bgVOZcsql',
        //       timestamp: 1699786888.367986,
        //       operations: 7
        //     },
        //     nudity: {
        //       sexual_activity: 0.01,
        //       sexual_display: 0.01,
        //       erotica: 0.01,
        //       sextoy: 0.01,
        //       suggestive: 0.01,
        //       suggestive_classes: [Object],
        //       none: 0.99,
        //       context: [Object]
        //     },
        //     weapon: 0.01,
        //     alcohol: 0.01,
        //     drugs: 0.01,
        //     medical_drugs: 0.01,
        //     recreational_drugs: 0.01,
        //     weapon_firearm: 0.01,
        //     weapon_knife: 0.01,
        //     offensive: {
        //       prob: 0.01,
        //       nazi: 0.01,
        //       confederate: 0.01,
        //       supremacist: 0.01,
        //       terrorist: 0.01,
        //       middle_finger: 0.01
        //     },
        //     text: {
        //       profanity: [],
        //       personal: [],
        //       link: [],
        //       social: [],
        //       extremism: [],
        //       medical: [],
        //       drug: [],
        //       weapon: [],
        //       ignored_text: false
        //     },
        //     faces: [],
        //     gore: { prob: 0.01 },
        //     skull: { prob: 0.01 },
        //     tobacco: { prob: 0.01 },
        //     media: {
        //       id: 'med_f8WxWLUFJXZNk2BU6ISiB',
        //       uri: '66437d7e879798744387d8b0049314a6'
        //     }
        //   }
    } catch (error) {
        console.error(error);
        return -2;
    }
}

async function categorizeNSFW(file) {
    const data = new FormData();
    let pathFile = './public/upload/' + file.filename + ".jpg";
    await sharp(file.path).toFormat('jpg').toFile(pathFile);
    data.append('image', fs.createReadStream(__dirname.replace('function', "") + pathFile.replace('./', "")));
    const options = {
        method: 'POST',
        url: 'https://nsfw-categorize.it/api/upload',
        headers: {
            ...data.getHeaders(),
            'Content-type': 'multipart/form-data'
        },
        data: data
    };

    try {
        const response = await axios.request(options);
        let data = response.data;
        console.log(data);
        if (fs.existsSync(pathFile)) {
            fs.unlink(pathFile, (err) => {
                console.log(err);
            });
        }
        if (data.data && data.status == "OK") {
            let check = 2;
            if (data.data?.classification) {
                switch (data.data?.classification) {
                    case "neutral":
                        check = 0;
                        break;
                    case "nsfw":
                        check = -1;
                        break;
                    case "porn":
                        check = -1;
                        break;

                    default:
                        break;
                }
            }
            if (data.data?.nsfw) {
                return -1;
            }
            if (data.data?.porn) {
                return -1;
            }
            return check;
        } else {
            return -2;
        }
        // {
        //     data: {
        //       classification: 'neutral',
        //       confidence: 99.42,
        //       hash: '21885bdd9846b96a420495d4167ef4f0f8e13cd7',
        //       nsfw: false,
        //       porn: false
        //     },
        //     quota: 9,
        //     status: 'OK'
        //   }
        return response.data;
    } catch (error) {
        if (fs.existsSync(pathFile)) {
            fs.unlink(pathFile, (err) => {
                console.log(err);
            });
        }
        console.error(error);
        return -2;
    }
}

async function zaloNSFWFilter(file) {
    const data = new FormData();
    data.append('img_bytes', fs.createReadStream(file.path));
    const options = {
        method: 'POST',
        url: 'https://api.zalo.ai/v1/dirtycontent/filter',
        headers: {
            ...data.getHeaders(),
            'Content-type': 'multipart/form-data',
            apikey: "PdsECZMLvvfKhHoawhNwLrSdI4zWl7si"
        },
        data: data
    };

    try {
        const response = await axios.request(options);
        let data = response.data;
        console.log(data);
        if (data.data) {
            if (data.data?.is_dirty_content == 1) {
                //nsfw: true
                return -1;
            } else {
                let check = 0;
                if (data.data?.score > 0.4) {
                    check = 1;
                }
                if (data.data?.score > 0.6) {
                    check = 2;
                }
                return check;
            }
        } else {
            return -2;
        }
    } catch (error) {
        console.error(error);
        return -2;
    }
}