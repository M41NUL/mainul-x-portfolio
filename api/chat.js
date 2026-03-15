// api/chat.js
// MAINUL-X Smart Chat API
// Author: Md. Mainul Islam (M41NUL)

export const maxDuration = 60;

// ===== YOUR DETAILED SYSTEM PROMPT =====
const SYSTEM_PROMPT = `
You are MAINUL-X AI HELPER.

You are the official AI assistant of Md. Mainul Islam (MAINUL-X).

━━━━━━━━━━━━━━━━━━━━
👤 CREATOR INFORMATION
━━━━━━━━━━━━━━━━━━━━

Name: Md. Mainul Islam  
Username: M41NUL

Profession:
• Cyber Security Specialist  
• Digital Marketing Expert  
• Termux Tools Developer  
• Web Developer  

Founder of SOCINEST-X and MAINUL-X. 

GitHub Profile:
https://github.com/M41NUL

━━━━━━━━━━━━━━━━━━━━
🤖 YOUR IDENTITY
━━━━━━━━━━━━━━━━━━━━

Your Name: MAINUL-X AI HELPER

You are Mainul's personal website assistant.

IMPORTANT RULES:

• Never say you are Gemini  
• Never say you are Google AI  
• Never say you are ChatGPT  
• Never mention language models  

If someone asks:

"তোর নাম কি?"
"What is your name?"

Reply:

"আমার নাম MAINUL-X AI HELPER।  
আমি Md. Mainul Islam এর তৈরি একটি AI সহকারী। 😊"

━━━━━━━━━━━━━━━━━━━━
🌍 LANGUAGE RULES
━━━━━━━━━━━━━━━━━━━━

Always match the user's language.

If user writes Bangla → reply Bangla  
If user writes Banglish → reply Banglish  
If user writes English → reply English  

Never mix languages unless the user mixes them.

━━━━━━━━━━━━━━━━━━━━
💬 CONVERSATION STYLE
━━━━━━━━━━━━━━━━━━━━

Friendly  
Professional  
Helpful  
Human-like  

Short and clear answers.

Use maximum 1 emoji.

━━━━━━━━━━━━━━━━━━━━
🧠 MEMORY
━━━━━━━━━━━━━━━━━━━━

If user shares their name remember it.

Example:

User: My name is Rahim

Reply: Nice to meet you Rahim!

━━━━━━━━━━━━━━━━━━━━
🎯 MAIN GOAL
━━━━━━━━━━━━━━━━━━━━

Welcome visitors to Mainul's portfolio  
Explain his work  
Provide useful information
`;

// ===== LANGUAGE DETECT =====
function detectLanguage(text) {

const banglaRegex=/[\u0980-\u09FF]/;

if(banglaRegex.test(text)){
return "bangla";
}

const banglishWords=[
"ami","tumi","valo","kemon","ki","ase","nai",
"korsi","khaisi","accha","korte","chai",
"bolo","jao","a6o","k6o","tmi","apni","amr","tomar"
];

const lower=text.toLowerCase();

if(banglishWords.some(w=>new RegExp(`\\b${w}\\b`).test(lower))){
return "banglish";
}

return "english";

}

// ===== GET PROMPT FUNCTION =====
function getPrompt(lang){
return SYSTEM_PROMPT;
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
try{
body=JSON.parse(body);
}catch(e){
return res.status(400).json({error:"Invalid JSON format"});
}
}

const {message,history=[]}=body;

if(!message || message.length>1000){
return res.status(400).json({error:"Invalid or too long message"});
}

const lang=detectLanguage(message);

console.log("🟢 Trying Gemini API...");

const geminiResponse=await askGemini(message,history,lang);

if(geminiResponse){

console.log("✅ Gemini Success!");

return res.status(200).json({
candidates:[
{
content:{
parts:[{text:geminiResponse}]
}
}
]
});

}

console.log("🟡 Gemini failed, trying Groq...");

const groqResponse=await askGroq(message,history,lang);

return res.status(200).json({
candidates:[
{
content:{
parts:[{text:groqResponse}]
}
}
]
});

}catch(err){

console.error("🔴 Main Handler Error:",err);

return res.status(500).json({error:"Server error"});

}

}

// ===== GEMINI API HANDLER =====
async function askGemini(message,history=[],lang){

const key=process.env.GEMINI_API_KEY;

if(!key){
console.error("🔴 GEMINI_API_KEY is missing");
return null;
}

let rawHistory=(history||[])
.slice(-5)
.map(msg=>({
role:msg.role==="ai"?"model":"user",
parts:[{text:msg.text||""}]
}));

rawHistory.push({
role:"user",
parts:[{text:message||""}]
});

let formattedHistory=[];

for(let msg of rawHistory){

let lastMsg=formattedHistory[formattedHistory.length-1];

if(lastMsg && lastMsg.role===msg.role){
lastMsg.parts[0].text+="\n"+msg.parts[0].text;
}else{
formattedHistory.push(msg);
}

}

try{

const res=await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"X-goog-api-key":key
},
body:JSON.stringify({

system_instruction:{
parts:[{text:SYSTEM_PROMPT}]
},

contents:formattedHistory,

generationConfig:{
temperature:0.7,
maxOutputTokens:300,
topP:0.16,
topK:80
}

})
}
);

const data=await res.json();

if(data.error){
console.error("🔴 Gemini API Error:",JSON.stringify(data.error));
return null;
}

return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

}catch(err){

console.error("🔴 Gemini Fetch Error:",err);
return null;

}

}

// ===== GROQ API HANDLER =====
async function askGroq(message,history,lang){

const key=process.env.GROQ_API_KEY;

if(!key){
console.error("🔴 GROQ_API_KEY is missing");
return "বট বর্তমানে অনেক ব্যস্ত। পরে আবার চেষ্টা করুন।";
}

try{

const res=await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",
headers:{
"Authorization":`Bearer ${key}`,
"Content-Type":"application/json"
},
body:JSON.stringify({

model:"llama-3.1-8b-instant",

messages:[

{role:"system",content:getPrompt(lang)},

...history.slice(-5).map(msg=>({
role:msg.role==="ai"?"assistant":"user",
content:msg.text || ""
})),

{role:"user",content:message}

],

temperature:0.7,
max_tokens:300

})
}
);

const data=await res.json();

if(data.error){
console.error("🔴 Groq API Error:",JSON.stringify(data.error));
return "দুঃখিত, আমি বর্তমানে কানেক্ট করতে পারছি না।";
}

return data?.choices?.[0]?.message?.content || "No response generated.";

}catch(err){

console.error("🔴 Groq Fetch Error:",err);
return "সার্ভারে সমস্যা হচ্ছে, পরে আবার চেষ্টা করুন।";

}

}
