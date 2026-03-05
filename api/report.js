// api/report.js - Terminal Theme Version
// Developer: Md. Mainul Islam
// GitHub: M41NUL
// Contact: +8801308850528

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Parse message
    const lines = message.split('\n');
    const name = lines.find(l => l.includes('Name:'))?.replace('Name:', '').trim() || 'Unknown';
    const email = lines.find(l => l.includes('Email:'))?.replace('Email:', '').trim() || 'Unknown';
    const msg = lines.find(l => l.includes('Message:'))?.replace('Message:', '').trim() || message;
    const time = new Date().toLocaleString();

    // Terminal Theme HTML
    const htmlTemplate = `
      <div style="max-width:600px; margin:0 auto; background:#1e1e1e; border-radius:15px; overflow:hidden; font-family:'Courier New',monospace;">
        <div style="background:#2d2d2d; padding:15px; display:flex; align-items:center; gap:10px;">
          <span style="width:12px; height:12px; background:#ff5f56; border-radius:50%;"></span>
          <span style="width:12px; height:12px; background:#ffbd2e; border-radius:50%;"></span>
          <span style="width:12px; height:12px; background:#27c93f; border-radius:50%;"></span>
          <span style="color:#888; margin-left:10px;">MAINUL-X@report:~$</span>
        </div>
        
        <div style="padding:30px; color:#fff;">
          <div style="color:#4ec9b0; margin-bottom:20px;">📢 NEW REPORT DETECTED</div>
          
          <div style="margin-bottom:15px;">
            <span style="color:#569cd6;">USERNAME</span>
            <span style="color:#9cdcfe;">: ${name}</span>
          </div>
          
          <div style="margin-bottom:15px;">
            <span style="color:#569cd6;">EMAIL</span>
            <span style="color:#ce9178;">: ${email}</span>
          </div>
          
          <div style="margin-bottom:20px;">
            <span style="color:#569cd6;">MESSAGE</span>
            <span style="color:#9cdcfe;">:</span>
            <div style="background:#2d2d2d; padding:15px; margin-top:10px; border-left:3px solid #569cd6; color:#ce9178;">
              ${msg}
            </div>
          </div>
          
          <div style="display:flex; justify-content:space-between; border-top:1px solid #404040; padding-top:15px;">
            <span style="color:#6a9955;">🕐 ${time}</span>
            <span style="color:#ffd700;">⚡ PRIORITY: NORMAL</span>
          </div>
          
          <div style="margin-top:20px; color:#4ec9b0;">────────────────────────</div>
        </div>
      </div>
    `;

    // Plain text version
    const textVersion = `MAINUL-X REPORT\n━━━━━━━━━━━━━━━━━━━━━━\nUSERNAME: ${name}\nEMAIL: ${email}\nMESSAGE: ${msg}\nTIME: ${time}\nPRIORITY: NORMAL\n━━━━━━━━━━━━━━━━━━━━━━`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
    });

    await transporter.sendMail({
      from: `"MAINUL-X Reports" <${process.env.GMAIL_USER}>`,
      to: 'githubmainul@gmail.com',
      subject: '📢 MAINUL-X New Report',
      text: textVersion,
      html: htmlTemplate
    });

    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
