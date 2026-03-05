// api/report.js - Terminal Theme Version (FIXED)
// Developer: Md. Mainul Islam
// GitHub: M41NUL
// Contact: +8801308850528

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // FIXED: Better parsing
    let name = 'Unknown';
    let email = 'Unknown'; 
    let msg = message;

    const lines = message.split('\n');
    
    for (const line of lines) {
      if (line.includes('Name:') || line.includes('NAME:')) {
        name = line.replace(/Name:|NAME:/i, '').trim();
      } else if (line.includes('Email:') || line.includes('EMAIL:')) {
        email = line.replace(/Email:|EMAIL:/i, '').trim();
      } else if (line.includes('Message:') || line.includes('MESSAGE:')) {
        msg = line.replace(/Message:|MESSAGE:/i, '').trim();
      }
    }

    // If still unknown, try to guess from structure
    if (name === 'Unknown' && lines.length > 0) name = lines[0] || 'Unknown';
    if (email === 'Unknown' && lines.length > 1) email = lines[1] || 'Unknown';
    if (msg === message && lines.length > 2) msg = lines.slice(2).join('\n') || message;

    const time = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

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

    // Check if Gmail credentials exist
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      return res.status(500).json({ error: 'Gmail credentials not configured' });
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"MAINUL-X Reports" <${process.env.GMAIL_USER}>`,
      to: 'githubmainul@gmail.com',
      subject: '📢 MAINUL-X New Report',
      text: textVersion,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return res.status(200).json({ 
      ok: true, 
      message: 'Report sent successfully',
      id: info.messageId 
    });

  } catch (error) {
    console.error('Report API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
