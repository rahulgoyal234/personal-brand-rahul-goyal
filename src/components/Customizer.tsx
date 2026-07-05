import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Link as LinkIcon, RotateCcw, Check, Sparkles, User, Image as ImageIcon, Video, Trash2, Play, AlertCircle, Film, Plus, Edit, FolderOpen, Lock, Unlock, Download, UploadCloud, Camera, VideoOff, RefreshCw, Sliders, ZoomIn, RotateCw, Move, Mail, FlipHorizontal, FlipVertical, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Globe } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';

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
    importPortfolio
  } = usePortfolio();
  
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'info' | 'portfolio'>('photo');
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawBase64 = reader.result as string;
        
        // Dynamic client-side compression
        const img = new Image();
        img.onload = () => {
          const maxDimension = 500; // Optimal resolution for an avatar
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
              // Convert to jpeg with 0.82 quality to get highly compact file size (<40KB)
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
              updatePersonalInfo({ avatar: compressedBase64 });
              resetEditingStates(compressedBase64);
              setTempUrl('');
              triggerSaveSuccess();
            } catch (err) {
              console.error("Compression failed, using raw base64 as fallback", err);
              updatePersonalInfo({ avatar: rawBase64 });
              resetEditingStates(rawBase64);
              setTempUrl('');
              triggerSaveSuccess();
            }
          } else {
            updatePersonalInfo({ avatar: rawBase64 });
            resetEditingStates(rawBase64);
            setTempUrl('');
            triggerSaveSuccess();
          }
        };
        img.onerror = () => {
          // Fallback if load fails
          updatePersonalInfo({ avatar: rawBase64 });
          resetEditingStates(rawBase64);
          setTempUrl('');
          triggerSaveSuccess();
        };
        img.src = rawBase64;
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
            <div className="flex overflow-x-auto scrollbar-none flex-nowrap border-b border-neutral-200 bg-white min-w-0">
              <button
                id="tab-photo-btn"
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 px-4 ${
                  activeTab === 'photo'
                    ? 'border-black text-black bg-neutral-50/50'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo</span>
              </button>
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
              
              {/* Photo Upload Tab */}
              {activeTab === 'photo' && (
                <div className="space-y-6">
                  {/* Visual Portrait Preview Box */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Active Avatar Preview
                    </label>
                    <div className="p-4 bg-white border border-neutral-200 space-y-4">
                      <div className="flex items-center gap-4">
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
                        <div className="space-y-1 overflow-hidden flex-1">
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

                      {!personalInfo.isAvatarLocked && (
                        <div className="pt-2.5 border-t border-neutral-100 flex flex-col sm:flex-row gap-2 justify-between items-center">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full sm:w-auto px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[30px]"
                          >
                            <Upload className="w-3.5 h-3.5 text-neutral-300" />
                            <span>Upload New Photo</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setImageToCustomize(personalInfo.avatar);
                              setZoom(100);
                              setRotation(0);
                              setOffsetX(0);
                              setOffsetY(0);
                              setCustomFilter('none');
                              setCustomBrightness(100);
                              setCustomContrast(100);
                            }}
                            className="w-full sm:w-auto px-3.5 py-1.5 border border-neutral-300 hover:border-black text-neutral-800 hover:text-black font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-white min-h-[30px]"
                          >
                            <Sliders className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Crop & Fine-Tune</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* INTERACTIVE PHOTO CUSTOMIZER PANEL */}
                  {imageToCustomize && !personalInfo.isAvatarLocked && (
                    <div ref={workshopRef} className="p-4 bg-brand-50/40 border border-brand-200/80 space-y-4 rounded-none">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sliders className="w-4 h-4 text-brand-900" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-900">
                            Photo Workshop / Editor
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setImageToCustomize(null)}
                          className="text-neutral-400 hover:text-neutral-600 font-mono text-[10px] uppercase"
                        >
                          Close
                        </button>
                      </div>

                      {/* Live WYSIWYG crop/filter preview circle */}
                      <div className="flex flex-col items-center space-y-3 bg-white p-4 border border-brand-100">
                        <div 
                          className={`relative w-48 h-48 bg-neutral-900 border border-neutral-300 overflow-hidden flex items-center justify-center select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                            setDragStart({ x: e.clientX, y: e.clientY });
                            setDragOffsetStart({ x: offsetX, y: offsetY });
                          }}
                          onMouseMove={(e) => {
                            if (!isDragging) return;
                            const dx = e.clientX - dragStart.x;
                            const dy = e.clientY - dragStart.y;
                            setOffsetX(Math.max(-150, Math.min(150, dragOffsetStart.x + dx)));
                            setOffsetY(Math.max(-150, Math.min(150, dragOffsetStart.y + dy)));
                          }}
                          onMouseUp={() => setIsDragging(false)}
                          onMouseLeave={() => setIsDragging(false)}
                          onTouchStart={(e) => {
                            if (e.touches.length === 1) {
                              setIsDragging(true);
                              setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                              setDragOffsetStart({ x: offsetX, y: offsetY });
                            }
                          }}
                          onTouchMove={(e) => {
                            if (!isDragging || e.touches.length !== 1) return;
                            const dx = e.touches[0].clientX - dragStart.x;
                            const dy = e.touches[0].clientY - dragStart.y;
                            setOffsetX(Math.max(-150, Math.min(150, dragOffsetStart.x + dx)));
                            setOffsetY(Math.max(-150, Math.min(150, dragOffsetStart.y + dy)));
                          }}
                          onTouchEnd={() => setIsDragging(false)}
                          onWheel={(e) => {
                            const zoomDelta = e.deltaY < 0 ? 5 : -5;
                            setZoom((prev) => Math.max(50, Math.min(300, prev + zoomDelta)));
                          }}
                        >
                          <img
                            src={imageToCustomize}
                            alt="Adjusting"
                            style={{
                              transform: `translate(${offsetX}px, ${offsetY}px) scale(${(zoom / 100) * (isFlippedH ? -1 : 1)}, ${(zoom / 100) * (isFlippedV ? -1 : 1)}) rotate(${rotation}deg)`,
                              filter: getFilterStyle(customFilter, customBrightness, customContrast),
                              transition: 'none',
                            }}
                            className="w-full h-full object-contain origin-center select-none pointer-events-none"
                          />
                          {/* Circle crop mask to guide the user */}
                          <div className="absolute inset-0 border border-brand-900/40 rounded-full pointer-events-none shadow-[0_0_0_9999px_rgba(255,255,255,0.4)]" />
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-neutral-400/30 pointer-events-none" />
                          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-neutral-400/30 pointer-events-none" />
                        </div>
                        
                        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest text-center leading-relaxed">
                          Drag directly on photo to position • Scroll to zoom
                        </span>

                        {/* Alternative Edit Actions: Mirroring & Nudging */}
                        <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                          {/* Mirror / Flip Actions */}
                          <div className="space-y-1.5 text-center">
                            <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                              Quick Mirrors
                            </span>
                            <div className="flex justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setIsFlippedH(prev => !prev)}
                                className={`flex-1 py-1 px-1.5 border font-mono text-[8px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                  isFlippedH 
                                    ? 'bg-neutral-900 border-neutral-900 text-white font-bold' 
                                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-800 hover:text-black'
                                }`}
                                title="Flip Horizontally"
                              >
                                <FlipHorizontal className="w-3 h-3" />
                                <span>Flip H</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsFlippedV(prev => !prev)}
                                className={`flex-1 py-1 px-1.5 border font-mono text-[8px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                  isFlippedV 
                                    ? 'bg-neutral-900 border-neutral-900 text-white font-bold' 
                                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-800 hover:text-black'
                                }`}
                                title="Flip Vertically"
                              >
                                <FlipVertical className="w-3 h-3" />
                                <span>Flip V</span>
                              </button>
                            </div>
                          </div>

                          {/* D-Pad Pixel Nudging */}
                          <div className="space-y-1.5 text-center">
                            <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                              Arrow Nudge
                            </span>
                            <div className="flex items-center justify-center gap-1">
                              {/* Left */}
                              <button
                                type="button"
                                onClick={() => setOffsetX(prev => Math.max(-150, prev - 2))}
                                className="w-6 h-6 border border-neutral-200 bg-white hover:border-neutral-800 hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-black cursor-pointer rounded-none"
                                title="Nudge Left"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                              
                              <div className="flex flex-col gap-1">
                                {/* Up */}
                                <button
                                  type="button"
                                  onClick={() => setOffsetY(prev => Math.max(-150, prev - 2))}
                                  className="w-6 h-6 border border-neutral-200 bg-white hover:border-neutral-800 hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-black cursor-pointer rounded-none"
                                  title="Nudge Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                {/* Down */}
                                <button
                                  type="button"
                                  onClick={() => setOffsetY(prev => Math.min(150, prev + 2))}
                                  className="w-6 h-6 border border-neutral-200 bg-white hover:border-neutral-800 hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-black cursor-pointer rounded-none"
                                  title="Nudge Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Right */}
                              <button
                                type="button"
                                onClick={() => setOffsetX(prev => Math.min(150, prev + 2))}
                                className="w-6 h-6 border border-neutral-200 bg-white hover:border-neutral-800 hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-black cursor-pointer rounded-none"
                                title="Nudge Right"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Live controls */}
                      <div className="space-y-4">
                        {/* Zoom Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Scale / Zoom</span>
                            <span>{zoom}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="300"
                            value={zoom}
                            onChange={(e) => setZoom(parseInt(e.target.value))}
                            className="w-full accent-black h-1 bg-neutral-200 cursor-pointer"
                          />
                        </div>

                        {/* Rotate Slider & Quick Rotate Buttons */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> Rotation</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                                className="px-1 py-0.5 border text-[8px] bg-white hover:bg-neutral-100 font-mono tracking-normal"
                              >
                                -90°
                              </button>
                              <button
                                type="button"
                                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                className="px-1 py-0.5 border text-[8px] bg-white hover:bg-neutral-100 font-mono tracking-normal"
                              >
                                +90°
                              </button>
                              <span className="font-semibold">{rotation}°</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={rotation}
                            onChange={(e) => setRotation(parseInt(e.target.value))}
                            className="w-full accent-black h-1 bg-neutral-200 cursor-pointer"
                          />
                        </div>

                        {/* Pan X and Pan Y Offset Sliders */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                              <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Position X</span>
                              <span>{offsetX}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              value={offsetX}
                              onChange={(e) => setOffsetX(parseInt(e.target.value))}
                              className="w-full accent-black h-1 bg-neutral-200 cursor-pointer"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                              <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Position Y</span>
                              <span>{offsetY}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              value={offsetY}
                              onChange={(e) => setOffsetY(parseInt(e.target.value))}
                              className="w-full accent-black h-1 bg-neutral-200 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Fine Art Aesthetics / Filters */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">
                            Aesthetic Filters
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { id: 'none', name: 'Original' },
                              { id: 'grayscale', name: 'Monochrome' },
                              { id: 'sepia', name: 'Warm Sepia' },
                              { id: 'vintage', name: 'Vintage' },
                              { id: 'warm', name: 'Warm Tone' },
                              { id: 'cool', name: 'Cool Slate' },
                            ].map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => {
                                  setCustomFilter(f.id as any);
                                  // Reset fine sliders to appropriate presets
                                  if (f.id === 'vintage') {
                                    setCustomBrightness(95);
                                    setCustomContrast(110);
                                  } else {
                                    setCustomBrightness(100);
                                    setCustomContrast(100);
                                  }
                                }}
                                className={`py-1 text-[8px] font-mono uppercase tracking-wider border text-center transition-all cursor-pointer ${
                                  customFilter === f.id
                                    ? 'bg-neutral-900 border-neutral-900 text-white font-bold'
                                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-800 hover:text-black'
                                }`}
                              >
                                {f.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Brightness & Contrast sliders */}
                        <div className="pt-2 border-t border-brand-100/50 grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                              <span>Brightness</span>
                              <span>{customBrightness}%</span>
                            </div>
                            <input
                              type="range"
                              min="60"
                              max="140"
                              value={customBrightness}
                              onChange={(e) => setCustomBrightness(parseInt(e.target.value))}
                              className="w-full accent-black h-1 bg-neutral-200 cursor-pointer"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                              <span>Contrast</span>
                              <span>{customContrast}%</span>
                            </div>
                            <input
                              type="range"
                              min="60"
                              max="140"
                              value={customContrast}
                              onChange={(e) => setCustomContrast(parseInt(e.target.value))}
                              className="w-full accent-black h-1 bg-neutral-200 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleSaveCustomized}
                          className="flex-1 py-2 bg-brand-900 hover:bg-brand-950 text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply & Save to Profile</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setZoom(100);
                            setRotation(0);
                            setOffsetX(0);
                            setOffsetY(0);
                            setCustomFilter('none');
                            setCustomBrightness(100);
                            setCustomContrast(100);
                          }}
                          className="px-3 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-600 hover:text-black font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer bg-white"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageToCustomize(null)}
                          className="px-3 py-2 border border-transparent hover:bg-neutral-100 text-neutral-500 hover:text-black font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photo Lock Settings */}
                  <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {personalInfo.isAvatarLocked ? (
                          <Lock className="w-4 h-4 text-amber-600 animate-pulse" />
                        ) : (
                          <Unlock className="w-4 h-4 text-neutral-400" />
                        )}
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-800">
                          Lock Profile Photo
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!personalInfo.isAvatarLocked}
                          onChange={(e) => updatePersonalInfo({ isAvatarLocked: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    <p className="text-[9px] font-sans text-neutral-500 leading-normal">
                      {personalInfo.isAvatarLocked 
                        ? "Currently LOCKED. Changing is disabled on the main landing page, and upload options are frozen to protect your avatar."
                        : "Currently UNLOCKED. You can upload or paste a new avatar image URL."}
                    </p>
                  </div>

                  {/* Option 1: Drag and Drop Upload */}
                  <div className={`space-y-2 ${personalInfo.isAvatarLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Option A.1: {personalInfo.isAvatarLocked ? 'Drag & Drop or Browse (Locked)' : 'Drag & Drop or Browse'}
                    </label>
                    <div
                      tabIndex={0}
                      onDragEnter={personalInfo.isAvatarLocked ? undefined : handleDrag}
                      onDragOver={personalInfo.isAvatarLocked ? undefined : handleDrag}
                      onDragLeave={personalInfo.isAvatarLocked ? undefined : handleDrag}
                      onDrop={personalInfo.isAvatarLocked ? undefined : handleDrop}
                      onPaste={personalInfo.isAvatarLocked ? undefined : handlePaste}
                      onClick={personalInfo.isAvatarLocked ? undefined : () => fileInputRef.current?.click()}
                      className={`border border-dashed p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black ${
                        dragActive 
                          ? 'border-black bg-neutral-50 scale-[0.99]' 
                          : 'border-neutral-300 hover:border-neutral-600 hover:bg-neutral-50/50'
                      }`}
                    >
                      {personalInfo.isAvatarLocked ? <Lock className="w-6 h-6 text-neutral-400" /> : <Upload className="w-6 h-6 text-neutral-400" />}
                      <div className="space-y-1">
                        <p className="font-sans text-xs font-semibold text-neutral-800">
                          {personalInfo.isAvatarLocked 
                            ? "This option is locked" 
                            : "Drag & drop, browse, or paste image from clipboard"}
                        </p>
                        <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider leading-relaxed">
                          Supports JPG, JPEG, PNG • Select box & press <kbd className="px-1 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[8px]">Ctrl + V</kbd> to paste!
                        </p>
                        <p className="text-[9px] font-mono text-brand-900 font-bold uppercase tracking-wider leading-relaxed mt-1 flex items-center justify-center gap-1">
                          <Sparkles className="w-3 h-3 text-brand-600 animate-pulse" />
                          <span>Will open the Editor Workshop below for manual cropping/filters!</span>
                        </p>
                      </div>
                      
                      {/* Robust touch-target button for mobile device support */}
                      <button
                        type="button"
                        disabled={!!personalInfo.isAvatarLocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!personalInfo.isAvatarLocked) {
                            fileInputRef.current?.click();
                          }
                        }}
                        className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 hover:border-neutral-800 text-neutral-800 font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm rounded-none min-h-[36px]"
                      >
                        <Upload className="w-3 h-3 text-neutral-600" />
                        <span>Select Photo</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        disabled={!!personalInfo.isAvatarLocked}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Option A.2: Take Photo with Webcam (Alternative Manual) */}
                  <div className={`space-y-2 ${personalInfo.isAvatarLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Option A.2: {personalInfo.isAvatarLocked ? 'Take Photo with Webcam (Locked)' : 'Take Photo with Webcam'}
                    </label>
                    <div className="border border-neutral-200 bg-white p-4 space-y-3">
                      {!isCameraActive ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
                          <Camera className="w-8 h-8 text-neutral-400" />
                          <div className="space-y-1">
                            <p className="font-sans text-xs font-semibold text-neutral-800">
                              Capture a custom profile snapshot directly
                            </p>
                            <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                              Requires camera permission in browser
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={!!personalInfo.isAvatarLocked}
                            onClick={startCamera}
                            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase tracking-widest font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm rounded-none min-h-[36px]"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Activate Webcam</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden border border-neutral-300">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover scale-x-[-1]"
                            />
                            {/* Guideline Mask Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-32 h-32 border-2 border-dashed border-white/60 rounded-full bg-black/20" />
                            </div>
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 tracking-wider animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-white rounded-full" />
                              <span>Live Feed</span>
                            </div>
                          </div>

                          {cameraError && (
                            <p className="text-[9px] font-mono text-red-600 uppercase tracking-wider leading-relaxed">
                              Error: {cameraError}
                            </p>
                          )}

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="flex-1 py-2 bg-brand-900 hover:bg-brand-950 text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Capture Snapshot</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => stopCamera()}
                              className="px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-600 hover:text-black font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer bg-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  </div>

                  {/* Option A.3: Traditional Manual File Selector */}
                  <div className={`space-y-2 ${personalInfo.isAvatarLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                      Option A.3: {personalInfo.isAvatarLocked ? 'Classic File Selector (Locked)' : 'Classic File Selector'}
                    </label>
                    <div className="border border-neutral-200 bg-white p-4 space-y-3">
                      <p className="text-[9px] font-sans text-neutral-500 leading-normal">
                        Select a file from your system manually using a classic, direct file explorer button. <span className="text-brand-900 font-mono font-bold uppercase block mt-1">★ Opens the Workshop below to crop, rotate, and fine-tune!</span>
                      </p>
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          id="traditional-avatar-upload"
                          disabled={!!personalInfo.isAvatarLocked}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              processFile(file);
                            }
                          }}
                          accept="image/*"
                          className="block w-full text-xs font-mono text-neutral-500
                            file:mr-4 file:py-1.5 file:px-3
                            file:rounded-none file:border-0
                            file:text-[9px] file:font-mono file:font-bold file:uppercase file:tracking-wider
                            file:bg-neutral-900 file:text-white
                            file:hover:bg-neutral-800
                            file:cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Image URL Input */}
                  <div className={`space-y-4 ${personalInfo.isAvatarLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                        Option B.1: {personalInfo.isAvatarLocked ? 'Paste Image URL (Locked)' : 'Paste Image URL / Base64'}
                      </label>
                      <form onSubmit={handleUrlSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                            {personalInfo.isAvatarLocked ? <Lock className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                          </div>
                          <input
                            type="text"
                            disabled={!!personalInfo.isAvatarLocked}
                            placeholder={personalInfo.isAvatarLocked ? "Profile photo is locked" : "https://example.com/your-photo.jpg or data:image/..."}
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 font-sans text-xs placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!!personalInfo.isAvatarLocked}
                          className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </form>
                      <p className="text-[9px] font-sans text-neutral-500 leading-normal">
                        <strong>Pro Tip:</strong> Supports public links from Google Drive, Dropbox, Imgur, or direct <span className="text-black font-semibold">Base64 Data URLs</span>!
                      </p>
                    </div>

                    {/* Option B.2: Fetch from GitHub */}
                    <div className="space-y-2 pt-3 border-t border-neutral-100">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                        Option B.2: {personalInfo.isAvatarLocked ? 'Sync from GitHub Profile (Locked)' : 'Instant Sync from GitHub'}
                      </label>
                      <form onSubmit={handleGithubSync} className="flex gap-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400 font-mono text-[10px]">
                            @
                          </div>
                          <input
                            type="text"
                            disabled={!!personalInfo.isAvatarLocked}
                            placeholder={personalInfo.isAvatarLocked ? "Profile photo is locked" : "GitHub Username"}
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-white border border-neutral-200 font-sans text-xs placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!!personalInfo.isAvatarLocked || !githubUsername.trim()}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Fetch
                        </button>
                      </form>
                      {githubError ? (
                        <p className="text-[9px] font-mono text-red-600 uppercase tracking-wider">
                          {githubError}
                        </p>
                      ) : (
                        <p className="text-[9px] font-sans text-neutral-500 leading-normal">
                          Fetch your high-resolution profile photo directly from any public GitHub profile.
                        </p>
                      )}
                    </div>

                    {/* Option B.3: Fetch from Gravatar */}
                    <div className="space-y-2 pt-3 border-t border-neutral-100">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                        Option B.3: {personalInfo.isAvatarLocked ? 'Sync from Gravatar (Locked)' : 'Instant Sync from Gravatar'}
                      </label>
                      <form onSubmit={handleGravatarSync} className="flex gap-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                            <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                          <input
                            type="email"
                            disabled={!!personalInfo.isAvatarLocked}
                            placeholder={personalInfo.isAvatarLocked ? "Profile photo is locked" : "your-gravatar-email@example.com"}
                            value={gravatarEmail}
                            onChange={(e) => setGravatarEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 font-sans text-xs placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-none transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!!personalInfo.isAvatarLocked || !gravatarEmail.trim()}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Sync
                        </button>
                      </form>
                      {gravatarError ? (
                        <p className="text-[9px] font-mono text-red-600 uppercase tracking-wider leading-relaxed">
                          {gravatarError}
                        </p>
                      ) : (
                        <p className="text-[9px] font-sans text-neutral-500 leading-normal">
                          Enter your Gravatar-registered email to automatically pull your global professional photo.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Option C: Dynamic Professional Initials & Preset Library */}
                  <div className={`p-4 bg-brand-50/50 border border-brand-100 space-y-4 mt-4 ${personalInfo.isAvatarLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-brand-900" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-900">
                        Option C: Dynamic Professional Initials & Preset Library
                      </span>
                    </div>
                    <p className="text-[9px] font-sans text-neutral-600 leading-normal">
                      Don't have a photo handy? Generate a polished, corporate brand identity initials avatar or select from classic professional portraits with one click.
                    </p>

                    <div className="space-y-3 pt-2 border-t border-brand-100">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                        C.1: Custom Initials Generator
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={3}
                          value={customInitials}
                          onChange={(e) => setCustomInitials(e.target.value)}
                          placeholder="RG"
                          disabled={!!personalInfo.isAvatarLocked}
                          className="w-16 px-2.5 py-1.5 bg-white border border-neutral-200 font-sans text-xs uppercase text-center focus:outline-none focus:border-black rounded-none"
                        />
                        <button
                          type="button"
                          disabled={!!personalInfo.isAvatarLocked}
                          onClick={() => generateInitialsAvatar(customInitials || 'RG', initialsBgColor, initialsTextColor, initialsBorderColor)}
                          className="flex-1 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                        >
                          Generate & Save Badge
                        </button>
                      </div>

                      {/* Presets Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {[
                          { name: 'Obsidian Navy', bg: '#0f172a', text: '#e2e8f0', border: '#3b82f6' },
                          { name: 'Luxury Bronze', bg: '#1c1917', text: '#f5f5f4', border: '#c2410c' },
                          { name: 'Emerald Law', bg: '#064e3b', text: '#ecfdf5', border: '#10b981' },
                          { name: 'Imperial Gold', bg: '#1e1b4b', text: '#fef3c7', border: '#fbbf24' },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={!!personalInfo.isAvatarLocked}
                            onClick={() => {
                              setInitialsBgColor(preset.bg);
                              setInitialsTextColor(preset.text);
                              setInitialsBorderColor(preset.border);
                              generateInitialsAvatar(customInitials || 'RG', preset.bg, preset.text, preset.border);
                            }}
                            className="flex items-center gap-2 p-1.5 border border-neutral-200 bg-white hover:border-black text-left transition-colors cursor-pointer"
                          >
                            <span 
                              className="w-5 h-5 rounded-none flex-shrink-0 border border-neutral-300"
                              style={{ backgroundColor: preset.bg, borderColor: preset.border }}
                            />
                            <span className="text-[9px] font-mono uppercase text-neutral-700 truncate">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-brand-100">
                      <label className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                        C.2: Elegant Preset Portraits
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            name: 'Classic Attorney Silhouette',
                            url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
                          },
                          {
                            name: 'Corporate Executive Portrait',
                            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
                          },
                          {
                            name: 'Modern Office Legal desk',
                            url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=300&q=80'
                          },
                          {
                            name: 'Justice Scales Symbol',
                            url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80'
                          }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={!!personalInfo.isAvatarLocked}
                            onClick={() => {
                              updatePersonalInfo({ avatar: item.url });
                              setImageToCustomize(null);
                              triggerSaveSuccess();
                            }}
                            className="flex items-center gap-2 p-1 border border-neutral-200 bg-white hover:border-black text-left transition-colors cursor-pointer"
                          >
                            <img src={item.url} alt={item.name} className="w-6 h-6 object-cover flex-shrink-0" />
                            <span className="text-[8px] font-sans text-neutral-600 line-clamp-1">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Option D: Device Sync / Backup */}
                  <div className="p-4 bg-brand-50/50 border border-brand-100 space-y-3 mt-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-brand-900" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-900">
                        Option D: Sync Across Devices
                      </span>
                    </div>
                    <p className="text-[9px] font-sans text-neutral-600 leading-normal">
                      Since customized data and uploaded photos are saved inside your browser's local cache, they don't automatically sync to your other devices. Use this tool to easily download your custom portfolio and restore it on another computer or phone!
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleExportConfig}
                        className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export Backup</span>
                      </button>
                      
                      <label className="flex-1 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 font-mono text-[9px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center bg-white">
                        <UploadCloud className="w-3 h-3 text-neutral-500" />
                        <span>Import Backup</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportConfig}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Option E: Selfie Snapshot (Live Camera) */}
                  <div className={`p-4 bg-brand-50/50 border border-brand-100 space-y-3 mt-4 ${personalInfo.isAvatarLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-brand-900" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-900">
                        Option E: Take a Selfie Live
                      </span>
                    </div>
                    <p className="text-[9px] font-sans text-neutral-600 leading-normal">
                      Use your device's front or back camera to capture a live profile picture. It will automatically crop into a clean square photo.
                    </p>

                    {isCameraActive ? (
                      <div className="space-y-3">
                        <div className="relative w-full max-w-[280px] mx-auto aspect-square bg-black border border-neutral-300 overflow-hidden">
                          {cameraError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-red-600 space-y-2">
                              <VideoOff className="w-8 h-8" />
                              <span className="text-[10px] font-mono uppercase tracking-wider">{cameraError}</span>
                            </div>
                          ) : (
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover scale-x-[-1]"
                            />
                          )}
                        </div>
                        
                        <div className="flex gap-2 justify-center">
                          {!cameraError && (
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Capture Photo</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => stopCamera()}
                            className="px-4 py-2 border border-neutral-300 hover:border-neutral-800 text-neutral-800 font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer bg-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!!personalInfo.isAvatarLocked}
                        onClick={startCamera}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Open Device Camera</span>
                      </button>
                    )}

                    {/* Hidden canvas for taking snapshot */}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </div>
              )}

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
