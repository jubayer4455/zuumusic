import React, { useState } from 'react';
import { X, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const CreatePlaylistModal = () => {
  const { isCreatePlaylistOpen, setIsCreatePlaylistOpen, createPlaylist } = useMusic();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreatePlaylistOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      createPlaylist(title, description);
      setTitle('');
      setDescription('');
      setIsCreatePlaylistOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="ios-glass-mini text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Details</h2>
          <button 
            onClick={() => setIsCreatePlaylistOpen(false)}
            className="p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-36 h-36 rounded-lg bg-neutral-800 border border-neutral-700 flex flex-col items-center justify-center text-neutral-400 shrink-0">
              <Music className="w-12 h-12 mb-1" />
              <span className="text-xs">Choose photo</span>
            </div>

            <div className="w-full space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-neutral-400 block mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="My Playlist"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#3e3e3e] text-white text-sm rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#1ed760] border border-neutral-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-400 block mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Give your playlist a catchy description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#3e3e3e] text-white text-xs rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#1ed760] border border-neutral-600 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-white text-black font-bold text-sm px-7 py-2.5 rounded-full hover:scale-105 active:scale-95 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
