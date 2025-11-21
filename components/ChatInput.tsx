import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { fileToBase64 } from '../services/geminiService';

interface ChatInputProps {
  onSend: (text: string, attachment?: { mimeType: string; data: string }) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    let attachment = undefined;
    if (selectedFile) {
      const base64 = await fileToBase64(selectedFile);
      attachment = {
        mimeType: selectedFile.type,
        data: base64
      };
    }

    onSend(input, attachment);
    
    // Reset state
    setInput('');
    clearFile();
    // Reset textarea height
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  }

  return (
    <div className="border-t border-slate-200 bg-white p-4 sticky bottom-0 z-20">
      <div className="max-w-3xl mx-auto">
        
        {/* Image Preview Area */}
        {previewUrl && (
          <div className="mb-3 relative inline-block">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded-lg border border-slate-200 shadow-sm" 
            />
            <button 
              onClick={clearFile}
              className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-slate-900 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          
          {/* Image Upload Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            title="Add image"
            disabled={isLoading}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={adjustHeight}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gemini..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent border-0 focus:ring-0 p-3 text-slate-800 placeholder:text-slate-400 resize-none max-h-[150px] overflow-y-auto leading-relaxed"
          />

          {/* Send Button */}
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedFile) || isLoading}
            className={`p-3 rounded-xl transition-all duration-200 ${
              (!input.trim() && !selectedFile) || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">Gemini may display inaccurate info, including about people, so double-check its responses.</p>
      </div>
    </div>
  );
};

export default ChatInput;