// src/components/chat/ChatLayout.jsx
import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../../shared/hooks/useSocket";
import { useChat } from "../../shared/hooks/useChat";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

export const ChatLayout = ({ userId }) => {
  const socket = useSocket(userId);
  const {
    users,
    selectedUser,
    setSelectedUser,
    messages,
    sendMessage,
    searchOptions,
    fetchMessages,
    loading,
  } = useChat(userId, socket);

  const [isMobile, setIsMobile] = useState(false);

  const handleSelectUser = useCallback(
    (user) => {
      const normalizedUser = {
        ...user,
        _id: user._id || user.uid,
        uid: user.uid || user._id,
      };
      setSelectedUser(normalizedUser);
      setTimeout(() => {
        const messageInput = document.getElementById("message-input");
        if (messageInput) messageInput.focus();
      }, 100);
    },
    [setSelectedUser]
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!socket || !userId) {
    return (
      <div className="flex items-center justify-center h-screen p-4 bg-[#0D0D0D]">
        <div className="animate-pulse text-[#5CE1E6]">🔄 Conectando al chat...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0D0D0D]">
      {(!selectedUser || !isMobile) && (
        <UserList
          users={users}
          selectedUser={selectedUser}
          onSelect={handleSelectUser}
          searchOptions={searchOptions}
          currentUser={userId}
        />
      )}

      {selectedUser && (
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <div className="flex-1 flex flex-col min-h-0">
            <ChatWindow
              key={selectedUser._id || selectedUser.uid}
              messages={messages}
              userId={userId}
              user={selectedUser}
              loading={loading.messages}
              isMobile={isMobile}
              onBack={() => setSelectedUser(null)}
            />

            <div className="p-3 bg-[#0D0D0D] border-t border-[#036873]">
              <MessageInput
                id="message-input"
                onSend={(message) => sendMessage(message)}
                disabled={!selectedUser || loading.sending}
                loading={loading.sending}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};