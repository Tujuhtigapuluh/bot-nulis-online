import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import {
  Type, Settings, Eraser, FileText,
  Plus, Trash2, Maximize, X, Download
} from "lucide-react";
import "./App.css";

declare global {
  interface Window {
    katex: any;
  }
}

// --- KONSTANTA KERTAS FOLIO ---
const PAPER_WIDTH = 794;
const PAPER_HEIGHT = 1224;
const LINE_HEIGHT_DEFAULT = 32;
const MARGIN_TOP_DEFAULT = 110;
const MARGIN_LEFT_DEFAULT = 140;

// --- COMPONENTS ---

interface MathRendererProps {
  latex: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  // TAMBAHAN: Tingkat "kekacauan" tulisan tangan (0-1)
  roughness?: number;
}

function MathRenderer({
  latex,
  color,
  fontSize,
  fontFamily,
  lineHeight,
  roughness = 0.3
}: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.katex && containerRef.current) {
      try {
        window.katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: false,
          strict: false,
          trust: true,
        });
      } catch (e) {
        console.error("KaTeX error:", e);
      }
    }
  }, [latex, fontFamily, fontSize]);

  const baselineShift = fontSize * 0.12;

  // STYLE UNTUK EFEK TULISAN TANGAN PADA KATEX
  const handwrittenMathStyles: React.CSSProperties = {
    color,
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily, // Font tulisan tangan!
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "baseline",
    transform: `translateY(${baselineShift}px)`,
    lineHeight: `${lineHeight}px`,
    height: `${lineHeight}px`,
    // EFEK TULISAN TANGAN
    position: "relative",
    // Variasi rotasi kecil untuk setiap math element
    rotate: `${(Math.random() - 0.5) * roughness * 4}deg`,
    // Slight scale variation
    scale: `${1 + (Math.random() - 0.5) * roughness * 0.05}`,
  };

  return (
    <span
      ref={containerRef}
      data-latex={latex}
      className="math-handwritten"
      style={handwrittenMathStyles}
    />
  );
}

interface ShapeRendererProps {
  type: string;
  color: string;
  size?: number;
  lineHeight?: number;
  roughness?: number;
}

function ShapeRenderer({
  type,
  color,
  size = 60,
  lineHeight = 32,
  roughness = 2
}: ShapeRendererProps) {
  const centerOffset = (lineHeight - size) / 2;
  
  // Generate random path variations untuk efek "gambar tangan"
  const wobble = (val: number) => val + (Math.random() - 0.5) * roughness;
  
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    style: {
      marginTop: Math.max(0, centerOffset),
      display: "block",
      // Efek gambar tangan: stroke tidak perfect
      filter: "url(#roughPaper)",
    }
  };

  // Triangle dengan sudut tidak sempurna
  if (type === "triangle") {
    const p1 = `${wobble(50)},${wobble(15)}`;
    const p2 = `${wobble(85)},${wobble(85)}`;
    const p3 = `${wobble(15)},${wobble(85)}`;
    return (
      <svg {...commonProps}>
        <defs>
          <filter id="roughPaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
        <path
          d={`M ${p1} L ${p2} L ${p3} Z`}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          // Efek garis tidak lurus sempurna
          style={{
            strokeDasharray: "none",
            filter: "url(#roughPaper)",
          }}
        />
      </svg>
    );
  }
  
  // Circle dengan sedikit oval/irregular
  if (type === "circle") {
    return (
      <svg {...commonProps}>
        <defs>
          <filter id="roughPaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
        <ellipse
          cx="50"
          cy="50"
          rx={wobble(35)}
          ry={wobble(35)}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          style={{ filter: "url(#roughPaper)" }}
        />
      </svg>
    );
  }
  
  // Square dengan sudut sedikit tidak sempurna
  if (type === "square") {
    const x = wobble(20);
    const y = wobble(20);
    const w = wobble(60);
    const h = wobble(60);
    return (
      <svg {...commonProps}>
        <defs>
          <filter id="roughPaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          // Slight rotation untuk efek gambar tangan
          transform={`rotate(${(Math.random() - 0.5) * 2}, 50, 50)`}
          style={{ filter: "url(#roughPaper)" }}
        />
      </svg>
    );
  }
  return null;
}

interface IdentityField {
  id: string;
  label: string;
  value: string;
}

// --- MAIN APP ---

