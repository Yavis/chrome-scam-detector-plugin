# 🚀 Quick Start

## 60-Second Setup

```bash
# 1. Navigate to extension folder
cd scam-detector-extension

# 2. Create icons (optional)
mkdir -p icons

# 3. Open Chrome and go to:
chrome://extensions/

# 4. Enable Developer mode (top right)

# 5. Click "Load unpacked" → select this folder

# 6. Done! 🎉
```

## Verify It Works

1. Click the extension icon (🛡️) in your toolbar
2. You should see a popup with domain analysis
3. Safe sites show ✓ Green
4. Suspicious sites show ⚠️ Yellow or 🚨 Red

## What This Extension Does

**Detects homograph attacks** - when scammers use characters from other languages (Cyrillic, Greek, etc.) that look identical to English letters.

Example:
- `gооgle.com` (with Cyrillic 'о' U+043E) 
- Looks like `google.com` 
- But it's actually a phishing site!

## Key Files

| File | Purpose |
|------|---------|
| `background.js` | Main detector engine |
| `popup.html/js` | Warning UI |
| `manifest.json` | Extension config |

## Supported Lookalikes

✅ **Cyrillic** (а, е, о, р, с, у, х, н, м, etc.)  
✅ **Greek** (α, ο, ν, ρ, τ, etc.)  
✅ **Hebrew, Armenian, Georgian** (and more)

## Test It

### Safe (should be green ✓):
- google.com
- github.com
- stackoverflow.com

### For mock testing without visiting malicious sites:
See TESTING.md for detailed test procedures.

## Configuration

Want to add more characters? Edit `background.js`:

```javascript
this.lookalikes = {
  'а': { script: 'Cyrillic', lookalike: 'a', code: 'U+0430' },
  // Add your characters here:
  'YOUR_CHAR': { script: 'Script', lookalike: 'ascii', code: 'U+XXXX' }
};
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Extension not showing | Refresh `chrome://extensions/` |
| Popup doesn't open | Check Service Worker console for errors |
| No icons visible | Run `mkdir -p icons` then reload extension |
| Wrong detections | Check lookalikes map in `background.js` |

## Full Documentation

- **README.md** - Complete feature guide
- **SETUP.md** - Detailed installation & configuration
- **TESTING.md** - Comprehensive testing guide
- **This file** - Quick reference

## Browser Support

✅ Chrome, Edge, Brave, Opera, Vivaldi (any Chromium-based)  
⚠️ Firefox, Safari (would need separate versions)

## Learn More

- What is a homograph attack? https://en.wikipedia.org/wiki/Homograph_attack
- Unicode character lookup: https://unicode-table.com
- Finding Unicode of a character:
  ```javascript
  'а'.charCodeAt(0).toString(16)  // Returns "430"
  ```

---

**Ready?** Load the extension and start protecting yourself! 🛡️