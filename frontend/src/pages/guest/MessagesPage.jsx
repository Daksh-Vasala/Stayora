import { useState, useEffect, useRef } from "react";
import { Send, Search, ArrowLeft, MoreVertical } from "lucide-react";
import { socket } from "../../socket";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const location = useLocation();

  const bottomRef = useRef();
  const { user } = useAuth();

  // 🔹 Fetch chats
  const fetchChats = async () => {
    try {
      const res = await axios.get("/chats");
      setChats(res.data.chats);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Select chat
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);

    try {
      const res = await axios.get(`/messages/${chat._id}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Send message
  const sendMessage = () => {
    if (!input.trim() || !selectedChat) return;

    const receiver = selectedChat.members.find(
      (m) => m._id !== user.id
    )?._id;

    socket.emit("sendMessage", {
      sender: user.id,
      receiver,
      message: input,
      property: selectedChat.property,
    });

    setInput("");
  };

  // 🔹 Register socket
  useEffect(() => {
    if (user?.id) {
      socket.emit("register", user.id);
    }
  }, [user]);

  // 🔹 Fetch chats on load
  useEffect(() => {
    fetchChats();
  }, []);

  // 🔹 Receive messages (🔥 FIX HERE)
  useEffect(() => {
    const handleReceive = (msg) => {
      // update messages if open
      if (msg.chat === selectedChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }

      // 🔥 FIX: handle new chat case
      setChats((prev) => {
        const exists = prev.find((chat) => chat._id === msg.chat);

        if (exists) {
          return prev.map((chat) =>
            chat._id === msg.chat
              ? { ...chat, lastMessage: msg }
              : chat
          );
        } else {
          // NEW CHAT → refetch
          fetchChats();
          return prev;
        }
      });
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [selectedChat]);

  // 🔹 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatId = location.state?.chatId;

  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find((c) => c._id === chatId);
      if (chat) handleSelectChat(chat);
    }
  }, [chatId, chats]);

  return (
    <div className="h-[calc(100vh-70px)] flex bg-white rounded-xl overflow-hidden border border-gray-200">
      {/* LEFT PANEL */}
      <div
        className={`w-full md:w-[320px] border-r border-gray-200 flex flex-col ${
          selectedChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-3">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const otherUser = chat.members?.find(
              (m) => m._id !== user.id
            );

            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                  selectedChat?._id === chat._id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">
                  {otherUser?.name?.[0] || "U"}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{otherUser?.name || "User"}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {chat.lastMessage?.message || "Start conversation"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`flex-1 flex flex-col ${
          !selectedChat ? "hidden md:flex" : "flex"
        }`}
      >
        {!selectedChat ? (
          <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
            <div className="text-lg font-medium">Select a conversation</div>
            <p className="text-sm mt-1">Your messages will appear here</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-semibold">
                  {
                    selectedChat.members?.find(
                      (m) => m._id !== user.id
                    )?.name?.[0]
                  }
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {
                      selectedChat.members?.find(
                        (m) => m._id !== user.id
                      )?.name
                    }
                  </p>
                </div>
              </div>

              <MoreVertical size={18} className="text-gray-500" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      msg.sender === user.id
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {msg.message}
                    <div className="text-[10px] mt-1 opacity-60 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>

            <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;