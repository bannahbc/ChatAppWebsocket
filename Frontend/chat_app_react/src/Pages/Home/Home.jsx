import React, { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { ChatSidebar } from "../../Components/Chat/ChatSideBar";
import { ChatArea } from "../../Components/Chat/message";


const HomePage = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
  <div className="flex flex-col h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden">
  <header className="sticky top-0 z-50 shadow-md h-16">
    <Navbar />
  </header>

  <main className="flex flex-1 h-[calc(100vh-4rem)] w-full">
    {/* Sidebar */}
    <div
      className={`w-72 border-r border-[var(--color-border)] ${
        selectedContact ? "hidden" : "block"
      } lg:block h-full overflow-y-auto overflow-x-hidden`}
    >
      <ChatSidebar onSelectContact={setSelectedContact} />
    </div>

    {/* Chat area */}
    <div
      className={`flex-1 flex flex-col ${
        selectedContact ? "block" : "hidden"
      } lg:flex h-full overflow-y-auto overflow-x-hidden`}
    >
      <ChatArea
        contact={selectedContact}
        onBack={() => setSelectedContact(null)}
      />
    </div>
  </main>
</div>


  );
};


export default HomePage;