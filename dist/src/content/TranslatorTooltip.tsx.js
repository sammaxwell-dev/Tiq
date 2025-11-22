import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/TranslatorTooltip.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--38734408.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--38734408.js"; const useState = __vite__cjsImport3_react["useState"]; const useEffect = __vite__cjsImport3_react["useEffect"]; const useRef = __vite__cjsImport3_react["useRef"];
import {
  Languages,
  ChevronDown,
  Sparkles,
  MessageSquareText,
  Briefcase,
  Coffee,
  Smile,
  Terminal,
  Zap
} from "/vendor/.vite-deps-lucide-react.js__v--38734408.js";
import { motion, AnimatePresence } from "/vendor/.vite-deps-framer-motion.js__v--38734408.js";
import { cn } from "/src/lib/utils.ts.js";
import { TONE_OPTIONS } from "/src/types/tone.ts.js";
const TONE_ICONS = {
  standard: MessageSquareText,
  formal: Briefcase,
  casual: Coffee,
  humorous: Smile,
  code: Terminal,
  tldr: Zap
};
const TranslatorTooltip = ({
  x,
  y,
  visible,
  selectedTone,
  onTranslate,
  onToneChange
}) => {
  _s();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tooltipRef = useRef(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);
  useEffect(() => {
    if (!visible) {
      setIsDropdownOpen(false);
    }
  }, [visible]);
  if (!visible) return null;
  const currentToneOption = TONE_OPTIONS.find((opt) => opt.value === selectedTone) || TONE_OPTIONS[0];
  const CurrentToneIcon = TONE_ICONS[selectedTone] || MessageSquareText;
  const isMobile = window.innerWidth < 640;
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleTranslateClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onTranslate("modal");
  };
  const handleInlineClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onTranslate("inline");
  };
  const handleToneToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleToneSelect = (tone) => {
    onToneChange(tone);
    setIsDropdownOpen(false);
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        ref: tooltipRef,
        className: cn(
          "fixed z-[9999] flex items-center p-1 bg-[#11111198] backdrop-blur-sm rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)]",
          "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out",
          "hover:shadow-2xl transition-all duration-300"
        ),
        style: {
          left: `${x}px`,
          top: `${y}px`,
          transform: "translateX(-50%) translateY(-100%) translateY(-16px)",
          pointerEvents: "auto"
        },
        onMouseDown: handleMouseDown,
        children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "hover:bg-white/10 text-white",
                "transition-all duration-200 ease-out",
                "active:scale-90",
                isMobile ? "w-12 h-12" : "w-10 h-10"
              ),
              onClick: handleInlineClick,
              title: "Replace inline",
              type: "button",
              children: /* @__PURE__ */ jsxDEV(Sparkles, { size: isMobile ? 20 : 18, strokeWidth: 2.5 }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                lineNumber: 157,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
              lineNumber: 145,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "w-px h-5 mx-1 bg-white/20" }, void 0, false, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
            lineNumber: 161,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: cn(
                "flex items-center gap-2 px-3 py-2 rounded-full",
                "hover:bg-white/10",
                "text-white",
                "transition-all duration-200 ease-out",
                "active:scale-95",
                isMobile ? "px-4 py-3" : "px-3 py-2"
              ),
              onClick: handleTranslateClick,
              title: `Translate (${currentToneOption.label})`,
              type: "button",
              children: [
                /* @__PURE__ */ jsxDEV(Languages, { size: isMobile ? 20 : 18, className: "text-white", strokeWidth: 2.5 }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                  lineNumber: 177,
                  columnNumber: 11
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "w-1 h-1 rounded-full bg-white/50" }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                    lineNumber: 179,
                    columnNumber: 13
                  }, this),
                  /* @__PURE__ */ jsxDEV(CurrentToneIcon, { size: 14, className: "text-white/80" }, void 0, false, {
                    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                    lineNumber: 180,
                    columnNumber: 13
                  }, this)
                ] }, void 0, true, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                  lineNumber: 178,
                  columnNumber: 11
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
              lineNumber: 164,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: cn(
                "flex items-center justify-center w-8 h-8 ml-0.5 rounded-full",
                "hover:bg-white/10",
                "text-white/80",
                "transition-all duration-200",
                "active:scale-90",
                isDropdownOpen && "bg-white/20 text-white",
                isMobile ? "w-10 h-10" : "w-8 h-8"
              ),
              onClick: handleToneToggle,
              title: "Select tone",
              type: "button",
              children: /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  animate: { rotate: isDropdownOpen ? 180 : 0 },
                  transition: { duration: 0.3, ease: "easeInOut" },
                  children: /* @__PURE__ */ jsxDEV(
                    ChevronDown,
                    {
                      size: isMobile ? 18 : 16,
                      strokeWidth: 2.5
                    },
                    void 0,
                    false,
                    {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                      lineNumber: 203,
                      columnNumber: 13
                    },
                    this
                  )
                },
                void 0,
                false,
                {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                  lineNumber: 199,
                  columnNumber: 11
                },
                this
              )
            },
            void 0,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
              lineNumber: 185,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "absolute left-1/2 -translate-x-1/2 top-full",
              style: { marginTop: "-1px" },
              children: /* @__PURE__ */ jsxDEV("svg", { width: "12", height: "6", viewBox: "0 0 12 6", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "fill-[#11111198] drop-shadow-sm", children: /* @__PURE__ */ jsxDEV("path", { d: "M6 6L0 0H12L6 6Z" }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                lineNumber: 216,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                lineNumber: 215,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
              lineNumber: 211,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
        lineNumber: 129,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: isDropdownOpen && /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        ref: dropdownRef,
        initial: { opacity: 0, x: 10, y: 10, filter: "blur(10px)" },
        animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: 10, y: 10, filter: "blur(10px)" },
        transition: {
          duration: 0.6,
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.1
        },
        className: "fixed z-[10000] flex flex-col items-end gap-2",
        style: {
          left: `${x}px`,
          top: `${y + 16}px`,
          // Position below tooltip
          transform: "translateX(-50%)",
          // Centered relative to tooltip
          x: "-50%",
          // Framer motion handles transform
          pointerEvents: "auto",
          width: "max-content"
        },
        children: TONE_OPTIONS.map((option, index) => {
          const Icon = TONE_ICONS[option.value] || MessageSquareText;
          const isSelected = selectedTone === option.value;
          return /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: 20 },
              transition: {
                duration: 0.3,
                delay: index * 0.05
              },
              className: "w-full flex justify-center",
              children: /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: cn(
                    "flex items-center gap-3 px-5 py-3 rounded-full",
                    "bg-[#11111198] backdrop-blur-sm",
                    "shadow-[0_0_20px_rgba(0,0,0,0.2)]",
                    "hover:bg-[#111111d1]",
                    "transition-all duration-200",
                    "text-white border-none",
                    isSelected && "ring-2 ring-white/20 bg-[#111111d1]"
                  ),
                  onClick: () => handleToneSelect(option.value),
                  type: "button",
                  children: [
                    /* @__PURE__ */ jsxDEV(Icon, { size: 18, strokeWidth: 2, className: "text-white" }, void 0, false, {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                      lineNumber: 275,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-medium text-white", children: option.label }, void 0, false, {
                      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                      lineNumber: 276,
                      columnNumber: 21
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
                  lineNumber: 262,
                  columnNumber: 19
                },
                this
              )
            },
            option.value,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
              lineNumber: 251,
              columnNumber: 15
            },
            this
          );
        })
      },
      void 0,
      false,
      {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
        lineNumber: 224,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
      lineNumber: 222,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx",
    lineNumber: 127,
    columnNumber: 5
  }, this);
};
_s(TranslatorTooltip, "c2tZm1svqLXmzN/Ys12vtn2o+4U=");
_c = TranslatorTooltip;
export default TranslatorTooltip;
var _c;
$RefreshReg$(_c, "TranslatorTooltip");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/dwhitewolf/Desktop/Tiq/src/content/TranslatorTooltip.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
