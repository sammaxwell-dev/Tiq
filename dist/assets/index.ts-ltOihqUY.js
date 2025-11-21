import{s as u}from"./storage-DaJmYFgk.js";async function c(e,a){var r,o,s;try{const t=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e.apiKey}`},body:JSON.stringify({model:e.model||"gpt-3.5-turbo",messages:a,temperature:.3,max_tokens:1e3})});if(!t.ok){const i=await t.json().catch(()=>({}));throw console.error("OpenAI API Error:",t.status,i),t.status===401?new Error("Invalid API Key"):t.status===429?new Error("Rate Limit Exceeded"):new Error(((r=i.error)==null?void 0:r.message)||`API Error: ${t.status}`)}return((s=(o=(await t.json()).choices[0])==null?void 0:o.message)==null?void 0:s.content)||""}catch(t){throw console.error("Fetch Completion Error:",t),t}}function p(e,a){const r=`You are a professional translator and language expert.
Your task is to translate the user's text into the target language: ${e}.
Output ONLY the translated text. Do not add any explanations, notes, or quotes unless asked.
Maintain the original tone and formatting.`;return a?`${r}
Context: ${a}`:r}function m(e){return`You are a professional translator performing inline text replacement.

CRITICAL RULES:
1. Return ONLY the translated text - NO explanations, quotes, or conversational filler
2. The input may be a sentence fragment, not a complete sentence - translate it as-is
3. Preserve the exact capitalization style of the original (Title Case, lowercase, UPPERCASE, etc.)
4. Preserve all punctuation exactly as provided
5. If the fragment starts/ends mid-sentence, keep it that way
6. Match the formality and tone of the original text
7. Translate to: ${e}

Example:
Input: "quick brown fox"
Output: "быстрая коричневая лиса" (NOT "The translation is: 'быстрая коричневая лиса'")`}console.log("Tippr Background Service Worker started");chrome.runtime.onMessage.addListener((e,a,r)=>{if(console.log("Background received message:",e),e.type==="PING"){r({status:"ok"});return}if(e.type==="TRANSLATE_REQUEST")return d(e.payload,r),!0;if(e.type==="VALIDATE_API_KEY")return f(e.payload.key,r),!0});async function d(e,a){var r,o,s;try{const t=await u.get();if(!t.apiKey){a({success:!1,error:"API Key is missing. Please configure it in settings."});return}const i=[{role:"system",content:e.context==="inline-replace"?m(e.targetLang):p(e.targetLang,e.context)},{role:"user",content:e.text}],l=await c({apiKey:t.apiKey,model:t.model},i);a({success:!0,data:l})}catch(t){console.error("Translation error:",t);let n="Unknown error occurred";(r=t.message)!=null&&r.includes("401")?n="Invalid API key. Please check your OpenAI API key.":(o=t.message)!=null&&o.includes("429")?n="Rate limit exceeded. Please try again later.":(s=t.message)!=null&&s.includes("quota")?n="API quota exceeded. Please check your OpenAI billing.":t.message&&(n=t.message),a({success:!1,error:n})}}async function f(e,a){try{await c({apiKey:e,model:"gpt-3.5-turbo"},[{role:"user",content:"Hi"}]),a({success:!0})}catch{a({success:!1,error:"Invalid API Key"})}}
