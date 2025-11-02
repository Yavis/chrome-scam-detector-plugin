# Testing Guide

## How to Test the Extension

### 1. Basic Functionality Test

**Goal:** Verify the extension loads and displays correctly

1. Load extension into Chrome (see SETUP.md)
2. Navigate to any website
3. Click the extension icon in the toolbar
4. Verify popup appears with:
   - ✓ Safe status (if page is legit)
   - Current domain name
   - No warnings

### 2. Detection Test (Safe)

**Goal:** Confirm the detector works on legitimate domains

1. Visit these legitimate websites:
   - google.com
   - github.com
   - stackoverflow.com
   - wikipedia.org

2. Click extension icon - should show:
   - Status: "✓ Safe"
   - Risk Level: safe (green)
   - Message: "No suspicious characters detected"

### 3. Mock Detection Test (Without Visiting Malicious Sites)

**Goal:** Test detector logic without visiting actual phishing sites

#### Option A: Modify Popup for Testing

Edit `popup.js` and replace the `displayAnalysis()` function temporarily:

```javascript
async function displayAnalysis() {
  // Mock test data - change isSuspicious to test different scenarios
  const analysis = {
    isSuspicious: true,  // Change to true to see warning
    hostname: 'раypal.com',  // Cyrillic 'р' and 'а' characters
    lookalikes: [
      { char: 'р', script: 'Cyrillic', lookalike: 'p', code: 'U+0440' },
      { char: 'а', script: 'Cyrillic', lookalike: 'a', code: 'U+0430' }
    ],
    riskLevel: 'danger',
    report: 'Detected 2 suspicious character(s) from non-Latin scripts'
  };
  
  // Call renderAnalysis with mock data
  displayMockAnalysis(analysis);
}

function displayMockAnalysis(analysis) {
  const statusCard = document.getElementById('status');
  const statusMessage = document.getElementById('statusMessage');
  const hostnameContainer = document.getElementById('hostnameContainer');
  const hostnameEl = document.getElementById('hostname');
  const lookalikesContainer = document.getElementById('lookalikesContainer');
  const lookalikesEl = document.getElementById('lookalikes');

  statusCard.className = `status-card ${analysis.riskLevel}`;

  const statusIcons = {
    safe: '✓',
    warning: '⚠',
    danger: '✕'
  };

  statusCard.innerHTML = `
    <span class="status-icon ${analysis.riskLevel}">${statusIcons[analysis.riskLevel]}</span>
    <div class="status-text">
      <div class="status-title">Test: ${analysis.riskLevel.toUpperCase()}</div>
      <div class="status-message">${analysis.report}</div>
    </div>
  `;

  hostnameEl.textContent = analysis.hostname;
  hostnameContainer.style.display = 'block';

  if (analysis.lookalikes && analysis.lookalikes.length > 0) {
    lookalikesContainer.style.display = 'block';
    lookalikesEl.innerHTML = analysis.lookalikes.map(item => `
      <div class="lookalike-item">
        <span class="lookalike-char">${item.char}</span>
        <span class="lookalike-info">
          <strong>${item.script}</strong> character that looks like '<strong>${item.lookalike}</strong>' 
          <code>(${item.code})</code>
        </span>
      </div>
    `).join('');
  }
}
```

#### Option B: Test via Console

Open extension's Service Worker console:
1. Go to `chrome://extensions/`
2. Find "Scam Detector"
3. Click "Service Worker"
4. In console, test the detector:

```javascript
// Test 1: Safe domain
const detector = new HomographDetector();
const result1 = detector.analyzeUrl('https://www.google.com');
console.log('Test 1 - Google:', result1);
// Expected: isSuspicious: false, riskLevel: 'safe'

// Test 2: Cyrillic lookalikes
const result2 = detector.analyzeUrl('https://раypal.com');
console.log('Test 2 - Cyrillic:', result2);
// Expected: isSuspicious: true, riskLevel: 'danger'

// Test 3: Greek lookalikes
const result3 = detector.analyzeUrl('https://αmazon.com');
console.log('Test 3 - Greek:', result3);
// Expected: isSuspicious: true

// Test 4: Mixed scripts
const result4 = detector.analyzeUrl('https://gοοgle.com');
console.log('Test 4 - Mixed:', result4);
// Expected: isSuspicious: true, lookalikes.length >= 1
```

### 4. Test Cases by Risk Level

#### Safe (Green)
- `https://www.google.com`
- `https://github.com`
- `https://stackoverflow.com`
- `https://www.wikipedia.org`

**Expected result:** 
- Status: ✓ Safe
- Risk Level: safe
- Lookalikes: []

#### Warning (Yellow)
Modified popup with mock data containing 1 lookalike:

