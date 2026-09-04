'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadedFile } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { saveArtworkFile } from '@/lib/file-store';
import {
  X,
  Crop,
  Sliders,
  Sparkles,
  RotateCw,
  FlipHorizontal,
  Download,
  Check,
  RotateCcw,
  Layers,
  Smile,
  Trash2,
  Heart,
  Star,
  Shield,
  Hexagon,
  Circle,
  Square,
  Award,
  Type,
  Palette,
  Maximize2,
  Coffee,
  Laptop,
  Smartphone,
  Package,
  User,
} from 'lucide-react';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: UploadedFile;
  onSave: (updatedFile: UploadedFile) => void;
}

export type TabType = 'crop' | 'border' | 'filters' | 'overlays' | 'text' | 'transform';

export type CropShape =
  | 'original'
  | 'body'
  | 'heart'
  | 'star'
  | 'circle'
  | 'rounded'
  | 'square'
  | 'hexagon'
  | 'stamp'
  | 'shield';

export interface ClipartItem {
  id: string;
  type: string;
  label: string;
  labelKm: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface EditorState {
  shape: CropShape;
  borderRadius: number; // for rounded rect 0 - 80
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  // Filters
  brightness: number; // -80 to 80
  contrast: number;   // -80 to 80
  saturation: number; // -100 to 100
  hue: number;        // 0 to 360
  sepia: number;      // 0 to 100
  invert: boolean;
  activeFilterPreset: string;
  // White die-cut border & shadow
  borderWidth: number; // 0 - 36
  borderColor: string; // default #ffffff
  shadow: boolean;
  // Cliparts
  cliparts: ClipartItem[];
  selectedClipartId: string | null;
  // Custom Text Overlay
  customText: string;
  textColor: string;
  textBgColor: string;
  textSize: number;
  textY: number;
  textStyle: 'clean' | 'badge' | 'outline';
  // Mockup view
  mockupView: 'sticker' | 'cup' | 'laptop' | 'phone' | 'box';
}

const defaultState: EditorState = {
  shape: 'original',
  borderRadius: 40,
  zoom: 1,
  panX: 0,
  panY: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  sepia: 0,
  invert: false,
  activeFilterPreset: 'normal',
  borderWidth: 10, // Default white sticker die-cut border
  borderColor: '#ffffff',
  shadow: true,
  cliparts: [],
  selectedClipartId: null,
  customText: '',
  textColor: '#0f172a',
  textBgColor: '#ffffff',
  textSize: 20,
  textY: 150,
  textStyle: 'badge',
  mockupView: 'sticker',
};

// SVG data strings for high-resolution sticker clipart & caps
const CLIPART_SVGS: Record<string, string> = {
  'cap-baseball': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 70" width="100" height="70">
    <path d="M15 45 C15 15 75 15 85 45 Z" fill="#ef4444" stroke="#991b1b" stroke-width="3"/>
    <ellipse cx="50" cy="18" rx="4" ry="2" fill="#991b1b"/>
    <path d="M12 45 C40 40 75 40 96 46 C90 54 60 56 12 48 Z" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <path d="M55 43 C75 42 95 45 95 46 C85 52 65 52 50 49 Z" fill="#991b1b" opacity="0.3"/>
  </svg>`,
  'cap-crown': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="100" height="80">
    <polygon points="10,65 20,25 40,45 50,15 60,45 80,25 90,65" fill="#facc15" stroke="#ca8a04" stroke-width="4"/>
    <circle cx="20" cy="22" r="6" fill="#ef4444"/>
    <circle cx="50" cy="12" r="7" fill="#3b82f6"/>
    <circle cx="80" cy="22" r="6" fill="#10b981"/>
    <rect x="10" y="62" width="80" height="10" rx="3" fill="#eab308" stroke="#ca8a04" stroke-width="3"/>
  </svg>`,
  'cap-party': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100" width="80" height="100">
    <polygon points="40,15 15,85 65,85" fill="#ec4899" stroke="#be185d" stroke-width="3"/>
    <path d="M22 65 L58 65" stroke="#facc15" stroke-width="8"/>
    <path d="M28 45 L52 45" stroke="#38bdf8" stroke-width="8"/>
    <circle cx="40" cy="12" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
    <ellipse cx="40" cy="85" rx="25" ry="6" fill="#be185d"/>
  </svg>`,
  'cap-santa': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="100" height="90">
    <path d="M18 68 C22 25 65 15 82 45 C92 60 75 75 75 75 Z" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <rect x="12" y="66" width="76" height="18" rx="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
    <circle cx="85" cy="45" r="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
  </svg>`,
  'cap-chef': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="100" height="90">
    <path d="M22 60 C10 45 15 20 35 22 C40 10 60 10 68 20 C85 15 95 38 82 60 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="25" y="60" width="52" height="20" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
    <line x1="38" y1="62" x2="38" y2="78" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="50" y1="62" x2="50" y2="78" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="62" y1="62" x2="62" y2="78" stroke="#cbd5e1" stroke-width="2"/>
  </svg>`,
  'cap-grad': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 70" width="100" height="70">
    <polygon points="50,15 95,30 50,45 5,30" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <rect x="28" y="38" width="44" height="22" rx="4" fill="#0f172a"/>
    <circle cx="50" cy="30" r="4" fill="#facc15"/>
    <path d="M50 30 L80 46 L82 60" stroke="#facc15" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`,
  'ears-cat': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="100" height="60">
    <polygon points="12,55 25,12 48,45" fill="#f8fafc" stroke="#64748b" stroke-width="3"/>
    <polygon points="18,50 26,20 42,42" fill="#fda4af"/>
    <polygon points="52,45 75,12 88,55" fill="#f8fafc" stroke="#64748b" stroke-width="3"/>
    <polygon points="58,42 74,20 82,50" fill="#fda4af"/>
  </svg>`,
  'bow-ribbon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="100" height="60">
    <polygon points="50,30 15,12 18,48" fill="#e11d48" stroke="#9f1239" stroke-width="2"/>
    <polygon points="50,30 85,12 82,48" fill="#e11d48" stroke="#9f1239" stroke-width="2"/>
    <circle cx="50" cy="30" r="8" fill="#f43f5e" stroke="#9f1239" stroke-width="2"/>
    <path d="M44 35 L35 55" stroke="#be123c" stroke-width="6" stroke-linecap="round"/>
    <path d="M56 35 L65 55" stroke="#be123c" stroke-width="6" stroke-linecap="round"/>
  </svg>`,
  'shades-cool': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" width="120" height="50">
    <path d="M10 15 Q60 8 110 15" stroke="#0f172a" stroke-width="5" fill="none"/>
    <rect x="15" y="15" width="40" height="28" rx="8" fill="#0f172a"/>
    <rect x="65" y="15" width="40" height="28" rx="8" fill="#0f172a"/>
    <line x1="20" y1="20" x2="35" y2="35" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="20" x2="85" y2="35" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  'shades-heart': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" width="120" height="50">
    <line x1="45" y1="22" x2="75" y2="22" stroke="#be123c" stroke-width="4"/>
    <path d="M30 38 L15 22 C8 15 18 5 28 15 C38 5 48 15 42 25 Z" fill="#e11d48" stroke="#9f1239" stroke-width="3"/>
    <path d="M90 38 L75 22 C68 15 78 5 88 15 C98 5 108 15 102 25 Z" fill="#e11d48" stroke="#9f1239" stroke-width="3"/>
  </svg>`,
  'badge-star': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <polygon points="40,5 50,28 75,30 55,48 62,73 40,58 18,73 25,48 5,30 30,28" fill="#fbbf24" stroke="#d97706" stroke-width="4"/>
  </svg>`,
  'badge-fire': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width="80" height="90">
    <path d="M40 5 C55 25 75 40 75 60 C75 78 60 90 40 90 C20 90 5 78 5 60 C5 45 20 30 30 15 C32 30 40 35 35 48 C42 42 48 30 40 5 Z" fill="#ef4444"/>
    <path d="M40 40 C48 52 58 60 58 72 C58 82 48 88 40 88 C32 88 22 82 22 72 C22 62 30 55 35 45 Z" fill="#facc15"/>
  </svg>`,
  'badge-heart': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <path d="M40 72 C20 55 5 40 5 25 C5 12 15 5 28 5 C35 5 40 10 40 10 C40 10 45 5 52 5 C65 5 75 12 75 25 C75 40 60 55 40 72 Z" fill="#e11d48" stroke="#9f1239" stroke-width="3"/>
  </svg>`,
  'badge-vip': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
    <circle cx="45" cy="45" r="40" fill="#0f172a" stroke="#f59e0b" stroke-width="5"/>
    <circle cx="45" cy="45" r="34" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="45" y="54" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#f59e0b" text-anchor="middle">VIP</text>
  </svg>`,
  'badge-sale': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" width="100" height="50">
    <rect x="5" y="5" width="90" height="40" rx="10" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <text x="50" y="32" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">SALE</text>
  </svg>`,
  'badge-verified': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="70" height="70">
    <circle cx="35" cy="35" r="30" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
    <polyline points="22,35 30,44 48,24" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

const AVAILABLE_CLIPARTS = [
  { type: 'cap-baseball', label: 'Baseball Cap', labelKm: 'មួកកាតឹប' },
  { type: 'cap-crown', label: 'Golden Crown', labelKm: 'ម្កុដមាស' },
  { type: 'cap-party', label: 'Party Cone Hat', labelKm: 'មួកជប់លៀង' },
  { type: 'cap-santa', label: 'Santa Hat', labelKm: 'មួកគ្រីស្មាស' },
  { type: 'cap-chef', label: 'Chef Hat', labelKm: 'មួកចុងភៅ' },
  { type: 'cap-grad', label: 'Graduation Cap', labelKm: 'មួកបញ្ជាក់ការសិក្សា' },
  { type: 'ears-cat', label: 'Cute Cat Ears', labelKm: 'ត្រចៀកឆ្មា' },
  { type: 'bow-ribbon', label: 'Ribbon Bow', labelKm: 'បូផ្កាអំណោយ' },
  { type: 'shades-cool', label: 'Cool Sunglasses', labelKm: 'វ៉ែនតាខ្មៅ' },
  { type: 'shades-heart', label: 'Heart Sunglasses', labelKm: 'វ៉ែនតាបេះដូង' },
  { type: 'badge-star', label: 'Gold Star Badge', labelKm: 'ផ្កាយមាស' },
  { type: 'badge-fire', label: 'Hot Fire Flame', labelKm: 'ភ្លើងឆេះ' },
  { type: 'badge-heart', label: 'Love Heart', labelKm: 'បេះដូង' },
  { type: 'badge-vip', label: 'VIP Gold Seal', labelKm: 'តែម VIP' },
  { type: 'badge-sale', label: 'Sale Ribbon', labelKm: 'តែម SALE' },
  { type: 'badge-verified', label: 'Verified Check', labelKm: 'ធិកខៀវ Verified' },
];

const FILTER_PRESETS = [
  { id: 'normal', name: 'Original', nameKm: 'រូបដើម', b: 0, c: 0, s: 0, h: 0, sep: 0, inv: false },
  { id: 'vibrant', name: 'Vibrant Pop', nameKm: 'ពណ៌ដិត', b: 5, c: 25, s: 55, h: 0, sep: 0, inv: false },
  { id: 'hdr', name: 'HDR Clarity', nameKm: 'ច្បាស់ខ្លាំង', b: 2, c: 40, s: 30, h: 0, sep: 0, inv: false },
  { id: 'warm', name: 'Warm Sunset', nameKm: 'កម្តៅថ្ងៃ', b: 5, c: 10, s: 25, h: 25, sep: 12, inv: false },
  { id: 'cool', name: 'Ice Cool', nameKm: 'ត្រជាក់ស្រស់', b: 0, c: 15, s: 15, h: 190, sep: 0, inv: false },
  { id: 'golden', name: 'Golden Hour', nameKm: 'ពន្លឺមាស', b: 8, c: 15, s: 40, h: 42, sep: 20, inv: false },
  { id: 'emerald', name: 'Fresh Mint', nameKm: 'បៃតងស្រស់', b: 0, c: 20, s: 35, h: 110, sep: 0, inv: false },
  { id: 'sakura', name: 'Sakura Pink', nameKm: 'ផ្កាសាគូរ៉ា', b: 8, c: 10, s: 30, h: 325, sep: 0, inv: false },
  { id: 'neon', name: 'Neon Glow', nameKm: 'នេអុងភ្លឺ', b: 5, c: 35, s: 75, h: 310, sep: 0, inv: false },
  { id: 'cyberpunk', name: 'Cyberpunk', nameKm: 'ស៊ីប័រ 2077', b: 0, c: 35, s: 65, h: 275, sep: 0, inv: false },
  { id: 'retro', name: 'Vintage 70s', nameKm: 'ហ្វីល 70s', b: 0, c: 15, s: 20, h: 20, sep: 45, inv: false },
  { id: 'analog', name: 'Analog Film', nameKm: 'កូដាក', b: 4, c: 18, s: 15, h: 355, sep: 28, inv: false },
  { id: 'matte', name: 'Matte Finish', nameKm: 'ស្បែកម៉ត់', b: -5, c: -10, s: -15, h: 0, sep: 0, inv: false },
  { id: 'monochrome', name: 'Deep B&W', nameKm: 'ស-ខ្មៅដិត', b: 0, c: 35, s: -100, h: 0, sep: 0, inv: false },
  { id: 'sepia', name: 'Rustic Sepia', nameKm: 'ត្នោតបុរាណ', b: 0, c: 12, s: 10, h: 0, sep: 80, inv: false },
  { id: 'violet', name: 'Synth Violet', nameKm: 'ស្វាយរាត្រី', b: -2, c: 30, s: 50, h: 255, sep: 0, inv: false },
  { id: 'summer', name: 'Tropical', nameKm: 'រដូវក្តៅ', b: 6, c: 20, s: 45, h: 15, sep: 5, inv: false },
  { id: 'invert', name: 'Invert Art', nameKm: 'ត្រឡប់ពណ៌', b: 0, c: 0, s: 0, h: 0, sep: 0, inv: true },
];

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  file,
  onSave,
}) => {
  const { tObj } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('crop');
  const [state, setState] = useState<EditorState>(defaultState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggingTargetRef = useRef<'image' | 'clipart'>('image');
  const loadedClipartImages = useRef<Map<string, HTMLImageElement>>(new Map());

  // Load image element
  useEffect(() => {
    if (!isOpen || !file.previewUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
      setState(defaultState);
    };
    img.src = file.previewUrl;
  }, [isOpen, file.previewUrl]);

  // Pre-load clipart SVG images into memory
  useEffect(() => {
    Object.entries(CLIPART_SVGS).forEach(([type, svgStr]) => {
      if (!loadedClipartImages.current.has(type)) {
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedClipartImages.current.set(type, img);
        };
      }
    });
  }, []);

  // Helper to draw geometric crop path
  const applyCropPath = useCallback(
    (ctx: CanvasRenderingContext2D, shape: CropShape, cx: number, cy: number, size: number, radius: number) => {
      ctx.beginPath();
      if (shape === 'circle') {
        ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
      } else if (shape === 'square') {
        const half = size * 0.46;
        ctx.rect(cx - half, cy - half, half * 2, half * 2);
      } else if (shape === 'rounded') {
        const half = size * 0.46;
        ctx.roundRect(cx - half, cy - half, half * 2, half * 2, radius);
      } else if (shape === 'heart') {
        // Parametric Bezier Heart
        const s = size * 0.90;
        const topY = cy - s * 0.40;
        ctx.moveTo(cx, topY + s * 0.28);
        ctx.bezierCurveTo(cx, topY, cx - s * 0.52, topY, cx - s * 0.52, topY + s * 0.38);
        ctx.bezierCurveTo(cx - s * 0.52, topY + s * 0.68, cx - s * 0.22, topY + s * 0.88, cx, cy + s * 0.50);
        ctx.bezierCurveTo(cx + s * 0.22, topY + s * 0.88, cx + s * 0.52, topY + s * 0.68, cx + s * 0.52, topY + s * 0.38);
        ctx.bezierCurveTo(cx + s * 0.52, topY, cx, topY, cx, topY + s * 0.28);
      } else if (shape === 'star') {
        // 5-Point Star
        const outerR = size * 0.48;
        const innerR = size * 0.22;
        let angle = -Math.PI / 2;
        const step = Math.PI / 5;
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          angle += step;
        }
      } else if (shape === 'body') {
        // Contour Body / Badge Shape
        const w = size * 0.88;
        const h = size * 0.92;
        ctx.moveTo(cx - w * 0.26, cy - h * 0.45);
        ctx.quadraticCurveTo(cx, cy - h * 0.52, cx + w * 0.26, cy - h * 0.45);
        ctx.bezierCurveTo(cx + w * 0.48, cy - h * 0.35, cx + w * 0.50, cy - h * 0.08, cx + w * 0.46, cy + h * 0.16);
        ctx.bezierCurveTo(cx + w * 0.40, cy + h * 0.38, cx + w * 0.30, cy + h * 0.48, cx, cy + h * 0.50);
        ctx.bezierCurveTo(cx - w * 0.30, cy + h * 0.48, cx - w * 0.40, cy + h * 0.38, cx - w * 0.46, cy + h * 0.16);
        ctx.bezierCurveTo(cx - w * 0.50, cy - h * 0.08, cx - w * 0.48, cy - h * 0.35, cx - w * 0.26, cy - h * 0.45);
      } else if (shape === 'hexagon') {
        // 6-sided Hexagon
        const r = size * 0.48;
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3 - Math.PI / 6;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      } else if (shape === 'stamp') {
        // Scalloped Stamp Badge
        const r = size * 0.42;
        const numScallops = 16;
        const step = (Math.PI * 2) / numScallops;
        for (let i = 0; i < numScallops; i++) {
          const angle = i * step;
          const nextAngle = (i + 1) * step;
          const midAngle = angle + step / 2;
          const outerX = cx + Math.cos(midAngle) * (r + 14);
          const outerY = cy + Math.sin(midAngle) * (r + 14);
          const nextX = cx + Math.cos(nextAngle) * r;
          const nextY = cy + Math.sin(nextAngle) * r;
          if (i === 0) ctx.moveTo(cx + Math.cos(0) * r, cy + Math.sin(0) * r);
          ctx.quadraticCurveTo(outerX, outerY, nextX, nextY);
        }
      } else if (shape === 'shield') {
        // Crest / Shield
        const w = size * 0.88;
        const h = size * 0.94;
        ctx.moveTo(cx, cy - h * 0.46);
        ctx.lineTo(cx + w * 0.44, cy - h * 0.38);
        ctx.quadraticCurveTo(cx + w * 0.46, cy + h * 0.12, cx, cy + h * 0.48);
        ctx.quadraticCurveTo(cx - w * 0.46, cy + h * 0.12, cx - w * 0.44, cy - h * 0.38);
      }
      ctx.closePath();
    },
    []
  );

  // Render the canvas preview
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 1. Draw Background: Mockup or Transparency Checkerboard
    if (state.mockupView === 'cup') {
      // Modern Takeaway Coffee Cup Mockup
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 600);
      bgGrad.addColorStop(0, '#f1f5f9');
      bgGrad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 600, 600);

      // Cup Lid
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(170, 48, 260, 40, [12, 12, 4, 4]);
      ctx.fill();
      ctx.fillRect(195, 34, 210, 16);

      // Cup Body
      const cupGrad = ctx.createLinearGradient(160, 0, 440, 0);
      cupGrad.addColorStop(0, '#ffffff');
      cupGrad.addColorStop(0.5, '#f8fafc');
      cupGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = cupGrad;
      ctx.beginPath();
      ctx.moveTo(180, 88);
      ctx.lineTo(420, 88);
      ctx.lineTo(385, 545);
      ctx.quadraticCurveTo(300, 560, 215, 545);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cup Kraft Paper Sleeve
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(195, 230);
      ctx.lineTo(405, 230);
      ctx.lineTo(395, 415);
      ctx.lineTo(205, 415);
      ctx.closePath();
      ctx.fill();
    } else if (state.mockupView === 'laptop') {
      // Modern Aluminum Laptop Lid Mockup
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 600);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 600, 600);

      // Aluminum Laptop Lid
      const lapGrad = ctx.createLinearGradient(80, 80, 520, 520);
      lapGrad.addColorStop(0, '#cbd5e1');
      lapGrad.addColorStop(0.5, '#94a3b8');
      lapGrad.addColorStop(1, '#64748b');
      ctx.fillStyle = lapGrad;
      ctx.beginPath();
      ctx.roundRect(70, 75, 460, 450, 24);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Subtle Laptop Hinge line
      ctx.fillStyle = '#475569';
      ctx.fillRect(160, 72, 280, 6);
    } else if (state.mockupView === 'phone') {
      // Modern Smartphone Back Cover Mockup
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 600);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 600, 600);

      // Phone Body
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.roundRect(175, 45, 250, 510, 42);
      ctx.fill();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Camera Island
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(190, 62, 80, 110, 22);
      ctx.fill();

      // Camera Lenses
      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.arc(230, 92, 18, 0, Math.PI * 2);
      ctx.arc(230, 142, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(227, 89, 5, 0, Math.PI * 2);
      ctx.arc(227, 139, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (state.mockupView === 'box') {
      // Kraft Cardboard Shipping Package Mockup
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 600);
      bgGrad.addColorStop(0, '#fef3c7');
      bgGrad.addColorStop(1, '#fde68a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 600, 600);

      // Kraft Box
      const boxGrad = ctx.createLinearGradient(70, 70, 530, 530);
      boxGrad.addColorStop(0, '#d97706');
      boxGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = boxGrad;
      ctx.beginPath();
      ctx.roundRect(75, 75, 450, 450, 20);
      ctx.fill();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Center Sealing Tape
      ctx.fillStyle = '#78350f';
      ctx.fillRect(75, 275, 450, 50);
    } else {
      // Standard Transparent Checkerboard for Direct Sticker Preview
      const checkSize = 16;
      for (let x = 0; x < width; x += checkSize) {
        for (let y = 0; y < height; y += checkSize) {
          ctx.fillStyle = (x / checkSize + y / checkSize) % 2 === 0 ? '#f8fafc' : '#e2e8f0';
          ctx.fillRect(x, y, checkSize, checkSize);
        }
      }
    }

    // Determine scale if on mockup view
    const scaleFactor = state.mockupView === 'sticker' ? 1.0 : 0.65;
    const stickerCenterY = state.mockupView === 'cup' ? cy + 40 : state.mockupView === 'phone' ? cy + 60 : cy;

    ctx.save();
    ctx.translate(cx, stickerCenterY);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(-cx, -stickerCenterY);

    // 2. Draw Die-Cut White Bleed Shadow if enabled
    if (state.shadow && state.shape !== 'original') {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = state.borderColor;
      applyCropPath(ctx, state.shape, cx, stickerCenterY, 470 + state.borderWidth, state.borderRadius);
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw Base Image with Crop Shape Clipping & Filter
    ctx.save();

    if (state.shape !== 'original') {
      applyCropPath(ctx, state.shape, cx, stickerCenterY, 460, state.borderRadius);
      ctx.clip();
    }

    // Apply Filter
    const b = 100 + state.brightness;
    const c = 100 + state.contrast;
    const s = 100 + state.saturation;
    const h = state.hue;
    const sep = state.sepia;
    const inv = state.invert ? 100 : 0;
    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) sepia(${sep}%) invert(${inv}%)`;

    // Position, Rotate, Scale & Pan
    ctx.translate(cx + state.panX, stickerCenterY + state.panY);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);

    const imgAspect = imgElement.width / imgElement.height;
    let drawW = 460 * state.zoom;
    let drawH = (460 / imgAspect) * state.zoom;
    if (imgAspect < 1) {
      drawH = 460 * state.zoom;
      drawW = 460 * imgAspect * state.zoom;
    }

    ctx.drawImage(imgElement, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // 4. Draw Clipart Overlays (Hats, Caps, Sunglasses, Badges)
    state.cliparts.forEach((clipart) => {
      const clipImg = loadedClipartImages.current.get(clipart.type);
      if (!clipImg) return;

      ctx.save();
      ctx.translate(cx + clipart.x, stickerCenterY + clipart.y);
      ctx.rotate((clipart.rotation * Math.PI) / 180);
      const cw = 110 * clipart.scale;
      const ch = (110 * (clipImg.height / clipImg.width)) * clipart.scale;

      if (state.selectedClipartId === clipart.id) {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.strokeRect(-cw / 2 - 4, -ch / 2 - 4, cw + 8, ch + 8);
      }

      ctx.drawImage(clipImg, -cw / 2, -ch / 2, cw, ch);
      ctx.restore();
    });

    // 5. Draw Custom Text Overlay if configured
    if (state.customText.trim()) {
      ctx.save();
      ctx.font = `900 ${state.textSize * 1.5}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textMetrics = ctx.measureText(state.customText.trim());
      const textW = textMetrics.width;
      const textH = state.textSize * 1.8;
      const textPosY = stickerCenterY + state.textY;

      if (state.textStyle === 'badge') {
        // Pill Badge background
        ctx.fillStyle = state.textBgColor;
        ctx.beginPath();
        ctx.roundRect(cx - textW / 2 - 16, textPosY - textH / 2, textW + 32, textH, 12);
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
      } else if (state.textStyle === 'outline') {
        ctx.strokeStyle = state.textBgColor === '#ffffff' ? '#0f172a' : '#ffffff';
        ctx.lineWidth = 6;
        ctx.strokeText(state.customText.trim(), cx, textPosY);
      }

      ctx.fillStyle = state.textColor;
      ctx.fillText(state.customText.trim(), cx, textPosY);
      ctx.restore();
    }

    // 6. Draw White Die-Cut Bleed Border on top ("redis with white")
    if (state.borderWidth > 0 && state.shape !== 'original') {
      ctx.save();
      ctx.strokeStyle = state.borderColor;
      ctx.lineWidth = state.borderWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      applyCropPath(ctx, state.shape, cx, stickerCenterY, 460 - state.borderWidth / 2, state.borderRadius);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }, [imgElement, state, applyCropPath]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleSelectFilterPreset = (presetId: string) => {
    const preset = FILTER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setState((prev) => ({
      ...prev,
      activeFilterPreset: presetId,
      brightness: preset.b,
      contrast: preset.c,
      saturation: preset.s,
      hue: preset.h,
      sepia: preset.sep,
      invert: preset.inv,
    }));
  };

  const handleAddClipart = (type: string) => {
    const item = AVAILABLE_CLIPARTS.find((c) => c.type === type);
    if (!item) return;

    const newId = `clip_${Date.now()}`;
    const newClipart: ClipartItem = {
      id: newId,
      type: item.type,
      label: item.label,
      labelKm: item.labelKm,
      x: 0,
      y: -80,
      scale: 1,
      rotation: 0,
    };

    setState((prev) => ({
      ...prev,
      cliparts: [...prev.cliparts, newClipart],
      selectedClipartId: newId,
    }));
    setActiveTab('overlays');
  };

  const handleRemoveSelectedClipart = () => {
    if (!state.selectedClipartId) return;
    setState((prev) => ({
      ...prev,
      cliparts: prev.cliparts.filter((c) => c.id !== prev.selectedClipartId),
      selectedClipartId: null,
    }));
  };

  const handleUpdateSelectedClipart = (field: keyof ClipartItem, value: number) => {
    if (!state.selectedClipartId) return;
    setState((prev) => ({
      ...prev,
      cliparts: prev.cliparts.map((c) =>
        c.id === prev.selectedClipartId ? { ...c, [field]: value } : c
      ),
    }));
  };

  // Mouse & Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 600 / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX - 300;
    const mouseY = (e.clientY - rect.top) * scaleY - 300;

    // Check if clicking on clipart
    const hitClipart = [...state.cliparts].reverse().find((c) => {
      const dist = Math.sqrt((c.x - mouseX) ** 2 + (c.y - mouseY) ** 2);
      return dist < 65 * c.scale;
    });

    if (hitClipart) {
      setState((p) => ({ ...p, selectedClipartId: hitClipart.id }));
      draggingTargetRef.current = 'clipart';
    } else {
      draggingTargetRef.current = 'image';
    }

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    if (draggingTargetRef.current === 'clipart' && state.selectedClipartId) {
      setState((prev) => ({
        ...prev,
        cliparts: prev.cliparts.map((c) =>
          c.id === prev.selectedClipartId ? { ...c, x: c.x + dx * 1.4, y: c.y + dy * 1.4 } : c
        ),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        panX: prev.panX + dx * 1.4,
        panY: prev.panY + dy * 1.4,
      }));
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setState((prev) => ({
      ...prev,
      panX: prev.panX + dx * 1.4,
      panY: prev.panY + dy * 1.4,
    }));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Export edited canvas to clean transparent PNG for print production
  const handleSave = async () => {
    if (!imgElement) return;
    setIsProcessing(true);

    // Create an offscreen clean canvas to ensure transparent background is exported
    const offscreen = document.createElement('canvas');
    offscreen.width = 600;
    offscreen.height = 600;
    const octx = offscreen.getContext('2d');

    if (!octx) {
      setIsProcessing(false);
      return;
    }

    const cx = 300;
    const cy = 300;

    // Draw White Bleed Shadow if enabled
    if (state.shadow && state.shape !== 'original') {
      octx.save();
      octx.shadowColor = 'rgba(0, 0, 0, 0.32)';
      octx.shadowBlur = 24;
      octx.shadowOffsetX = 0;
      octx.shadowOffsetY = 10;
      octx.fillStyle = state.borderColor;
      applyCropPath(octx, state.shape, cx, cy, 470 + state.borderWidth, state.borderRadius);
      octx.fill();
      octx.restore();
    }

    // Draw Base Image with Crop Shape Clipping & Filter
    octx.save();
    if (state.shape !== 'original') {
      applyCropPath(octx, state.shape, cx, cy, 460, state.borderRadius);
      octx.clip();
    }

    const b = 100 + state.brightness;
    const c = 100 + state.contrast;
    const s = 100 + state.saturation;
    const h = state.hue;
    const sep = state.sepia;
    const inv = state.invert ? 100 : 0;
    octx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) sepia(${sep}%) invert(${inv}%)`;

    octx.translate(cx + state.panX, cy + state.panY);
    octx.rotate((state.rotation * Math.PI) / 180);
    octx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);

    const imgAspect = imgElement.width / imgElement.height;
    let drawW = 460 * state.zoom;
    let drawH = (460 / imgAspect) * state.zoom;
    if (imgAspect < 1) {
      drawH = 460 * state.zoom;
      drawW = 460 * imgAspect * state.zoom;
    }

    octx.drawImage(imgElement, -drawW / 2, -drawH / 2, drawW, drawH);
    octx.restore();

    // Draw Clipart Overlays
    state.cliparts.forEach((clipart) => {
      const clipImg = loadedClipartImages.current.get(clipart.type);
      if (!clipImg) return;

      octx.save();
      octx.translate(cx + clipart.x, cy + clipart.y);
      octx.rotate((clipart.rotation * Math.PI) / 180);
      const cw = 110 * clipart.scale;
      const ch = (110 * (clipImg.height / clipImg.width)) * clipart.scale;
      octx.drawImage(clipImg, -cw / 2, -ch / 2, cw, ch);
      octx.restore();
    });

    // Draw Custom Text Overlay
    if (state.customText.trim()) {
      octx.save();
      octx.font = `900 ${state.textSize * 1.5}px system-ui, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      const textMetrics = octx.measureText(state.customText.trim());
      const textW = textMetrics.width;
      const textH = state.textSize * 1.8;
      const textPosY = cy + state.textY;

      if (state.textStyle === 'badge') {
        octx.fillStyle = state.textBgColor;
        octx.beginPath();
        octx.roundRect(cx - textW / 2 - 16, textPosY - textH / 2, textW + 32, textH, 12);
        octx.fill();
      } else if (state.textStyle === 'outline') {
        octx.strokeStyle = state.textBgColor === '#ffffff' ? '#0f172a' : '#ffffff';
        octx.lineWidth = 6;
        octx.strokeText(state.customText.trim(), cx, textPosY);
      }

      octx.fillStyle = state.textColor;
      octx.fillText(state.customText.trim(), cx, textPosY);
      octx.restore();
    }

    // Draw White Die-Cut Bleed Border on top
    if (state.borderWidth > 0 && state.shape !== 'original') {
      octx.save();
      octx.strokeStyle = state.borderColor;
      octx.lineWidth = state.borderWidth;
      octx.lineJoin = 'round';
      octx.lineCap = 'round';
      applyCropPath(octx, state.shape, cx, cy, 460 - state.borderWidth / 2, state.borderRadius);
      octx.stroke();
      octx.restore();
    }

    offscreen.toBlob(async (blob) => {
      if (!blob) {
        setIsProcessing(false);
        return;
      }

      const editedFileName = `custom_${file.name.replace(/\.[^/.]+$/, '')}.png`;
      const newFile = new File([blob], editedFileName, { type: 'image/png' });
      const newPreviewUrl = URL.createObjectURL(newFile);
      const newFileId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      await saveArtworkFile(newFileId, newFile);

      onSave({
        fileId: newFileId,
        name: editedFileName,
        size: blob.size,
        type: 'image/png',
        lastModified: Date.now(),
        previewUrl: newPreviewUrl,
      });

      setIsProcessing(false);
      onClose();
    }, 'image/png');
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `sticker-artwork-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  const selectedClipart = state.cliparts.find((c) => c.id === state.selectedClipartId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                {tObj('Sticker Studio & Design Editor', 'ស្ទូឌីយោកែច្នៃស្ទីគ័រ & កាត់តម្រឹម')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {tObj(
                  'Crop shape, add white die-cut borders, custom caps, text, and 18+ filters',
                  'កាត់រាងបេះដូង ផ្កាយ ដងខ្លួន បន្ថែមគែមស ដាក់មួក ថែមអក្សរ & តម្រងពណ៌ ១៨+'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 18+ Filter Presets Scroll Bar (No emojis, Lucide SVG icons only) */}
        <div className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200/80 dark:border-slate-800 px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 pl-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-brand-600" />
            <span>{tObj('18+ Filters:', 'តម្រងពណ៌៖')}</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {FILTER_PRESETS.map((preset) => {
              const isSelected = state.activeFilterPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectFilterPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20 scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  <span>{tObj(preset.name, preset.nameKm)}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Left Canvas Preview Area with Mockup Switcher */}
          <div className="lg:col-span-7 bg-slate-100/80 dark:bg-slate-950 p-4 sm:p-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 relative select-none">
            {/* Real-World Mockup Switcher Bar */}
            <div className="flex items-center gap-1 p-1 bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-3">
              {[
                { id: 'sticker', label: 'Sticker', labelKm: 'ស្ទីគ័រ', icon: Layers },
                { id: 'cup', label: 'Coffee Cup', labelKm: 'កែវកាហ្វេ', icon: Coffee },
                { id: 'laptop', label: 'Laptop Lid', labelKm: 'គម្របកុំព្យូទ័រ', icon: Laptop },
                { id: 'phone', label: 'Phone Case', labelKm: 'ខ្នងទូរស័ព្ទ', icon: Smartphone },
                { id: 'box', label: 'Package Box', labelKm: 'ប្រអប់ទំនិញ', icon: Package },
              ].map((mock) => {
                const isSelected = state.mockupView === mock.id;
                const IconComp = mock.icon;
                return (
                  <button
                    key={mock.id}
                    type="button"
                    onClick={() => setState((p) => ({ ...p, mockupView: mock.id as any }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25 scale-[1.02]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{tObj(mock.label, mock.labelKm)}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-300 dark:border-slate-700 max-w-[420px] max-h-[420px] aspect-square w-full">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full object-contain cursor-grab active:cursor-grabbing bg-slate-50 dark:bg-slate-900 touch-none"
              />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{tObj('Click & drag to reposition image or accessories', 'ចុចហើយទាញដើម្បីរំកិលរូបភាព ឬមួក')}</span>
            </p>
          </div>

          {/* Right Editing Controls Panel */}
          <div className="lg:col-span-5 flex flex-col p-4 sm:p-5 space-y-4 bg-white dark:bg-slate-900">
            {/* Tab Navigation (No emojis, Lucide SVG icons only) */}
            <div className="grid grid-cols-6 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('crop')}
                className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'crop'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Crop className="w-3.5 h-3.5" />
                <span className="text-[10px]">{tObj('Shape', 'រាង')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('border')}
                className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'border'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[10px]">{tObj('Border', 'គែមស')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overlays')}
                className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'overlays'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span className="text-[10px]">{tObj('Hats', 'មួក')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span className="text-[10px]">{tObj('Text', 'អក្សរ')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('filters')}
                className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'filters'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="text-[10px]">{tObj('Tune', 'ពណ៌')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('transform')}
                className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'transform'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[10px]">{tObj('Rotate', 'បង្វិល')}</span>
              </button>
            </div>

            {/* TAB 1: CROP SHAPES (Heart, Star, Body, Circle, Rounded, Hexagon, Stamp, Shield) */}
            {activeTab === 'crop' && (
              <div className="space-y-4 pt-1 flex-1 overflow-y-auto pr-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Crop className="w-3.5 h-3.5 text-brand-600" />
                      <span>{tObj('Sticker Die-Cut Cut Shape', 'ទម្រង់កាត់ស្ទីគ័រ (Die-Cut Shapes)')}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'original', label: 'Original Full', labelKm: 'រូបដើម', icon: Maximize2 },
                      { id: 'heart', label: 'Love Heart', labelKm: 'រាងបេះដូង', icon: Heart },
                      { id: 'star', label: '5-Point Star', labelKm: 'រាងផ្កាយ', icon: Star },
                      { id: 'body', label: 'Body Contour', labelKm: 'កាត់តាមដងខ្លួន', icon: User },
                      { id: 'circle', label: 'Round Circle', labelKm: 'រង្វង់មូល', icon: Circle },
                      { id: 'rounded', label: 'Rounded Rect', labelKm: 'ជ្រុងកោង', icon: Square },
                      { id: 'hexagon', label: 'Hexagon (6-side)', labelKm: 'រាង ៦ជ្រុង', icon: Hexagon },
                      { id: 'stamp', label: 'Scalloped Stamp', labelKm: 'រាងត្រា / ផ្កា', icon: Award },
                      { id: 'shield', label: 'Royal Shield', labelKm: 'រាងខែល VIP', icon: Shield },
                    ].map((shape) => {
                      const isSelected = state.shape === shape.id;
                      const IconComp = shape.icon;
                      return (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setState((p) => ({ ...p, shape: shape.id as CropShape }))}
                          className={`p-2.5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/60 ring-2 ring-brand-500/20 shadow-sm text-brand-700 dark:text-brand-300 font-extrabold'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <IconComp className="w-4 h-4 shrink-0 text-brand-600" />
                          <span className="text-xs truncate">{tObj(shape.label, shape.labelKm)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Corner Radius Slider for Rounded Shape */}
                {state.shape === 'rounded' && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                      <span>{tObj('Corner Radius', 'កម្រិតកោងជ្រុង')}</span>
                      <span>{state.borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={state.borderRadius}
                      onChange={(e) =>
                        setState((p) => ({ ...p, borderRadius: parseInt(e.target.value) }))
                      }
                      className="w-full accent-brand-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WHITE DIE-CUT BLEED BORDER ("redis with white") */}
            {activeTab === 'border' && (
              <div className="space-y-4 pt-1 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    <span>{tObj('White Die-Cut Bleed Border Width', 'កម្រាស់គែមស្ទីគ័រស (White Bleed Border)')}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { width: 0, label: 'None (0px)' },
                      { width: 6, label: 'Thin (6px)' },
                      { width: 12, label: 'Classic (12px)' },
                      { width: 18, label: 'Bold (18px)' },
                      { width: 26, label: 'Thick (26px)' },
                      { width: 34, label: 'Heavy (34px)' },
                    ].map((b) => (
                      <button
                        key={b.width}
                        type="button"
                        onClick={() => setState((p) => ({ ...p, borderWidth: b.width }))}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          state.borderWidth === b.width
                            ? 'border-brand-600 bg-brand-50/80 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>

                  {/* Range Slider for granular control */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{tObj('Fine Tune Border Thickness', 'កម្រាស់គែមលម្អិត')}</span>
                      <span>{state.borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="36"
                      value={state.borderWidth}
                      onChange={(e) =>
                        setState((p) => ({ ...p, borderWidth: parseInt(e.target.value) }))
                      }
                      className="w-full accent-brand-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Border Outline Color */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block mb-2">
                    {tObj('Border Color (Default: Pure White)', 'ពណ៌គែមស្ទីគ័រ')}
                  </label>
                  <div className="flex items-center gap-2.5">
                    {[
                      { color: '#ffffff', label: 'Pure White (ស្ទីគ័រស)' },
                      { color: '#e2e8f0', label: 'Silver Holographic' },
                      { color: '#f59e0b', label: 'Gold Metallic' },
                      { color: '#0284c7', label: 'Cyan Brand' },
                      { color: '#f43f5e', label: 'Hot Pink' },
                      { color: '#0f172a', label: 'Carbon Black' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setState((p) => ({ ...p, borderColor: c.color }))}
                        style={{ backgroundColor: c.color }}
                        className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm cursor-pointer ${
                          state.borderColor === c.color
                            ? 'scale-110 border-brand-600 ring-2 ring-brand-400/60'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* 3D Peelable Drop Shadow */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {tObj('Realistic 3D Sticker Shadow', 'ស្រមោល 3D បែបស្ទីគ័រពិត')}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {tObj('Adds realistic drop shadow depth for die-cut preview', 'បង្ហាញស្រមោលផុសឡើងស្អាត')}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.shadow}
                      onChange={(e) => setState((p) => ({ ...p, shadow: e.target.checked }))}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: CAPS, HATS & CLIPARTS */}
            {activeTab === 'overlays' && (
              <div className="space-y-4 pt-1 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-brand-600" />
                    <span>{tObj('Pick a Cap, Hat, Sunglasses or Badge:', 'រើសមួក វ៉ែនតា ឬតែមតុបតែង៖')}</span>
                  </label>

                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_CLIPARTS.map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => handleAddClipart(item.type)}
                        className="p-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800 transition-all flex flex-col items-center justify-center gap-1.5 group active:scale-95 cursor-pointer shadow-sm"
                        title={item.label}
                      >
                        <div
                          className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-8"
                          dangerouslySetInnerHTML={{ __html: CLIPART_SVGS[item.type] || '' }}
                        />
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate w-full text-center">
                          {tObj(item.label, item.labelKm)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Clipart Controls */}
                {selectedClipart && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
                        {tObj('Selected Accessory Controls', 'កែសម្រួលមួកដែលបានជ្រើស')}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveSelectedClipart}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{tObj('Remove', 'លុប')}</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                        <span>{tObj('Size / Scale', 'ទំហំមួក')}</span>
                        <span>{Math.round(selectedClipart.scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.4"
                        max="2.5"
                        step="0.05"
                        value={selectedClipart.scale}
                        onChange={(e) =>
                          handleUpdateSelectedClipart('scale', parseFloat(e.target.value))
                        }
                        className="w-full accent-brand-600 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                        <span>{tObj('Rotation', 'បង្វិលមួក')}</span>
                        <span>{selectedClipart.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={selectedClipart.rotation}
                        onChange={(e) =>
                          handleUpdateSelectedClipart('rotation', parseInt(e.target.value))
                        }
                        className="w-full accent-brand-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CUSTOM TEXT OVERLAY TOOL */}
            {activeTab === 'text' && (
              <div className="space-y-4 pt-1 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-brand-600" />
                    <span>{tObj('Custom Text / Slogan on Sticker', 'បន្ថែមអក្សរផ្ទាល់ខ្លួនលើស្ទីគ័រ')}</span>
                  </label>
                  <input
                    type="text"
                    value={state.customText}
                    onChange={(e) => setState((p) => ({ ...p, customText: e.target.value }))}
                    placeholder={tObj('e.g. RS Coffee, 012 345 678, VIP', 'ឧ. RS Coffee, 012 345 678, VIP...')}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {state.customText.trim() && (
                  <>
                    {/* Text Style */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {tObj('Text Badge Style', 'ទម្រង់អក្សរ')}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'badge', label: 'Pill Badge', labelKm: 'តែម Badge' },
                          { id: 'outline', label: 'Outlined', labelKm: 'មានគែម' },
                          { id: 'clean', label: 'Clean Text', labelKm: 'អក្សរទទេ' },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setState((p) => ({ ...p, textStyle: s.id as 'clean' | 'badge' | 'outline' }))}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              state.textStyle === s.id
                                ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {tObj(s.label, s.labelKm)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Size & Vertical Position */}
                    <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>{tObj('Font Size', 'ទំហំអក្សរ')}</span>
                          <span>{state.textSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="12"
                          max="40"
                          value={state.textSize}
                          onChange={(e) => setState((p) => ({ ...p, textSize: parseInt(e.target.value) }))}
                          className="w-full accent-brand-600 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>{tObj('Vertical Position (Y)', 'ទីតាំងលើក្រោម')}</span>
                          <span>{state.textY}</span>
                        </div>
                        <input
                          type="range"
                          min="-200"
                          max="220"
                          value={state.textY}
                          onChange={(e) => setState((p) => ({ ...p, textY: parseInt(e.target.value) }))}
                          className="w-full accent-brand-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 5: MANUAL COLOR TUNE */}
            {activeTab === 'filters' && (
              <div className="space-y-3 pt-1 flex-1 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <span>{tObj('Brightness', 'ពន្លឺ')}</span>
                    <span>{state.brightness > 0 ? `+${state.brightness}` : state.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    value={state.brightness}
                    onChange={(e) => setState((p) => ({ ...p, brightness: parseInt(e.target.value) }))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <span>{tObj('Contrast', 'កម្រិតដិត')}</span>
                    <span>{state.contrast > 0 ? `+${state.contrast}` : state.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    value={state.contrast}
                    onChange={(e) => setState((p) => ({ ...p, contrast: parseInt(e.target.value) }))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <span>{tObj('Color Saturation', 'កម្រិតពណ៌')}</span>
                    <span>{state.saturation > 0 ? `+${state.saturation}` : state.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={state.saturation}
                    onChange={(e) => setState((p) => ({ ...p, saturation: parseInt(e.target.value) }))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <span>{tObj('Hue Shift (Change Color)', 'ប្តូរពណ៌ Logo')}</span>
                    <span>{state.hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={state.hue}
                    onChange={(e) => setState((p) => ({ ...p, hue: parseInt(e.target.value) }))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 6: TRANSFORM & ROTATE */}
            {activeTab === 'transform' && (
              <div className="space-y-4 pt-1 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setState((p) => ({ ...p, rotation: (p.rotation - 90) % 360 }))}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-brand-600" />
                    <span>-90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setState((p) => ({ ...p, rotation: (p.rotation + 90) % 360 }))}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4 text-brand-600" />
                    <span>+90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setState((p) => ({ ...p, flipH: !p.flipH }))}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                      state.flipH
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/50 text-brand-700'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4 text-brand-600" />
                    <span>Flip H</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <span>{tObj('Zoom Scale', 'ពង្រីក/បង្រួម')}</span>
                    <span>{Math.round(state.zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={state.zoom}
                    onChange={(e) => setState((p) => ({ ...p, zoom: parseFloat(e.target.value) }))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Bottom Modal Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setState(defaultState)}
                className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{tObj('Reset All', 'កំណត់ឡើងវិញ')}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Download PNG to device"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-black text-xs shadow-md shadow-brand-600/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-75"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>
                    {isProcessing
                      ? tObj('Saving Artwork...', 'កំពុងរក្សាទុក...')
                      : tObj('Save & Apply Sticker', 'រក្សាទុក & ប្រើប្រាស់')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
