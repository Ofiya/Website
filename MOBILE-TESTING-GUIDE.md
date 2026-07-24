# Mobile Interface Testing Guide

## 🧪 Mobile Testing Tools & Methods

### **Option 1: Browser DevTools (Best for Quick Testing)**

#### **Chrome/Edge:**
1. Press `F12` to open DevTools
2. Click **Toggle Device Toolbar** (Ctrl+Shift+M)
3. Select device from dropdown:
   - iPhone 12/13 Pro (390x844)
   - iPhone SE (375x667)
   - Samsung Galaxy S20 (360x800)
   - iPad Air (820x1180)

#### **Test Checklist:**
- ✅ Scroll down → Header should slide up (disappear)
- ✅ Scroll up → Header should slide back down (appear)
- ✅ At top of page → Header always visible
- ✅ Switch between pages → Consistent behavior
- ✅ Logo clear and readable (55px mobile)
- ✅ Navigation in 2-column grid
- ✅ Watch Live button visible

---

### **Option 2: Live Site Testing (Most Accurate)**

**Test on actual devices or live site:**
https://cccredemptionwpg.org

**Mobile Devices to Test:**
- 📱 iPhone (Safari)
- 📱 Android (Chrome)
- 📱 iPad (Safari)

**What to Check:**
1. **Header Behavior:**
   - Start at top of page (header visible)
   - Scroll down slowly (header should slide up after ~80px)
   - Scroll back up (header should slide down immediately)
   - Scroll to top (header should be visible)

2. **All Pages:**
   - Test on: Home, About, Services, Projects, Events, Contact
   - All should have identical scroll behavior

3. **Performance:**
   - Video loads smoothly (48.7 MB compressed)
   - Scroll is smooth (no lag)
   - Header animation is smooth (0.3s transition)

---

### **Option 3: Responsive Design Testing Tools**

#### **Online Tools:**
1. **Responsively App** (Free Desktop App)
   - Download: https://responsively.app/
   - Tests multiple devices simultaneously

2. **BrowserStack** (Paid - Free Trial)
   - Real device testing
   - https://www.browserstack.com/

3. **LambdaTest** (Paid - Free Trial)
   - Cross-browser testing
   - https://www.lambdatest.com/

#### **Browser Extensions:**
- **Responsive Viewer** (Chrome)
- **Mobile Simulator** (Edge)

---

### **Option 4: PowerShell Script for Local Testing**

Run this to open the site in different window sizes:

```powershell
# Desktop view
Start-Process "chrome.exe" "file:///C:/WebsiteNew/website/index.html" -ArgumentList "--window-size=1920,1080"

# Tablet view
Start-Process "chrome.exe" "file:///C:/WebsiteNew/website/index.html" -ArgumentList "--window-size=768,1024"

# Mobile view
Start-Process "chrome.exe" "file:///C:/WebsiteNew/website/index.html" -ArgumentList "--window-size=390,844"
```

---

## 📊 Expected Mobile Behavior

### **Current Implementation:**

| Screen Width | Header Behavior | Logo Size |
|--------------|----------------|-----------|
| **>768px** (Desktop) | Always visible | 80px |
| **≤768px** (Tablet) | Auto-hides on scroll down | 60px |
| **≤480px** (Mobile) | Auto-hides on scroll down | 55px |

### **Scroll Thresholds:**
- **80px**: Minimum scroll before header can hide
- **10ms**: Debounce delay for smooth performance

### **Animation:**
- **0.3s ease**: Smooth slide up/down transition
- **Transform**: `translateY(-100%)` to hide

---

## 🐛 Troubleshooting

### **Header Not Hiding?**

**Check 1:** Viewport Width
```javascript
// In browser console (F12):
console.log(window.innerWidth);
// Should be ≤768 for mobile behavior
```

**Check 2:** JavaScript Loaded
```javascript
// In browser console:
console.log(typeof lastScrollTop);
// Should be "number", not "undefined"
```

**Check 3:** CSS Class Applied
```javascript
// In browser console after scrolling down:
console.log(document.querySelector('.navbar').classList);
// Should contain "navbar-hidden" when scrolled down
```

### **Header Hiding Too Early/Late?**

The threshold is 80px. To adjust:
1. Open the HTML file
2. Find: `currentScroll > 80`
3. Change to desired value (e.g., `100` or `50`)

---

## ✅ Current Status (After Latest Commit)

**Commit:** `c2e7320a` - "Add mobile header scroll-hide to remaining pages"

**Pages with Mobile Header:**
- ✅ index.html (Home)
- ✅ about.html (About Us)
- ✅ services.html (Weekly Programs)
- ✅ projects.html (Projects)
- ✅ events.html (Events)
- ✅ contact.html (Contact Us)

**All pages should now have consistent behavior!**

---

## 🎯 Quick Test Script

Open browser console (F12) and run:

```javascript
// Test mobile detection
console.log('Is Mobile:', window.innerWidth <= 768);

// Test scroll position
window.addEventListener('scroll', () => {
    const pos = window.pageYOffset;
    const header = document.querySelector('.navbar');
    console.log(`Scroll: ${pos}px | Hidden: ${header.classList.contains('navbar-hidden')}`);
});
```

Scroll the page and watch console for real-time feedback!

---

## 📱 Recommended Testing Flow

1. **Open site in Chrome/Edge**
2. **Press F12** (DevTools)
3. **Press Ctrl+Shift+M** (Mobile view)
4. **Select "iPhone 12 Pro"** from dropdown
5. **Scroll down** → Watch header slide up
6. **Scroll up** → Watch header slide down
7. **Click different pages** → Test consistency
8. **Check on real phone** → Final validation

---

**Your site is now mobile-optimized! 🎉**
