import { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  MoreHorizontal,
  Home,
} from "lucide-react";
import { socket } from "../../socket";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

// ══════════════════════════════════════════════════════════════════════════════
//  SHARED DATA
// ══════════════════════════════════════════════════════════════════════════════

const CONVOS = [
  {
    id: 1,
    host: "Raj Shah",
    initials: "RS",
    online: true,
    unread: 2,
    property: "Luxury Beach Villa",
    preview: "Yes, the pool is heated! And parking is available.",
    time: "10:42 AM",
    msgs: [
      {
        id: 1,
        me: true,
        text: "Hi! Is the pool heated during winter months?",
        time: "10:30 AM",
        read: true,
      },
      {
        id: 2,
        me: true,
        text: "Also, is parking available on-site?",
        time: "10:31 AM",
        read: true,
      },
      {
        id: 3,
        me: false,
        text: "Hi! Yes, the pool is heated through December. And yes, we have covered parking for 2 cars 🚗",
        time: "10:40 AM",
      },
      {
        id: 4,
        me: false,
        text: "Let me know if you have any other questions!",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: 2,
    host: "Priya Nair",
    initials: "PN",
    online: false,
    unread: 0,
    property: "Modern City Apartment",
    preview: "Check-in is at 2 PM. See you soon!",
    time: "Yesterday",
    msgs: [
      {
        id: 1,
        me: true,
        text: "What time is check-in?",
        time: "9:00 AM",
        read: true,
      },
      {
        id: 2,
        me: false,
        text: "Check-in is at 2 PM. See you soon! 🏙️",
        time: "9:10 AM",
      },
    ],
  },
  {
    id: 3,
    host: "Arjun Verma",
    initials: "AV",
    online: true,
    unread: 1,
    property: "Cozy Hill Cottage",
    preview: "The road is clear now, drive safe!",
    time: "Mon",
    msgs: [
      {
        id: 1,
        me: true,
        text: "Is the road to the cottage clear after the snowfall?",
        time: "Mon 8:00 AM",
        read: true,
      },
      {
        id: 2,
        me: false,
        text: "Yes, the road is clear now! Drive safe 🏔️",
        time: "Mon 9:30 AM",
      },
    ],
  },
  {
    id: 4,
    host: "Sneha Kapoor",
    initials: "SK",
    online: false,
    unread: 0,
    property: "Heritage Haveli",
    preview: "You: Can we get a late checkout?",
    time: "Sun",
    msgs: [
      {
        id: 1,
        me: true,
        text: "Can we get a late checkout on our last day?",
        time: "Sun 3:00 PM",
        read: true,
      },
      {
        id: 2,
        me: false,
        text: "Of course! Checkout by 1 PM works perfectly 🙏",
        time: "Sun 3:15 PM",
      },
    ],
  },
];

const QUICK = [
  "Thank you!",
  "Is it still available?",
  "What's the check-in process?",
];

function Avatar({ initials, online }) {
  return (
    <div className="relative shrink-0">
      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 text-[12px] font-bold flex items-center justify-center select-none">
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-white" />
      )}
    </div>
  );
}

