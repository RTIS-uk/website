/**
 * ZOHO SMTP TEST SCRIPT
 * 
 * Instructions:
 * 1. Set your Zoho password in your terminal:
 *    export ZOHO_PASSWORD="your_actual_password_or_app_password"
 * 
 * 2. Run the script:
 *    node test-smtp.js
 */

const nodemailer = require('nodemailer');

if (!process.env.ZOHO_PASSWORD) {
  console.error('❌ Error: ZOHO_PASSWORD environment variable is not set!');
  console.log('Please set it in your terminal before running this script:');
  console.log('  export ZOHO_PASSWORD="your_zoho_password_here"');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'info@rtisuk.co.uk',
    pass: process.env.ZOHO_PASSWORD,
  },
});

console.log('Connecting to Zoho SMTP server (smtp.zoho.eu:465)...');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection failed!');
    console.error(error);
  } else {
    console.log('✅ SMTP Connection & Authentication successful! Your credentials are correct.');
  }
});
