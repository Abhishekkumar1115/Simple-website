import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import { sendMessageToGemini } from './services/geminiService';
import { Message, Role } from './types';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, attachment?: { mimeType: string; data: string }) => {
    const userMessageId = uuidv4();
    
    // 1. Create User Message
    const newUserMessage: Message = {
      id: userMessageId,
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
      attachment: attachment
    };

    // Update UI immediately
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // 2. Call Gemini
      const responseText = await sendMessageToGemini(text, attachment?.data, attachment?.mimeType);

      // 3. Create Bot Message
      const botMessage: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Handle Error
      const errorMessage: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: "I'm sorry, I encountered an error processing your request. Please check your connection or API key and try again.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto flex flex-col min-h-full">
          
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                 <Sparkles className="w-8 h-8 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 max-w-sm">
                I can explain complex topics, analyze images, write code, or just chat.
              </p>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {/* Loading Indicator (in stream-like location) */}
          {isLoading && (
            <div className="flex w-full justify-start mb-6 animate-pulse">
               <div className="flex max-w-[80%] gap-3 flex-row">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;