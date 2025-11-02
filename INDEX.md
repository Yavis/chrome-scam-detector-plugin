# 🛡️ Scam Detector Extension - Complete Index

## Project Overview

A **Chrome browser extension** that detects **homograph attacks** by identifying Unicode characters that visually resemble English letters but come from other scripts (Cyrillic, Greek, Hebrew, Armenian, Georgian, etc.).

**Goal**: Help users stay safe from phishing attacks using lookalike domain names.

---

## 📋 File Structure

```
scam-detector-extension/
├── 📄 manifest.json                   # Extension configuration
├── 🔧 background.js                   # Main detector engine (service worker)
├── 🎨 popup.html                      # User interface
├── 📝 popup.js                        # Popup logic
├── 🎯 homographDetector.js            # Reusable detector class
├── 🎪 generate-icons.js               # Icon generator script
├── 📜 create-icons.sh                 # Shell script for icons
├── 📦 package.json                    # Dependencies & metadata
├── 📁 icons/                          # Extension icons (generated)
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── 📚 Documentation
    ├── QUICK_START.md                 # ⭐ Start here!
    ├── SETUP.md                       # Installation & configuration
    ├── README.md                      # Full feature documentation
    ├── TESTING.md                     # Testing procedures
    └── INDEX.md                       # This file
```

---

## 🚀 Quick Links

### Getting Started
1. **First time?** → Start with [`QUICK_START.md`](QUICK_START.md)
2. **Installation help?** → Read [`SETUP.md`](SETUP.md)
3. **Full docs?** → See [`README.md`](README.md)
4. **Want to test?** → Check [`TESTING.md`](TESTING.md)

### For Developers
- **Main logic**: Edit `background.js`
- **Add characters**: Update `lookalikes` object in `background.js`
- **Customize UI**: Modify `popup.html` and `popup.js`
- **Test detector**: Use `homographDetector.js` standalone

---

## 🎯 Core Features

| Feature | File | Status |
|---------|------|--------|
| Real-time URL monitoring | `background.js` | ✅ Complete |
| Character detection | `background.js` | ✅ Complete |
| Risk assessment | `background.js` | ✅ Complete |
| Visual warnings | `popup.html/.js` | ✅ Complete |
| Icon system | `manifest.json` | ✅ Complete |
| Customization | Config-ready | ✅ Ready |

---

## 📚 File Descriptions

### Core Extension Files

#### `manifest.json`
- Extension metadata and configuration
- Defines permissions and icons
- Registers service worker and popup

#### `background.js`  
- **Main engine** - runs in the background
- Monitors tab URL changes
- Analyzes URLs for lookalikes
- Updates icon based on risk level
- Contains `HomographDetector` class

#### `popup.html`
- **User interface** when icon is clicked
- Shows detection results
- Displays suspicious characters with details
- Styled for light/dark mode

#### `popup.js`
- Displays analysis results in UI
- Retrieves stored analysis from service worker
- Renders lookalike character details

### Configuration Files

#### `manifest.json`
Permissions used:
- `activeTab` - Access current tab info
- `scripting` - Execute scripts
- `tabs` - Monitor tab changes

#### `package.json`
- Project metadata
- Can add dev dependencies later

### Utility Files

#### `homographDetector.js`
- Standalone detector class
- Can be used independently
- Reference implementation

#### `generate-icons.js`
- Creates PNG icons via ImageMagick or fallback
- Node.js script
- Provides placeholder generation

#### `create-icons.sh`
- Bash script for icon generation
- Cross-platform compatible
- Easy one-command setup

### Documentation

#### `QUICK_START.md` ⭐ START HERE
- 60-second setup guide
- Key features overview
- Troubleshooting table

#### `SETUP.md`
- Step-by-step installation
- Configuration options
- Character code reference
- Development tips

#### `README.md`
- Complete feature documentation
- How homograph attacks work
- Limitations and future plans
- Security notes

#### `TESTING.md`
- Comprehensive testing procedures
- Test cases by risk level
- Mock data examples
- Performance benchmarks

#### `INDEX.md` (this file)
- Project overview
- File descriptions
- Quick navigation

---

## 🔍 Character Detection

### Supported Scripts

#### Cyrillic (U+04XX)
Most common in phishing attacks:
- а (U+0430) → 'a'
- е (U+0435) → 'e'
- о (U+043E) → 'o'
- р (U+0440) → 'p'
- с (U+0441) → 'c'
- и many more...

#### Greek (U+03XX)
- α (U+03B1) → 'a'
- ο (U+03BF) → 'o'
- ν (U+03BD) → 'v'

#### Other Scripts
- Hebrew, Armenian, Georgian, Fullwidth

### How to Add More

Edit `background.js`, locate `this.lookalikes`:

```javascript
this.lookalikes = {
  'YOUR_CHAR': { 
    script: 'ScriptName', 
    lookalike: 'ascii_char', 
    code: 'U+XXXX' 
  }
};
```

To find Unicode:
```javascript
'а'.charCodeAt(0).toString(16)  // Returns "430"
// Format: U+0430
```

---

## 🎮 How It Works

### Detection Flow

