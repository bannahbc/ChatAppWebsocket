import React, { useEffect, useState } from "react";
import { API } from "../../Api/Axios";
import SearchInput from "../Search/searchinput";
import Spinner from "../../Utils/loadingspinner";

const getAvatar = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const ChatSidebar = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const getContacts = async () => {
    try {
      setLoading(true);
      const res = await API.get("user/getusers/");
      setContacts(res.data);
      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error(
        "Error fetching chat users:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
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
    <aside className=" border-r border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4 font-bold text-[var(--color-primary)] text-xl border-b border-[var(--color-border)]">
        Chats
      </div>
      <div className="chat-search m-2">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {
          loading?
          (
            <Spinner/>
          )
          :
        <>
        {contacts
          .filter((contact) =>
            contact.username.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((contact) => (
            <li
              key={contact.id}
              onClick={() => handleSelect(contact)}
              className={`flex items-center gap-3 p-2 bg-[var(--color-bg-tra)] cursor-pointer transition-colors rounded-3xl mt-1 mx-2
          ${
            selectedContactId === contact.id
              ? "bg-[var(--color-accent-dark)] shadow-xl"
              : "hover:bg-[var(--color-accent)]"
          }`}
            >
              <div className="relative w-10 h-10">
  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-accent)] flex items-center justify-center bg-[var(--color-accent)]">
    {contact.profile_picture ? (
      <img
        src={contact.profile_picture}
        alt={contact.username}
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-white font-bold">
        {getAvatar(contact.username)}
      </span>
    )}
  </div>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-[var(--color-bg)] rounded-full" />
                )}
</div>

              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold truncate">
                  {contact.username}
                </span>
                <span className="text-sm text-[var(--color-primary-dark)] truncate">
                  {contact.lastMessage}
                </span>
              </div>
            </li>
          ))}

          {/* ✅ Show message if no users match */}
          {contacts.filter((c) =>
          c.username.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
            <li className="p-4 text-center text-[var(--color-text-small)]">
            No users found
          </li>
        )}
        </>
      }
      </ul>
    </aside>
  );
};
