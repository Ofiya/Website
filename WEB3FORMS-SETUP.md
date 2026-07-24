# Web3Forms Setup Guide - Simple Contact Form

## Why Web3Forms?
- ✅ **FREE**: 250 submissions/month
- ✅ **No backend required**: Works with static HTML
- ✅ **2-minute setup**: Just get an access key
- ✅ **No email verification needed**: Instant activation
- ✅ **Spam protection**: Built-in reCAPTCHA support

---

## Quick Setup (2 minutes)

### Step 1: Get Your Free Access Key

1. Go to **https://web3forms.com**
2. Click **"Get Started for Free"** or **"Create Access Key"**
3. Enter your email address (e.g., `info@cccredemptionwpg.org`)
4. Click **"Create Access Key"**
5. **Copy the Access Key** (looks like: `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

### Step 2: Add Access Key to Your Website

1. Open `contact.html`
2. Find this line (around line 636):
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual access key
4. Save the file

### Step 3: Test Your Form

1. Open your website
2. Fill out the contact form
3. Click "Send Message"
4. Check your email inbox (`info@cccredemptionwpg.org`)
5. You should receive the form submission!

---

## Example Configuration

```html
<!-- In contact.html -->
<form id="contactForm" action="https://api.web3forms.com/submit" method="POST">
    <!-- Replace with your actual access key -->
    <input type="hidden" name="access_key" value="a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6">
    <input type="hidden" name="subject" value="New Contact Form Message from CCC Redemption Website">
    
    <!-- Rest of form fields... -->
</form>
```

---

## Optional: Add Spam Protection

To enable reCAPTCHA spam protection:

1. Add this to your form:
   ```html
   <input type="hidden" name="recaptcha_response" id="recaptchaResponse">
   ```

2. Get a free reCAPTCHA site key from Google
3. Web3Forms will automatically handle verification

---

## Features Included

✅ Email notifications sent to `info@cccredemptionwpg.org`
✅ Auto-reply to user's email address
✅ Form data includes: Name, Email, Phone, Subject, Message
✅ Success/error messages with visual feedback
✅ Automatic redirect to thank-you page on success
✅ Mobile-responsive form design

---

## Troubleshooting

**Problem**: Not receiving emails
- Check your spam folder
- Verify the access key is correct
- Ensure the email in Web3Forms dashboard matches your inbox

**Problem**: Form shows error message
- Check browser console for errors (F12)
- Verify internet connection
- Make sure access key is not expired

---

## Support

- Web3Forms Documentation: https://docs.web3forms.com
- Email: support@web3forms.com

---

## Free Plan Limits

- **250 submissions/month** (resets monthly)
- Enough for most small church websites
- Upgrade available if you need more

---

That's it! Your contact form will be working in 2 minutes. 🎉
