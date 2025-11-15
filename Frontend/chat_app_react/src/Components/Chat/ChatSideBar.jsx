import React, { useEffect, useState } from "react";
import { API } from "../../Api/Axios";

const getAvatar = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const ChatSidebar = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);

  const getContacts = async () => {
    try {
      const res = await API.get("user/getusers/");
      setContacts(res.data);
      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error("Error fetching chat users:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const handleSelect = (contact) => {
    setSelectedContactId(contact.id);
    onSelectContact(contact);
  };

  return (
    <aside className="w-72 border-r border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4 font-bold text-[var(--color-primary)] text-xl border-b border-[var(--color-border)]">
        Chats
      </div>
      <ul className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            onClick={() => handleSelect(contact)}
            className={`flex items-center gap-3 p-2 bg-[var(--color-bg-tra)] cursor-pointer transition-colors rounded-3xl mt-1 mx-2
              ${selectedContactId === contact.id 
                ? "bg-[var(--color-accent-dark)] shadow-xl" 
                : "hover:bg-[var(--color-accent)]"}`}
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
