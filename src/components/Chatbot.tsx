import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, 
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

// --- Bot Knowledge Base ---
const KNOWLEDGE_BASE: Record<string, { response: string | React.ReactNode, suggestions?: string[] }> = {
  initial: {
    response: "Hello! I'm Gani, your property concierge. How can I help you today?",
    suggestions: ["Franchise Models", "Property Types", "Approval to Key", "About Legacy", "Contact Now"]
  },
  "hi": {
    response: "Hello there! How can Gani Properties assist you today? Are you looking for a property or interested in our franchise models?",
    suggestions: ["Franchise Models", "Property Types", "Contact Now"]
  },
  "hello": {
    response: "Hi! I'm here to help you navigate our properties and investment opportunities. What's on your mind?",
    suggestions: ["Franchise Models", "Property Types", "About Legacy"]
  },
  "hey": {
    response: "Hey! Nice to meet you. Looking for something specific in the Bangalore property market?",
    suggestions: ["Franchise Models", "Property Types", "Contact Now"]
  },
  "franchise models": {
    response: "We offer 3 strategic models:\n\n1. City Franchise (Model A): ₹8-10 Lakhs\n2. Regional Franchise (Model B): ₹15-20 Lakhs\n3. Builder Partner (Model C): Custom Investment\n\nWould you like to see the revenue splits?",
    suggestions: ["Revenue Split", "Apply for Franchise", "Back"]
  },
  "revenue split": {
    response: "Our splits are highly competitive:\n- Model A: 70% You / 30% Us\n- Model B: 75% You / 25% Us\n- Model C: 80% You / 20% Us\n\nAll models include full training!",
    suggestions: ["Apply for Franchise", "Back"]
  },
  "property types": {
    response: "We specialize in premium Residential Plots, Farmlands, Agricultural Lands, and Commercial Projects across Bengaluru.",
    suggestions: ["Search Locations", "Current Projects", "Back"]
  },
  "approval to key": {
    response: "Our 'Approval to Key' USP means we handle EVERYTHING—from government approvals and PSD (Design) to construction and key handover. Total peace of mind for you.",
    suggestions: ["Process Detail", "Back"]
  },
  "about legacy": {
    response: "With over 25 years of legacy, Gani Properties has delivered 100+ properties and currently manages 60+ acres in progress. We've brought smiles to over 600+ happy customers.",
    suggestions: ["Our Team", "Back"]
  },
  "contact now": {
    response: "You can reach our experts at +91 99000 00000 or email us at info@ganiproperties.com. Alternatively, I can take your details here for a callback.",
    suggestions: ["Submit Callback Enquiry", "Back"]
  },
  "fallback": {
    response: "That's a great question! I'm still learning, but I can certainly have one of our human experts call you back within an hour. Would you like to leave your details?",
    suggestions: ["Submit Callback Enquiry", "Start Over"]
  }
};

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string | React.ReactNode;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: KNOWLEDGE_BASE.initial.response,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [lastKey, setLastKey] = useState('initial');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', interest: 'General Inquiry' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addBotMessage = (key: string) => {
    setIsTyping(true);
    setLastKey(key.toLowerCase());
    setTimeout(() => {
      const kbEntry = KNOWLEDGE_BASE[key.toLowerCase()] || KNOWLEDGE_BASE.fallback;
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        text: kbEntry.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 800); // Slightly faster response
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    if (text.toLowerCase().includes('franchise')) addBotMessage('franchise models');
    else if (text.toLowerCase().includes('property')) addBotMessage('property types');
    else if (text.toLowerCase().includes('key') || text.toLowerCase().includes('approval')) addBotMessage('approval to key');
    else if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('call')) addBotMessage('contact now');
    else if (text.toLowerCase().includes('about') || text.toLowerCase().includes('legacy')) addBotMessage('about legacy');
    else if (text === 'Submit Callback Enquiry') {
      setShowEnquiryForm(true);
    }
    else {
      // Direct match or fallback
      const match = Object.keys(KNOWLEDGE_BASE).find(k => text.toLowerCase().includes(k));
      addBotMessage(match || 'fallback');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');
      await axios.post(`${API_URL}/leads`, {
        ...formData,
        source: 'Chatbot'
      });
      setFormStatus('success');
      setTimeout(() => {
        setShowEnquiryForm(false);
        setFormStatus('idle');
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          text: "✅ Got it! Our team will call you back shortly. Have a great day!",
          timestamp: new Date()
        }]);
      }, 1500);
    } catch (err) {
      alert("Failed to send enquiry. Please try again.");
      setFormStatus('idle');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 bg-[#0F3A3D] text-white rounded-full shadow-[0_10px_30px_rgba(15,58,61,0.4)] flex items-center justify-center border-2 border-[#C9B589]/30 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#C9B589]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={28} /> : (
          <div className="relative">
            <MessageCircle size={30} className="relative z-10" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9B589] rounded-full border-2 border-[#0F3A3D] animate-ping" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9B589] rounded-full border-2 border-[#0F3A3D]" />
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-[9998] w-[90vw] max-w-[400px] h-[600px] bg-white rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] border border-gp-ink/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#0F3A3D] p-6 text-white flex items-center gap-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9B589]/10 rounded-full blur-2xl -mr-16 -mt-16" />
               <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Bot size={24} className="text-[#C9B589]" />
               </div>
               <div>
                  <h3 className="font-display font-bold text-lg tracking-tight">Gani Concierge</h3>
                  <div className="flex items-center gap-1.5">
                     <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                     <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Always Active</span>
                  </div>
               </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 bg-gp-surface/30 space-y-4">
               {messages.map((msg) => (
                 <motion.div
                   key={msg.id}
                   initial={{ opacity: 0, x: msg.type === 'bot' ? -20 : 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                 >
                   <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.type === 'bot' ? 'bg-[#0F3A3D] text-white' : 'bg-[#C9B589] text-white'}`}>
                        {msg.type === 'bot' ? <Bot size={14} /> : <User size={14} />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.type === 'bot' 
                        ? 'bg-white text-gp-ink rounded-tl-none border border-gp-ink/5' 
                        : 'bg-[#0F3A3D] text-white rounded-tr-none'
                      }`}>
                         {typeof msg.text === 'string' ? msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>) : msg.text}
                      </div>
                   </div>
                 </motion.div>
               ))}

               {isTyping && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                     {[0.1, 0.2, 0.3].map(d => (
                       <motion.div 
                        key={d}
                        animate={{ y: [0, -3, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: d }} 
                        className="w-1.5 h-1.5 bg-gp-accent rounded-full" 
                       />
                     ))}
                   </div>
                 </motion.div>
               )}

               {/* Suggestions */}
               {!isTyping && !showEnquiryForm && messages[messages.length - 1]?.type === 'bot' && (
                 <div className="flex flex-wrap gap-2 py-2">
                    {KNOWLEDGE_BASE[lastKey]?.suggestions?.map(s => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSend(s)}
                        className="px-4 py-2 bg-white hover:bg-gp-accent hover:text-white text-gp-accent border border-gp-accent/20 rounded-full text-xs font-bold transition-all shadow-sm"
                      >
                        {s}
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowEnquiryForm(true)}
                      className="px-4 py-2 bg-[#C9B589] text-white rounded-full text-xs font-bold shadow-md"
                    >
                      Instant Callback ⚡
                    </motion.button>
                 </div>
               )}

               {/* Integrated Enquiry Form */}
               {showEnquiryForm && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-5 rounded-[2rem] border border-gp-accent/20 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gp-ink">Instant Callback</h4>
                      <button onClick={() => setShowEnquiryForm(false)} className="text-gp-ink-muted"><X size={16} /></button>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                       <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gp-ink-muted uppercase">Full Name</label>
                         <input 
                            required 
                            className="w-full bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 ring-gp-accent/20 transition-all outline-none" 
                            placeholder="e.g. Rahul Sharma"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                         />
                       </div>
                       <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gp-ink-muted uppercase">Phone Number</label>
                         <input 
                            required 
                            type="tel"
                            className="w-full bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 ring-gp-accent/20 transition-all outline-none" 
                            placeholder="+91 00000 00000"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                         />
                       </div>
                       <Button 
                        type="submit" 
                        disabled={formStatus === 'sending' || formStatus === 'success'}
                        className="w-full py-5 bg-[#0F3A3D] font-bold text-xs"
                       >
                         {formStatus === 'sending' ? <Loader2 className="animate-spin" /> : 
                          formStatus === 'success' ? 'Sent!' : 'Request Call'}
                       </Button>
                    </form>
                 </motion.div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            {!showEnquiryForm && (
              <div className="p-4 bg-white border-t border-gp-ink/5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask about properties, franchise..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                    className="w-full bg-slate-50 pl-5 pr-12 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm focus:ring-2 ring-gp-accent/50 placeholder:text-slate-400 outline-none transition-all"
                  />
                  <button 
                    onClick={() => handleSend(inputValue)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0F3A3D] text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[10px] text-gp-ink-muted text-center mt-3 font-medium">Powering premium property experiences</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
