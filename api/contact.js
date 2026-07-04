const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { name, email, phone, company, job_title, service, requirements } = req.body;

  // Basic validation
  if (!name || !email || !phone || !company || !service || !requirements) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create transporter with Zoho Mail SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: 'info@rtisuk.co.uk',
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  // Construct Email Content
  const mailOptions = {
    from: '"RTIS Website Enquiry" <info@rtisuk.co.uk>',
    to: 'info@rtisuk.co.uk, rtis.co.uk@gmail.com, abdurahman32129@gmail.com',
    replyTo: `"${name}" <${email}>`,
    subject: `📩 New RTIS Website Enquiry: ${name} (${company})`,
    html: `
      <h2>New Contact Form Submission</h2>
      <hr />
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Job Title:</strong> ${job_title || 'Not provided'}</p>
      <p><strong>Service Required:</strong> ${service}</p>
      <br />
      <p><strong>Project Requirements / Message:</strong></p>
      <blockquote style="background: #f7f9fc; border-left: 4px solid #e67e22; padding: 15px; margin: 0;">
        ${requirements.replace(/\n/g, '<br />')}
      </blockquote>
      <hr />
      <p style="font-size: 0.8rem; color: #888;">Submitted from RTIS website contact form at ${new Date().toUTCString()}</p>
    `,
    text: `
      New Contact Form Submission
      ---------------------------------
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Company: ${company}
      Job Title: ${job_title || 'Not provided'}
      Service Required: ${service}
      
      Project Requirements:
      ${requirements}
      
      ---------------------------------
      Submitted from RTIS website contact form at ${new Date().toUTCString()}
    `
  };

  try {
    // Verify transporter configuration
    await transporter.verify();

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({ success: true, message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Error sending email via Zoho SMTP:', error);
    
    // Provide a helpful warning if ZOHO_PASSWORD environment variable is missing
    if (!process.env.ZOHO_PASSWORD) {
      console.warn('WARNING: process.env.ZOHO_PASSWORD is not set. Please add it to your Vercel project environment variables.');
    }

    return res.status(500).json({ 
      error: 'Failed to send enquiry. Please try again later or email us directly at info@rtisuk.co.uk' 
    });
  }
};
