import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Link as LinkIcon, RotateCcw, Check, Sparkles, User, Image as ImageIcon, Video, Trash2, Play, AlertCircle, Film, Plus, Edit, FolderOpen, Lock, Unlock, Download, UploadCloud, Camera, VideoOff, RefreshCw, Sliders, ZoomIn, RotateCw, Move, Mail, FlipHorizontal, FlipVertical, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Globe } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';

// Real and AI Portrait Assets
const rahulAvatarSuit = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
const rahulAvatarGlasses = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';
const aiAvatarBlack = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80';
const aiAvatarGrey = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

export default function Customizer() {
  const { 
    personalInfo, 
    updatePersonalInfo, 
    resetPersonalInfo, 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    resetProjects, 
    isEditorOpen, 
    setIsEditorOpen,
    importPortfolio,
    isSyncing,
    hasLoadedRemote,
    syncStateWithServer
  } = usePortfolio();
  
  const [activeTab, setActiveTab] = useState<'video' | 'info' | 'portfolio'>('info');
  const [tempUrl, setTempUrl] = useState(personalInfo.avatar.startsWith('data:') ? '' : personalInfo.avatar);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workshopRef = useRef<HTMLDivElement>(null);

  // Photo customization/cropping state
  const [imageToCustomize, setImageToCustomize] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [customFilter, setCustomFilter] = useState<'none' | 'grayscale' | 'sepia' | 'vintage' | 'warm' | 'cool'>('none');
  const [customBrightness, setCustomBrightness] = useState(100);
  const [customContrast, setCustomContrast] = useState(100);
  const [isFlippedH, setIsFlippedH] = useState(false);
  const [isFlippedV, setIsFlippedV] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffsetStart, setDragOffsetStart] = useState({ x: 0, y: 0 });

  // Auto-scroll to customizer workshop when an image is loaded or uploaded
  useEffect(() => {
    if (imageToCustomize && workshopRef.current) {
      setTimeout(() => {
        workshopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [imageToCustomize]);

  const resetEditingStates = (imgUrl: string | null = null) => {
    if (imgUrl !== null) {
      setImageToCustomize(imgUrl);
    }
    setZoom(100);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
    setCustomFilter('none');
    setCustomBrightness(100);
    setCustomContrast(100);
    setIsFlippedH(false);
    setIsFlippedV(false);
  };

  // GitHub Avatar Sync States
  const [githubUsername, setGithubUsername] = useState('');
  const [githubError, setGithubError] = useState('');

  // Gravatar Sync States
  const [gravatarEmail, setGravatarEmail] = useState('');
  const [gravatarError, setGravatarError] = useState('');

  const getSha256Hash = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Dynamic Initials Generator States
  const [customInitials, setCustomInitials] = useState('RG');
  const [initialsBgColor, setInitialsBgColor] = useState('#1c1917'); // stone-900 (Obsidian Black)
  const [initialsTextColor, setInitialsTextColor] = useState('#f5f5f4'); // stone-100 (Warm Silver)
  const [initialsBorderColor, setInitialsBorderColor] = useState('#c2410c'); // amber-700 (Rust Accent)

  const generateInitialsAvatar = (initials: string, bgColor: string, textColor: string, borderColor: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 400, 400);
      
      // Draw a sleek inner border line to look incredibly premium
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(200, 200, 175, 0, Math.PI * 2);
      ctx.stroke();

      // Write initials with luxury serif font
      ctx.fillStyle = textColor;
      ctx.font = 'bold 150px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials.toUpperCase(), 200, 200);

      try {
        const base64Data = canvas.toDataURL('image/jpeg', 0.90);
        updatePersonalInfo({ avatar: base64Data });
        setImageToCustomize(null);
        triggerSaveSuccess();
      } catch (err) {
        console.error("Initials generator failed", err);
      }
    }
  };

  // Camera/Webcam snapshot states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop camera tracks helper
  const stopCamera = (streamToStop?: MediaStream | null) => {
    const activeStream = streamToStop || cameraStream;
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setIsCameraActive(false);
  };

  // Automatically shut down webcam stream when switching tabs, closing customizer, or unmounting
  useEffect(() => {
    if (!isEditorOpen || activeTab !== 'photo') {
      stopCamera();
    }
  }, [isEditorOpen, activeTab]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Video States
  const [videoUrlInput, setVideoUrlInput] = useState(personalInfo.introVideo && !personalInfo.introVideo.startsWith('data:') ? personalInfo.introVideo : '');
  const [dragVideoActive, setDragVideoActive] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Portfolio Management States
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('Research Papers');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLongDescription, setProjectLongDescription] = useState('');
  const [projectTags, setProjectTags] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [projectDemoUrl, setProjectDemoUrl] = useState('');
  const [projectGithubUrl, setProjectGithubUrl] = useState('');
  const [projectHighlights, setProjectHighlights] = useState('');

  // Stats
  const [stat1Label, setStat1Label] = useState('');
  const [stat1Value, setStat1Value] = useState('');
  const [stat2Label, setStat2Label] = useState('');
  const [stat2Value, setStat2Value] = useState('');
  const [stat3Label, setStat3Label] = useState('');
  const [stat3Value, setStat3Value] = useState('');

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
    setVideoUrlInput(personalInfo.introVideo && !personalInfo.introVideo.startsWith('data:') ? personalInfo.introVideo : '');
  }, [personalInfo]);

  // Handle local file uploads with smart compression to prevent localStorage QuotaExceeded errors
  const processFile = (file: File) => {
    if (personalInfo.isAvatarLocked) return;
    if (file) {
      // Create high-performance, low-memory Object URL instead of Reading as base64 string first
      const blobUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const maxDimension = 1600; // Perfect retina-crisp limit for profile photo
        let w = img.width;
        let h = img.height;
        
        if (w > maxDimension || h > maxDimension) {
          if (w > h) {
            h = Math.round((h * maxDimension) / w);
            w = maxDimension;
          } else {
            w = Math.round((w * maxDimension) / h);
            h = maxDimension;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          try {
            // Highly pristine 0.95 quality for crisp original detail with zero compression artifacts
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.95);
            updatePersonalInfo({ avatar: compressedBase64 });
            resetEditingStates(compressedBase64);
            setTempUrl('');
            triggerSaveSuccess();
          } catch (err) {
            console.error("Compression failed, using generic PNG as fallback", err);
            try {
              const fallbackBase64 = canvas.toDataURL('image/png');
              updatePersonalInfo({ avatar: fallbackBase64 });
              resetEditingStates(fallbackBase64);
              setTempUrl('');
              triggerSaveSuccess();
            } catch (fallbackErr) {
              console.error("Fallback image rendering failed", fallbackErr);
            }
          }
        }
        URL.revokeObjectURL(blobUrl);
      };
      
      img.onerror = () => {
        console.error("Failed to load image via ObjectURL");
        URL.revokeObjectURL(blobUrl);
        // Robust fallback to FileReader if ObjectURL fails or isn't supported
        const reader = new FileReader();
        reader.onloadend = () => {
          const rawBase64 = reader.result as string;
          updatePersonalInfo({ avatar: rawBase64 });
          resetEditingStates(rawBase64);
          setTempUrl('');
          triggerSaveSuccess();
        };
        reader.readAsDataURL(file);
      };
      
      img.src = blobUrl;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Clear input value so selecting the same file triggers onChange again
    e.target.value = '';
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } },
        audio: false
      });
      setCameraStream(stream);
      // Wait a tick for video element to mount, then set source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Could not access your camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions matching the video stream
    const size = Math.min(video.videoWidth, video.videoHeight) || 400;
    canvas.width = size;
    canvas.height = size;

    // Center crop the video to be a square
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    context.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    try {
      const base64Data = canvas.toDataURL('image/jpeg', 0.85);
      updatePersonalInfo({ avatar: base64Data });
      resetEditingStates(base64Data);
      triggerSaveSuccess();
      stopCamera();
    } catch (err) {
      console.error("Failed to capture image:", err);
      alert("Failed to capture image from camera.");
    }
  };

  const handleExportConfig = () => {
    try {
      const configData = {
        personalInfo,
        projects,
        _version: 1,
        _exportDate: new Date().toISOString()
      };
      const jsonString = JSON.stringify(configData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${personalInfo.name.toLowerCase().replace(/\s+/g, '_')}_portfolio_backup.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export configuration:', e);
      alert('Failed to export portfolio backup.');
    }
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsed = JSON.parse(result);
        
        if (!parsed || (typeof parsed !== 'object')) {
          throw new Error('Invalid portfolio backup file structure.');
        }

        const importedPersonalInfo = parsed.personalInfo;
        const importedProjects = parsed.projects;

        if (!importedPersonalInfo && !importedProjects) {
          throw new Error('No valid portfolio data found in backup file.');
        }

        if (importedPersonalInfo) {
          if (importedPersonalInfo.isAvatarLocked === undefined) {
            importedPersonalInfo.isAvatarLocked = false;
          }
          importPortfolio(importedPersonalInfo, importedProjects || projects);
        } else if (importedProjects) {
          importPortfolio(personalInfo, importedProjects);
        }

        triggerSaveSuccess();
        alert('Portfolio configuration imported successfully!');
        e.target.value = '';
      } catch (err) {
        console.error('Failed to import configuration:', err);
        alert(err instanceof Error ? err.message : 'Invalid backup file format. Please load a valid portfolio backup .json file.');
      }
    };
    reader.readAsText(file);
  };

  // Handle local video file upload
  const processVideoFile = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      // Alert/warn if file is particularly large, but still allow processing
      if (file.size > 20 * 1024 * 1024) {
        alert('This video is quite large (>20MB). For better browser performance and loading speed, we recommend using a video under 10MB, or pasting an embed link from YouTube, Vimeo, or Loom.');
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updatePersonalInfo({ 
          introVideo: base64String,
          introVideoType: 'file'
        });
        setVideoUrlInput('');
        triggerSaveSuccess();
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid video file (MP4, WEBM, MOV, etc.).');
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  // Video Drag and drop handlers
  const handleVideoDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragVideoActive(true);
    } else if (e.type === 'dragleave') {
      setDragVideoActive(false);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragVideoActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  // Video URL Helpers & Parsing
  const parseVideoUrl = (url: string): { url: string; type: 'youtube' | 'vimeo' | 'loom' | 'url' } => {
    const cleanUrl = url.trim();
    
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return {
        url: `https://www.youtube.com/embed/${ytMatch[1]}`,
        type: 'youtube'
      };
    }

    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i);
    if (vimeoMatch && vimeoMatch[3]) {
      return {
        url: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
        type: 'vimeo'
      };
    }

    const loomMatch = cleanUrl.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/i);
    if (loomMatch && loomMatch[1]) {
      return {
        url: `https://www.loom.com/embed/${loomMatch[1]}`,
        type: 'loom'
      };
    }

    return {
      url: cleanUrl,
      type: 'url'
    };
  };

  const handleVideoUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrlInput.trim()) {
      const parsed = parseVideoUrl(videoUrlInput);
      updatePersonalInfo({ 
        introVideo: parsed.url,
        introVideoType: parsed.type 
      });
      triggerSaveSuccess();
    }
  };

  const handleRemoveVideo = () => {
    updatePersonalInfo({
      introVideo: undefined,
      introVideoType: undefined
    });
    setVideoUrlInput('');
    triggerSaveSuccess();
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
    
    if (personalInfo.isAvatarLocked) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (personalInfo.isAvatarLocked) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          break;
        }
      }
    }
  };

  // Handle URL change
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personalInfo.isAvatarLocked) return;
    let url = tempUrl.trim();
    if (url) {
      // Automatic link converters to make copy-pasting from cloud storage seamless
      // 1. Google Drive view link conversion
      if (url.includes('drive.google.com')) {
        const gdMatch = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (gdMatch && gdMatch[1]) {
          url = `https://drive.google.com/uc?export=download&id=${gdMatch[1]}`;
        }
      }

      // 2. Dropbox share link conversion
      if (url.includes('dropbox.com')) {
        url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '').replace('&dl=0', '');
      }

      // 3. Imgur share page conversion
      if (url.includes('imgur.com') && !url.match(/\.(jpeg|jpg|gif|png|webp)/i)) {
        const imgurMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
        if (imgurMatch && imgurMatch[1]) {
          url = `https://i.imgur.com/${imgurMatch[1]}.jpg`;
        }
      }

      updatePersonalInfo({ avatar: url });
      resetEditingStates(url);
      triggerSaveSuccess();
    }
  };

  const handleGithubSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (personalInfo.isAvatarLocked) return;
    setGithubError('');
    const username = githubUsername.trim();
    if (!username) {
      setGithubError('Please enter a username');
      return;
    }
    
    // GitHub provides a high-res direct square avatar access via github.com/username.png
    // It is fast, requires 0 API keys or auth, and has reliable CORS configuration
    const avatarUrl = `https://github.com/${username}.png`;
    
    const img = new Image();
    img.onload = () => {
      updatePersonalInfo({ avatar: avatarUrl });
      resetEditingStates(avatarUrl);
      triggerSaveSuccess();
      setGithubUsername('');
    };
    img.onerror = () => {
      setGithubError('User not found or GitHub avatar unavailable');
    };
    img.src = avatarUrl;
  };

  const handleGravatarSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (personalInfo.isAvatarLocked) return;
    setGravatarError('');
    const email = gravatarEmail.trim().toLowerCase();
    if (!email) {
      setGravatarError('Please enter an email address');
      return;
    }
    
    try {
      const hash = await getSha256Hash(email);
      const avatarUrl = `https://www.gravatar.com/avatar/${hash}?s=400&d=404`;
      
      const img = new Image();
      img.onload = () => {
        updatePersonalInfo({ avatar: avatarUrl });
        resetEditingStates(avatarUrl);
        triggerSaveSuccess();
        setGravatarEmail('');
      };
      img.onerror = () => {
        setGravatarError('No public Gravatar image registered for this email address. Note: Gravatars can take a few minutes to update.');
      };
      img.src = avatarUrl;
    } catch (err) {
      setGravatarError('Failed to generate Gravatar request.');
    }
  };

  const getFilterStyle = (filterType: typeof customFilter, brightness: number, contrast: number) => {
    let filterStr = '';
    switch (filterType) {
      case 'grayscale':
        filterStr += 'grayscale(100%) ';
        break;
      case 'sepia':
        filterStr += 'sepia(80%) ';
        break;
      case 'vintage':
        filterStr += 'sepia(40%) contrast(120%) saturate(120%) ';
        break;
      case 'warm':
        filterStr += 'saturate(130%) sepia(10%) ';
        break;
      case 'cool':
        filterStr += 'saturate(80%) hue-rotate(15deg) ';
        break;
      case 'none':
      default:
        break;
    }
    filterStr += `brightness(${brightness}%) contrast(${contrast}%)`;
    return filterStr;
  };

  const handleSaveCustomized = () => {
    if (!imageToCustomize) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const SIZE = 600; // High resolution square
      canvas.width = SIZE;
      canvas.height = SIZE;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clean background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, SIZE, SIZE);
      
      // Apply filters if browser supports it on canvas
      try {
        const filterStr = getFilterStyle(customFilter, customBrightness, customContrast);
        ctx.filter = filterStr;
      } catch (e) {
        console.warn("Canvas filter not supported by browser", e);
      }
      
      // Translate to center for rotation & scaling
      ctx.translate(SIZE / 2, SIZE / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      
      const scaleX = (zoom / 100) * (isFlippedH ? -1 : 1);
      const scaleY = (zoom / 100) * (isFlippedV ? -1 : 1);
      ctx.scale(scaleX, scaleY);
      
      // Calculate dx, dy based on preview container width of 192px (w-48)
      const ratio = SIZE / 192;
      const dx = (offsetX * ratio) / (zoom / 100);
      const dy = (offsetY * ratio) / (zoom / 100);
      
      const imgAspect = img.width / img.height;
      let dw, dh;
      if (imgAspect >= 1) {
        dh = SIZE;
        dw = SIZE * imgAspect;
      } else {
        dw = SIZE;
        dh = SIZE / imgAspect;
      }
      
      ctx.drawImage(img, dx - dw / 2, dy - dh / 2, dw, dh);
      
      try {
        const base64Data = canvas.toDataURL('image/jpeg', 0.9);
        updatePersonalInfo({ avatar: base64Data });
        triggerSaveSuccess();
        setImageToCustomize(null);
      } catch (err) {
        console.error("Failed to render customized image:", err);
        alert("Failed to save image. This can happen if you pasted an external URL which prevents cross-device customization (CORS). Please upload a file from your device instead!");
      }
    };
    img.onerror = () => {
      alert("Failed to load image for customization.");
    };
    img.src = imageToCustomize;
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
      resetProjects();
      triggerSaveSuccess();
    }
  };

  const startEditingProject = (proj: Project) => {
    setEditingProjectId(proj.id);
    setIsAddingNewProject(false);
    setProjectTitle(proj.title);
    setProjectCategory(proj.category);
    setProjectDescription(proj.description);
    setProjectLongDescription(proj.longDescription);
    setProjectTags(proj.tags.join(', '));
    setProjectImage(proj.image);
    setProjectDemoUrl(proj.demoUrl || '');
    setProjectGithubUrl(proj.githubUrl || '');
    setProjectHighlights(proj.highlights.join('\n'));
    
    // Stats
    setStat1Label(proj.stats?.[0]?.label || '');
    setStat1Value(proj.stats?.[0]?.value || '');
    setStat2Label(proj.stats?.[1]?.label || '');
    setStat2Value(proj.stats?.[1]?.value || '');
    setStat3Label(proj.stats?.[2]?.label || '');
    setStat3Value(proj.stats?.[2]?.value || '');
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setIsAddingNewProject(false);
    setProjectTitle('');
    setProjectCategory('Research Papers');
    setProjectDescription('');
    setProjectLongDescription('');
    setProjectTags('');
    setProjectImage('');
    setProjectDemoUrl('');
    setProjectGithubUrl('');
    setProjectHighlights('');
    setStat1Label('');
    setStat1Value('');
    setStat2Label('');
    setStat2Value('');
    setStat3Label('');
    setStat3Value('');
  };

  const handleProjectFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = projectTags.split(',').map(t => t.trim()).filter(Boolean);
    const highlightsArray = projectHighlights.split('\n').map(h => h.trim()).filter(Boolean);
    
    const statsArray = [];
    if (stat1Label && stat1Value) statsArray.push({ label: stat1Label, value: stat1Value });
    if (stat2Label && stat2Value) statsArray.push({ label: stat2Label, value: stat2Value });
    if (stat3Label && stat3Value) statsArray.push({ label: stat3Label, value: stat3Value });

    const projectData = {
      title: projectTitle,
      category: projectCategory || 'Articles',
      description: projectDescription,
      longDescription: projectLongDescription,
      tags: tagsArray,
      image: projectImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      demoUrl: projectDemoUrl || undefined,
      githubUrl: projectGithubUrl || undefined,
      highlights: highlightsArray.length > 0 ? highlightsArray : ['Published online.'],
      stats: statsArray.length > 0 ? statsArray : undefined,
    };

    if (editingProjectId) {
      updateProject(editingProjectId, projectData);
    } else {
      addProject(projectData);
    }
    
    resetProjectForm();
    triggerSaveSuccess();
  };

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const maxDimension = 1600; // Optimal widescreen card preview size with retina clarity
        let w = img.width;
        let h = img.height;
        
        if (w > maxDimension || h > maxDimension) {
          if (w > h) {
            h = Math.round((h * maxDimension) / w);
            w = maxDimension;
          } else {
            w = Math.round((w * maxDimension) / h);
            h = maxDimension;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          try {
            // Highly pristine 0.95 quality for crisp original detail with zero compression artifacts
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.95);
            setProjectImage(compressedBase64);
          } catch (err) {
            console.error("Project image compression failed, fallback to generic PNG", err);
            try {
              const fallbackBase64 = canvas.toDataURL('image/png');
              setProjectImage(fallbackBase64);
            } catch (fallbackErr) {
              console.error("Fallback project image rendering failed", fallbackErr);
            }
          }
        }
        URL.revokeObjectURL(blobUrl);
      };
      
      img.onerror = () => {
        console.error("Failed to load project image via ObjectURL");
        URL.revokeObjectURL(blobUrl);
        // Fallback to FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
          setProjectImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      };
      
      img.src = blobUrl;
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
                  <span>Writings Customizer</span>
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : hasLoadedRemote ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                    {isSyncing ? 'Syncing to Server...' : hasLoadedRemote ? 'Synced Across Devices' : 'Connecting...'}
                  </span>
                </div>
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
            <div className="flex overflow-x-auto scrollbar-none flex-nowrap border-b border-neutral-200 bg-white min-w-0">
              <button
                id="tab-video-btn"
                onClick={() => setActiveTab('video')}
                className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 px-4 ${
                  activeTab === 'video'
                    ? 'border-black text-black bg-neutral-50/50'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Intro Video</span>
              </button>
              <button
                id="tab-info-btn"
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 px-4 ${
                  activeTab === 'info'
                    ? 'border-black text-black bg-neutral-50/50'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal Info</span>
              </button>
              <button
                id="tab-portfolio-btn"
                onClick={() => setActiveTab('portfolio')}
                className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 px-4 ${
                  activeTab === 'portfolio'
                    ? 'border-black text-black bg-neutral-50/50'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Writings</span>
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              

              {/* Intro Video Upload/Embed Tab */}
              {activeTab === 'video' && (
                <div className="space-y-6">
                  {/* Active Video Status/Preview */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Active Intro Video
                    </label>
                    {personalInfo.introVideo ? (
                      <div className="p-4 bg-white border border-neutral-200 space-y-3">
                        <div className="relative aspect-video bg-neutral-900 border border-neutral-200 overflow-hidden flex items-center justify-center">
                          {personalInfo.introVideoType === 'file' || personalInfo.introVideoType === 'url' ? (
                            <video 
                              src={personalInfo.introVideo} 
                              controls 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <iframe
                              src={personalInfo.introVideo}
                              title="Intro Video Preview"
                              className="w-full h-full border-none"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="overflow-hidden mr-2">
                            <span className="block text-[10px] font-sans font-bold text-neutral-900 uppercase tracking-tight">Status: Active Video</span>
                            <span className="block text-[8px] font-mono text-neutral-400 uppercase tracking-wider truncate">
                              Source: {personalInfo.introVideoType === 'file' ? 'Local Upload' : 'External Embed'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 hover:border-red-600 hover:bg-red-50 text-red-500 hover:text-red-700 font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-white border border-neutral-200 text-center space-y-2">
                        <Film className="w-8 h-8 text-neutral-300 mx-auto" />
                        <div className="space-y-1">
                          <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">No Intro Video Configured</span>
                          <p className="text-[9px] font-sans text-neutral-500 max-w-xs mx-auto">
                            Adding a video introduces yourself to visitors in a personalized, interactive format. When added, an option to play your video will appear on your hero portrait card.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 1: Video File Drag & Drop Upload */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Option A: Upload Video File
                    </label>
                    <div
                      onDragEnter={handleVideoDrag}
                      onDragOver={handleVideoDrag}
                      onDragLeave={handleVideoDrag}
                      onDrop={handleVideoDrop}
                      onClick={() => videoFileInputRef.current?.click()}
                      className={`border border-dashed p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-white ${
                        dragVideoActive 
                          ? 'border-black bg-neutral-50 scale-[0.99]' 
                          : 'border-neutral-300 hover:border-neutral-600 hover:bg-neutral-50/50'
                      }`}
                    >
                      <Upload className="w-6 h-6 text-neutral-400" />
                      <div className="space-y-1">
                        <p className="font-sans text-xs font-semibold text-neutral-800">
                          Drag and drop your video file here, or <span className="underline text-black font-bold">browse</span>
                        </p>
                        <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                          Supports MP4, WEBM, MOV (Max recommended: 15MB)
                        </p>
                      </div>

                      {/* Robust touch-target button for mobile device support */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          videoFileInputRef.current?.click();
                        }}
                        className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 hover:border-neutral-800 text-neutral-800 font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm rounded-none min-h-[36px]"
                      >
                        <Upload className="w-3 h-3 text-neutral-600" />
                        <span>Select Video</span>
                      </button>

                      <input
                        type="file"
                        ref={videoFileInputRef}
                        onChange={handleVideoFileChange}
                        accept="video/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Option 2: Paste Embed or Share Link */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Option B: Paste Video URL
                    </label>
                    <form onSubmit={handleVideoUrlSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                          <LinkIcon className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="url"
                          placeholder="Paste YouTube, Vimeo, Loom, or direct .mp4 link"
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
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
                    
                    {/* Supported Badge Indicators */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[8px] font-mono uppercase bg-neutral-100 px-1.5 py-0.5 text-neutral-600 tracking-wider">YouTube</span>
                      <span className="text-[8px] font-mono uppercase bg-neutral-100 px-1.5 py-0.5 text-neutral-600 tracking-wider">Vimeo</span>
                      <span className="text-[8px] font-mono uppercase bg-neutral-100 px-1.5 py-0.5 text-neutral-600 tracking-wider">Loom</span>
                      <span className="text-[8px] font-mono uppercase bg-neutral-100 px-1.5 py-0.5 text-neutral-600 tracking-wider">Raw MP4/WEBM</span>
                    </div>
                    
                    <p className="text-[9px] font-sans text-neutral-400 leading-normal">
                      We'll automatically parse your link into an elegant video player. This is highly recommended for zero-latency loading.
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
                    <div className="mt-2 p-2.5 bg-amber-50/50 border border-amber-200/60 text-[10px] leading-relaxed text-amber-900 font-sans space-y-1.5">
                      <p className="font-semibold uppercase tracking-wider text-[8px] font-mono text-amber-800 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>Google Search Index Caching Guide:</span>
                      </p>
                      <p>
                        We have successfully optimized your site's HTML header, Open Graph meta tags, and structured JSON-LD schema with the title <strong>"{formData.name} | {formData.title}"</strong>.
                      </p>
                      <p>
                        If Google Search results still display <strong>"{formData.name} | Full Stack Engineer"</strong>, this is because Google has not yet re-crawled your site since you customized it. To speed this up, log into your <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-950">Google Search Console</a> and click <strong>"Request Indexing"</strong> for your domain <code>rahul-goyal.com</code> to clear their cached title!
                      </p>
                    </div>
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

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <div className="space-y-4">
                  {isAddingNewProject || editingProjectId ? (
                    <form onSubmit={handleProjectFormSubmit} className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                          {editingProjectId ? 'Edit Project' : 'Add New Project'}
                        </span>
                        <button
                          type="button"
                          onClick={resetProjectForm}
                          className="text-[10px] font-mono text-neutral-500 hover:text-black underline cursor-pointer"
                        >
                          Back to List
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          placeholder="e.g., Decentralized AI Governance"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                          Category *
                        </label>
                        <select
                          value={projectCategory}
                          onChange={(e) => setProjectCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          required
                        >
                          <option value="Research Papers">Research Papers</option>
                          <option value="Articles">Articles</option>
                          <option value="IP Press Blogs">IP Press Blogs</option>
                          <option value="Other">Other / Custom</option>
                        </select>
                        {projectCategory === 'Other' && (
                          <input
                            type="text"
                            placeholder="Enter Custom Category Name"
                            onChange={(e) => setProjectCategory(e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                            required
                          />
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                          Cover Image
                        </label>
                        {projectImage && (
                          <div className="w-full h-24 mb-2 bg-neutral-100 border border-neutral-200 overflow-hidden">
                            <img src={projectImage} alt="Cover Preview" className="w-full h-full object-cover animate-fade-in" />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={projectImage.startsWith('data:') ? 'Local Uploaded File' : projectImage}
                            onChange={(e) => setProjectImage(e.target.value)}
                            className="flex-1 px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                            placeholder="Paste cover image URL"
                          />
                          <label className="px-3 py-2 border border-black hover:bg-neutral-50 text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center">
                            <Upload className="w-3 h-3 mr-1" />
                            <span>File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProjectImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                          Short Description *
                        </label>
                        <textarea
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          rows={2}
                          placeholder="One-liner summary of the project."
                          className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors resize-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                          Abstract / Long Description
                        </label>
                        <textarea
                          value={projectLongDescription}
                          onChange={(e) => setProjectLongDescription(e.target.value)}
                          rows={4}
                          placeholder="Comprehensive description of findings, writing context, and details."
                          className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                          Domain Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={projectTags}
                          onChange={(e) => setProjectTags(e.target.value)}
                          placeholder="e.g., Law, IP, Artificial Intelligence"
                          className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                          Highlights (one per line)
                        </label>
                        <textarea
                          value={projectHighlights}
                          onChange={(e) => setProjectHighlights(e.target.value)}
                          rows={3}
                          placeholder="Highlight 1&#10;Highlight 2&#10;Highlight 3"
                          className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            Writing / External Link
                          </label>
                          <input
                            type="url"
                            value={projectDemoUrl}
                            onChange={(e) => setProjectDemoUrl(e.target.value)}
                            placeholder="https://journal.org/paper.pdf"
                            className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            Code / GitHub Link
                          </label>
                          <input
                            type="url"
                            value={projectGithubUrl}
                            onChange={(e) => setProjectGithubUrl(e.target.value)}
                            placeholder="https://github.com/user/repo"
                            className="w-full px-3 py-2 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                          Writing / Project Metrics
                        </label>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Metric 1 Label (e.g. Journal)"
                            value={stat1Label}
                            onChange={(e) => setStat1Label(e.target.value)}
                            className="px-2 py-1 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="Metric 1 Value (e.g. JIPLP)"
                            value={stat1Value}
                            onChange={(e) => setStat1Value(e.target.value)}
                            className="px-2 py-1 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Metric 2 Label (e.g. Citations)"
                            value={stat2Label}
                            onChange={(e) => setStat2Label(e.target.value)}
                            className="px-2 py-1 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="Metric 2 Value (e.g. 42)"
                            value={stat2Value}
                            onChange={(e) => setStat2Value(e.target.value)}
                            className="px-2 py-1 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Metric 3 Label (e.g. Read Time)"
                            value={stat3Label}
                            onChange={(e) => setStat3Label(e.target.value)}
                            className="px-2 py-1 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="Metric 3 Value (e.g. 8 min)"
                            value={stat3Value}
                            onChange={(e) => setStat3Value(e.target.value)}
                            className="px-2 py-1 bg-white border border-neutral-200 font-sans text-xs focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Project</span>
                        </button>
                        <button
                          type="button"
                          onClick={resetProjectForm}
                          className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                            Writings
                          </span>
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                            {projects.length} Total items
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewProject(true)}
                          className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add New</span>
                        </button>
                      </div>

                      {projects.length === 0 ? (
                        <div className="py-8 text-center bg-white border border-dashed border-neutral-200">
                          <p className="text-xs text-neutral-400 font-light font-sans">No projects added yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                          {projects.map((proj) => (
                            <div key={proj.id} className="p-3 bg-white border border-neutral-200 flex gap-3 items-center justify-between">
                              <div className="flex gap-2 items-center min-w-0">
                                <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 flex-shrink-0 overflow-hidden">
                                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-semibold text-neutral-900 truncate pr-2 font-sans">{proj.title}</h4>
                                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">{proj.category}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditingProject(proj)}
                                  className="p-1.5 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-all border border-transparent hover:border-neutral-200 cursor-pointer"
                                  title="Edit Project"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${proj.title}"?`)) {
                                      deleteProject(proj.id);
                                      triggerSaveSuccess();
                                    }
                                  }}
                                  className="p-1.5 hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-all border border-transparent hover:border-red-100 cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
