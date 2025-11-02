/**
 * Service Worker for Scam Detector Extension
 * Monitors URL changes and triggers checks
 */

class HomographDetector {
  constructor() {
    this.lookalikes = {
      // Cyrillic
      'а': { script: 'Cyrillic', lookalike: 'a', code: 'U+0430' },
      'е': { script: 'Cyrillic', lookalike: 'e', code: 'U+0435' },
      'о': { script: 'Cyrillic', lookalike: 'o', code: 'U+043E' },
      'р': { script: 'Cyrillic', lookalike: 'p', code: 'U+0440' },
      'с': { script: 'Cyrillic', lookalike: 'c', code: 'U+0441' },
      'у': { script: 'Cyrillic', lookalike: 'u', code: 'U+0443' },
      'х': { script: 'Cyrillic', lookalike: 'x', code: 'U+0445' },
      'н': { script: 'Cyrillic', lookalike: 'h', code: 'U+043D' },
      'м': { script: 'Cyrillic', lookalike: 'm', code: 'U+043C' },
      'В': { script: 'Cyrillic', lookalike: 'B', code: 'U+0412' },
      'Е': { script: 'Cyrillic', lookalike: 'E', code: 'U+0415' },
      'К': { script: 'Cyrillic', lookalike: 'K', code: 'U+041A' },
      'М': { script: 'Cyrillic', lookalike: 'M', code: 'U+041C' },
      'Н': { script: 'Cyrillic', lookalike: 'H', code: 'U+041D' },
      'О': { script: 'Cyrillic', lookalike: 'O', code: 'U+041E' },
      'Р': { script: 'Cyrillic', lookalike: 'P', code: 'U+0420' },
      'С': { script: 'Cyrillic', lookalike: 'C', code: 'U+0421' },
      'Х': { script: 'Cyrillic', lookalike: 'X', code: 'U+0425' },
      'ё': { script: 'Cyrillic', lookalike: 'e', code: 'U+0451' },
      'в': { script: 'Cyrillic', lookalike: 'b', code: 'U+0432' },
      'к': { script: 'Cyrillic', lookalike: 'k', code: 'U+043A' },
      // Greek
      'α': { script: 'Greek', lookalike: 'a', code: 'U+03B1' },
      'ο': { script: 'Greek', lookalike: 'o', code: 'U+03BF' },
      'ν': { script: 'Greek', lookalike: 'v', code: 'U+03BD' },
      'ρ': { script: 'Greek', lookalike: 'p', code: 'U+03C1' },
      'τ': { script: 'Greek', lookalike: 't', code: 'U+03C4' },
      // Fullwidth
      'ａ': { script: 'Fullwidth', lookalike: 'a', code: 'U+FF41' },
      'ｏ': { script: 'Fullwidth', lookalike: 'o', code: 'U+FF4F' },
      // Hebrew
      'א': { script: 'Hebrew', lookalike: 'A', code: 'U+05D0' },
      'ס': { script: 'Hebrew', lookalike: 'O', code: 'U+05E1' },
      // Armenian
      'ա': { script: 'Armenian', lookalike: 'a', code: 'U+0561' },
      'ո': { script: 'Armenian', lookalike: 'o', code: 'U+0578' },
      // Georgian
      'ა': { script: 'Georgian', lookalike: 'a', code: 'U+10D0' }
    };
  }

  getHostname(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname || '';
    } catch {
      return '';
    }
  }

  detectLookalikes(text) {
    const detections = [];
    const seenChars = new Set();

    for (let char of text) {
      if (this.lookalikes[char] && !seenChars.has(char)) {
        detections.push({
          char: char,
          ...this.lookalikes[char]
        });
        seenChars.add(char);
      }
    }

    return detections;
  }

  analyzeUrl(url) {
    const hostname = this.getHostname(url);

    if (!hostname) {
      return {
        isSuspicious: false,
        hostname: '',
        lookalikes: [],
        report: 'Invalid URL'
      };
    }

    const lookalikes = this.detectLookalikes(hostname);
    const isSuspicious = lookalikes.length > 0;

    return {
      isSuspicious,
      hostname,
      lookalikes,
      url,
      riskLevel: this.calculateRiskLevel(lookalikes),
      report: isSuspicious 
        ? `Detected ${lookalikes.length} suspicious character(s) from non-Latin scripts`
        : 'No suspicious characters detected'
    };
  }

  calculateRiskLevel(lookalikes) {
    if (lookalikes.length === 0) return 'safe';
    if (lookalikes.length === 1) return 'warning';
    return 'danger';
  }
}

// Global detector instance
const detector = new HomographDetector();
let lastAnalysis = {};

// Listen for tab updates
chrome.tabs.onActivated.addListener((activeInfo) => {
  analyzeCurrentTab();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    analyzeCurrentTab();
  }
});

// Get active tab and analyze
async function analyzeCurrentTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      const url = tabs[0].url;
      const analysis = detector.analyzeUrl(url);
      lastAnalysis = analysis;

      // Update icon color based on risk level
      updateIcon(analysis.riskLevel);

      // Store analysis for popup
      chrome.storage.session.set({ lastAnalysis: analysis });
    }
  } catch (error) {
    console.error('Error analyzing tab:', error);
  }
}

function updateIcon(riskLevel) {
  const colors = {
    safe: { color: [0, 128, 0, 255], title: 'Safe' },
    warning: { color: [255, 165, 0, 255], title: 'Warning: Suspicious characters detected' },
    danger: { color: [255, 0, 0, 255], title: 'Danger: Multiple suspicious characters detected' }
  };

  const config = colors[riskLevel] || colors.safe;

  // Create canvas for dynamic icon
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Draw background circle with color
  ctx.fillStyle = `rgba(${config.color.join(',')})`;
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, 2 * Math.PI);
  ctx.fill();

  // Draw shield or warning symbol
  ctx.fillStyle = 'white';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (riskLevel === 'safe') {
    ctx.fillText('✓', 64, 64);
  } else if (riskLevel === 'warning') {
    ctx.fillText('⚠', 64, 64);
  } else {
    ctx.fillText('✕', 64, 64);
  }

  chrome.action.setIcon({ imageData: ctx.getImageData(0, 0, 128, 128) });
  chrome.action.setTitle({ title: config.title });
}

// Initialize on startup
analyzeCurrentTab();