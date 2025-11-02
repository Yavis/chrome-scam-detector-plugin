# Quick Setup Guide

## Prerequisites
- Chrome/Chromium browser (latest version)
- Basic file access

## Installation Steps

### 1. Prepare Icons (Optional)

The extension includes a dynamic icon generator, but for better visual quality, create placeholder icons:

```bash
# Navigate to extension directory
cd scam-detector-extension

# Option A: Create placeholder icons
mkdir -p icons
node generate-icons.js

# Option B: Manual - Create 3 PNG files
# - icons/icon-16.png (16×16)
# - icons/icon-48.png (48×48)
# - icons/icon-128.png (128×128)
```

### 2. Load Extension into Chrome

1. **Open Chrome Extensions page**
   - Type in address bar: `chrome://extensions/`
   - Or go to: ☰ Menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" in top right corner

3. **Load Unpacked**
   - Click "Load unpacked" button
   - Navigate to and select the `scam-detector-extension` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Scam Detector" in your extension list
   - Extension icon (🛡️) appears in toolbar

### 3. Test It Works

1. Click the extension icon - you should see:
   - A popup showing "Safe" (if current page has no lookalikes)
   - The domain being analyzed

2. **Create a test case** (don't actually visit malicious sites):
   - Open popup developer tools: Right-click popup → Inspect
   - Go to Console tab in popup's DevTools
   - You can manually test the detector

### 4. Troubleshooting

**Icons not showing:**
- Generate them with: `node generate-icons.js`
- Reload extension: Click refresh icon on extension card

**Extension crashes on some sites:**
- Check Service Worker logs: Click "Service Worker" link on extension detail page
- Look for errors in console

**Popup doesn't load:**
- Clear extension storage: Extension detail page → "Clear data"
- Reload extension with refresh button

## Configuration

### Add More Lookalike Characters

Edit `background.js`, find the `lookalikes` object:

```javascript
this.lookalikes = {
  'а': { script: 'Cyrillic', lookalike: 'a', code: 'U+0430' },
  // Add your custom entries here:
  ' yourChar': { script: 'YourScript', lookalike: 'ascii', code: 'U+XXXX' },
};
```

To find Unicode codes for characters:
- Copy the character and paste into a JavaScript console:
  ```javascript
  'а'.charCodeAt(0).toString(16)  // Returns "430"
  // Unicode: U+0430
  ```

### Change Risk Level Thresholds

In `background.js`, modify `calculateRiskLevel()`:

```javascript
calculateRiskLevel(lookalikes) {
  if (lookalikes.length === 0) return 'safe';
  if (lookalikes.length === 1) return 'warning';  // Change threshold here
  return 'danger';
}
```

## Files You Should Know About

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration (version, permissions, etc.) |
| `background.js` | Main logic - monitors URLs and detects lookalikes |
| `popup.html` | User interface when clicking extension icon |
| `popup.js` | Logic for displaying detection results |
| `homographDetector.js` | Reusable detector class (reference) |

## Common Character Codes (for reference)

### Cyrillic (U+04XX range)
- а (U+0430) looks like 'a'
- е (U+0435) looks like 'e'  
- о (U+043E) looks like 'o'
- р (U+0440) looks like 'p'
- с (U+0441) looks like 'c'
- х (U+0445) looks like 'x'
- у (U+0443) looks like 'u'

### Greek (U+03XX range)
- α (U+03B1) looks like 'a'
- ο (U+03BF) looks like 'o'
- ν (U+03BD) looks like 'v'

## Testing with Mock Data

To test without actually visiting suspicious sites, modify `popup.js`:

```javascript
// Add at the beginning of displayAnalysis()
if (true) { // Set to true for testing
  const analysis = {
    isSuspicious: true,
    hostname: 'раypal.com',
    lookalikes: [
      { char: 'р', script: 'Cyrillic', lookalike: 'p', code: 'U+0440' },
      { char: 'а', script: 'Cyrillic', lookalike: 'a', code: 'U+0430' }
    ],
    riskLevel: 'danger',
    report: 'Detected 2 suspicious character(s) from non-Latin scripts'
  };
  // ... then render analysis
}
```

## Development Tips

### View Service Worker Logs
1. Go to `chrome://extensions/`
2. Find "Scam Detector"
3. Click "Service Worker" - opens DevTools
4. See real-time logs of URL analysis

### Debug Popup
1. Click extension icon
2. Right-click popup → Inspect
3. Use DevTools to debug `popup.js`

### Test Different Domains

Try analyzing these (if safe, or in controlled environment):
- Domains with mixed scripts
- Internationalized domains (IDN)
- Subdomains with lookalikes

## Next Steps

- 📖 Read README.md for full feature documentation
- 🔧 Customize lookalike characters for your needs
- ✅ Test with various domains
- 🚀 Consider packaging for Chrome Web Store (in future)

---

**Need help?** Check browser console for error messages!