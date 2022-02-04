import React from 'react';
import Conversation from '../components/conversation/conversation';
import Message from '../components/message/message';
import Navbar from '../Navbar/Navbar';
import ChatOnline from '../components/chatOnline/chatOnline';
import "./Messenger.css";
import axios from 'axios';
import { useState,useEffect,useRef} from 'react';
var x;
const Messenger = () => {
  const username = localStorage.getItem("userk");
   
   const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();
 
   useEffect(() => {
     async function  getConversations () {
          const data ={
            username: username,
          }
          try {
            await axios
              .post("http://localhost:8000/getUser", data)
              .then( async (response) => {
                const id=response.data._id;
                x = response.data._id;
                //  console.log(x);
                  const res = await axios.get(
                    "http://localhost:8000/conversations/" + id
                  );
                  // console.log(res);
                  setConversations(res.data);
              })
              .catch((error) => {
                {
                  alert("Error");
                }
                console.log(error);
              });
          } catch (error) {
            console.log("error");
          }
         
  
    };
    getConversations();
    
   },[x]);

    useEffect(() => {
      const getMessages = async () => {
        try {
          console.log(currentChat?._id);
          const res = await axios.get("http://localhost:8000/messages/" + currentChat?._id);
          setMessages(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getMessages();
    }, [currentChat]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const message = {
        sender: x,
        text: newMessage,
        conversationId: currentChat._id,
      };

     
      try {
        const res = await axios.post("http://localhost:8000/messages", message);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    
    return (
      <>
        <Navbar />
        <div className="messenger">
          <div className="chatMenu">
            <div className="chatMenuWrapper">
              <input
                placeholder="Search for friends"
                className="chatMenuInput"
              />

              {conversations.map((c) => (
                <div onClick={() => setCurrentChat(c)}>

                <Conversation conversation={c} currentUser={x} />
                </div>
              ))}
            </div>
          </div>
          <div className="chatBox">
            <div className="chatBoxWrapper">
              {currentChat ? (
                <>
                  <div className="chatBoxTop">
                    {messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message message={m} own={m.sender === x} />
                      </div>
                    ))}
                  </div>
                  <div className="chatBoxBottom">
                    <textarea
                      className="chatMessageInput"
                      placeholder="write something..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <span className="noConversationText">
                  Open a conversation to start a chat.
                </span>
              )}
            </div>
          </div>
          <div className="chatOnline">
            <div className="chatOnlineWrapper">
              <ChatOnline />
              <ChatOnline />
              <ChatOnline />
              <ChatOnline />
            </div>
          </div>
        </div>
      </>
    );
};

export default Messenger;