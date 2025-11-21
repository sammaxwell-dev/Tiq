import{s as d}from"./storage-CmcN9rvR.js";async function l(e,r){var t,n,s;try{const a=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e.apiKey}`},body:JSON.stringify({model:e.model||"gpt-3.5-turbo",messages:r,temperature:.3,max_tokens:1e3})});if(!a.ok){const i=await a.json().catch(()=>({}));throw console.error("OpenAI API Error:",a.status,i),a.status===401?new Error("Invalid API Key"):a.status===429?new Error("Rate Limit Exceeded"):new Error(((t=i.error)==null?void 0:t.message)||`API Error: ${a.status}`)}return((s=(n=(await a.json()).choices[0])==null?void 0:n.message)==null?void 0:s.content)||""}catch(a){throw console.error("Fetch Completion Error:",a),a}}function m(e,r){const t=`You are a professional translator and language expert.
Your task is to translate the user's text into the target language: ${e}.
Output ONLY the translated text. Do not add any explanations, notes, or quotes unless asked.
Maintain the original tone and formatting.`;return r?`${t}
Context: ${r}`:t}function g(e,r){let t="";switch(r){case"formal":t=`
8. Use formal, professional language and honorifics where appropriate`;break;case"casual":t=`
8. Use casual, friendly language as if talking to a friend`;break;case"humorous":t=`
8. Make the translation light and playful while keeping the meaning`;break;case"code":t=`
8. Optimize for technical/programming terminology and concepts`;break;case"tldr":t=`
8. Provide a very brief summary (maximum 10 words)`;break;default:t=""}return`You are a professional translator performing inline text replacement.

CRITICAL RULES:
1. Return ONLY the translated text - NO explanations, quotes, or conversational filler
2. The input may be a sentence fragment, not a complete sentence - translate it as-is
3. Preserve the exact capitalization style of the original (Title Case, lowercase, UPPERCASE, etc.)
4. Preserve all punctuation exactly as provided
5. If the fragment starts/ends mid-sentence, keep it that way
6. Match the formality and tone of the original text
7. Translate to: ${e}${t}

Example:
Input: "quick brown fox"
Output: "быстрая коричневая лиса" (NOT "The translation is: 'быстрая коричневая лиса'")`}function p(e,r,t){let n="";switch(r){case"formal":n="professional and formal, using polite language and proper titles";break;case"casual":n="casual and friendly, as if talking to a close friend";break;case"humorous":n="light-hearted and humorous, while preserving the core meaning";break;case"code":n="technical and precise, optimized for programming terms and concepts";break;case"tldr":n="extremely concise - provide only a brief summary";break;default:n="natural and accurate"}const s=`You are a professional translator and language expert.
Your task is to translate the user's text into the target language: ${e}.
The translation style should be ${n}.
Output ONLY the translated text. Do not add any explanations, notes, or quotes unless asked.
Maintain the original formatting.`;return t?`${s}
Context: ${t}`:s}console.log("Tippr Background Service Worker started");chrome.runtime.onMessage.addListener((e,r,t)=>{if(console.log("Background received message:",e),e.type==="PING"){t({status:"ok"});return}if(e.type==="TRANSLATE_REQUEST")return f(e.payload,t),!0;if(e.type==="VALIDATE_API_KEY")return h(e.payload.key,t),!0});async function f(e,r){var t,n,s;try{const a=await d.get();if(!a.apiKey){r({success:!1,error:"API Key is missing. Please configure it in settings."});return}const o=e.tone||"standard";let i;e.context==="inline-replace"?i=g(e.targetLang,o):o!=="standard"?i=p(e.targetLang,o,e.context):i=m(e.targetLang,e.context);const c=[{role:"system",content:i},{role:"user",content:e.text}],u=await l({apiKey:a.apiKey,model:a.model},c);r({success:!0,data:u})}catch(a){console.error("Translation error:",a);let o="Unknown error occurred";(t=a.message)!=null&&t.includes("401")?o="Invalid API key. Please check your OpenAI API key.":(n=a.message)!=null&&n.includes("429")?o="Rate limit exceeded. Please try again later.":(s=a.message)!=null&&s.includes("quota")?o="API quota exceeded. Please check your OpenAI billing.":a.message&&(o=a.message),r({success:!1,error:o})}}async function h(e,r){try{await l({apiKey:e,model:"gpt-3.5-turbo"},[{role:"user",content:"Hi"}]),r({success:!0})}catch{r({success:!1,error:"Invalid API Key"})}}
