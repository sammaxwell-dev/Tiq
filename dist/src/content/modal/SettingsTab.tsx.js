import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/modal/SettingsTab.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--13cc1f75.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--13cc1f75.js"; const useState = __vite__cjsImport3_react["useState"]; const useEffect = __vite__cjsImport3_react["useEffect"];
import { Loader2, CheckCircle, XCircle, Moon, Sun, Monitor, Key, Sparkles } from "/vendor/.vite-deps-lucide-react.js__v--13cc1f75.js";
import { Button } from "/src/components/ui/Button.tsx.js";
import { Input } from "/src/components/ui/Input.tsx.js";
import { Select } from "/src/components/ui/Select.tsx.js";
import { Switch } from "/src/components/ui/Switch.tsx.js";
import { storage } from "/src/lib/storage.ts.js";
import { cn } from "/src/lib/utils.ts.js";
const SettingsTab = () => {
  _s();
  const [settings, setSettings] = useState(null);
  const [key, setKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    storage.get().then((s) => {
      setSettings(s);
      setKey(s.apiKey);
    });
  }, []);
  const updateSetting = async (key2, value) => {
    if (!settings) return;
    const newSettings = { ...settings, [key2]: value };
    setSettings(newSettings);
    await storage.set({ [key2]: value });
  };
  const handleSaveKey = async () => {
    setStatus("checking");
    setErrorMsg("");
    if (!key.trim()) {
      setStatus("invalid");
      setErrorMsg("Key cannot be empty");
      return;
    }
    try {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
        const response = await chrome.runtime.sendMessage({
          type: "VALIDATE_API_KEY",
          payload: { key }
        });
        if (response && response.success) {
          setStatus("valid");
          await updateSetting("apiKey", key);
        } else {
          setStatus("invalid");
          setErrorMsg(response?.error || "Invalid API Key");
        }
      } else {
        setTimeout(() => {
          if (key.startsWith("sk-")) {
            setStatus("valid");
            updateSetting("apiKey", key);
          } else {
            setStatus("invalid");
            setErrorMsg("Dev: Key must start with sk-");
          }
        }, 1e3);
      }
    } catch (e) {
      setStatus("invalid");
      setErrorMsg("Failed to validate key");
    }
  };
  if (!settings) return /* @__PURE__ */ jsxDEV("div", { className: "p-8 flex justify-center", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "animate-spin text-blue-500" }, void 0, false, {
    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
    lineNumber: 92,
    columnNumber: 66
  }, this) }, void 0, false, {
    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
    lineNumber: 92,
    columnNumber: 25
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-full overflow-y-auto p-6 space-y-8", children: [
    /* @__PURE__ */ jsxDEV("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(Monitor, { size: 14 }, void 0, false, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 100,
          columnNumber: 21
        }, this),
        " Appearance"
      ] }, void 0, true, {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
        lineNumber: 99,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white/50 dark:bg-white/5 rounded-xl p-1 flex gap-1 border border-gray-200 dark:border-white/10", children: ["light", "dark", "system"].map(
        (theme) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => updateSetting("theme", theme),
            className: cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              settings.theme === theme ? "bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            ),
            children: [
              theme === "light" && /* @__PURE__ */ jsxDEV(Sun, { size: 16 }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
                lineNumber: 114,
                columnNumber: 51
              }, this),
              theme === "dark" && /* @__PURE__ */ jsxDEV(Moon, { size: 16 }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
                lineNumber: 115,
                columnNumber: 50
              }, this),
              theme === "system" && /* @__PURE__ */ jsxDEV(Monitor, { size: 16 }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
                lineNumber: 116,
                columnNumber: 52
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "capitalize", children: theme }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
                lineNumber: 117,
                columnNumber: 29
              }, this)
            ]
          },
          theme,
          true,
          {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 104,
            columnNumber: 11
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
        lineNumber: 102,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
      lineNumber: 98,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(Key, { size: 14 }, void 0, false, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 126,
          columnNumber: 21
        }, this),
        " AI Configuration"
      ] }, void 0, true, {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
        lineNumber: 125,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "text-sm font-medium text-foreground dark:text-gray-200", children: "API Key" }, void 0, false, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 130,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            Input,
            {
              type: isVisible ? "text" : "password",
              placeholder: "sk-...",
              value: key,
              onChange: (e) => {
                setKey(e.target.value);
                setStatus("idle");
              },
              className: cn(
                "bg-white/50 dark:bg-white/5",
                status === "invalid" ? "border-red-500 focus-visible:ring-red-500" : ""
              )
            },
            void 0,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
              lineNumber: 132,
              columnNumber: 25
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(Button, { variant: "outline", size: "icon", onClick: () => setIsVisible(!isVisible), className: "shrink-0", children: isVisible ? /* @__PURE__ */ jsxDEV("span", { className: "text-xs", children: "Hide" }, void 0, false, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 146,
            columnNumber: 42
          }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-xs", children: "Show" }, void 0, false, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 146,
            columnNumber: 82
          }, this) }, void 0, false, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 145,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 131,
          columnNumber: 21
        }, this),
        status === "invalid" && /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1", children: [
          /* @__PURE__ */ jsxDEV(XCircle, { size: 12 }, void 0, false, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 152,
            columnNumber: 29
          }, this),
          " ",
          errorMsg
        ] }, void 0, true, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 151,
          columnNumber: 11
        }, this),
        status === "valid" && /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-green-600 dark:text-green-400 flex items-center gap-1 animate-in slide-in-from-top-1", children: [
          /* @__PURE__ */ jsxDEV(CheckCircle, { size: 12 }, void 0, false, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 157,
            columnNumber: 29
          }, this),
          " Verified & Saved"
        ] }, void 0, true, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 156,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            onClick: handleSaveKey,
            disabled: status === "checking" || !key,
            className: "w-full",
            variant: status === "valid" ? "outline" : "default",
            children: [
              status === "checking" && /* @__PURE__ */ jsxDEV(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
                lineNumber: 167,
                columnNumber: 51
              }, this),
              status === "checking" ? "Verifying..." : "Verify & Save Key"
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 161,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
        lineNumber: 129,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "text-sm font-medium text-foreground dark:text-gray-200", children: "Model" }, void 0, false, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 173,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(
          Select,
          {
            value: settings.model,
            onChange: (e) => updateSetting("model", e.target.value),
            className: "bg-white/50 dark:bg-white/5",
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "gpt-4o-mini", children: "GPT-4o mini (Recommended)" }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
                lineNumber: 179,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "gpt-4o", children: "GPT-4o (Best Quality)" }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
                lineNumber: 180,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("option", { value: "gpt-3.5-turbo", children: "GPT-3.5 Turbo (Legacy)" }, void 0, false, {
                fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
                lineNumber: 181,
                columnNumber: 25
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 174,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
        lineNumber: 172,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
      lineNumber: 124,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(Sparkles, { size: 14 }, void 0, false, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 189,
          columnNumber: 21
        }, this),
        " Behavior"
      ] }, void 0, true, {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
        lineNumber: 188,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 bg-white/30 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-medium text-foreground dark:text-gray-200", children: "Instant Translation" }, void 0, false, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
              lineNumber: 195,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-muted-foreground", children: "Translate immediately on click" }, void 0, false, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
              lineNumber: 196,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 194,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV(
            Switch,
            {
              checked: settings.instantTranslation,
              onChange: (e) => updateSetting("instantTranslation", e.target.checked)
            },
            void 0,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
              lineNumber: 198,
              columnNumber: 25
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 193,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-px bg-gray-200 dark:bg-white/10" }, void 0, false, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 204,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-medium text-foreground dark:text-gray-200", children: "Show Backdrop" }, void 0, false, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
              lineNumber: 208,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-muted-foreground", children: "Dim background when open" }, void 0, false, {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
              lineNumber: 209,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
            lineNumber: 207,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV(
            Switch,
            {
              checked: settings.showBackdrop,
              onChange: (e) => updateSetting("showBackdrop", e.target.checked)
            },
            void 0,
            false,
            {
              fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
              lineNumber: 211,
              columnNumber: 25
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
          lineNumber: 206,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
        lineNumber: 192,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
      lineNumber: 187,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx",
    lineNumber: 95,
    columnNumber: 5
  }, this);
};
_s(SettingsTab, "7i+oxRN25jPzrZ5qdA/GPfFpeg4=");
_c = SettingsTab;
export default SettingsTab;
var _c;
$RefreshReg$(_c, "SettingsTab");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/dwhitewolf/Desktop/Tiq/src/content/modal/SettingsTab.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
