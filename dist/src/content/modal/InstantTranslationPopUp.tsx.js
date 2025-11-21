import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/modal/InstantTranslationPopUp.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--13cc1f75.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--13cc1f75.js"; const useState = __vite__cjsImport3_react["useState"]; const useEffect = __vite__cjsImport3_react["useEffect"]; const useRef = __vite__cjsImport3_react["useRef"];
import { X, Copy, Maximize2, Move } from "/vendor/.vite-deps-lucide-react.js__v--13cc1f75.js";
import { Button } from "/src/components/ui/Button.tsx.js";
import { cn } from "/src/lib/utils.ts.js";
export const InstantTranslationPopUp = ({
  translation,
  position,
  onClose,
  onCopy,
  onOpenModal
}) => {
  _s();
  const popupRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, currentX: 0, currentY: 0 });
  useEffect(() => {
    setIsVisible(true);
    const popupWidth = 320;
    const popupHeight = 200;
    const padding = 16;
    let adjustedX = position.x;
    let adjustedY = position.y;
    if (adjustedX + popupWidth > window.innerWidth - padding) {
      adjustedX = window.innerWidth - popupWidth - padding;
    }
    if (adjustedX < padding) {
      adjustedX = padding;
    }
    if (adjustedY + popupHeight > window.innerHeight - padding) {
      adjustedY = position.y - popupHeight - 32;
    }
    if (adjustedY < padding) {
      adjustedY = padding;
    }
    setCurrentPosition({ x: adjustedX, y: adjustedY });
  }, [position]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) && !isDragging) {
        onClose();
      }
    };
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isVisible, onClose, isDragging]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && popupRef.current) {
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;
        popupRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        dragStartPos.current.currentX = newX;
        dragStartPos.current.currentY = newY;
      }
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (typeof dragStartPos.current.currentX === "number") {
          setCurrentPosition({
            x: dragStartPos.current.currentX,
            y: dragStartPos.current.currentY
          });
        }
      }
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
      currentX: currentPosition.x,
      currentY: currentPosition.y
    };
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      onCopy(translation);
    } catch (err) {
      console.error("Failed to copy translation:", err);
    }
  };
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      ref: popupRef,
      className: cn(
        "fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[320px] max-w-[400px] select-none",
        !isDragging && "transition-all duration-200 ease-in-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        isDragging ? "cursor-move" : "cursor-default"
      ),
      style: {
        left: 0,
        top: 0,
        transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
        willChange: isDragging ? "transform" : "auto"
      },
      onMouseDown: handleMouseDown,
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(Move, { className: "h-3 w-3 text-gray-400" }, void 0, false, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
              lineNumber: 176,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-medium text-gray-700", children: "Translation" }, void 0, false, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
              lineNumber: 177,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
            lineNumber: 175,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: onClose,
              className: "h-6 w-6 p-0 text-gray-500 hover:text-gray-700",
              children: /* @__PURE__ */ jsxDEV(X, { className: "h-3 w-3" }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
                lineNumber: 187,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
              lineNumber: 181,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
          lineNumber: 174,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mb-4 max-h-32 overflow-y-auto", children: /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-900 leading-relaxed", children: translation }, void 0, false, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
          lineNumber: 193,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
          lineNumber: 192,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleCopy,
              className: "flex-1 text-xs",
              children: [
                /* @__PURE__ */ jsxDEV(Copy, { className: "h-3 w-3 mr-1" }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
                  lineNumber: 206,
                  columnNumber: 11
                }, this),
                "Copy"
              ]
            },
            void 0,
            true,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
              lineNumber: 200,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onOpenModal,
              className: "flex-1 text-xs",
              children: [
                /* @__PURE__ */ jsxDEV(Maximize2, { className: "h-3 w-3 mr-1" }, void 0, false, {
                  fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
                  lineNumber: 216,
                  columnNumber: 11
                }, this),
                "Full"
              ]
            },
            void 0,
            true,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
              lineNumber: 210,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
          lineNumber: 199,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx",
      lineNumber: 155,
      columnNumber: 5
    },
    this
  );
};
_s(InstantTranslationPopUp, "3gCTwid0H2K0yXPTCDwOg/FhcKc=");
_c = InstantTranslationPopUp;
var _c;
$RefreshReg$(_c, "InstantTranslationPopUp");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/InstantTranslationPopUp.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
