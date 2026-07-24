# Azure Logic App Setup for Contact Form

## Overview
This guide will help you configure an Azure Logic App to receive contact form submissions via HTTP and send them as emails.

---

## Step 1: Create the Logic App (If Not Already Created)

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"Logic Apps"** in the top search bar
3. Click **"+ Create"**
4. Fill in:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Logic App Name**: `RedemptionLA` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., Canada Central, East US)
   - **Plan Type**: Select **Consumption** (pay-per-use)
5. Click **"Review + Create"** then **"Create"**

---

## Step 2: Configure the HTTP Trigger

### Add the Trigger

1. Open your Logic App in Azure Portal
2. Click **"Logic app designer"** under Development Tools
3. Search for **"When a HTTP request is received"**
4. Click on it to add

### Configure Request Body JSON Schema

Click **"Use sample payload to generate schema"** and paste this JSON:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(204) 555-0123",
  "message_subject": "Prayer Request",
  "message": "Please pray for my family during this difficult time."
}
```

Click **"Done"**. This will auto-generate the schema.

### Method Configuration

- **Method**: Leave as **Default (Allow All Methods)** or select **POST**
- The **HTTP URL** will be generated after you save (you'll use this in your website)

---

## Step 3: Add Email Action

### Option A: Using Office 365 Outlook (Recommended for Organizations)

1. Click **"+ New step"**
2. Search for **"Office 365 Outlook"**
3. Select **"Send an email (V2)"**
4. Click **"Sign in"** and authenticate with your Office 365 account

**Configure the Email:**

- **To**: `info@cccredemptionwpg.org` (or your email)
- **Subject**: Click in field → Select **"Add dynamic content"** → Choose **message_subject**
  - Or use: `New Contact Form: [message_subject]`
- **Body**: Click in field and build email like this:

```
New Contact Form Submission
============================

From: [name]
Email: [email]
Phone: [phone]

Subject: [message_subject]

Message:
[message]

----
Submitted via cccredemptionwpg.org contact form
```

To add dynamic fields, click the lightning bolt icon and select: `name`, `email`, `phone`, `message_subject`, `message`

### Option B: Using Gmail (Personal Gmail Account)

1. Click **"+ New step"**
2. Search for **"Gmail"**
3. Select **"Send email (V2)"**
4. Click **"Sign in"** and authenticate with your Gmail account

**Configure similarly to Option A above**

### Option C: Using SendGrid (Most Reliable for Production)

1. Create free SendGrid account at [SendGrid.com](https://sendgrid.com)
2. Get your API key from SendGrid dashboard
3. In Logic App, search for **"SendGrid"**
4. Select **"Send email (V2)"**
5. Enter your SendGrid API key
6. Configure email as shown above

---

## Step 4: Add Conditional Logic (Optional but Recommended)

### Add Spam Protection

After the HTTP trigger, before the email action:

1. Click **"+ New step"**
2. Search for **"Condition"**
3. Add condition: `email` **contains** `@`
   - If **True**: Send email
   - If **False**: Return error response

### Add Response Action

This tells the website whether the submission succeeded:

1. After the "Send email" action, click **"+ New step"**
2. Search for **"Response"**
3. Select **"Response"** action
4. Configure:
   - **Status Code**: `200`
   - **Body**: 
   ```json
   {
     "success": true,
     "message": "Email sent successfully"
   }
   ```

---

## Step 5: Save and Get the HTTP URL

1. Click **"Save"** at the top of the designer
2. After saving, go back to the **HTTP trigger** step
3. Click on it to expand
4. **Copy the HTTP POST URL** - this is your webhook URL
   - It looks like: `https://prod-xx.region.logic.azure.com:443/workflows/.../triggers/manual/paths/invoke?...`

---

## Step 6: Update Your Website

### Replace Web3Forms with Azure Logic App

Open `contact.html` and update the form:

```html
<form id="contactForm" action="YOUR_AZURE_LOGIC_APP_URL" method="POST">
    <!-- Remove the Web3Forms access key -->
    <!-- Remove all hidden fields -->
    
    <div class="form-group">
        <label for="name">Your Name <span class="required">*</span></label>
        <input type="text" id="name" name="name" required>
    </div>

    <div class="form-group">
        <label for="email">Email Address <span class="required">*</span></label>
        <input type="email" id="email" name="email" required>
    </div>

    <div class="form-group">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone">
    </div>

    <div class="form-group">
        <label for="subject-select">Message Subject</label>
        <select id="subject-select" name="message_subject">
            <option value="">Select a subject</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Prayer Request">Prayer Request</option>
            <option value="Request Visitation">Request Visitation</option>
            <option value="Membership Information">Membership Information</option>
            <option value="Donation Inquiry">Donation Inquiry</option>
            <option value="Event Information">Event Information</option>
            <option value="Spiritual Counseling">Spiritual Counseling</option>
        </select>
    </div>

    <div class="form-group">
        <label for="message">Your Message <span class="required">*</span></label>
        <textarea id="message" name="message" required></textarea>
    </div>

    <button type="submit" class="btn-celestial" id="submitBtn">
        <i class="fas fa-paper-plane"></i> Send Message
    </button>
    
    <div id="formMessage" style="margin-top: 1rem; padding: 1rem; border-radius: 8px; display: none;"></div>
</form>
```

