import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, AlertCircle } from 'lucide-react';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in-up`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-indigo-600'
        }`}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-sm' 
              : message.isError 
                ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-sm'
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
          }`}>
            {/* Image Attachment Display */}
            {message.attachment && (
              <div className="mb-3 rounded-lg overflow-hidden border border-white/20 max-w-[200px]">
                <img 
                  src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} 
                  alt="User upload"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Text Content */}
            {message.isError ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{message.text}</span>
              </div>
            ) : (
              <div className={`markdown-body ${isUser ? 'text-white' : ''}`}>
                 {isUser ? (
                   <p className="whitespace-pre-wrap">{message.text}</p>
                 ) : (
                   <ReactMarkdown 
                    components={{
                      code({node, className, children, ...props}) {
                        // Check if the code is inline or a block
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match && !String(children).includes('\n');
                        
                        return !isInline ? (
                          <div className="bg-slate-800 text-slate-100 p-3 rounded-md my-2 overflow-x-auto font-mono text-xs">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </div>
                        ) : (
                          <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-xs" {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                   >
                     {message.text}
                   </ReactMarkdown>
                 )}
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;