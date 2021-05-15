import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    apiRootUrl, 
    convertDate, 
    socket
} from "./../../../appConfig";
import UserNavbar from "./../Nav/UserNavbar";
import { Container } from "react-bootstrap";
import TimeAgo from "react-timeago";
import $ from "jquery";
import "./../../../../Assets/Styles/UserChat.css";
import {
  FaPaperPlane
 } from "react-icons/fa";
 
 //sets the sender and receiver to null
let chatSender = null;
let chatReceiver = null;

//use state requirments for user chat
const UserChat = (props) => {
  const [myChats, setMyChats] = useState([]);
  const [, setUserChat] = useState([]);
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [, setIsReceiver] = useState(false);
  const [sender, setSender] = useState("");
  
  //sets the chat depending on the users ID
  const getUserChat = (chat) => {
    if (chat.sender.id === sender) {

      setReceiver(chat.receiver.id);
      chatReceiver = chat.receiver.id;
    } else {

      setReceiver(chat.sender.id);
      chatReceiver = chat.sender.id;
    }
    getSingleChat(chat.sender.id, chat.receiver.id);
  };
  const sendMessage = (e) => {
    //prevents message from sending on render
    e.preventDefault();

    if (message) {
      //creates data variable with sender, receiver and message data
      const data = {
        sender: sender,
        receiver: receiver,
        message: message,
      };
//socket used to send the data
      socket.emit("sendMessage", data);
      setMessage("");
      //API post to send the message to the DB 
      axios.post(apiRootUrl + "/chats/sendMessage", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      //returns console log of message sent (testing purposes)
        .then((res) => {
          console.log("Message Sent", res);
        })
        //returns any errors
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };
//API call to DB to get the sender and receiver chats
  const getSingleChat = (senders, receiver) => {
    axios.get(apiRootUrl + "/chats/getUserChat", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      params: {
        sender: senders,
        receiver: receiver,
      },
    })
    //returns all the chat data, including message history, includes animation for scrolling
      .then((res) => {
        console.log("User Chats", res.data.data);
        setUserChat(res.data.data);
        setMessages(res.data.data[0].messages);
        //animates the messages and scrolls to the bottom of chat
        $(".message-history")
          .stop()
          .animate({ scrollTop: $(".message-history")[0].scrollHeight }, 1000);
      })
      //catches any erros and console logs them
      .catch((err) => {
        console.log(err);
      });
  };
  //Gets the senders ID from local storage
  useEffect(() => {
    let receiverId = props.match.params.id;
    setSender(localStorage.getItem("id"));
    chatSender = localStorage.getItem("id");
    chatReceiver = receiverId;
    setReceiver(receiverId);

//gets the receiver ID and sets as true
    if (receiverId) {
      getSingleChat(localStorage.getItem("id"), receiverId);
      setIsReceiver(true);
    } else {
      setIsReceiver(false);
    }

    //API get request for all chats
    axios.get(apiRootUrl + "/chats/getAllChats", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
// returns success result
      .then((res) => {
        setMyChats(res.data.data);
      })
      //returns error
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);


  useEffect(() => {
    socket.on("message", (result) => {
      //if the receiver and sender are correct the messages appear
      if (result.receiver === chatSender && result.sender === chatReceiver) {
        setMessages((messages) => [...messages, result]);
        //uses css and jQuery to create scrollable history
        $(".message-history")
          .stop()
          .animate({ scrollTop: $(".message-history")[0].scrollHeight }, 1000);
          //if the sender matches it returns the chat results
      } else if (result.sender === chatSender) {
    
        setMessages((messages) => [...messages, result]);
         //uses css and jQuery to create scrollable history
        $(".message-history")
          .stop()
          .animate({ scrollTop: $(".message-history")[0].scrollHeight }, 1000);
      } else {
 
      }
    });
  }, []);

  return (
    <>
      <UserNavbar />
      <div className="table-top">
          <h2>Inbox</h2>
        </div>
          <Container>

          <div className='chat-box'>
            <div className='chat-active'>
              <div className='chat-heading'>
                  <h4>Recent Chats</h4>
              </div>
              <div className='chat-messages'>
                {myChats.length > 0 ? (
                  myChats.map((chat) => {
                    return (
                      <div
                        className='chat-active-list'
                        onClick={(e) => getUserChat(chat)}
                        key={chat._id}
                      >
                        <div className='chat-active-users'>
                          <div className='chat-users-box'>
                            <h5 className='chat-username'>
                              {chat.sender.id === sender
                                ? chat.receiver.username 
                                  
                                : chat.sender.username}
                              <span>
                                {/*TimeAgo used to format message time */}
                                <TimeAgo date={chat.lastMessageTime} />{" "}
                              </span>
                            </h5>
                            <p>{chat.lastMessageText}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  //Displays no Active chats if no chats are found/exist
                  <h3>No Active Chats</h3>
                )}
              </div>
            </div>
            <div className='user-messages'>
              <div className='message-history'>
                {/*Maps out all the messages the user sent */}
                {messages.length > 0 ? (
                  messages.map((message) => {
                    return message.sender === sender ? (
                      <div className='outgoing-message' key={message._id}>
       
                        <div className='sent-message'>
                          <p>{message.text}</p>
                          <span className='date'>
                            
                            {convertDate(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    ) : (
                     
                        <div className='received-message-box' key={message._id}>
                          
                          <div className='received-message'>
                            <p>{message.text}</p>
                            <span className='date'>
                           
                              {convertDate(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      
                    );
                  })
                ) : (
                  
                    <div className='received-message-box'>
                      <div className='received-message'>
                        <p>No Messages</p>
                        <span className='date'> Now</span>
                      </div>
                    </div>
                  
                )}
              </div>
              <div className='send-message-box'>
                <div className='send-message'>
                  <input
                    type='text'
                    value={message}
                    onChange={({ target: { value } }) => setMessage(value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" ? sendMessage(e) : null
                    }
                    placeholder='Send a message'
                  />
                  <button
                    className='send-btn'
                    type='button'
                    onClick={(e) => sendMessage(e)}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          </div>
      </Container>
      <div className="bottom"/>
    </>
  );
};
export default UserChat;
