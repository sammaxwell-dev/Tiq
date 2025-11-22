import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/ContentApp.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--13cc1f75.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/dwhitewolf/Desktop/Tiq/src/content/ContentApp.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--13cc1f75.js"; const useState = __vite__cjsImport3_react["useState"]; const useEffect = __vite__cjsImport3_react["useEffect"]; const useRef = __vite__cjsImport3_react["useRef"];
import TranslatorTooltip from "/src/content/TranslatorTooltip.tsx.js";
import TranslationModal from "/src/content/modal/TranslationModal.tsx.js";
import { InstantTranslationPopUp } from "/src/content/modal/InstantTranslationPopUp.tsx.js";
import { storage } from "/src/lib/storage.ts.js";
import { performInlineReplace } from "/src/lib/inlineReplace.ts.js";
const ContentApp = () => {
  _s();
  const [selection, setSelection] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInstantPopupVisible, setIsInstantPopupVisible] = useState(false);
  const [tooltipClicked, setTooltipClicked] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [instantTranslation, setInstantTranslation] = useState(false);
  const [selectedTone, setSelectedTone] = useState("standard");
  const [initialTranslation, setInitialTranslation] = useState(void 0);
  const timeoutRef = useRef(null);
  const isSelectingRef = useRef(false);
  useEffect(() => {
    storage.get().then((settings) => {
      setInstantTranslation(settings.instantTranslation);
      if (settings.translationTone) {
        setSelectedTone(settings.translationTone);
      }
    });
  }, []);
  useEffect(() => {
    const handleMouseDown = () => {
      isSelectingRef.current = true;
      setIsTooltipVisible(false);
    };
    const handleMouseUp = () => {
      isSelectingRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleSelectionChange();
      }, 50);
    };
    const handleKeyUp = () => {
      if (!isSelectingRef.current) {
        handleSelectionChange();
      }
    };
    const handleSelectionChange = () => {
      if (isSelectingRef.current || isModalVisible || isInstantPopupVisible || tooltipClicked) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        setIsTooltipVisible(false);
        setSelection(null);
        return;
      }
      const text = sel.toString().trim();
      if (text.length > 0) {
        try {
          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
          if (!isVisible) {
            setIsTooltipVisible(false);
            return;
          }
          setSelection({ text, rect });
          const x = rect.left + rect.width / 2;
          const y = rect.top;
          setTooltipPos({ x, y });
          console.log("Setting tooltip visible at position:", { x, y });
          setIsTooltipVisible(true);
        } catch (error) {
          console.error("Error positioning tooltip:", error);
          setIsTooltipVisible(false);
        }
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isModalVisible, isInstantPopupVisible, tooltipClicked]);
  const handleTranslate = async (mode) => {
    console.log("handleTranslate called", { mode, selection, instantTranslation, selectedTone });
    if (!selection) {
      console.log("No selection, returning");
      return;
    }
    setIsTooltipVisible(false);
    setTooltipClicked(true);
    if (mode === "inline") {
      await handleInlineTranslation();
    } else {
      await handleModalTranslation();
    }
  };
  const handleModalTranslation = async () => {
    if (instantTranslation) {
      try {
        if (!chrome.runtime?.id) {
          setInitialTranslation("Extension reloading, please refresh the page");
          setIsModalVisible(true);
          return;
        }
        const settings = await storage.get();
        const messagePromise = chrome.runtime.sendMessage({
          type: "TRANSLATE_REQUEST",
          payload: {
            text: selection.text,
            targetLang: settings.targetLang,
            tone: selectedTone
          }
        });
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout")), 3e4);
        });
        const response = await Promise.race([messagePromise, timeoutPromise]);
        if (response && response.success) {
          setInitialTranslation(response.data);
          setIsInstantPopupVisible(true);
        } else {
          setInitialTranslation(response?.error || "Translation failed");
          setIsModalVisible(true);
        }
      } catch (error) {
        console.error("Translation request error:", error);
        if (error.message === "Request timeout") {
          setInitialTranslation("Translation request timed out. Please try again.");
        } else if (error.message?.includes("Extension context invalidated")) {
          setInitialTranslation("Extension reloaded. Please refresh the page and try again.");
        } else {
          setInitialTranslation("Failed to communicate with extension. Please try again.");
        }
        setIsModalVisible(true);
      }
    } else {
      setInitialTranslation(void 0);
      setIsModalVisible(true);
    }
  };
  const handleInlineTranslation = async () => {
    try {
      if (!chrome.runtime?.id) {
        console.error("Extension context invalid");
        alert("Extension reloading, please refresh the page");
        setTooltipClicked(false);
        return;
      }
      const settings = await storage.get();
      const messagePromise = chrome.runtime.sendMessage({
        type: "TRANSLATE_REQUEST",
        payload: {
          text: selection.text,
          targetLang: settings.targetLang,
          context: "inline-replace",
          // Special context for inline mode
          tone: selectedTone
        }
      });
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 3e4);
      });
      const response = await Promise.race([messagePromise, timeoutPromise]);
      if (response && response.success) {
        const result = await performInlineReplace(response.data);
        if (result) {
          console.log("Inline replacement successful");
        }
      } else {
        console.error("Translation failed:", response?.error);
        alert(`Translation failed: ${response?.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Inline translation error:", error);
      if (error.message === "Request timeout") {
        alert("Translation request timed out. Please try again.");
      } else {
        alert("Failed to translate. Please try again.");
      }
    } finally {
      setTooltipClicked(false);
      setTimeout(() => {
        window.getSelection()?.removeAllRanges();
      }, 500);
    }
  };
  const handleToneChange = async (tone) => {
    setSelectedTone(tone);
    await storage.set({ translationTone: tone });
    console.log("Tone changed to:", tone);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTooltipClicked(false);
    window.getSelection()?.removeAllRanges();
  };
  const handleCloseInstantPopup = () => {
    setIsInstantPopupVisible(false);
    setInitialTranslation(void 0);
    setTooltipClicked(false);
    window.getSelection()?.removeAllRanges();
  };
  const handleCopyTranslation = (translation) => {
    console.log("Translation copied:", translation);
  };
  const handleOpenFullModal = () => {
    setIsInstantPopupVisible(false);
    setIsModalVisible(true);
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      TranslatorTooltip,
      {
        x: tooltipPos.x,
        y: tooltipPos.y,
        visible: isTooltipVisible && !tooltipClicked,
        selectedTone,
        onTranslate: handleTranslate,
        onToneChange: handleToneChange
      },
      void 0,
      false,
      {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/ContentApp.tsx",
        lineNumber: 303,
        columnNumber: 7
      },
      this
    ),
    selection && isModalVisible && /* @__PURE__ */ jsxDEV(
      TranslationModal,
      {
        visible: isModalVisible,
        initialText: selection.text,
        initialTranslation,
        onClose: handleCloseModal
      },
      void 0,
      false,
      {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/ContentApp.tsx",
        lineNumber: 313,
        columnNumber: 7
      },
      this
    ),
    selection && isInstantPopupVisible && initialTranslation && /* @__PURE__ */ jsxDEV(
      InstantTranslationPopUp,
      {
        translation: initialTranslation,
        position: tooltipPos,
        onClose: handleCloseInstantPopup,
        onCopy: handleCopyTranslation,
        onOpenModal: handleOpenFullModal
      },
      void 0,
      false,
      {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/ContentApp.tsx",
        lineNumber: 322,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/ContentApp.tsx",
    lineNumber: 302,
    columnNumber: 5
  }, this);
};
_s(ContentApp, "UEVnW+s536Iy4YT5BCPaWeHaq5o=");
_c = ContentApp;
export default ContentApp;
var _c;
$RefreshReg$(_c, "ContentApp");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/dwhitewolf/Desktop/Tiq/src/content/ContentApp.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/dwhitewolf/Desktop/Tiq/src/content/ContentApp.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
