import { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  ArrowLeft,
  MoreHorizontal,
  CheckCheck,
  Check,
} from "lucide-react";

const CONVOS = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    role: "guest",
    unread: 2,
    time: "10:42 AM",
    preview: "The pool wasn't heated at all during our stay.",
    msgs: [
      {
        id: 1,
        me: false,
        text: "Hi Admin, I wanted to report an issue with my recent stay at Luxury Beach Villa.",
        time: "10:30 AM",
      },
      {
        id: 2,
        me: true,
        text: "Hi Priya! I'm sorry to hear that. Can you please describe the issue in detail?",
        time: "10:35 AM",
        read: true,
      },
      {
        id: 3,
        me: false,
        text: "The pool wasn't heated at all during our stay, despite it being listed as an amenity.",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Raj Shah",
    initials: "RS",
    role: "host",
    unread: 0,
    time: "Yesterday",
    preview: "When will my listing go live?",
    msgs: [
      {
        id: 1,
        me: false,
        text: "Hi, I submitted a new listing 3 days ago. When will it go live?",
        time: "9:00 AM",
      },
      {
        id: 2,
        me: true,
        text: "Hi Raj! Your listing is currently under review. It should be live within 24 hours.",
        time: "9:10 AM",
        read: true,
      },
    ],
  },
  {
    id: 3,
    name: "Anjali Singh",
    initials: "AS",
    role: "guest",
    unread: 1,
    time: "Mon",
    preview: "I haven't received my refund yet.",
    msgs: [
      {
        id: 1,
        me: false,
        text: "My cancellation was approved 10 days ago but I still haven't received the refund.",
        time: "Mon 3:00 PM",
      },
    ],
  },
  {
    id: 4,
    name: "Arjun Verma",
    initials: "AV",
    role: "host",
    unread: 0,
    time: "Sun",
    preview: "Thanks for the quick resolution!",
    msgs: [
      {
        id: 1,
        me: false,
        text: "The dispute with my guest has been resolved. Thanks for the quick help!",
        time: "Sun 5:00 PM",
      },
      {
        id: 2,
        me: true,
        text: "Glad we could help resolve it smoothly. Let us know if anything comes up.",
        time: "Sun 5:30 PM",
        read: true,
      },
    ],
  },
];

const ROLE_CLS = {
  guest: "bg-blue-50 text-blue-600",
  host: "bg-purple-50 text-purple-600",
};

function Avatar({ initials, online }) {
  return (
    <div className="relative shrink-0">
      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center select-none">
        {initials}
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const [convos, setConvos] = useState(CONVOS);
  const [activeId, setActiveId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const bottomRef = useRef(null);
  const taRef = useRef(null);

  const active = convos.find((c) => c.id === activeId);

  const pick = (id) => {
    setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    const c = convos.find((c) => c.id === id);
    setMsgs(c?.msgs || []);
    setActiveId(id);
    setShowChat(true);
    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

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
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const filtered = convos.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.preview.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="h-full flex overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Sidebar */}
      <div
        className={`w-full md:w-72 lg:w-80 shrink-0 border-r border-gray-100 flex flex-col ${showChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">Messages</h2>
            {convos.reduce((n, c) => n + c.unread, 0) > 0 && (
              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                {convos.reduce((n, c) => n + c.unread, 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-transparent focus-within:border-blue-200 rounded-xl px-3 py-2.5 transition-all">
            <Search size={13} className="text-gray-300 shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="bg-transparent outline-none text-[13px] text-gray-700 w-full placeholder:text-gray-300"
            />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto [scrollbar-width:none] divide-y divide-gray-50">
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => pick(c.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left border-none cursor-pointer transition-colors
                  ${activeId === c.id ? "bg-blue-50" : "bg-white hover:bg-gray-50/70"}`}
              >
                <Avatar initials={c.initials} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`text-[13px] truncate font-${c.unread ? "bold" : "medium"} text-gray-${c.unread ? "900" : "700"}`}
                      >
                        {c.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${ROLE_CLS[c.role]}`}
                      >
                        {c.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-300 shrink-0">
                      {c.time}
                    </span>
                  </div>
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

      {/* Chat */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${showChat ? "flex" : "hidden md:flex"}`}
      >
        {active ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 h-17.25 border-b border-gray-100 shrink-0">
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400 border-none cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <Avatar initials={active.initials} />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13.5px] font-bold text-gray-900">
                    {active.name}
                  </p>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ROLE_CLS[active.role]}`}
                  >
                    {active.role}
                  </span>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-300 border-none cursor-pointer">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 bg-gray-50/40 [scrollbar-width:none] space-y-1">
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
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                            {active.initials}
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[68%] sm:max-w-[55%] flex flex-col ${m.me ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`px-4 py-2.5 text-[13.5px] leading-relaxed
                        ${m.me ? "bg-blue-600 text-white rounded-2xl rounded-br-sm" : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm"}
                        ${prevSame && m.me ? "rounded-tr-sm" : ""} ${prevSame && !m.me ? "rounded-tl-sm" : ""}`}
                      >
                        {m.text}
                      </div>
                      {!nextSame && (
                        <div
                          className={`flex items-center gap-1 mt-1 ${m.me ? "flex-row-reverse" : ""}`}
                        >
                          <span className="text-[10px] text-gray-300">
                            {m.time}
                          </span>
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

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-end gap-2.5">
                <div className="flex-1 flex items-end bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-300 focus-within:bg-white transition-all">
                  <textarea
                    ref={taRef}
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKey}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent outline-none text-[13.5px] text-gray-800 placeholder:text-gray-300 resize-none leading-relaxed"
                    style={{ scrollbarWidth: "none", maxHeight: 100 }}
                  />
                </div>
                <button
                  onClick={send}
                  disabled={!text.trim()}
                  className="shrink-0 w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 flex items-center justify-center border-none cursor-pointer transition-all"
                >
                  <Send size={14} className="text-white ml-0.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-gray-50/30">
            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Send size={16} className="text-gray-400 ml-0.5" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              Select a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
