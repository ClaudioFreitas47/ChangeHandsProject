
//encryption used to create encrypted messages between users
"use strict";
//brings in crypto module
const crypto = require("crypto");

//encryption key used to encrypt all chats (must be 32 char)
const key = "lTAtAiLyNXZYbFiwUpO06fc2wWaXAHlq";

//16 char length for AES
const aesIV = 16; 

//encrypts the text using the key
const encryption = (text) => {

  //generates random bytes
  let aesiv = crypto.randomBytes(aesIV);

  //uses aes 256 to encrypt
  let codedText = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    aesiv
  );

  //updates the text with the new encryption
  let isEncrypted = codedText.update(text);

  isEncrypted = Buffer.concat([isEncrypted, codedText.final()]);

  return aesiv.toString("hex") + ":" + isEncrypted.toString("hex");
}

//decrypts the text using the key
const decryption = (text) => {

  let msgParts = text.split(":");

  let aesiv = Buffer.from(msgParts.shift(), "hex");

  let encryptedText = Buffer.from(msgParts.join(":"), "hex");
  
  //decrypts the message using the key and AESiv
  let convert = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    aesiv
  );
  let isDecrypted = convert.update(encryptedText);

  isDecrypted = Buffer.concat([isDecrypted, convert.final()]);

  //returns the decrypted message back into a string 
  return isDecrypted.toString();
}
//exports the functions for use in the chat
module.exports = { encryption, decryption };