```
1. User visits website
   ↓
2. background.js detects URL change
   ↓
3. Extract hostname (e.g., "gооgle.com")
   ↓
4. Check each character against lookalikes map
   ↓
5. Calculate risk level:
   - 0 suspicious chars → SAFE (green)
   - 1 suspicious char → WARNING (yellow)
   - 2+ suspicious chars → DANGER (red)
   ↓
6. Update icon color
   ↓
7. Store analysis in session storage
   ↓
8. User clicks icon → popup displays results
```

### Risk Levels

| Level | Color | Icon | Example |
|-------|-------|------|---------|
| Safe | 🟢 Green | ✓ | google.com |
| Warning | 🟠 Yellow | ⚠️ | gооgle.com (1 lookalike) |
| Danger | 🔴 Red | ✕ | раypal.com (2+ lookalikes) |

---

## 🔧 Customization

### Change Detection Threshold

In `background.js`:
```javascript
calculateRiskLevel(lookalikes) {
  if (lookalikes.length === 0) return 'safe';
  if (lookalikes.length === 1) return 'warning';  // ← Change here
  return 'danger';
}
```

### Add Custom Scripts

Add to `lookalikes` in `background.js`:
```javascript
'ḟ': { script: 'Latin Extended', lookalike: 'f', code: 'U+1E1F' }
```

### Change Icon Colors

In `updateIcon()` function:
```javascript
const colors = {
  safe: { color: [0, 128, 0, 255], ... },     // RGB Green
  warning: { color: [255, 165, 0, 255], ... }, // RGB Orange
  danger: { color: [255, 0, 0, 255], ... }     // RGB Red
};
```

### Modify UI Styling

Edit `popup.html` in the `<style>` section:
```css
/* Change background */
body {
  background: #f5f5f5;  /* ← Your color */
}

/* Change header color */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## 🧪 Testing Quick Reference

### Test Safe Domain
```javascript
detector.analyzeUrl('https://www.google.com')
// Expected: riskLevel: 'safe', isSuspicious: false
```

### Test Mock Phishing
See TESTING.md for detailed procedures using mock data.

### Via Console
1. Go to `chrome://extensions/`
2. Click "Service Worker" on extension detail
3. Run test code in console

---

## 🚀 Installation Summary

```bash
# 1. Ensure icons exist
mkdir -p icons

# 2. Generate icons (optional)
./create-icons.sh
# or
node generate-icons.js

# 3. Load in Chrome
# - Go to chrome://extensions/
# - Enable Developer mode
# - Click "Load unpacked"
# - Select this folder

# 4. Verify
# - Icon appears in toolbar
# - Click to open popup
# - Should work on any website
```

---

## 📊 Supported Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full | Primary target |
| Edge | ✅ Full | Chromium-based |
| Brave | ✅ Full | Chromium-based |
| Opera | ✅ Full | Chromium-based |
| Vivaldi | ✅ Full | Chromium-based |
| Firefox | ⚠️ Needs work | Different extension format |
| Safari | ⚠️ Needs work | Different extension format |

---

## 🔐 Security Notes

⚠️ **This is a supplementary tool, not a complete security solution.**

Always:
- Verify domains before entering sensitive info
- Use strong, unique passwords
- Enable 2-factor authentication
- Keep browser/OS updated
- Use a reputable password manager

---

## 🚧 Future Enhancements

- [ ] Whitelist trusted domains
- [ ] Machine learning for pattern detection
- [ ] Firefox/Safari support
- [ ] User-configurable sensitivity
- [ ] Domain reputation checking
- [ ] Statistics dashboard
- [ ] WHOIS lookup integration
- [ ] Publish to Chrome Web Store

---

## 📞 Troubleshooting

### Common Issues

**Extension not showing**
→ See SETUP.md section "Troubleshooting"

**Popup doesn't load**
→ Check Service Worker logs at chrome://extensions/

**Wrong detections**
→ Review lookalikes map in background.js

**Icons missing**
→ Run `mkdir -p icons && ./create-icons.sh`

See TESTING.md for comprehensive testing guide.

---

## 📖 Documentation Map

```
Getting Started
├── QUICK_START.md          (60-sec setup)
├── SETUP.md                (installation & config)
├── README.md               (full documentation)
└── TESTING.md              (testing procedures)

Development
├── background.js           (main logic)
├── popup.js                (UI logic)
├── homographDetector.js    (detector class)
└── manifest.json           (config)

Tools
├── create-icons.sh         (icon generation)
└── generate-icons.js       (Node script)

This Overview
└── INDEX.md                (you are here)
```

---

## 📝 Project Notes

- **Language**: JavaScript (Manifest v3)
- **Target**: Chrome/Chromium browsers
- **Size**: Lightweight (~50KB)
- **Permissions**: Minimal (activeTab, scripting, tabs)
- **Performance**: < 5ms URL analysis
- **No data collection**: All processing local

---

## ✅ Checklist

- [x] Extension manifest created
- [x] URL detection engine implemented
- [x] Character lookalike database populated
- [x] UI popup designed
- [x] Icon system setup
- [x] Documentation complete
- [x] Testing guide provided
- [x] Installation simplified

---

## 🎯 Next Steps

1. **Read**: Start with `QUICK_START.md`
2. **Install**: Follow `SETUP.md`
3. **Verify**: Check `TESTING.md`
4. **Customize**: Edit config in `background.js`
5. **Deploy**: Package for Chrome Web Store (future)

---

**Ready to protect yourself from phishing?** 🛡️

Start with [`QUICK_START.md`](QUICK_START.md)!