function ConvoList({ convos, activeId, onPick }) {
  const [q, setQ] = useState("");
  const filtered = convos.filter(
    (c) =>
      c.host.toLowerCase().includes(q.toLowerCase()) ||
      c.property.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-gray-900">Messages</h2>
          {convos.reduce((n, c) => n + c.unread, 0) > 0 && (
            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
              {convos.reduce((n, c) => n + c.unread, 0)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-blue-200 transition-all">
          <Search size={13} className="text-gray-300 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="bg-transparent outline-none text-[13px] text-gray-700 w-full placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* List */}
      <ul className="flex-1 overflow-y-auto [scrollbar-width:none] divide-y divide-gray-50">
        {filtered.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onPick(c.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors border-none cursor-pointer
                ${activeId === c.id ? "bg-blue-50" : "bg-white hover:bg-gray-50/70"}`}
            >
              <Avatar initials={c.initials} online={c.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span
                    className={`text-[13px] truncate ${c.unread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                  >
                    {c.host}
                  </span>
                  <span className="text-[11px] text-gray-300 shrink-0">
                    {c.time}
                  </span>
                </div>
                <p className="text-[11px] text-blue-500 flex items-center gap-1 mb-0.5 truncate">
                  <Home size={9} className="shrink-0" /> {c.property}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[12px] truncate ${c.unread ? "text-gray-600 font-medium" : "text-gray-400"}`}
                  >
                    {c.preview}
                  </span>
                  {c.unread > 0 && (
                    <span className="shrink-0 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatWindow({ convo, onBack }) {
  const [msgs, setMsgs] = useState(convo.msgs);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);
  useEffect(() => {
    setMsgs(convo.msgs);
    setText("");
  }, [convo.id]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((p) => [
      ...p,
      {
        id: p.length + 1,
        me: true,
        text: t,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
      },
    ]);
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
  const onType = (e) => {
    setText(e.target.value);
    const el = taRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 h-17.25 border-b border-gray-100 shrink-0">
        <button
          onClick={onBack}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400 border-none cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <Avatar initials={convo.initials} online={convo.online} />
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-bold text-gray-900 truncate">
            {convo.host}
          </p>
          <p className="text-[11px] text-blue-500 flex items-center gap-1 truncate">
            <Home size={9} className="shrink-0" /> {convo.property}
          </p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-300 border-none cursor-pointer transition-colors shrink-0">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 bg-gray-50/40 [scrollbar-width:none] space-y-1">
        <div className="flex justify-center mb-4">
          <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">
            Today
          </span>
        </div>

        {msgs.map((m, i) => {
          const prevSame = i > 0 && msgs[i - 1].me === m.me;
          const nextSame = i < msgs.length - 1 && msgs[i + 1].me === m.me;
          return (
            <div
              key={m.id}
              className={`flex ${m.me ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-3"}`}
            >
              {!m.me && (
                <div className="w-7 h-7 mr-2 shrink-0 self-end">
                  {!nextSame && (
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center">
                      {convo.initials}
                    </div>
                  )}
                </div>
              )}
              <div
                className={`max-w-[68%] sm:max-w-[55%] flex flex-col ${m.me ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-4 py-2.5 text-[13.5px] leading-relaxed shadow-sm
                  ${
                    m.me
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm"
                  }
                  ${prevSame && m.me ? "rounded-tr-sm" : ""}
                  ${prevSame && !m.me ? "rounded-tl-sm" : ""}
                `}
                >
                  {m.text}
                </div>
                {!nextSame && (
                  <div
                    className={`flex items-center gap-1 mt-1 ${m.me ? "flex-row-reverse" : ""}`}
                  >
                    <span className="text-[10px] text-gray-300">{m.time}</span>
                    {m.me &&
                      (m.read ? (
                        <CheckCheck size={11} className="text-blue-400" />
                      ) : (
                        <Check size={11} className="text-gray-300" />
                      ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-5 py-2.5 bg-white border-t border-gray-50 shrink-0">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {QUICK.map((r) => (
            <button
              key={r}
              onClick={() => {
                setText(r);
                taRef.current?.focus();
              }}
              className="shrink-0 text-[11px] font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-blue-100 transition-colors whitespace-nowrap border-none"
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-end gap-2.5">
          <div className="flex-1 flex items-end bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-300 focus-within:bg-white transition-all">
            <textarea
              ref={taRef}
              rows={1}
              value={text}
              onChange={onType}
              onKeyDown={onKey}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-[13.5px] text-gray-800 placeholder:text-gray-300 resize-none leading-relaxed"
              style={{ scrollbarWidth: "none", maxHeight: 120 }}
            />
          </div>
          <button
            onClick={send}
            disabled={!text.trim()}
            className="shrink-0 w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border-none cursor-pointer transition-all"
          >
            <Send size={14} className="text-white ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function GuestMessagesPage() {
  const [convos, setConvos] = useState(CONVOS);
  const [activeId, setActiveId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const active = convos.find((c) => c.id === activeId) ?? null;

  const pick = (id) => {
    setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    setActiveId(id);
    setShowChat(true);
  };

  useEffect(() => {
    if (!user?.id) return;

    // connect + register
    socket.on("connect", () => {
      socket.emit("register", user.id);
    });

    // receive message
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => {
        // Remove temp message if exists
        const filtered = prev.filter(
          (msg) => !msg._id.startsWith("temp-") || msg.message !== data.message,
        );
        // Add the real message
        return [...filtered, data];
      });
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, [user.id]);

  // fetch messages when receiver changes
  useEffect(() => {
    if (!receiverId) return;

    const fetchMessages = async () => {
      const res = await axios.get(`/messages/${user.id}/${receiverId}`);
      setMessages(res.data.messages); // ✅ FIXED
    };

    fetchMessages();

    // mark as read
    axios.post("/messages/mark-read", {
      sender: receiverId,
      receiver: user.id,
    });
  }, [receiverId, user.id]);

  // send message
  const sendTestMessage = () => {
    if (!message.trim()) return;

    const tempMsg = {
      _id: `temp-${Date.now()}`,
      sender: user.id,
      receiver: receiverId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // Optimistically add to UI
    setMessages((prev) => [...prev, tempMsg]);

    socket.emit("sendMessage", {
      sender: user.id,
      receiver: receiverId,
      message: message.trim(),
    });

    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div>
        <h3>Logged in as: {user.id}</h3>

        <input
          placeholder="Enter receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />

        <input
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={sendTestMessage}>Send</button>

        <div>
          {Array.isArray(messages)
            ? messages.map((msg, i) => <p key={i}>{msg.message}</p>)
            : "Not an array"}
        </div>
      </div>
      <div
        className={`w-full md:w-72 lg:w-80 shrink-0 border-r border-gray-100 ${showChat ? "hidden md:block" : "block"}`}
      >
        <div className="h-full">
          <ConvoList convos={convos} activeId={activeId} onPick={pick} />
        </div>
      </div>
      <div
        className={`flex-1 min-w-0 ${showChat ? "flex flex-col" : "hidden md:flex md:flex-col"}`}
      >
        {active ? (
          <ChatWindow convo={active} onBack={() => setShowChat(false)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-gray-50/30">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Send size={16} className="text-gray-400 ml-0.5" />
            </div>
            <p className="text-[13px] font-semibold text-gray-500">
              Your messages
            </p>
            <p className="text-[12px] text-gray-300">
              Select a conversation to start
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
