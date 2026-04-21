import { useState, useEffect, useRef } from "react";
import { Send, Search, ArrowLeft, MoreVertical } from "lucide-react";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const bottomRef = useRef();
  const { user } = useAuth();

  // Check if user is admin (you may need to adjust this based on your auth)
  const isAdmin = user?.role === "admin";

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

    const receiver = selectedChat.members.find((m) => m._id !== user._id)?._id;

    socket.emit("sendMessage", {
      sender: user._id,
      receiver,
      message: input,
      property: selectedChat.property,
    });

    setInput("");
  };

  // 🔹 Register socket
  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }
  }, [user]);

  // 🔹 Fetch chats on load
  useEffect(() => {
    fetchChats();
  }, []);

  // 🔹 Receive messages
  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.chat === selectedChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }

      setChats((prev) => {
        const exists = prev.find((chat) => chat._id === msg.chat);

        if (exists) {
          return prev.map((chat) =>
            chat._id === msg.chat ? { ...chat, lastMessage: msg } : chat,
          );
        } else {
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

  // Filter chats based on search
  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.members?.find((m) => m._id !== user._id);
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div
      className={`${isAdmin ? "min-h-screen" : "min-h-[calc(100vh-70px)]"} flex bg-white rounded-xl overflow-hidden border border-gray-200`}
    >
      {/* LEFT PANEL */}
      <div
        className={`w-full md:w-[320px] border-r border-gray-200 flex flex-col min-h-0 ${
          selectedChat ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => {
            const otherUser = chat.members?.find((m) => m._id !== user._id);

            // Get last message preview
            const lastMessagePreview =
              chat.lastMessage?.message || "Start conversation";
            const previewText =
              lastMessagePreview.length > 35
                ? lastMessagePreview.substring(0, 35) + "..."
                : lastMessagePreview;

            // Get time for last message
            const lastMessageTime = chat.lastMessage?.createdAt
              ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                  selectedChat?._id === chat._id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : "hover:bg-gray-50 border-l-4 border-l-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {otherUser?.name?.[0]?.toUpperCase() || "U"}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {otherUser?.name || "User"}
                    </span>
                    {lastMessageTime && (
                      <span className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">
                        {lastMessageTime}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isAdmin && (
                      <span
                        className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                          otherUser?.role === "host"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {otherUser?.role || "guest"}
                      </span>
                    )}
                    <p className="text-xs text-gray-500 truncate flex-1">
                      {previewText}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Search size={20} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`flex-1 flex flex-col min-h-0 ${
          !selectedChat ? "hidden md:flex" : "flex"
        }`}
      >
        {!selectedChat ? (
          <div className="flex flex-1 flex-col items-center justify-center text-gray-400 bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="text-base font-medium text-gray-600">
              Select a conversation
            </div>
            <p className="text-sm mt-1 text-gray-400">
              Your messages will appear here
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>

                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                  {selectedChat.members
                    ?.find((m) => m._id !== user._id)
                    ?.name?.[0]?.toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {
                      selectedChat.members?.find((m) => m._id !== user._id)
                        ?.name
                    }
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedChat.members?.find((m) => m._id !== user._id)
                        ?.role === "host"
                        ? "Host"
                        : "Guest"}
                    </p>
                  )}
                </div>
              </div>

              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-gray-50">
              {messages.map((msg, idx) => {
                const isOwn = msg.sender === user._id;
                const sender = selectedChat.members?.find(
                  (m) => m._id === msg.sender,
                );

                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${!isOwn && isAdmin ? "ml-0" : ""}`}
                    >
                      {!isOwn && isAdmin && (
                        <div className="mb-1 ml-2">
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                              sender?.role === "host"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {sender?.role || "guest"}
                          </span>
                        </div>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isOwn
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        {msg.message}
                        <div
                          className={`text-[10px] mt-1.5 ${isOwn ? "text-blue-100" : "text-gray-400"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!input.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
