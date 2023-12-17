const admin = require("firebase-admin");
const axios = require("axios");
const mdNotification = require("../model/notice.model");
const mdUser = require("../model/user.model").UserModel;
// ... (khởi tạo Firebase Admin SDK)
const serviceAccount = require("../petworld-firebase-firebase-adminsdk-jcff6-578705a4ad.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://petworld-firebase-default-rtdb.firebaseio.com",
});

exports.notificationSc = async (req, res, next) => {
  const db = admin.database();
  const role = req.body.role;
  const messagesRef = db.ref(`chat_messages/${role}`);
  const message = req.body.message;
  const title =
    role === "client" ? "Thông báo từ OurPet" : "Thông báo từ OurPetSeller";
  try {
    const newMessageRef = messagesRef.push();
    await newMessageRef.set({
      message: message,
      timestamp: admin.database.ServerValue.TIMESTAMP,
    });

    const tokensSnapshot = await db.ref("sellerTokens").once("value");
    tokensSnapshot.forEach((childSnapshot) => {
      const token = childSnapshot.val().token;
      sendFCMNotification(token, role, message);
    });

    const getListUser = await mdUser.find();
    if (getListUser) {
      await Promise.all(
        getListUser.map(async (user) => {
          const createNotice = new mdNotification.NoticeModel({
            detail: message,
            idUser: user._id,
            content: title,
            status: 1,
            createdAt: new Date(),
          });
          await createNotice.save();
          await Promise.all([user]);
        })
      );
    }
    res.render("Notification/notification", {
      adminLogin: req.session.adLogin,
    });
  } catch (error) {
    console.error("Error sending notification and saving message:", error);
    res.status(500).send("Internal Server Error");
  }
};

async function sendFCMNotification(token, role, message) {
  const title =
    role === "client" ? "Thông báo từ OurPet" : "Thông báo từ OurPetSeller";
  const fcmData = {
    notification: {
      title: title,
      body: message,
    },
    to: token,
  };

  const headers = {
    Authorization:
      "key=AAAA7kKbW5U:APA91bFwY7iSyzatKfVc0WBWh0gRYWu_uXLPfNo4FZHUCnmwCCirCGNchC7yFE2tTsRDoJFlNYBuD05WdANrDL38nX_pa-t8Xl2649Ak0g7mqAARFRszc4CDPkYrwADcJ4SJuryXwJDS",
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      fcmData,
      { headers }
    );

    // console.log('FCM Response:', response.status, response.data, token, message,role);
  } catch (error) {
    console.error("Error sending FCM:", error);
  }
}

exports.getChatMessages = async (req, res, next) => {
  const db = admin.database();
  const role = req.query.role;
  const messagesRef = db.ref().child("chat_messages").child(role);

  try {
    const snapshot = await messagesRef.orderByChild("timestamp").once("value");
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push(childSnapshot.val());
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving chat messages:", error);
    res.status(500).json({ error: "Failed to retrieve chat messages" });
  }
};
exports.detailUser = async (req, res, next) => {
  res.render("Notification/notification", { adminLogin: req.session.adLogin });
};
