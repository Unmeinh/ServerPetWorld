const key =
  'key=AAAA7kKbW5U:APA91bFwY7iSyzatKfVc0WBWh0gRYWu_uXLPfNo4FZHUCnmwCCirCGNchC7yFE2tTsRDoJFlNYBuD05WdANrDL38nX_pa-t8Xl2649Ak0g7mqAARFRszc4CDPkYrwADcJ4SJuryXwJDS';

const axios = require('axios');

let mdNoticeClient = require('../model/notice.model');
let mdNoticeSeller = require('../model/noticeSeller.model');

const sendFCMNotification = async (
  token,
  title,
  message,
  role,
  images,
  idUser,
) => {
  try {
    const params = {
      idUser: idUser,
      content: title,
      detail: message,
      image: images,
      status: 1,
      createdAt: new Date(),
    };
    if (role === 'CLIENT') {
      const newNotice = new mdNoticeClient.NoticeModel(params);
      await newNotice.save();
    }
    if (role === 'SELLER') {
      const newNotice = new mdNoticeSeller.NoticeSellerModel(params);
      await newNotice.save();
    }
    if (token) {
      const fcmData = {
        notification: {
          title: title,
          body: message,
        },
        to: token,
      };

      const headers = {
        Authorization: key,
        'Content-Type': 'application/json',
      };

      await axios.post('https://fcm.googleapis.com/fcm/send', fcmData, {
        headers,
      });
    }
    return true;
  } catch (error) {
    console.error('Error sending FCM:', error);
    return false;
  }
};

module.exports = {sendFCMNotification};