export default function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState(
    "Contoh soal tulisan tangan:\n\nJika $$\\frac{1}{2}$$ + $$\\frac{1}{4}$$ = $$\\frac{3}{4}$$\n\nMaka $$\\sqrt{\\frac{9}{16}}$$ = $$\\frac{3}{4}$$\n\nRumus: x$$^2$$ + y$$^2$$ = z$$^2$$\n\nIntegral: $$\\int_{0}^{1} x^2 dx$$ = $$\\frac{1}{3}$$\n\nLimit: $$\\lim_{x \\to 0} \\frac{\\sin x}{x}$$ = 1"
  );

  const [fontFamily, setFontFamily] = useState("Kalam");
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(LINE_HEIGHT_DEFAULT);
  const [inkColor, setInkColor] = useState("#1a237e");
  
  // TAMBAHAN: Tingkat kekasaran tulisan (handwriting effect)
  const [handwritingRoughness, setHandwritingRoughness] = useState(0.4);

  const [marginTop, setMarginTop] = useState(MARGIN_TOP_DEFAULT);
  const [marginBottom] = useState(70);
  const [paddingLeft, setPaddingLeft] = useState(MARGIN_LEFT_DEFAULT);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scaleProps, setScaleProps] = useState(1);
  const [showMarginLine, setShowMarginLine] = useState(true);
  const [lineColor, setLineColor] = useState("#64748b");

  const [identities, setIdentities] = useState<IdentityField[]>([
    { id: "1", label: "Nama", value: "" },
    { id: "2", label: "NIM/NPM", value: "" },
    { id: "3", label: "Mata Kuliah", value: "" },
    { id: "4", label: "Kelas", value: "" },
  ]);

  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFullscreen) {
      const updateScale = () => {
        const availableHeight = window.innerHeight - 120;
        const newScale = Math.min(availableHeight / PAPER_HEIGHT, 1);
        setScaleProps(newScale);
      };
      updateScale();
      window.addEventListener("resize", updateScale);
      return () => window.removeEventListener("resize", updateScale);
    } else {
      setScaleProps(1);
    }
  }, [isFullscreen]);

  const addIdentityField = () => {
    const newId = crypto.randomUUID();
    setIdentities([...identities, { id: newId, label: "Label Baru", value: "" }]);
  };

  const removeIdentityField = (id: string) => {
    setIdentities(identities.filter((item) => item.id !== id));
  };

  const updateIdentity = (id: string, field: "label" | "value", newValue: string) => {
    setIdentities(
      identities.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const insertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    
    const newValue = currentValue.substring(0, start) + symbol + currentValue.substring(end);
    setText(newValue);
    
    const newCursorPos = start + symbol.length;
    
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  const handleDownload = async () => {
    if (!paperRef.current) return;
    setIsGenerating(true);

    try {
      await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 800));

      const originalElement = paperRef.current;
      const clone = originalElement.cloneNode(true) as HTMLDivElement;

      clone.style.position = "fixed";
      clone.style.top = "-9999px";
      clone.style.left = "-9999px";
      clone.style.width = `${PAPER_WIDTH}px`;
      clone.style.height = `${PAPER_HEIGHT}px`;

      document.body.appendChild(clone);

      const allElements = clone.querySelectorAll("*");
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlEl);
        const colorProps = [
          "color", "backgroundColor", "borderColor",
          "borderTopColor", "borderRightColor",
          "borderBottomColor", "borderLeftColor"
        ];

        colorProps.forEach((prop) => {
          const value = computedStyle.getPropertyValue(prop);
          if (value.includes("oklch")) {
            if (prop.includes("background")) {
              htmlEl.style.backgroundColor = "#faf8f2";
            } else {
              htmlEl.style.color = inkColor;
            }
          }
        });
      });

      const mathElements = clone.querySelectorAll("[data-latex]");
      mathElements.forEach((el) => {
        const span = el as HTMLSpanElement;
        const latex = span.dataset.latex;
        if (window.katex && latex) {
          try {
            window.katex.render(latex, span, {
              throwOnError: false,
              displayMode: false,
              strict: false,
              trust: true,
            });
          } catch (e) {
            console.error("KaTeX render error:", e);
          }
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#faf8f2",
        logging: false,
        width: PAPER_WIDTH,
        height: PAPER_HEIGHT,
      });

      document.body.removeChild(clone);

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `Tugas-Folio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal membuat gambar: " + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const lineCount = Math.floor((PAPER_HEIGHT - marginTop - marginBottom) / lineHeight);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-800">
      {!isFullscreen && (
        <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Bot Nulis Online</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                Tulisan tangan - Text to Handwriting
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-md active:scale-95"
          >
            <Maximize size={18} /> Pratinjau Kertas Full
          </button>
        </header>
      )}

      <main className={`flex-1 max-w-[1600px] w-full mx-auto ${isFullscreen ? "p-0" : "p-6"} grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-80px)]`}>

        {!isFullscreen && (
          <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 pb-20 panel-scroll">

            {/* EDITOR TEKS */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <label className="flex items-center gap-2 font-bold text-gray-700">
                  <Type size={18} /> Konten Tugas
                </label>
                <button
                  onClick={() => setText("")}
                  className="text-xs text-red-500 hover:bg-red-50 p-1 px-2 rounded"
                >
                  <Eraser size={14} />
                </button>
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {[
                  { label: "Pecahan", value: "$$\\frac{a}{b}$$", display: "a/b" },
                  { label: "Akar", value: "$$\\sqrt{x}$$", display: "√x" },
                  { label: "Pangkat", value: "$$x^2$$", display: "x²" },
                  { label: "Subskrip", value: "$$x_1$$", display: "x₁" },
                  { label: "Limit", value: "$$\\lim_{x \\to 0}$$", display: "lim" },
                  { label: "Sigma", value: "$$\\sum_{i=1}^{n}$$", display: "Σ" },
                  { label: "Integral", value: "$$\\int_{a}^{b}$$", display: "∫" },
                  { label: "±", value: "±", display: "±" },
                  { label: "×", value: "×", display: "×" },
                  { label: "÷", value: "÷", display: "÷" },
                  { label: "≠", value: "≠", display: "≠" },
                  { label: "≤", value: "≤", display: "≤" },
                  { label: "≥", value: "≥", display: "≥" },
                  { label: "∞", value: "∞", display: "∞" },
                  { label: "°", value: "°", display: "°" },
                  { label: "π", value: "π", display: "π" },
                  { label: "θ", value: "θ", display: "θ" },
                  { label: "α", value: "α", display: "α" },
                  { label: "β", value: "β", display: "β" },
                  { label: "γ", value: "γ", display: "γ" },
                  { label: "Δ", value: "Δ", display: "Δ" },
                ].map((sym, i) => (
                  <button
                    key={i}
                    onClick={() => insertSymbol(sym.value)}
                    className="px-2 py-1.5 text-xs bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded border border-gray-200 hover:border-blue-300 font-mono transition-colors"
                    title={sym.label}
                  >
                    {sym.display}
                  </button>
                ))}
              </div>

              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-44 p-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed font-mono"
                placeholder="Tuliskan isi tugas di sini... Gunakan $$...$$ untuk rumus"
              />
            </section>

            {/* EDITOR IDENTITAS */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-2 font-bold text-gray-700">
                  <Settings size={18} /> Identitas Header
                </label>
                <button
                  onClick={addIdentityField}
                  className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-200 flex items-center gap-1 hover:bg-blue-100"
                >
                  <Plus size={12} /> Tambah
                </button>
              </div>

              <div className="space-y-3">
                {identities.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center group">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateIdentity(item.id, "label", e.target.value)}
                      placeholder="Label"
                      className="w-1/3 text-[11px] p-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 outline-none font-bold"
                    />
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateIdentity(item.id, "value", e.target.value)}
                      placeholder="Isi data..."
                      className="w-full text-[11px] p-2 border border-gray-200 rounded-lg focus:border-blue-400 outline-none"
                    />
                    <button
                      onClick={() => removeIdentityField(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* FORMATTING TOOLS */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase mb-3 block">
                  Font Tulis Tangan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Kalam", "Caveat", "Indie Flower", "Patrick Hand", "Shadows Into Light", "Coming Soon"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFontFamily(f)}
                      style={{ fontFamily: f }}
                      className={`p-2.5 border rounded-xl text-base transition-all ${fontFamily === f ? "bg-blue-50 border-blue-500 text-blue-600 shadow-inner" : "bg-white hover:border-gray-300"}`}
                    >
                      {f.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-gray-500">
                    <span>Ukuran Font</span>
                    <span>{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="28"
                    value={fontSize}
                    onChange={(e) => setFontSize(+e.target.value)}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-gray-500">
                    <span>Jarak Baris</span>
                    <span>{lineHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="48"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(+e.target.value)}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* TAMBAHAN: Slider untuk tingkat "kekacauan" tulisan */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-gray-500">
                    <span>Gaya Tulisan Tangan</span>
                    <span>{Math.round(handwritingRoughness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={handwritingRoughness * 100}
                    onChange={(e) => setHandwritingRoughness(+e.target.value / 100)}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Tingkatkan untuk efek tulisan lebih "tidak rapi"
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-gray-500">
                    <span>Margin Atas</span>
                    <span>{marginTop}px</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="120"
                    value={marginTop}
                    onChange={(e) => setMarginTop(+e.target.value)}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-gray-500">
                    <span>Margin Kiri</span>
                    <span>{paddingLeft}px</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="120"
                    value={paddingLeft}
                    onChange={(e) => setPaddingLeft(+e.target.value)}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Tampilkan Margin Kiri</span>
                  <button
                    onClick={() => setShowMarginLine(!showMarginLine)}
                    className={`w-10 h-5 rounded-full transition-colors ${showMarginLine ? "bg-blue-500" : "bg-gray-300"}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${showMarginLine ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 mb-2">Warna Tinta</div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      "#1a237e", "#0d47a1", "#1b1b1b", "#0a3d62", "#004d40", "#991b1b",
                    ].map((c) => (
                      <button
                        key={c}
                        onClick={() => setInkColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${inkColor === c ? "border-blue-400 scale-125 ring-2 ring-blue-200" : "border-transparent hover:scale-110"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 mb-2">Warna Garis Kertas</div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { color: "#1e3a8a", label: "Biru Tua" },
                      { color: "#000000", label: "Hitam" },
                      { color: "#dc2626", label: "Merah" },
                      { color: "#16a34a", label: "Hijau" },
                      { color: "#9333ea", label: "Ungu" },
                    ].map((item) => (
                      <button
                        key={item.color}
                        onClick={() => setLineColor(item.color)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${lineColor === item.color ? "border-blue-400 scale-125 ring-2 ring-blue-200" : "border-gray-200 hover:scale-110"}`}
                        style={{ backgroundColor: item.color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PREVIEW KERTAS FOLIO */}
        <div
          className={
            isFullscreen
              ? "fixed inset-0 z-50 bg-gray-900 overflow-y-auto flex flex-col items-center pt-24 pb-12"
              : "lg:col-span-8 bg-gray-300/40 rounded-3xl p-8 overflow-auto flex justify-center shadow-inner"
          }
        >
          {isFullscreen && (
            <div className="fixed top-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-2xl flex items-center gap-6 z-50 shadow-2xl">
              <div className="text-sm">
                Potong Manual: <br />
                <b className="text-yellow-300">Win+Shift+S</b>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Download size={18} /> {isGenerating ? "Menyimpan..." : "Download (PNG)"}
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-transform active:scale-95"
              >
                <X size={18} /> Tutup
              </button>
            </div>
          )}

          <div
            style={{
              transform: isFullscreen ? `scale(${scaleProps})` : "none",
              transformOrigin: "center top",
              transition: "transform 0.2s",
            }}
          >
            <div
              ref={paperRef}
              className="relative"
              style={{
                width: `${PAPER_WIDTH}px`,
                height: `${PAPER_HEIGHT}px`,
                backgroundColor: "#faf8f2",
                boxShadow: isFullscreen
                  ? "0 20px 60px rgba(0,0,0,0.5)"
                  : "0 4px 30px rgba(0,0,0,0.15)",
                overflow: "hidden",
              }}
            >
              {/* SVG GARIS KERTAS */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                  pointerEvents: "none"
                }}
              >
                {showMarginLine && (
                  <>
                    <line x1={paddingLeft - 20} y1="0" x2={paddingLeft - 20} y2={PAPER_HEIGHT} stroke="#b93b6e" strokeWidth="1.5" opacity="0.8" />
                    <line x1={paddingLeft - 24} y1="0" x2={paddingLeft - 24} y2={PAPER_HEIGHT} stroke="#b93b6e" strokeWidth="0.8" opacity="0.6" />
                  </>
                )}
                <line x1="0" y1={marginTop} x2={PAPER_WIDTH} y2={marginTop} stroke="#b93b6e" strokeWidth="1.5" opacity="0.8" />
                <line x1="0" y1={marginTop - 4} x2={PAPER_WIDTH} y2={marginTop - 4} stroke="#b93b6e" strokeWidth="0.8" opacity="0.6" />
                {Array.from({ length: 15 }).map((_, i) => (
                  <line key={`tick-${i}`} x1={paddingLeft + 30 + i * 40} y1={marginTop - 6} x2={paddingLeft + 30 + i * 40} y2={marginTop} stroke="#b93b6e" strokeWidth="1" opacity="0.6" />
                ))}
                {Array.from({ length: lineCount }).map((_, i) => {
                  const y = marginTop + (i + 1) * lineHeight;
                  if (y > PAPER_HEIGHT - marginBottom) return null;
                  return <line key={`line-${i}`} x1="0" y1={y} x2={PAPER_WIDTH} y2={y} stroke={lineColor} strokeWidth="1" opacity="0.5" />;
                })}
                <g transform={`translate(${PAPER_WIDTH - 220}, 30)`} stroke="#b93b6e" opacity="0.8">
                  <rect x="0" y="0" width="180" height="50" fill="none" strokeWidth="1" />
                  <line x1="0" y1="25" x2="120" y2="25" strokeWidth="1" />
                  <line x1="120" y1="0" x2="120" y2="50" strokeWidth="1" />
                  <text x="5" y="16" fontSize="10" fill="#b93b6e" stroke="none" fontFamily="sans-serif">Page No.</text>
                  <line x1="55" y1="16" x2="115" y2="16" stroke="#b93b6e" strokeWidth="0.5" strokeDasharray="1 2" />
                  <text x="5" y="41" fontSize="10" fill="#b93b6e" stroke="none" fontFamily="sans-serif">Date</text>
                  <line x1="35" y1="41" x2="115" y2="41" stroke="#b93b6e" strokeWidth="0.5" strokeDasharray="1 2" />
                  <g transform="translate(150, 25)">
                    <text x="0" y="5" fontSize="30" fill="#b93b6e" stroke="none" fontFamily="serif" fontWeight="bold" textAnchor="middle" opacity="0.7">A</text>
                    <text x="-8" y="5" fontSize="30" fill="#b93b6e" stroke="none" fontFamily="serif" fontWeight="bold" textAnchor="middle" opacity="0.5">A</text>
                    <rect x="-20" y="-18" width="40" height="34" fill="none" strokeWidth="1" />
                    <text x="0" y="22" fontSize="5" fill="#b93b6e" stroke="none" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="0.2">SARASWATI</text>
                  </g>
                </g>
              </svg>

              <div style={{ position: "absolute", bottom: "20px", left: "40px", width: "35px", height: "35px", border: `1.5px solid ${lineColor}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: "bold", color: lineColor, opacity: 0.3, zIndex: 5, transform: "rotate(-10deg)" }}>
                SiDU
              </div>

              {/* AREA HEADER IDENTITAS */}
              <div style={{ position: "relative", zIndex: 2, height: `${marginTop}px`, padding: `20px 40px 10px ${paddingLeft}px`, backgroundColor: "transparent" }}>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {identities.map((item) => (
                    <div key={item.id} className="flex gap-2 items-baseline" style={{ fontFamily, fontSize: `${fontSize * 0.85}px`, color: inkColor }}>
                      <span className="opacity-60 whitespace-nowrap font-semibold">{item.label}:</span>
                      <span className="flex-1 px-1 border-b-2 border-dotted border-gray-400" style={{ minWidth: "80px", color: inkColor }}>{item.value || ""}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AREA KONTEN UTAMA */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  paddingLeft: `${paddingLeft}px`,
                  paddingRight: "40px",
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: `${lineHeight}px`,
                  color: inkColor,
                  backgroundColor: "transparent",
                }}
              >
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    verticalAlign: "baseline",
                    lineHeight: `${lineHeight}px`,
                  }}
                >
                  {text.split(/(\$\$.*?\$\$|\[shape:.*?\])/g).map((part, i) => {
                    if (part.startsWith("$$") && part.endsWith("$$")) {
                      return (
                        <MathRenderer
                          key={`math-${i}`}
                          latex={part.slice(2, -2)}
                          color={inkColor}
                          fontSize={fontSize}
                          fontFamily={fontFamily}
                          lineHeight={lineHeight}
                          roughness={handwritingRoughness}
                        />
                      );
                    }
                    if (part.startsWith("[shape:") && part.endsWith("]")) {
                      return (
                        <ShapeRenderer
                          key={`shape-${i}`}
                          type={part.slice(7, -1)}
                          color={inkColor}
                          size={lineHeight * 1.2}
                          lineHeight={lineHeight}
                          roughness={handwritingRoughness * 3}
                        />
                      );
                    }
                    return (
                      <span
                        key={`text-${i}`}
                        style={{
                          fontFamily: fontFamily,
                          fontSize: `${fontSize}px`,
                          lineHeight: `${lineHeight}px`,
                          color: inkColor,
                          verticalAlign: "baseline",
                          // EFEK TULISAN TANGAN: variasi rotasi kecil
                          transform: `rotate(${(Math.random() - 0.5) * handwritingRoughness * 2}deg)`,
                          display: "inline-block",
                        }}
                      >
                        {part}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${marginBottom}px`, backgroundColor: "#faf8f2", zIndex: 2 }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}