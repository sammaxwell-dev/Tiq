import{s as d}from"./storage-DIGbv6aW.js";async function c(e,n){var t,r,s;try{const a=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e.apiKey}`},body:JSON.stringify({model:e.model||"gpt-3.5-turbo",messages:n,temperature:.3,max_tokens:1e3})});if(!a.ok){const i=await a.json().catch(()=>({}));throw console.error("OpenAI API Error:",a.status,i),a.status===401?new Error("Invalid API Key"):a.status===429?new Error("Rate Limit Exceeded"):new Error(((t=i.error)==null?void 0:t.message)||`API Error: ${a.status}`)}return((s=(r=(await a.json()).choices[0])==null?void 0:r.message)==null?void 0:s.content)||""}catch(a){throw console.error("Fetch Completion Error:",a),a}}function f(e,n){const t=`You are a professional translator and language expert.
Your task is to translate the user's text into the target language: ${e}.
Output ONLY the translated text. Do not add any explanations, notes, or quotes unless asked.
Maintain the original tone and formatting.`;return n?`${t}
Context: ${n}`:t}function h(e,n){let t="";switch(n){case"formal":t=`
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
Output: "быстрая коричневая лиса" (NOT "The translation is: 'быстрая коричневая лиса'")`}function p(e,n,t){let r="";switch(n){case"formal":r="professional and formal, using polite language and proper titles";break;case"casual":r="casual and friendly, as if talking to a close friend";break;case"humorous":r="light-hearted and humorous, while preserving the core meaning";break;case"code":r="technical and precise, optimized for programming terms and concepts";break;case"tldr":r="extremely concise - provide only a brief summary";break;default:r="natural and accurate"}const s=`You are a professional translator and language expert.
Your task is to translate the user's text into the target language: ${e}.
The translation style should be ${r}.
Output ONLY the translated text. Do not add any explanations, notes, or quotes unless asked.
Maintain the original formatting.`;return t?`${s}
Context: ${t}`:s}function m(e){return`You are a helpful teacher.
Your task is to explain the following text simply, as if to a 5-year-old.
The explanation should be in ${e}.
Keep it short, simple, and easy to understand.
Do not use complex words.
Output ONLY the explanation.`}function g(e){return`You are a dictionary.
Your task is to define the following term or phrase.
The definition should be in ${e}.
Keep it concise and clear.
Output ONLY the definition.`}function y(e){return`You are a contextual dictionary that explains words based on their usage in a specific sentence.

You will receive:
1. A specific word to define
2. The full sentence where this word appears

Your task:
1. Analyze how the word is used in the given sentence context
2. Provide a clear, concise definition that matches THIS specific usage
3. Write the definition in ${e}

IMPORTANT RULES:
- Keep it very short (1-2 sentences max)
- Do NOT compare with other meanings or say "not to be confused with"
- Do NOT add disclaimers about other possible meanings
- Just give the direct definition for THIS context
- Output ONLY the definition, nothing else

Example:
Word: "agent"
Context: "We may update agent mode soon"
Response: "Автономный режим работы ИИ, когда модель самостоятельно выполняет задачи без постоянного участия пользователя."`}console.log("Tippr Background Service Worker started");chrome.runtime.onMessage.addListener((e,n,t)=>{if(console.log("Background received message:",e),e.type==="PING"){t({status:"ok"});return}if(e.type==="TRANSLATE_REQUEST")return x(e.payload,t),!0;if(e.type==="VALIDATE_API_KEY")return w(e.payload.key,t),!0});async function x(e,n){var t,r,s;try{const a=await d.get();if(!a.apiKey){n({success:!1,error:"API Key is missing. Please configure it in settings."});return}const o=e.tone||"standard";let i;e.mode==="explain"?i=m(e.targetLang):e.mode==="define"?i=g(e.targetLang):e.mode==="define-context"?i=y(e.targetLang):e.context==="inline-replace"?i=h(e.targetLang,o):o!=="standard"?i=p(e.targetLang,o,e.context):i=f(e.targetLang,e.context);const l=[{role:"system",content:i},{role:"user",content:e.text}],u=await c({apiKey:a.apiKey,model:a.model},l);n({success:!0,data:u})}catch(a){console.error("Translation error:",a);let o="Unknown error occurred";(t=a.message)!=null&&t.includes("401")?o="Invalid API key. Please check your OpenAI API key.":(r=a.message)!=null&&r.includes("429")?o="Rate limit exceeded. Please try again later.":(s=a.message)!=null&&s.includes("quota")?o="API quota exceeded. Please check your OpenAI billing.":a.message&&(o=a.message),n({success:!1,error:o})}}async function w(e,n){try{await c({apiKey:e,model:"gpt-3.5-turbo"},[{role:"user",content:"Hi"}]),n({success:!0})}catch{n({success:!1,error:"Invalid API Key"})}}
