# EmailJS Setup Guide for Contact Form

## Why EmailJS Instead of FormSubmit or Google SMTP?

### ❌ Google SMTP Limitations:
- Requires backend server (Node.js, PHP, Python)
- Cannot work from static HTML sites
- Browser security prevents direct SMTP connections

### ❌ FormSubmit Issues:
- Activation email not received
- Less reliable delivery
- Limited customization

### ✅ EmailJS Benefits:
- **FREE**: 200 emails/month
- **No backend required**: Works with static HTML
- **Reliable**: Proven email delivery
- **Easy setup**: 5-minute configuration

---

## Setup Instructions

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up Free"**
3. Register with your Google account or email
4. Verify your email address

### Step 2: Add Email Service

1. In EmailJS dashboard, click **"Add New Service"**
2. Choose **"Gmail"** (recommended) or your preferred email provider
3. Click **"Connect Account"**
4. Sign in with `wunmiofi@gmail.com` (or your preferred email)
5. Allow EmailJS to send emails on your behalf
6. Copy the **Service ID** (looks like: `service_abc1234`)

### Step 3: Create Email Template

1. Go to **"Email Templates"** tab
2. Click **"Create New Template"**
3. Template name: `CCC Contact Form`
4. **Template content:**

```
Subject: New Contact Form Message from {{from_name}}

From: {{from_name}}
Email: {{reply_to}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the CCC Redemption Parish Winnipeg website contact form.
```

5. Click **"Save"**
6. Copy the **Template ID** (looks like: `template_xyz5678`)

### Step 4: Get Public Key

1. Go to **"Account"** tab
2. Find **"Public Key"** section
3. Copy your **Public Key** (looks like: `user_AbCdEfGhIjKlMnOp`)

### Step 5: Update Website Code

Open `contact.html` and replace the placeholder values:

#### Line ~870 (inside the emailjs.send call):
```javascript
emailjs.send(
    'service_abc1234',      // ← Replace with YOUR Service ID
    'template_xyz5678',     // ← Replace with YOUR Template ID
    formData,
    'user_AbCdEfGhIjKlMnOp' // ← Replace with YOUR Public Key
)
```

#### Line ~896 (inside emailjs.init):
```javascript
emailjs.init('user_AbCdEfGhIjKlMnOp'); // ← Replace with YOUR Public Key
```

### Step 6: Test the Form

1. Save the changes to `contact.html`
2. Push to GitHub: `git add . && git commit -m "Setup EmailJS" && git push`
3. Wait for Azure deployment (5-10 minutes)
4. Visit: `https://cccredemptionwpg.org/contact.html`
5. Fill out the form and submit
6. Check `wunmiofi@gmail.com` inbox for the message

---

## Troubleshooting

### Form shows "Failed to send message"
- Double-check Service ID, Template ID, and Public Key
- Make sure all three values are replaced in contact.html
- Check EmailJS dashboard for error logs

### Email not received
- Check spam folder
- Verify Gmail service is connected in EmailJS dashboard
- Check EmailJS usage quota (200/month on free plan)

### Button stuck on "Sending..."
- Open browser console (F12) to see error messages
- Verify EmailJS SDK is loading (check Network tab)

---

## Email Template Variables

These are automatically filled from the form:

- `{{from_name}}` - User's name
- `{{reply_to}}` - User's email
- `{{phone}}` - User's phone number
- `{{subject}}` - Selected subject
- `{{message}}` - User's message
- `{{to_name}}` - Always "CCC Redemption Parish"

---

## Monthly Limit

- **Free Plan**: 200 emails/month
- **If exceeded**: Upgrade to paid plan or emails will stop sending
- **Cost**: Paid plans start at $7/month for 1,000 emails

---

## Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: support@emailjs.com
