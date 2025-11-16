// import React, { useState, useEffect, useRef } from "react";
// import { API } from "../../Api/Axios";
// import Picker from '@emoji-mart/react';
// import data from '@emoji-mart/data';





// const currentUser = JSON.parse(localStorage.getItem("user"));

// export const ChatArea = ({ contact, onBack }) => {
//   const [socket, setSocket] = useState(null);   // <-- add this

//   useEffect(() => {
//     if (!contact) return;
//     const token = localStorage.getItem("access"); // JWT
// const ws = new WebSocket(`ws://localhost:8000/ws/chat/${contact.id}/?token=${token}`);

//     // const ws = new WebSocket(`ws://localhost:8000/ws/chat/${contact.id}/`);

//     ws.onopen = () => console.log("✅ Connected to backend");
//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setMessages((prev) => [...prev, data]);
//     };
//     ws.onclose = () => console.log("⚠️ Disconnected");

//     setSocket(ws);
//     return () => ws.close();
//   }, [contact]);

//   const sendMessage2 = () => {
//     if (!input.trim()) return;
//     const msg = {
//       sender_id: currentUser.id,
//       receiver: contact.id,
//       text: input,
//     };
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(msg));
//     }
//     setInput("");
//   };
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const bottomRef = useRef(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!contact) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await API.get(`/chat/getmessage/?receiver=${contact.id}`);
//         console.log("messages",res)
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err.response?.data || err.message);
//       }
//     };

//     fetchMessages();
//   }, [contact]);

//   const sendMessage = async () => {
//   if (!input.trim()) return;

//   try {
//     const res = await API.post("chat/createmessage/", {
//       receiver: contact.id,
//       text: input,
//     });

//     // Append new message from backend response
//     setMessages((prev) => [...prev, res.data]);
//     setInput("");
//   } catch (err) {
//     console.error("Error sending message:", err.response?.data || err.message);
//   }
// };


//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   if (!contact)
//     return (
//       <div className="hidden lg:flex flex-1 items-center justify-center text-[var(--color-primary)]">
//         Select a chat to start messaging
//       </div>
//     );

//   return (
//     <section className="flex flex-col flex-1 bg-[var(--color-bg)] text-[var(--color-text)] h-full relative">
//       {/* Back button only on mobile */}
//       <div className="border-b border-[var(--color-border)] p-4 flex items-center lg:hidden">
//         <button onClick={onBack} className="text-[var(--color-primary)] font-semibold">
//           ← Back
//         </button>
//         <h2 className="ml-4 font-bold grow">{contact.username}</h2>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-scroll p-4 flex flex-col space-y-2 mb-24">
//         {messages.map(({ id, text, sender_id }) => {
//   const isUserMessage = sender_id === currentUser.id;

//   return (
//     <div
//       key={id}
//       className={`flex w-full mb-2 ${isUserMessage ? "justify-end" : "justify-start"}`}
//     >
//       <div
//         className="max-w-[70%] p-3 rounded-lg break-words select-none drop-shadow-md"
//         style={{
//           backgroundColor: isUserMessage
//             ? "var(--color-primary)"
//             : "var(--color-accent)",
//           color: isUserMessage ? "white" : "var(--color-text)",
//           borderTopRightRadius: isUserMessage ? 0 : "0.75rem",
//           borderTopLeftRadius: isUserMessage ? "0.75rem" : 0,
//         }}
//       >
//         {text} 
//         <button onClick={sendMessage2}>Socket 2</button>
//       </div>
//     </div>
//   );
// })}
//         <div ref={bottomRef} />
//       </div>

// {/* Emoji Picker */}
// {showEmojiPicker && (
//   <div className="absolute bottom-20 right-4 z-50">
//     <Picker data={data} onEmojiSelect={(emoji) => setInput((prev) => prev + emoji.native)} />
//   </div>
// )}

//       {/* Input */}
//       <div className="fixed bottom-2 rounded-xl mx-2 left-0 right-0 lg:left-72 border-t border-[var(--color-border)] p-4 gap-2 flex items-center bg-white">
//         {/* Emoji toggle button */}
// <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="flex-1 px-3 py-2 rounded border border-[var(--color-border)] bg-white text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)] transition"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded transition"
//           aria-label="Send message"
//         >
//           Send
//         </button>
//       </div>
//     </section>
//   );
// };
import React, { useState, useEffect, useRef } from "react";
import { API } from "../../Api/Axios";
// import Picker from "@emoji-mart/react";
// import { Picker } from "emoji-mart";

