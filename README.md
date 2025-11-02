# 🛡️ Scam Detector Extension

A Chrome extension that detects homograph attacks by identifying Unicode characters that look like English letters but are from other scripts (primarily Cyrillic, Greek, and others).

## Features

✅ **Real-time URL Analysis** - Automatically checks every page you visit  
✅ **Homograph Detection** - Identifies lookalike characters from multiple scripts:
  - Cyrillic (а, е, о, р, с, etc.)
  - Greek (α, ο, ν, ρ, τ, etc.)
  - Hebrew, Armenian, Georgian
  - Fullwidth and other Unicode variants

✅ **Risk Levels** - Color-coded warnings:
  - 🟢 **Safe** - No suspicious characters
  - 🟠 **Warning** - 1 suspicious character detected
  - 🔴 **Danger** - Multiple suspicious characters detected

✅ **Detailed Reporting** - Shows exactly which characters are suspicious and which script they're from

## How It Works

Scammers use homograph attacks to create fake URLs that look identical to legitimate ones. For example:
- `gооgle.com` (with Cyrillic 'о' U+043E instead of ASCII 'o')
- `раypal.com` (with Cyrillic 'р' and 'a' mixed with ASCII)

This extension checks every domain you visit and warns you if it detects these lookalike characters.

## Installation

### From Source (Development Mode)

1. **Prepare Icons** (optional but recommended):
   ```bash
   ./create-icons.sh
   ```
   This will generate PNG icons, or see "Icon Setup" section below.

2. **Load into Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable **"Developer mode"** (top right toggle)
   - Click **"Load unpacked"**
   - Select the `scam-detector-extension` directory

3. **Verify Installation**:
   - You should see the extension icon (🛡️) in your toolbar
   - Click it to see the popup

## Configuration

### Customize Lookalikes (Advanced)

Edit `background.js` to add more character mappings to the `lookalikes` object:

```javascript
this.lookalikes = {
  'а': { script: 'Cyrillic', lookalike: 'a', code: 'U+0430' },
  'YOUR_CHAR': { script: 'YourScript', lookalike: 'ascii_char', code: 'U+XXXX' },
  // ... more entries
};
```

## Icon Setup

### Option 1: Use Simple SVG Icons (No Dependencies)

Replace `manifest.json` with SVG icons. The extension will generate icons dynamically anyway via the service worker, so you can use simple colored circles.

### Option 2: Generate PNG Icons

Create `icons` directory and add three PNG files:
- `icon-16.png` (16×16 pixels)
- `icon-48.png` (48×48 pixels)  
- `icon-128.png` (128×128 pixels)

Or run the icon generation script:

```bash
mkdir -p icons
node generate-icons.js
```

### Option 3: Remove Icon References (Minimal)

The extension will still work without static icons since `background.js` generates icons dynamically. You can comment out the icon references in `manifest.json`.

## Files Overview

```
scam-detector-extension/
├── manifest.json              # Extension configuration
├── background.js              # Service worker (main logic)
├── popup.html                 # UI for the popup
├── popup.js                   # Popup logic
├── homographDetector.js        # Reusable detector class
├── icons/                     # Extension icons (16, 48, 128px)
└── README.md                  # This file
```

## Usage

1. **Browse normally** - The extension runs in the background
2. **See alerts** - If a suspicious domain is detected:
   - Icon color changes (yellow for warning, red for danger)
   - Click the icon to see detailed report
   - View which characters are suspicious and their Unicode codes

3. **Decide** - Use your judgment:
   - Did you intentionally visit this site?
   - Do you recognize the domain?
   - When in doubt, don't proceed!

## Security Notes

⚠️ **This is a supplementary tool** - It's not a complete security solution. Always:
- Verify domains carefully before entering sensitive info
- Use strong, unique passwords
- Enable 2FA on important accounts
- Keep your browser and OS updated

## Testing

### Test Domains (for demonstration - don't actually visit suspicious sites)

Try these to test the extension:
- Mock Cyrillic: `gооgle.com` (with Cyrillic о)
- Would show: Warning or Danger badge
- Check popup for details

### Local Testing

You can modify `popup.js` to test with mock data:

```javascript
const mockAnalysis = {
  isSuspicious: true,
  hostname: 'раypal.com',
  lookalikes: [
    { char: 'р', script: 'Cyrillic', lookalike: 'p', code: 'U+0440' }
  ],
  riskLevel: 'danger'
};
```

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Chromium-based: Edge, Brave, Opera, Vivaldi
- ⚠️ Firefox (requires adaptation - uses different API)
- ❌ Safari (uses different extension format)

## Known Limitations

1. **IDN (Internationalized Domain Names)** - Some browsers auto-convert IDN to ASCII, hiding lookalikes
2. **Already-blocked domains** - Browser security may block known phishing sites first
3. **Subdomains** - Checks full subdomain names (not just the main domain)

## Future Enhancements

- [ ] Whitelist trusted domains
- [ ] Machine learning to detect mixed-script patterns
- [ ] Extended alphabet support (detecting mixed scripts)
- [ ] User-configurable sensitivity levels
- [ ] Firefox/Safari support
- [ ] Statistics on scam attempts detected
- [ ] Integration with DNS/WHOIS lookup

## Troubleshooting

### Extension not showing up
- Refresh Chrome extensions page: `chrome://extensions/`
- Clear cache: Settings → Privacy → Clear browsing data

### Icons not displaying
- Check if `icons/` directory exists
- Verify PNG files are valid
- Try reloading the extension

### Not detecting domains
- Check browser console for errors: DevTools → Extension → Service Worker
- Verify URL format is valid (http://, https://, etc.)

## Contributing

Found a problematic character we're missing? Submit details about:
- The character and its Unicode code point
- What script it's from
- What ASCII character it resembles

## License

Open source - feel free to use and modify

## Support

If you encounter issues:
1. Check the browser console for errors
2. Look at Service Worker logs in chrome://extensions/
3. Clear extension data and reload

---

**Stay safe online!** 🛡️