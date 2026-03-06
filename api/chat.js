// api/chat.js
// MAINUL-X Smart Chat API
// Author: Md. Mainul Islam

let memory = [];
const cache = new Map();

// ===== MEMORY =====
function addMemory(role, content) {
  memory.push({ role, content });

  if (memory.length > 8) {
    memory.shift();
  }
}

// ===== LANGUAGE DETECT =====
function detectLanguage(text) {

  const banglaRegex = /[\u0980-\u09FF]/;

  if (banglaRegex.test(text)) return "bangla";

  const banglishWords = ["ami","tumi","valo","kemon","ki","ase","nai"];

  const lower = text.toLowerCase();

  if (banglishWords.some(w => lower.includes(w))) {
    return "banglish";
  }

  return "english";
}

// ===== EMOJI CHECK =====
function isEmoji(text) {
  return /^[\p{Emoji}\s]+$/u.test(text);
}

// ===== SPAM =====
function isSpam(text) {
  return !text || text.length > 1000;
}

// ===== SYSTEM PROMPT =====
function getPrompt(lang) {

return `You are MAINUL-X AI HELPER.

Language mode: ${lang}

Rules:
- Bangla message → Bangla reply
- Banglish message → Banglish reply
- English message → English reply
- Never mix languages

Greeting rule:
If user greets, reply politely and ask how to help.

Emoji rule:
If user sends only emoji, reply with short reaction.

Identity rule:
You are an AI assistant created by developer Md. Mainul Islam.

Style:
Short, natural, friendly responses.`;
}

// ===== MAIN HANDLER =====
export default async function handler(req,res){

res.setHeader('Access-Control-Allow-Origin','*');
res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers','Content-Type');

if(req.method==="OPTIONS"){
return res.status(200).end();
}

if(req.method!=="POST"){
return res.status(405).json({error:"Method not allowed"});
}

try{

let body=req.body;

if(typeof body==="string"){
body=JSON.parse(body);
}

const {message}=body;

if(isSpam(message)){
return res.status(400).json({error:"Invalid message"});
}

// ===== CACHE CHECK =====
if(cache.has(message)){
return res.status(200).json({
candidates:[{
content:{parts:[{text:cache.get(message)}]}
}]
});
}

// ===== LANGUAGE =====
const lang=detectLanguage(message);

// ===== EMOJI FAST RESPONSE =====
if(isEmoji(message)){
let reply="😊";

if(lang==="bangla") reply="😊 বুঝতে পেরেছি। আপনাকে কীভাবে সাহায্য করতে পারি?";
if(lang==="banglish") reply="😊 bujhte parsi. ki vabe help korte pari?";
if(lang==="english") reply="😊 I understand. How can I help you?";

return res.status(200).json({
candidates:[{
content:{parts:[{text:reply}]}
}]
});
}

// ===== MEMORY =====
addMemory("user",message);

// ===== GEMINI TRY =====
const gemini=await askGemini(message,lang);

if(gemini){

addMemory("assistant",gemini);

cache.set(message,gemini);

return res.status(200).json({
candidates:[{
content:{parts:[{text:gemini}]}
}]
});

}

// ===== FALLBACK GROQ =====
const groq=await askGroq(message,lang);

addMemory("assistant",groq);

cache.set(message,groq);

return res.status(200).json({
candidates:[{
content:{parts:[{text:groq}]}
}]
});

}catch(err){

console.log(err);

return res.status(500).json({error:"Server error"});

}

}

// ===== GEMINI =====
async function askGemini(message,lang){

const key=process.env.GEMINI_API_KEY;

if(!key) return null;

try{

const res=await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

systemInstruction:{
parts:[{text:getPrompt(lang)}]
},

contents:[
...memory.map(m=>({
role:m.role==="assistant"?"model":"user",
parts:[{text:m.content}]
})),
{
role:"user",
parts:[{text:message}]
}
],

generationConfig:{
temperature:0.4,
maxOutputTokens:300
}

})
}
);

const data=await res.json();

return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

}catch{

return null;

}

}

// ===== GROQ =====
async function askGroq(message,lang){

const key=process.env.GROQ_API_KEY;

if(!key) return "AI unavailable.";

try{

const res=await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",
headers:{
Authorization:`Bearer ${key}`,
"Content-Type":"application/json"
},
body:JSON.stringify({

model:"llama-3.3-70b-versatile",

messages:[
{role:"system",content:getPrompt(lang)},
...memory,
{role:"user",content:message}
],

temperature:0.4,
max_tokens:300

})
}
);

const data=await res.json();

return data?.choices?.[0]?.message?.content || "No response";

}catch{

return "AI error.";

}

}