// // import "emoji-mart/css/emoji-mart.css"; // if you want default styles

// import data from "@emoji-mart/data";
import EmojiPicker from "emoji-picker-react";

import default_avatar from "../../Assets/images/default_avatar.png"
import { formatTimestamp } from "../../Services/time";

const currentUser = JSON.parse(localStorage.getItem("user"));

export const ChatArea = ({ contact, onBack }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef(null);

  // Connect WebSocket when contact changes
  useEffect(() => {
    if (!contact) return;

    const token = localStorage.getItem("access"); // JWT
    const ws = new WebSocket(
      // `ws://localhost:8000/ws/chat/${contact.id}/?token=${token}`
      `wss://voxachat-88fl.onrender.com/ws/chat/${contact.id}/?token=${token}`
    );

    ws.onopen = () => console.log("✅ Connected to backend");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]); // append new live message
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
        const res = await API.get(`/chat/getmessage/?receiver=${contact.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error(
          "Error fetching messages:",
          err.response?.data || err.message
        );
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
      <div className="hidden lg:flex flex-1 items-center justify-center text-[var(--color-primary)]">
        Select a chat to start messaging
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
      </div> */}{/* Chat header (mobile + desktop) */}
<div className="border-b border-[var(--color-border)] p-4 flex items-center bg-[var(--color-accent)]">
  {/* Back button only on mobile */}
  <button
    onClick={onBack}
    className="text-[var(--color-primary)] font-semibold lg:hidden mr-3"
  >
    ← Back
  </button>

  {/* Avatar */}
  <img
    src={contact.avatar || default_avatar} // fallback if no avatar
    alt={contact.username}
    className="w-10 h-10 rounded-full object-cover border border-[var(--color-border)]"
  />

  {/* Name */}
  <h2 className="ml-3 font-bold text-[var(--color-text)]">{contact.username}</h2>
</div>


      {/* Messages */}
      <div className="flex-1 overflow-y-scroll p-4 flex flex-col space-y-2 mb-24">
        {messages.map(({ id, text, sender_id, sender_username, timestamp }) => {
  const isUserMessage = sender_id === currentUser.id;

  return (
    <div
      key={id || Math.random()}
      className={`flex flex-col mb-4 ${isUserMessage ? "items-end" : "items-start"}`}
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
})}

        <div ref={bottomRef} />
      </div>

      {/* Emoji Picker */}
   {showEmojiPicker && (
  <div
    className="absolute bottom-20 right-0 z-50 
           w-[80vw] max-w-sm max-h-[70vh] 
           rounded-xl shadow-2xl 
           bg-[var(--color-glass)] backdrop-blur-md 
           overflow-y-auto "
  >
    <EmojiPicker
  onEmojiClick={(emojiData) =>
    setInput((prev) => prev + emojiData.emoji)
  }
  theme="light"
  searchDisabled={false}
  skinTonesDisabled={false}
  className="border  border-[var(--color-border)] rounded-lg"
/>

  </div>
)}




      {/* Input */}
      <div className="fixed bottom-3 rounded-3xl mx-4 left-0 right-0 lg:left-72 border border-[var(--color-border)] p-3 gap-2 flex items-center bg-[var(--color-glass)]">
        {/* Emoji toggle button */}
        {/* <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-[var(--color-accent)]">😊</button>4 */}
        <button
  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
  className="
    flex items-center justify-center
    w-10 h-10
    rounded-full
    bg-[var(--color-glass)]
    text-gray-700
    hover:bg-[var(--color-accent-light)]
    hover:scale-105
    transition-transform
    duration-200
    shadow-sm
  "
>
  {/* 😊 */}
  {
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
</svg>
||"😊"
}

</button>

        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-1.5 rounded border border-[var(--color-border)] bg-white text-[var(--color-accent-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)] transition"
        />
        <button
          onClick={sendMessage}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] px-4 py-2 rounded transition"
          aria-label="Send message"
        >
          {
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg> 
|| "send"

          }
      
        </button>
      </div>
    </section>
  );
};
