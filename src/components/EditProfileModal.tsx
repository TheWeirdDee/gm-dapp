'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, X, Loader2, Save, User as UserIcon } from 'lucide-react';
import { RootState, AppDispatch } from '@/lib/store';
import { uploadFile, getSupaClient } from '@/lib/supabase';
import { updateStats, fetchOnChainStats } from '@/lib/features/userSlice';
import IdentityAvatar from './IdentityAvatar';
import { callContract } from '@/lib/stacks';
import { APP_CONFIG } from '@/lib/config';
import { AnchorMode, PostConditionMode, stringUtf8CV } from '@stacks/transactions';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { address, bio: initialBio, username: initialUsername, website: initialWebsite } = useSelector((state: RootState) => state.user);
  const [bio, setBio] = useState(initialBio || '');
  const [newUsername, setNewUsername] = useState(initialUsername || '');
  const [website, setWebsite] = useState(initialWebsite || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !address) return;

    setIsUploading(true);
    try {
      const url = await uploadFile('avatars', file);
      if (url) {
        setAvatarPreview(url);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!address || isSaving) return;

    setIsSaving(true);
    try {
      // 1. Handle Username Change (On-Chain) if it changed
      if (newUsername && newUsername !== initialUsername && newUsername.length >= 3) {
        try {
          await callContract({
            anchorMode: AnchorMode.Any,
            contractAddress: APP_CONFIG.contractAddress,
            contractName: APP_CONFIG.contractName,
            functionName: 'set-username',
            functionArgs: [stringUtf8CV(newUsername.trim())],
            postConditionMode: PostConditionMode.Deny,
            postConditions: [],
            onFinish: (data: any) => {
              console.log('Username changed:', data.txId);
            }
          });
        } catch (stacksErr) {
          console.error('Stacks error:', stacksErr);
          // Don't stop the whole process if username fails (might be taken)
        }
      }

      // 2. Handle Bio & Avatar (Backend Proxy)
      const token = localStorage.getItem('gm_session_token');
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address,
          username: newUsername,
          bio,
          avatar_url: avatarPreview || undefined,
          website
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update profile');
      }

      // Update local state
      dispatch(updateStats({ 
        bio, 
        username: newUsername,
        avatar: avatarPreview || undefined,
        website 
      } as any));

      if (address) {
        dispatch(fetchOnChainStats(address) as any);
      }

      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#0A0A0A] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-all">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Edit Profile</h2>

        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="h-24 w-24 rounded-[2rem] overflow-hidden border-2 border-white/10 group-hover:border-[var(--color-accent)] transition-all">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <IdentityAvatar address={address || ''} size="lg" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"
              >
                {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <Camera className="h-6 w-6 text-white" />}
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Change Profile Photo</p>
          </div>

          {/* Username Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Display Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Your handle..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--color-accent)]/50 transition-all font-bold placeholder:text-gray-800"
              disabled={!!initialUsername && !initialUsername.startsWith('ST')}
            />
            {initialUsername && !initialUsername.startsWith('ST') && (
              <p className="text-[9px] text-gray-500 ml-1">Username is already locked on-chain.</p>
            )}
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Biography</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the protocol about yourself..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--color-accent)]/50 transition-all font-medium placeholder:text-gray-800 min-h-[120px] resize-none"
              maxLength={160}
            />
            <div className="text-right text-[10px] font-bold text-gray-700">
              {bio.length}/160
            </div>
          </div>

          {/* Website Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Personal Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourpage.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--color-accent)]/50 transition-all font-medium placeholder:text-gray-800"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-30"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
