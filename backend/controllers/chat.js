const ErrorHandler = require("../handlers/errorHandler");
const asyncHandler = require("../middleware/asyncHandler");
//brings in encyrption to encrypt and decrypt the chat
const { encryption, decryption } = require("../handlers/encryption");
const Chat = require("./../models/Chat");

 
//if there is no sender/receiver/message the message wont send
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { sender, receiver, message, type } = req.body;

  if (!receiver || !sender || !message) {
    return next(
      new ErrorHandler(`Sender, Receiver, Messages Missing`, 400)
    );
  }
  //encrypts all the messages from the sender and receiver to create a private chat
  const encryptedMsg = encryption(message);
  const messages = {
    sender: sender,
    receiver: receiver,
    text: encryptedMsg,
    type: type,
  };
  let result;

  //finds the chats that exist
  const chatExists = await Chat.find({
    $or: [
      { $and: [{ sender: receiver }, { receiver: sender }] },
      { $and: [{ sender: sender }, { receiver: receiver }] },
    ],
  });

  
  if (chatExists.length > 0) {
    const chattId = chatExists[0]._id;

    //updates the chat with the details below
    await Chat.findOneAndUpdate(
      { _id: chattId },
      {
        sender,
        receiver,
        lastMessageText: message,
        lastMessageTime: Date.now(),
        $push: { messages: messages },
      }
    );
    result = await Chat.find({
      $or: [
        { $and: [{ sender: receiver }, { receiver: sender }] },
        { $and: [{ sender: sender }, { receiver: receiver }] },
      ],
    });
//decrypts each message so the user can see
    result[0].messages.forEach((element) => {
      element.text = decryption(element.text);
    });
  } else {

    //creates new chat with the sender and receiver
    const chat = await Chat.create({
      sender,
      receiver,
      lastMessageText: message,
      lastMessageTime: Date.now(),
      messages: [messages],
    });
    result = chat;
  }
  return res.status(200).json({
    success: true,
    data: result,
  });
});


//gets all the user chats
exports.getAllChats = asyncHandler(async (req, res, next) => {
  const user = req.user.id;

  //finds the chat for the users
  const chat = await Chat.find({
    $or: [{ receiver: user }, { sender: user }],
  })
  //populates data with the following 
    .populate({
      path: "receiver",
      select: "firstName lastName username profile",
    })
    .populate({
      path: "sender",
      select: "firstName lastName username profile",
    });

  return res.status(200).json({
    success: true,
    data: chat,
  });
});


//gets the users chat data
exports.getUserChat = asyncHandler(async (req, res, next) => {
  const { sender, receiver } = req.query;


  if (!receiver || !sender) {
    return next(new ErrorHandler(`Receiver Or Sender Missing`, 400));
  }

  try {
    const chat = await Chat.find({
      $or: [
        { $and: [{ sender: receiver }, { receiver: sender }] },
        { $and: [{ sender: sender }, { receiver: receiver }] },
      ],
      //populates the data with the users main details
    }).populate({
      path: "receiver",
      select: "name firstName lastName username profile",
    })

    .populate({
      path: "sender",
      select: "name firstName lastName username profile",
    });

//decrypts each message
    chat[0].messages.forEach((element) => {
      element.text = decryption(element.text);
    });
    return res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.log("error", error);
  }
});
