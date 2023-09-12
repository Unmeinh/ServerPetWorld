const crypto = require("crypto")

function encodeEmail(email) {
    // const hash = crypto.createHash('sha256');
    // hash.update(email, 'binary');
    // let hashEmail = hash.digest('hex');
    try {
        const iv = crypto.randomBytes(16);
        const key = crypto.createHash('sha256').digest('base64').substr(0, 32);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        let encrypted = cipher.update(email);
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.log(error);
    }
    // return hashEmail;
};

function decodeEmail(hashText) {
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

module.exports = { encodeEmail, decodeEmail }