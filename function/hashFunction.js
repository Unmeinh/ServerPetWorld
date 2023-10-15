const crypto = require("crypto")

function encodeToSha256(text) {
    // const hash = crypto.createHash('sha256');
    // hash.update(email, 'binary');
    // let hashFunction = hash.digest('hex');
    try {
        const iv = crypto.randomBytes(16);
        const key = crypto.createHash('sha256').digest('base64').substr(0, 32);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.log(error);
    }
    // return hashFunction;
};

function decodeFromSha256(hashText) {
    try {
        const textParts = hashText.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');

        const encryptedData = Buffer.from(textParts.join(':'), 'hex');
        const key = crypto.createHash('sha256').digest('base64').substr(0, 32);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        const decrypted = decipher.update(encryptedData);
        const decryptedText = Buffer.concat([decrypted, decipher.final()]);
        return decryptedText.toString();
    } catch (error) {
        console.log(error)
    }
}

function encodeToAscii(inputString) {
    return inputString.split("")
        .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
}

function decodeFromAscii(inputString) {
    return inputString.split(/(\w\w)/g)
        .filter(p => !!p)
        .map(c => String.fromCharCode(parseInt(c, 16)))
        .join("")
}

module.exports = { encodeToSha256, decodeFromSha256, encodeToAscii, decodeFromAscii };