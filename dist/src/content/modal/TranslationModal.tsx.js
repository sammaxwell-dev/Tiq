import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/modal/TranslationModal.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--13cc1f75.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/vendor/react-refresh.js";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--13cc1f75.js"; const useState = __vite__cjsImport3_react["useState"]; const useEffect = __vite__cjsImport3_react["useEffect"]; const useRef = __vite__cjsImport3_react["useRef"];
import { X, Copy, ArrowRightLeft, Settings, Sparkles, Pin, PinOff, ChevronLeft } from "/vendor/.vite-deps-lucide-react.js__v--13cc1f75.js";
import { Button } from "/src/components/ui/Button.tsx.js";
import { Textarea } from "/src/components/ui/Textarea.tsx.js";
import { Select } from "/src/components/ui/Select.tsx.js";
import { Loader } from "/src/components/ui/Loader.tsx.js";
import SettingsTab from "/src/content/modal/SettingsTab.tsx.js";
import { cn } from "/src/lib/utils.ts.js";
import { storage } from "/src/lib/storage.ts.js";
const TranslationModal = ({ initialText, onClose, visible, initialTranslation }) => {
  _s();
  if (!visible) return null;
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 225, y: window.innerHeight / 4 });
  const [size, setSize] = useState({ width: 500, height: "auto" });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, currentX: 0, currentY: 0 });
  const resizeStart = useRef({ x: 0, width: 0, currentWidth: 0 });
  const modalRef = useRef(null);
  const [sourceText, setSourceText] = useState(initialText);
  const [targetText, setTargetText] = useState(initialTranslation || "");
  const [state, setState] = useState(initialTranslation ? "success" : "idle");
  const [targetLang, setTargetLang] = useState("ru");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [activeTab, setActiveTab] = useState("translate");
  useEffect(() => {
    if (!visible) {
      setTargetText("");
      setState("idle");
    }
  }, [visible]);
  useEffect(() => {
    storage.get().then((settings) => {
      setTargetLang(settings.targetLang);
      setShowBackdrop(settings.showBackdrop);
    });
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  useEffect(() => {
    if (!isPinned) {
      setSourceText(initialText);
      if (initialText && visible && !initialTranslation) {
        handleTranslate();
      }
    }
  }, [initialText, visible, initialTranslation]);
  const handleMouseDown = (e) => {
    if (e.target.closest("button, select, input, textarea, .resizer")) return;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
      currentX: position.x,
      currentY: position.y
    };
  };
  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      width: size.width,
      currentWidth: size.width
    };
  };
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && modalRef.current) {
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;
        modalRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        dragStartPos.current.currentX = newX;
        dragStartPos.current.currentY = newY;
      } else if (isResizing && modalRef.current) {
        const newWidth = Math.max(320, resizeStart.current.width + (e.clientX - resizeStart.current.x));
        modalRef.current.style.width = `${newWidth}px`;
        resizeStart.current.currentWidth = newWidth;
      }
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (typeof dragStartPos.current.currentX === "number") {
          setPosition({
            x: dragStartPos.current.currentX,
            y: dragStartPos.current.currentY
          });
        }
      }
      if (isResizing) {
        setIsResizing(false);
        if (typeof resizeStart.current.currentWidth === "number") {
          setSize((prev) => ({ ...prev, width: resizeStart.current.currentWidth }));
        }
      }
    };
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing]);
  const handleTranslate = async () => {
    setState("loading");
    try {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
        if (!chrome.runtime?.id) {
          setState("error");
          setTargetText("Extension reloading - please refresh the page");
          return;
        }
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("timeout")), 5e3);
        });
        const messagePromise = chrome.runtime.sendMessage({
          type: "TRANSLATE_REQUEST",
          payload: {
            text: sourceText,
            targetLang
          }
        });
        const response = await Promise.race([messagePromise, timeoutPromise]);
        if (!response) {
          setState("error");
          setTargetText("No response from background service");
          return;
        }
        if (response.success) {
          setTargetText(response.data);
          setState("success");
        } else {
          setState("error");
          const errorMsg = response.error || "";
          if (errorMsg.includes("API key") || errorMsg.includes("401")) {
            setTargetText("API key not configured - please open settings");
          } else if (errorMsg.includes("rate limit") || errorMsg.includes("429")) {
            setTargetText("Rate limit exceeded - please try again later");
          } else {
            setTargetText(`Translation error - ${errorMsg || "please check API key"}`);
          }
        }
      } else {
        setTimeout(() => {
          setTargetText("Simulated Translation (Playground): " + sourceText);
          setState("success");
        }, 1e3);
      }
    } catch (e) {
      console.error(e);
      setState("error");
      if (e?.message === "timeout") {
        setTargetText("Request timeout - please try again");
      } else {
        setTargetText("Failed to communicate with extension background");
      }
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(targetText);
  };
  const togglePin = () => {
    setIsPinned(!isPinned);
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    showBackdrop && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "fixed inset-0 z-[9999] bg-black/10 animate-in fade-in",
        onClick: onClose,
        style: { cursor: "default" }
      },
      void 0,
      false,
      {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
        lineNumber: 254,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        ref: modalRef,
        className: cn(
          "fixed z-[10000] flex flex-col font-sans text-foreground transition-shadow duration-300 animate-in fade-in zoom-in-95",
          "glass rounded-[2rem] overflow-hidden dark:bg-black/60 dark:border-white/10"
        ),
        style: {
          left: 0,
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: size.width,
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1), 0 0 20px -10px rgba(0,0,0,0.05)",
          willChange: isDragging ? "transform" : "auto"
        },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "flex items-center justify-between px-6 py-4 cursor-move select-none bg-white/30 dark:bg-black/20 backdrop-blur-md border-b border-white/10",
              onMouseDown: handleMouseDown,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  activeTab === "settings" ? /* @__PURE__ */ jsxDEV(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 -ml-2 rounded-full hover:bg-white/40 dark:hover:bg-white/10",
                      onClick: () => setActiveTab("translate"),
                      children: /* @__PURE__ */ jsxDEV(ChevronLeft, { size: 18 }, void 0, false, {
                        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                        lineNumber: 291,
                        columnNumber: 17
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                      lineNumber: 285,
                      columnNumber: 13
                    },
                    this
                  ) : /* @__PURE__ */ jsxDEV("div", { className: "p-1.5 bg-white/50 dark:bg-white/10 rounded-lg shadow-sm", children: /* @__PURE__ */ jsxDEV(Sparkles, { className: "w-4 h-4 text-blue-500 dark:text-blue-400" }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 295,
                    columnNumber: 17
                  }, this) }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 294,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-sm text-foreground/80 dark:text-white/90", children: activeTab === "settings" ? "Settings" : "Tippr AI" }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 298,
                    columnNumber: 13
                  }, this)
                ] }, void 0, true, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 283,
                  columnNumber: 11
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  activeTab === "translate" && /* @__PURE__ */ jsxDEV(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: cn("h-8 w-8 rounded-full hover:bg-white/40 dark:hover:bg-white/10", isPinned ? "text-blue-500" : "text-muted-foreground"),
                      onClick: togglePin,
                      title: isPinned ? "Unpin window" : "Pin window to keep open",
                      children: isPinned ? /* @__PURE__ */ jsxDEV(PinOff, { size: 16 }, void 0, false, {
                        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                        lineNumber: 312,
                        columnNumber: 29
                      }, this) : /* @__PURE__ */ jsxDEV(Pin, { size: 16 }, void 0, false, {
                        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                        lineNumber: 312,
                        columnNumber: 52
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                      lineNumber: 305,
                      columnNumber: 13
                    },
                    this
                  ),
                  activeTab === "translate" && /* @__PURE__ */ jsxDEV(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 rounded-full hover:bg-white/40 dark:hover:bg-white/10 text-muted-foreground",
                      onClick: () => setActiveTab("settings"),
                      children: /* @__PURE__ */ jsxDEV(Settings, { size: 16 }, void 0, false, {
                        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                        lineNumber: 322,
                        columnNumber: 17
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                      lineNumber: 316,
                      columnNumber: 13
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 rounded-full hover:bg-white/40 dark:hover:bg-white/10 text-muted-foreground", onClick: onClose, children: /* @__PURE__ */ jsxDEV(X, { size: 16 }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 326,
                    columnNumber: 15
                  }, this) }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 325,
                    columnNumber: 13
                  }, this)
                ] }, void 0, true, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 303,
                  columnNumber: 11
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
              lineNumber: 279,
              columnNumber: 9
            },
            this
          ),
          activeTab === "settings" ? /* @__PURE__ */ jsxDEV(SettingsTab, {}, void 0, false, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
            lineNumber: 332,
            columnNumber: 9
          }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "px-6 pt-4 pb-2 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxDEV(Select, { className: "h-9 bg-white/40 dark:bg-white/5 border-0 shadow-sm text-sm font-medium dark:text-white", children: [
                /* @__PURE__ */ jsxDEV("option", { value: "auto", children: "Detect Language" }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 338,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "en", children: "English" }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 339,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("option", { value: "ru", children: "Russian" }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 340,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                lineNumber: 337,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 shrink-0 rounded-full hover:bg-white/50 dark:hover:bg-white/10", children: /* @__PURE__ */ jsxDEV(ArrowRightLeft, { size: 14, className: "text-muted-foreground dark:text-white/70" }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                lineNumber: 344,
                columnNumber: 17
              }, this) }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                lineNumber: 343,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV(
                Select,
                {
                  className: "h-9 bg-white/40 dark:bg-white/5 border-0 shadow-sm text-sm font-medium dark:text-white",
                  value: targetLang,
                  onChange: (e) => setTargetLang(e.target.value),
                  children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "ru", children: "Russian" }, void 0, false, {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                      lineNumber: 352,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "en", children: "English" }, void 0, false, {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                      lineNumber: 353,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDEV("option", { value: "es", children: "Spanish" }, void 0, false, {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                      lineNumber: 354,
                      columnNumber: 17
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 347,
                  columnNumber: 15
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
              lineNumber: 336,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "p-6 space-y-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-medium text-muted-foreground ml-1 dark:text-white/60", children: "Original" }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 362,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Textarea,
                  {
                    value: sourceText,
                    onChange: (e) => setSourceText(e.target.value),
                    className: "min-h-[80px] bg-white/30 dark:bg-white/5 border-transparent focus:bg-white/60 dark:focus:bg-white/10 shadow-inner text-base dark:text-white dark:placeholder:text-white/30",
                    placeholder: "Enter text..."
                  },
                  void 0,
                  false,
                  {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 363,
                    columnNumber: 17
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                lineNumber: 361,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 relative", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-medium text-muted-foreground ml-1 dark:text-white/60", children: "Translation" }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 373,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: cn(
                  "relative min-h-[100px] p-4 rounded-xl transition-all duration-300",
                  "bg-blue-50/40 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30"
                ), children: state === "loading" ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center h-full py-4 space-y-3", children: [
                  /* @__PURE__ */ jsxDEV(Loader, { size: 24, className: "opacity-70 dark:text-blue-400" }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 380,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-blue-600/70 dark:text-blue-300/70 animate-pulse", children: "Polishing translation..." }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 381,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 379,
                  columnNumber: 17
                }, this) : state === "error" ? /* @__PURE__ */ jsxDEV("div", { className: "text-red-500 text-sm", children: "Something went wrong." }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 384,
                  columnNumber: 17
                }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-base text-foreground dark:text-white leading-relaxed selection:bg-blue-200/50 dark:selection:bg-blue-500/30", children: targetText || /* @__PURE__ */ jsxDEV("span", { className: "text-muted-foreground dark:text-white/40 italic opacity-50", children: "Translation will appear here..." }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 387,
                  columnNumber: 38
                }, this) }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 386,
                  columnNumber: 17
                }, this) }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 374,
                  columnNumber: 17
                }, this),
                state === "success" && /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-3 right-3 flex space-x-1", children: /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    variant: "secondary",
                    size: "icon",
                    className: "h-8 w-8 bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 shadow-sm backdrop-blur-sm",
                    onClick: handleCopy,
                    children: /* @__PURE__ */ jsxDEV(Copy, { size: 14, className: "text-foreground/70 dark:text-white/80" }, void 0, false, {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                      lineNumber: 400,
                      columnNumber: 23
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                    lineNumber: 394,
                    columnNumber: 21
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 393,
                  columnNumber: 15
                }, this)
              ] }, void 0, true, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                lineNumber: 372,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
              lineNumber: 359,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "px-6 py-4 bg-white/30 dark:bg-black/10 border-t border-white/10 flex justify-between items-center", children: [
              /* @__PURE__ */ jsxDEV(Button, { variant: "ghost", size: "sm", className: "text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white", onClick: () => setActiveTab("settings"), children: [
                /* @__PURE__ */ jsxDEV(Settings, { size: 14, className: "mr-2" }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 410,
                  columnNumber: 17
                }, this),
                " Settings"
              ] }, void 0, true, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                lineNumber: 409,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV(
                Button,
                {
                  onClick: handleTranslate,
                  disabled: state === "loading",
                  className: "bg-black/90 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-white/90 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl px-6",
                  children: state === "loading" ? "Translating..." : "Translate"
                },
                void 0,
                false,
                {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                  lineNumber: 413,
                  columnNumber: 15
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
              lineNumber: 408,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
            lineNumber: 334,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "resizer absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-50 hover:opacity-100 z-50 flex items-center justify-center",
              onMouseDown: handleResizeStart,
              children: /* @__PURE__ */ jsxDEV("svg", { width: "10", height: "10", viewBox: "0 0 6 6", className: "fill-gray-400 dark:fill-gray-600 pointer-events-none", children: /* @__PURE__ */ jsxDEV("path", { d: "M6 6V3L3 6H6ZM2 6L6 2V0L0 6H2Z" }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                lineNumber: 430,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
                lineNumber: 429,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
              lineNumber: 425,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
        lineNumber: 262,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx",
    lineNumber: 251,
    columnNumber: 5
  }, this);
};
_s(TranslationModal, "IktfEIdW3JZ6waFzqU6hA1/fFgA=");
_c = TranslationModal;
export default TranslationModal;
var _c;
$RefreshReg$(_c, "TranslationModal");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/TranslationModal.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