### Update the JavaScript

The JavaScript in `contact.html` should already work with Azure Logic Apps since both use fetch() to POST data.

**Just update the form action URL** to your Logic App URL, or keep the JavaScript form submission code as-is.

---

## Step 7: Test Your Logic App

### Test from Azure Portal

1. In Logic App designer, click **"Run Trigger"** → **"Run"**
2. Send a test submission from your website contact form
3. Go to **"Overview"** in your Logic App
4. Check **"Runs history"** to see if it succeeded
5. Click on a run to see detailed execution flow

### Test from Your Website

1. Fill out the contact form
2. Click "Send Message"
3. Check your email inbox for the submission
4. Check Azure Portal runs history for any errors

---

## Troubleshooting

### Issue: Email Not Received

**Check:**
- ✅ Logic App run history shows "Succeeded"
- ✅ Email action shows "Succeeded" (green checkmark)
- ✅ Check spam/junk folder
- ✅ Verify email address in "To" field is correct
- ✅ Check Office 365/Gmail account has proper permissions

### Issue: 401 Unauthorized Error

**Fix:**
- Reconnect your Office 365/Gmail account in the Logic App
- Go to the email action → Click the 3 dots → "Add new connection"

### Issue: 400 Bad Request

**Fix:**
- Ensure form field names match the JSON schema exactly:
  - `name` (not `from_name`)
  - `email` (not `reply_to`)
  - `message_subject` (not `subject`)
  - `message` (must be present)

### Issue: CORS Error from Website

**Fix:**
Add a Response action in your Logic App:
1. Click **"+ New step"** after email action
2. Add **"Response"** action
3. In **Headers**, add:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type
   ```

---

## Cost Considerations

**Consumption Plan Pricing:**
- First 4,000 actions/month: **FREE**
- After that: ~$0.000025 per action

**Example:**
- Your form has 2 actions (HTTP trigger + Send email)
- 50 form submissions/month = 100 actions
- Cost: **$0** (within free tier)

Even 1,000 submissions = 2,000 actions = **FREE**

---

## Advanced: Add Auto-Reply to Sender

### Add Second Email Action

1. After the first email action, click **"+ New step"**
2. Search for **"Office 365 Outlook"** (or Gmail)
3. Select **"Send an email (V2)"**
4. Configure:

**To**: (dynamic content) **email** ← the user's email  
**Subject**: `Thank you for contacting CCC Redemption Parish`  
**Body**:
```
Dear [name],

Thank you for reaching out to Celestial Church of Christ Redemption Parish Winnipeg.

We have received your message and will respond within 24-48 hours.

In the meantime, feel free to:
- Visit our website: https://cccredemptionwpg.org
- Join us for worship: Sundays 10:00 AM (CT)
- Call us: (204) 979-6644

Blessings,
CCC Redemption Parish Winnipeg

----
This is an automated response. Please do not reply to this email.
```

---

## Security Best Practices

### 1. Secure Your Logic App URL
- Never share the full URL publicly
- Regenerate if exposed (go to trigger settings → Regenerate)

### 2. Add IP Restrictions (Optional)
In Logic App settings:
- Go to **"Workflow settings"**
- Under **"Access control configuration"**
- Add allowed IP ranges (your website hosting IPs)

### 3. Add SAS Authentication
The Logic App URL already includes a SAS token (the long string after `?api-version=...`). This is secure by default.

---

## Next Steps

1. ✅ Create Logic App in Azure Portal
2. ✅ Configure HTTP trigger with JSON schema
3. ✅ Add Office 365 Outlook / Gmail email action
4. ✅ Configure email template with dynamic content
5. ✅ Add Response action (optional but recommended)
6. ✅ Save and copy the HTTP URL
7. ✅ Update `contact.html` form action or keep JavaScript fetch
8. ✅ Test form submission
9. ✅ Monitor runs history in Azure Portal

---

## Support Resources

- **Azure Logic Apps Documentation**: https://docs.microsoft.com/azure/logic-apps/
- **YouTube Tutorial**: Search "Azure Logic Apps Email Form"
- **Azure Support**: Available in Azure Portal under "Help + support"

---

**Need Help?** 
If you encounter issues, check the Logic App "Runs history" first. It shows exactly which step failed and why. Most issues are authentication-related (need to reconnect email account).

Good luck! 🚀
