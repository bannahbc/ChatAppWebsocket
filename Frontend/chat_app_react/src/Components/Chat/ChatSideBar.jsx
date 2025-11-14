import React, { useEffect, useState } from "react";
import { API } from "../../Api/Axios";


  const getAvatar = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

export const ChatSidebar = ({ onSelectContact }) => {
 const [contacts, setcontacts] = useState([]);

  const getcontacts = async () => {
    try {
      const res = await API.get("user/getusers/");
      setcontacts(res.data); // store in state
      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error("Error fetching chat users:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getcontacts();
  }, []); 
  // const contacts = [
  //   { id: 1, name: "Alice Johnson", lastMessage: "Hey! Are you free today?", avatar: "https://i.pravatar.cc/40?img=1", online: true },
  //   { id: 2, name: "Bob Smith", lastMessage: "Let's catch up later.", avatar: "https://i.pravatar.cc/40?img=2", online: false },
  //   { id: 3, name: "Cathy Green", lastMessage: "Got the documents.", avatar: "https://i.pravatar.cc/40?img=3", online: true },
  //   { id: 4, name: "David Lee", lastMessage: "Thanks for your help!", avatar: "https://i.pravatar.cc/40?img=4", online: true },
  //   { id: 1, name: "Alice Johnson", lastMessage: "Hey! Are you free today?", avatar: "https://i.pravatar.cc/40?img=1", online: true },
  //   { id: 2, name: "Bob Smith", lastMessage: "Let's catch up later.", avatar: "https://i.pravatar.cc/40?img=2", online: false },
  //   { id: 3, name: "Cathy Green", lastMessage: "Got the documents.", avatar: "https://i.pravatar.cc/40?img=3", online: true },
  //   { id: 4, name: "David Lee", lastMessage: "Thanks for your help!", avatar: "https://i.pravatar.cc/40?img=4", online: true },
  //   { id: 1, name: "Alice Johnson", lastMessage: "Hey! Are you free today?", avatar: "https://i.pravatar.cc/40?img=1", online: true },
  //   { id: 2, name: "Bob Smith", lastMessage: "Let's catch up later.", avatar: "https://i.pravatar.cc/40?img=2", online: false },
  //   { id: 3, name: "Cathy Green", lastMessage: "Got the documents.", avatar: "https://i.pravatar.cc/40?img=3", online: true },
  //   { id: 4, name: "David Lee", lastMessage: "Thanks for your help!", avatar: "https://i.pravatar.cc/40?img=4", online: true },
  //   { id: 1, name: "Alice Johnson", lastMessage: "Hey! Are you free today?", avatar: "https://i.pravatar.cc/40?img=1", online: true },
  //   { id: 2, name: "Bob Smith", lastMessage: "Let's catch up later.", avatar: "https://i.pravatar.cc/40?img=2", online: false },
  //   { id: 3, name: "Cathy Green", lastMessage: "Got the documents.", avatar: "https://i.pravatar.cc/40?img=3", online: true },
  //   { id: 4, name: "David Lee", lastMessage: "Thanks for your help!", avatar: "https://i.pravatar.cc/40?img=4", online: true },
  // ];

  return (
   <aside className="w-72 border-r border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] h-[calc(100vh-4rem)] flex flex-col">
  <div className="p-4 font-bold text-[var(--color-primary)] text-xl border-b border-[var(--color-border)]">
    Chats
  </div>
  <ul className="flex-1 overflow-y-auto">
    {contacts.map((contact) => (
      <li
        key={contact.id}
        onClick={() => onSelectContact(contact)}
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[var(--color-accent)] transition-colors "
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center font-bold">
              {getAvatar(contact.username)}
            </div>
          {contact.online && (
            <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-[var(--color-bg)] rounded-full" />
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold truncate">{contact.username}</span>
          <span className="text-sm text-[var(--color-primary-dark)] truncate">
            {contact.lastMessage}
          </span>
        </div>
      </li>
    ))}
  </ul>
</aside>

  );
};
