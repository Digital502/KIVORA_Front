import { useEffect, useState, useCallback } from "react";
import {
  getUser,
  getMyContacts,
  getMessagesWithUser,
  sendMessageToUser,
} from "../../services";

export const useChat = (userId, socket) => {
  const [users, setUsers] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    messages: false,
    sending: false,
  });
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true }));
      setError(null);

      const response = await getMyContacts();
      const transformed = response.contacts.map((item) => ({
        ...item.user,
        rol: item.rol,
        hasUnread: false,
      }));

      setUsers(transformed);
    } catch (err) {
      console.error("Error al obtener contactos:", err);
      setError("Error al cargar contactos");
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  }, []);

  const fetchSearchOptions = useCallback(async () => {
    try {
      setError(null);
      const res = await getUser();
      setSearchOptions(res.services || []);
    } catch (err) {
      console.error("Error al obtener usuarios para búsqueda:", err);
      setError("Error al cargar opciones de búsqueda");
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;

    try {
      setLoading((prev) => ({ ...prev, messages: true }));
      setError(null);

      const res = await getMessagesWithUser(selectedUser._id || selectedUser.uid);
      setMessages(res.messages || []);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, hasUnread: false } : user
        )
      );
    } catch (err) {
      console.error("Error al obtener mensajes:", err);
      setError("Error al cargar mensajes");
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  }, [selectedUser]);

  const sendMessage = useCallback(async (formData) => {
    if (!selectedUser || !formData) return;

    try {
      setLoading((prev) => ({ ...prev, sending: true }));
      setError(null);

      const res = await sendMessageToUser(selectedUser.uid, formData);

      setMessages((prev) => [
        ...prev,
        {
          ...res.newMessage,
          senderId: userId,
          timestamp: new Date().toISOString(),
        },
      ]);

      return res.newMessage;
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError("Error al enviar mensaje");
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }));
    }
  }, [selectedUser, userId]);

  useEffect(() => {
    if (userId) {
      fetchUsers();
      fetchSearchOptions();
    }
  }, [userId, fetchUsers, fetchSearchOptions]);

  useEffect(() => {
    fetchMessages();
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.senderId === selectedUser.uid)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const isSender =
            user._id === newMessage.senderId ||
            user.uid === newMessage.senderId;
          return isSender
            ? {
                ...user,
                hasUnread: !selectedUser || user._id !== selectedUser._id,
              }
            : user;
        })
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  return {
    users,
    selectedUser,
    setSelectedUser,
    messages,
    sendMessage,
    searchOptions,
    loading,
    error,
    fetchMessages,
    fetchUsers,
  };
};
