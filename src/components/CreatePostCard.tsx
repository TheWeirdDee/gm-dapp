'use client';

import { useState } from 'react';
import { Image as ImageIcon, Video, BarChart2, Smile, Globe, ChevronDown, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { createRealPost } from '@/lib/features/postsSlice';
import { uploadFile } from '@/lib/supabase';
import IdentityAvatar from './IdentityAvatar';
import { AppDispatch } from '@/lib/store';

export default function CreatePostCard() {
  const [content, setContent] = useState('');
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacy, setPrivacy] = useState('Public');
  const [attachments, setAttachments] = useState<{type: 'image' | 'video', url: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  const { address, isConnected, isPro } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddOption = () => {
    if (pollOptions.length < 5) setPollOptions([...pollOptions, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile('media', file);
      if (url) {
        setAttachments([...attachments, { type, url }]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && attachments.length === 0) || !address || isPosting) return;
    
    setIsPosting(true);
    try {
      const pollData = showPoll && pollOptions.some(o => o.trim()) ? {
        options: pollOptions.filter(o => o.trim()),
        votes: pollOptions.filter(o => o.trim()).map(() => 0)
      } : null;

      await dispatch(createRealPost({
        address,
        content: content.trim() || (attachments.length > 0 ? '' : 'Said GM!'),
        mediaUrl: attachments[0]?.url, // Support single media for now
        pollData,
        isPro: isPro || false
      })).unwrap();

      setContent('');
      setAttachments([]);
      setShowPoll(false);
      setPollOptions(['', '']);
    } catch (err) {
      console.error('Post creation failed:', err);
    } finally {
      setIsPosting(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl transition-all hover:border-white/10 group">
      <div className="flex gap-5">
        <IdentityAvatar address={address || ''} size="md" />
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something..."
            className="w-full bg-transparent border-none text-white resize-none outline-none text-lg min-h-[60px] placeholder-gray-600 font-medium py-2"
          />

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4">
              {attachments.map((file, i) => (
                <div key={i} className="relative h-24 w-40 rounded-2xl overflow-hidden border border-white/10 group/file">
                   <img src={file.url} className={`h-full w-full object-cover ${file.type === 'video' ? 'grayscale' : ''}`} alt="attachment" />
                   <button 
                    onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/file:opacity-100 transition-opacity"
                   >
                     ×
                   </button>
                </div>
              ))}
            </div>
          )}

          {/* Poll Creator UI */}
          {showPoll && (
            <div className="mb-6 p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-3 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Poll Options</span>
                <button onClick={() => setShowPoll(false)} className="text-gray-700 hover:text-white transition-colors">×</button>
              </div>
              {pollOptions.map((option, i) => (
                <input
                  key={i}
                  value={option}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-700 focus:border-white/20 transition-all outline-none"
                />
              ))}
              {pollOptions.length < 5 && (
                <button onClick={handleAddOption} className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] opacity-60 hover:opacity-100 transition-opacity pt-2">
                  + Add Option
                </button>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-6 border-t border-white/[0.03] gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
               <label className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group/btn cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.02] flex items-center justify-center group-hover/btn:bg-white/5">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'image')} disabled={isUploading} />
               </label>
               <label className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group/btn cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.02] flex items-center justify-center group-hover/btn:bg-white/5">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Video</span>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} disabled={isUploading} />
               </label>
               <button onClick={() => setShowPoll(!showPoll)} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group/btn">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.02] flex items-center justify-center group-hover/btn:bg-white/5">
                    <BarChart2 className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Poll</span>
               </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
               <button 
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
               >
                  <Globe className="h-3 w-3" />
                  <span className="opacity-70">{privacy}</span>
                  <ChevronDown className="h-2.5 w-2.5 opacity-40" />
               </button>

               {showPrivacy && (
                 <div className="absolute bottom-full right-0 mb-2 w-40 rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                    {['Public', 'Followers', 'Private'].map(p => (
                      <button 
                        key={p}
                        onClick={() => { setPrivacy(p); setShowPrivacy(false); }}
                        className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                 </div>
               )}

               <button
                 onClick={handleSubmit}
                 disabled={(!content.trim() && attachments.length === 0) || isPosting || isUploading}
                 className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-20 disabled:grayscale hover:bg-gray-200 active:scale-95 whitespace-nowrap min-w-[100px] flex items-center justify-center"
               >
                 {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

