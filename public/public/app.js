import React, { useState, useRef, useEffect } from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatRef = useRef();

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(m => [...m, {role: 'user', text: userMsg}]);
    setInput('');
    setTyping(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [...messages, {role:'user',content:userMsg}]})
    });
    const data = await res.json();

    setMessages(m => [...m, {role: 'ai', text: data.reply || "mitrsht устал..."}]);
    setTyping(false);
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="text-center py-10">
        <h1 className="text-8xl mitrsht">MITRSHT</h1>
        <p className="text-2xl mt-4">AI чат · 70B · сделано mitrsht</p>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto space-y-6 pb-32 px-4">
        {messages.map((m,i) => (
          <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
            <div className={`max-w-xl px-8 py-4 rounded-3xl ${m.role==='user'?'bg-purple-600':'bg-gradient-to-r from-orange-600 to-red-600'} shadow-2xl`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && <div className="text-orange-400">mitrsht думает...</div>}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
        <div className="flex gap-4">
          <input
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter' && send()}
            placeholder="Напиши mitrsht и увидишь магию..."
            className="flex-1 bg-gray-900/80 border border-orange-600/50 rounded-2xl px-8 py-5 text-xl focus:outline-none focus:border-orange-400"
          />
          <button onClick={send} className="px-10 py-5 bg-orange-600 rounded-2xl font-bold hover:bg-orange-500 transition">
            SEND
          </button>
        </div>
      </div>

      <div className="watermark">СДЕЛАНО MITRSHT</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
