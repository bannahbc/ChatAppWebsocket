import React, { useState, useEffect, useRef } from "react";
import { API } from "../../Api/Axios";
// import Picker from "@emoji-mart/react";
// import { Picker } from "emoji-mart";

// // import "emoji-mart/css/emoji-mart.css"; // if you want default styles

// import data from "@emoji-mart/data";
import EmojiPicker from "emoji-picker-react";
import {HeartIcon, EnvelopeIcon, PhoneIcon, XMarkIcon} from  '@heroicons/react/24/solid';

import default_avatar from "../../Assets/images/default_avatar.png";
import { formatTimestamp } from "../../Services/time";
import Spinner from "../../Utils/loadingspinner";
import { WEBSOCKET_URL } from "../../Api/websocket_url";


const currentUser = JSON.parse(localStorage.getItem("user"));

export const ChatArea = ({ contact, onBack }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef(null);
  const [isloading, setIsloading] = useState(false);
  const [receiverDetailsVisible, setReceiverDetailsVisible] = useState(false);

  const [contactStatus, setContactStatus] = useState({
    status: "offline",
    last_seen: null,
  });

  // Connect WebSocket when contact changes
  useEffect(() => {
    if (!contact) return;

    const token = localStorage.getItem("access"); // JWT
    const ws = new WebSocket(
      // `ws://localhost:8000/ws/chat/${contact.id}/?token=${token}`
      `${WEBSOCKET_URL}chat/${contact.id}/?token=${token}`
    );

    ws.onopen = () => console.log("✅ Connected to backend");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat_message") {
        // append only actual messages
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === "user_status") {
        // update presence state separately
        if (data.user_id === contact.id) {
          setContactStatus({ status: data.status, last_seen: data.last_seen });
        }
      }
    };

    ws.onclose = () => console.log("⚠️ Disconnected");

    setSocket(ws);
    return () => ws.close();
  }, [contact]);

  // Fetch old messages when opening a chat
  useEffect(() => {
    if (!contact) return;

    const fetchMessages = async () => {
      try {
        setIsloading(true);
        const res = await API.get(`/chat/getmessage/?receiver=${contact.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error(
          "Error fetching messages:",
          err.response?.data || err.message
        );
      } finally {
        setIsloading(false);
      }
    };

    fetchMessages();
  }, [contact]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message via WebSocket
  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      sender_id: currentUser.id,
      receiver: contact.id,
      text: input,
    };
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!contact)
    return (
      <div className="hidden lg:flex flex-1 flex-col gap-3 items-center justify-center ">
        <h1 className="text-lg">
          Welcome to{" "}
          <span className="text-4xl font-extrabold text-[var(--color-primary)] select-none tracking-wider drop-shadow-md">
            Voxa Chat
          </span>
        </h1>
        <p>Select a chat to start messaging</p>
      </div>
    );

  return (
    <section className="flex flex-col flex-1 bg-[var(--color-bg)] text-[var(--color-text)] h-full relative">
      {/* Back button only on mobile */}
      {/* <div className="border-b border-[var(--color-border)] p-4 flex items-center lg:hidden">
        <button
          onClick={onBack}
          className="text-[var(--color-primary)] font-semibold"
        >
          ← Back
        </button>
        <h2 className="ml-4 font-bold grow">{contact.username}</h2>
      </div> */}
      {/* Chat header (mobile + desktop) */}
      <div className="border-b border-[var(--color-border)] p-2.5 flex items-center bg-[var(--color-tra)]" onClick={() => setReceiverDetailsVisible(!receiverDetailsVisible)}>
        {/* Back button only on mobile */}
        <button
          onClick={onBack}
          className="text-[var(--color-primary)] font-semibold lg:hidden mr-3"
        >
          ← Back
        </button>

        {/* Avatar */}
        <div className="relative">
          <img
            src={contact.profile_picture || default_avatar}
            alt={contact.username}
            className="w-10 h-10 rounded-full object-cover border border-[var(--color-border)]"
          />
          {contactStatus.status === "online" && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* Name */}
        <h2 className="ml-3 font-bold text-[var(--color-text)]">
          {contact.username}
          <span className="ml-2 text-sm font-normal text-gray-500">
            {contactStatus.status === "online"
              ? "online"
              : contactStatus.last_seen
              ? `last seen ${formatTimestamp(contactStatus.last_seen)}`
              : "offline"}
          </span>
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-scroll p-4 flex flex-col space-y-2 mb-24 w-full relative">
      {receiverDetailsVisible && (
        <ReceiverDetails receiver={contact}  setReceiverDetailsVisible={setReceiverDetailsVisible}/>
      )}
        {isloading ? (
          <div className="loading flex justify-center items-end h-full">
            <Spinner />
          </div>
        ) : (
          <>
            {messages.map(
              ({ id, text, sender_id, sender_username, timestamp }) => {
                const isUserMessage = sender_id === currentUser.id;

                return (
                  <div
                    key={id || Math.random()}
                    className={`flex flex-col mb-4 ${
                      isUserMessage ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Sender name */}
                    {/* <div className="text-xs text-gray-500 mb-1">
        {isUserMessage ? "You" : sender_username || contact.username}
      </div> */}

                    {/* Message bubble */}
                    <div
                      className="max-w-[70%] p-3 rounded-lg break-words select-none drop-shadow-md"
                      style={{
                        backgroundColor: isUserMessage
                          ? "var(--color-primary)"
                          : "var(--color-accent)",
                        color: isUserMessage ? "white" : "var(--color-text)",
                        borderTopRightRadius: isUserMessage ? 0 : "0.75rem",
                        borderTopLeftRadius: isUserMessage ? "0.75rem" : 0,
                      }}
                    >
                      {text}
                      <div className="text-[0.7rem] text-[var(--color-text-small)] mt-1 text-right">
                        {formatTimestamp(timestamp)}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          className="
      absolute bottom-20 right-0 z-50
      w-[100vw] sm:w-[80vw] md:w-full
      max-w-full md:max-w-sm
      max-h-[70vh]
      rounded-xl shadow-2xl
      bg-[var(--color-glass)] backdrop-blur-md
      overflow-y-auto
      
    "
        >
          <EmojiPicker
            onEmojiClick={(emojiData) =>
              setInput((prev) => prev + emojiData.emoji)
            }
            theme="dark"
            searchDisabled={false}
            skinTonesDisabled={false}
            className="border border-[var(--color-border)]  w-full m-3"
          />
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-3 rounded-3xl mx-4 left-0 right-0 lg:left-96 border border-[var(--color-border)] p-3 gap-2 flex items-center bg-[var(--color-glass)]">
        {/* Emoji toggle button */}
        {/* <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-[var(--color-accent)]">😊</button>4 */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="
    flex items-center justify-center
    w-10 h-10
    rounded-full
    bg-[var(--color-glass)]
    text-[var(--color-text)]
    hover:bg-[var(--color-accent-light)]
    hover:scale-105
    transition-transform
    duration-200
    shadow-sm
  "
        >
          {/* 😊 */}
          {(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
              />
            </svg>
          ) || "😊"}
        </button>

        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-1.5 rounded border border-[var(--color-border)] bg-white text-[var(--color-accent-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)] transition rounded-3xl"
          disabled={showEmojiPicker}
        />
        <button
          onClick={sendMessage}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] px-4 py-2 rounded transition"
          aria-label="Send message"
        >
          {(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          ) || "send"}
        </button>
      </div>
    </section>
  );
};

// Assuming XMarkIcon, EnvelopeIcon, PhoneIcon, and default_avatar are imported
// ...

const ReceiverDetails = ({ receiver, setReceiverDetailsVisible }) => {
  // 1. Create a ref for the modal content
  const modalRef = useRef(null);

 

  // 2. useEffect hook to manage the click listener
  useEffect(() => {
    // Handler function to check for outside clicks
    const handleClickOutside = (event) => {
      // Check if the click happened outside the modal content area
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // If the click is outside, close the details
        setReceiverDetailsVisible(false);
      }
    };
 if (!receiver) {
    return null;
  }
    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setReceiverDetailsVisible]); // Dependency array includes the setter function

  // Note: The main overlay div handles closing when clicked directly (method below)
  // but the useEffect ensures closing even if the user interacts with surrounding DOM elements.


  return (
    // 3. Overlay Container with Click Handler
    // We add a direct click handler to the backdrop itself.
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md"
      onClick={() => setReceiverDetailsVisible(false)} // Close when backdrop is clicked
    >
      
      {/* 4. Details Modal Content: Enhanced Styling */}
      {/* Use the ref and stop the click event from propagating up to the overlay container */}
      <div 
        ref={modalRef} // Attach the ref here
        onClick={(e) => e.stopPropagation()} // PREVENTS CLOSING when modal content is clicked
        className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 w-80 md:w-96 transform scale-100 transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn"
      >
        
        {/* Close Button: Styled */}
        <XMarkIcon 
          className="absolute top-4 right-4 w-6 h-6 text-gray-400 cursor-pointer hover:text-red-500 transition duration-150" 
          onClick={() => setReceiverDetailsVisible(false)} 
        />
        
        {/* Profile Section */}
        <div className="text-center mb-6">
          <img
            src={receiver.profile_picture || default_avatar}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-indigo-500/50 dark:border-indigo-400/50 object-cover shadow-lg"
          />
          
          {/* Username */}
          <p className="font-extrabold text-2xl text-gray-900 dark:text-white capitalize">
            {receiver.username}
          </p>
        </div>
        
        {/* Divider */}
        <hr className="my-6 border-t border-gray-200 dark:border-gray-700" />
        
        {/* Contact Details Section */}
        <div className="space-y-4">
          
          {/* Email */}
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <EnvelopeIcon className="w-5 h-5 mr-4 flex-shrink-0 text-indigo-500" />
            <span className="truncate">{receiver.email || "No email provided"}</span>
          </div>
          
          {/* Phone Number */}
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <PhoneIcon className="w-5 h-5 mr-4 flex-shrink-0 text-indigo-500" />
            <span>{receiver.phone_number || "No phone number provided"}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReceiverDetails;