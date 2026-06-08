import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '32kb' }));

const INQUIRY_TYPES = [
  'General Inquiry',
  'Visit / Reservation',
  'Partnership',
  'Product Inquiry',
  'Investment / Franchise',
  'Press',
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, inquiryType, message, gdprConsent } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!INQUIRY_TYPES.includes(inquiryType)) {
      return res.status(400).json({ error: 'Please select a valid inquiry type.' });
    }

    if (!gdprConsent) {
      return res.status(400).json({ error: 'GDPR consent is required to submit this form.' });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return res.status(500).json({ error: 'Email service is not configured. Please try again later.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.CONTACT_EMAIL || 'hello@longevitycafe.com';
    const from = process.env.FROM_EMAIL || 'Longevity Cafe <onboarding@resend.dev>';

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone?.trim() || 'Not provided');
    const safeType = escapeHtml(inquiryType);
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>');

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email.trim(),
      subject: `[Longevity Café] ${inquiryType} — ${name.trim()}`,
      html: `
        <h2>New inquiry from Longevity Café website</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Inquiry type:</strong> ${safeType}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        <hr>
        <p style="color:#666;font-size:12px;">GDPR consent: Yes</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send your message. Please try again.' });
    }

    res.json({
      success: true,
      message: 'Thank you. Your message has been received. We will contact you shortly.',
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Longevity Café API running on http://localhost:${PORT}`);
});
