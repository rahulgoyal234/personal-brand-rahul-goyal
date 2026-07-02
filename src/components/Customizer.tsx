import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Link as LinkIcon, RotateCcw, Check, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Customizer() {
  const { personalInfo, updatePersonalInfo, resetPersonalInfo, isEditorOpen, setIsEditorOpen } = usePortfolio();
  
  const [activeTab, setActiveTab] = useState<'photo' | 'info'>('photo');
  const [tempUrl, setTempUrl] = useState(personalInfo.avatar.startsWith('data:') ? '' : personalInfo.avatar);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for profile editing
  const [formData, setFormData] = useState({
    name: personalInfo.name,
    title: personalInfo.title,
    email: personalInfo.email,
    location: personalInfo.location,
    github: personalInfo.github,
    linkedin: personalInfo.linkedin,
    shortBio: personalInfo.shortBio,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if context changes (e.g., on reset)
  useEffect(() => {
    setFormData({
      name: personalInfo.name,
      title: personalInfo.title,
      email: personalInfo.email,
      location: personalInfo.location,
      github: personalInfo.github,
      linkedin: personalInfo.linkedin,
      shortBio: personalInfo.shortBio,
    });
    setTempUrl(personalInfo.avatar.startsWith('data:') ? '' : personalInfo.avatar);
  }, [personalInfo]);

  // Handle local file uploads
  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updatePersonalInfo({ avatar: base64String });
        setTempUrl('');
        triggerSaveSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle URL change
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      updatePersonalInfo({ avatar: tempUrl.trim() });
      triggerSaveSuccess();
    }
  };

  // Form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo(formData);
    triggerSaveSuccess();
  };

  const triggerSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your profile details to the original defaults?')) {
      resetPersonalInfo();
      triggerSaveSuccess();
    }
  };

  return (
    <AnimatePresence>
      {isEditorOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            id="customizer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditorOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 print:hidden"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            id="customizer-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#fafafa] border-l border-neutral-200 z-50 shadow-2xl flex flex-col print:hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-neutral-800" />
                  <span>Portfolio Customizer</span>
                </h3>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">
                  Configure your professional avatar & profile
                </p>
              </div>
              <button
                id="close-customizer-btn"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 border border-transparent hover:border-neutral-200 hover:bg-neutral-50 transition-all text-neutral-500 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-neutral-200 bg-white">
              <button
                id="tab-photo-btn"
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'photo'
                    ? 'border-black text-black bg-neutral-50/50'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>
              <button
                id="tab-info-btn"
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'info'
                    ? 'border-black text-black bg-neutral-50/50'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal Info</span>
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Photo Upload Tab */}
              {activeTab === 'photo' && (
                <div className="space-y-6">
                  {/* Visual Portrait Preview Box */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Active Avatar Preview
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-white border border-neutral-200">
                      <div className="relative w-20 h-20 bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0">
                        <img
                          src={personalInfo.avatar}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <div className="font-sans text-xs font-bold text-neutral-900 truncate">
                          {personalInfo.name}
                        </div>
                        <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider truncate">
                          {personalInfo.title}
                        </div>
                        <div className="text-[9px] font-mono px-2 py-0.5 inline-block border bg-neutral-50 text-neutral-600 tracking-wide font-medium">
                          {personalInfo.avatar.startsWith('data:') ? 'Custom Upload (Base64)' : personalInfo.avatar.startsWith('http') ? 'Custom URL' : 'Default Asset'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Option 1: Drag and Drop Upload */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Option A: Upload Image File
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-white ${
                        dragActive 
                          ? 'border-black bg-neutral-50 scale-[0.99]' 
                          : 'border-neutral-300 hover:border-neutral-600 hover:bg-neutral-50/50'
                      }`}
                    >
                      <Upload className="w-6 h-6 text-neutral-400" />
                      <div className="space-y-1">
                        <p className="font-sans text-xs font-semibold text-neutral-800">
                          Drag and drop your photo here, or <span className="underline text-black">browse</span>
                        </p>
                        <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                          Supports JPG, JPEG, PNG (Square works best)
                        </p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Option 2: Image URL Input */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Option B: Paste Image URL
                    </label>
                    <form onSubmit={handleUrlSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                          <LinkIcon className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="url"
                          placeholder="https://example.com/your-photo.jpg"
                          value={tempUrl}
                          onChange={(e) => setTempUrl(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 font-sans text-xs placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-none transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                    <p className="text-[9px] font-mono text-neutral-400 leading-normal uppercase tracking-wider">
                      Paste a public image URL from Google Drive, LinkedIn, Imgur, etc.
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Info Tab */}
              {activeTab === 'info' && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Short Tagline / Subtitle
                    </label>
                    <textarea
                      name="shortBio"
                      value={formData.shortBio}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Sticky Actions Footer */}
            <div className="p-6 border-t border-neutral-200 bg-white flex gap-3">
              <button
                id="reset-customizer-btn"
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 border border-neutral-200 hover:border-neutral-900 text-neutral-600 hover:text-neutral-900 font-mono text-[9px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
              
              <button
                id="close-customizer-footer-btn"
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer text-center"
              >
                Close Settings
              </button>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-20 left-6 right-6 p-3 bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase shadow-xl"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Profile updated successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