```javascript
const analysis = {
  isSuspicious: true,
  hostname: 'gооgle.com',  // One Cyrillic 'о'
  lookalikes: [
    { char: 'о', script: 'Cyrillic', lookalike: 'o', code: 'U+043E' }
  ],
  riskLevel: 'warning',
  report: 'Detected 1 suspicious character(s) from non-Latin scripts'
};
```

**Expected result:**
- Status: ⚠️ Warning
- Risk Level: warning  
- Lookalikes: 1 item shown

#### Danger (Red)
Modified popup with mock data containing 2+ lookalikes:

```javascript
const analysis = {
  isSuspicious: true,
  hostname: 'раypal.com',  // Cyrillic 'р' and 'а'
  lookalikes: [
    { char: 'р', script: 'Cyrillic', lookalike: 'p', code: 'U+0440' },
    { char: 'а', script: 'Cyrillic', lookalike: 'a', code: 'U+0430' }
  ],
  riskLevel: 'danger',
  report: 'Detected 2 suspicious character(s) from non-Latin scripts'
};
```

**Expected result:**
- Status: 🚨 Danger
- Risk Level: danger
- Lookalikes: 2 items shown
- Warning message displayed

### 5. Test Character Detection

Test that various scripts are detected:

#### Cyrillic Characters (most common in phishing)
- а (U+0430) vs a
- е (U+0435) vs e
- о (U+043E) vs o
- р (U+0440) vs p
- с (U+0441) vs c

To manually verify:
```javascript
// In DevTools console:
'а'.charCodeAt(0).toString(16)  // "430" = Cyrillic 'a'
'a'.charCodeAt(0).toString(16)  // "61" = ASCII 'a'
```

#### Greek Characters
- α (U+03B1) vs a
- ο (U+03BF) vs o
- ν (U+03BD) vs v

### 6. URL Format Tests

Test different URL formats:

1. **HTTPS**
   - `https://example.com` ✓

2. **HTTP**
   - `http://example.com` ✓

3. **With port**
   - `https://example.com:8080` ✓

4. **With subdomain**
   - `https://mail.gооgle.com` ✓ (detects lookalike)

5. **With path**
   - `https://example.com/page` ✓ (checks domain only)

6. **Invalid URL**
   - `not-a-url` ✓ (safely handled)

### 7. Cross-Browser Testing Checklist

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome 120+ | ✅ Tested | Primary support |
| Edge 120+ | ⚠️ Should work | Chromium-based |
| Brave | ⚠️ Should work | Chromium-based |
| Opera | ⚠️ Should work | Chromium-based |
| Vivaldi | ⚠️ Should work | Chromium-based |
| Firefox | ❌ Not tested | Different extension format |
| Safari | ❌ Not tested | Different extension format |

### 8. Performance Test

**Goal:** Verify extension doesn't slow down browsing

1. Open the DevTools Performance tab
2. Record while switching between tabs
3. Click extension icon multiple times
4. Verify popup loads in < 100ms
5. No performance degradation on rapid tab switching

### 9. Edge Cases

Test these edge cases:

1. **Empty hostname**
   - URL: `chrome://extensions/`
   - Expected: Gracefully handled, no error

2. **Very long domain**
   - URL: `https://verylongdomainnamethatshouldstillworkfine.com`
   - Expected: Analyzed correctly

3. **Numbers and special characters**
   - URL: `https://test123-example.com`
   - Expected: No false positives

4. **All lowercase lookalikes**
   - URL: `https://яндекс.ru` (Cyrillic)
   - Expected: Detected

5. **All uppercase lookalikes**
   - URL: `https://ЯНДЕКС.RU` (Cyrillic uppercase)
   - Expected: Should consider uppercase variants

### 10. Error Scenarios

1. **No internet connection**
   - Extension should still check local URL
   - Popup should display normally

2. **Browser restart**
   - Extension should reinitialize
   - Should work on first page load

3. **Tab crash**
   - Service worker should continue running
   - Should work on subsequent tab

## Regression Testing

After making changes to code, verify:

- [ ] Popup still displays
- [ ] Safe domains show green
- [ ] Lookalike detection still works
- [ ] No JavaScript errors in console
- [ ] Icon updates based on risk level
- [ ] Info section appears for suspicious domains
- [ ] Character codes display correctly

## Performance Benchmarks

Expected timing (on modern machine):
- URL analysis: < 5ms
- Popup display: < 50ms  
- Icon update: < 20ms
- No noticeable lag on page load

## Cleanup After Testing

1. **Revert test data in popup.js**
   - Remove mock analysis code

2. **Clear session storage**
   - Extension detail page → "Clear data"

3. **Reload extension**
   - Click refresh icon

4. **Verify normal operation**
   - Test with real websites

---

**Report Issues:**
If you find bugs:
1. Check the Service Worker console
2. Note exact steps to reproduce
3. Include browser version
4. Include error messages from console