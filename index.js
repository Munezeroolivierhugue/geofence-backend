const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST endpoint to send email
app.post('/send-email', async (req, res) => {
  const { status, userEmail } = req.body;

  if (!status || !userEmail) {
    return res.status(400).json({ error: 'Status and userEmail are required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Geofence Status Update`,
    text: `Your geofence status has changed to: ${status}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail} with status: ${status}`);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});