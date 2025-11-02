/**
 * Homograph Attack Detector
 * Identifies characters that look like ASCII but are actually from other scripts
 */

class HomographDetector {
  constructor() {
    // Map of lookalike characters: Unicode char -> ASCII equivalent
    // Format: { unicodeChar: { name: 'script_name', lookalike: 'ascii_char' } }
    this.lookalikes = {
      // Cyrillic (most common in phishing)
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

      // Latin Extended (sometimes used)
      'ａ': { script: 'Fullwidth', lookalike: 'a', code: 'U+FF41' },
      'ｏ': { script: 'Fullwidth', lookalike: 'o', code: 'U+FF4F' },

      // Hebrew (less common but possible)
      'א': { script: 'Hebrew', lookalike: 'A', code: 'U+05D0' },
      'ס': { script: 'Hebrew', lookalike: 'O', code: 'U+05E1' },

      // Armenian
      'ա': { script: 'Armenian', lookalike: 'a', code: 'U+0561' },
      'ո': { script: 'Armenian', lookalike: 'o', code: 'U+0578' },

      // Georgian
      'ა': { script: 'Georgian', lookalike: 'a', code: 'U+10D0' }
    };
  }

  /**
   * Extracts hostname from URL
   */
  getHostname(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname || '';
    } catch {
      return '';
    }
  }

  /**
   * Checks if a string contains lookalike characters
   * Returns array of detected lookalikes with details
   */
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

  /**
   * Analyzes a URL for homograph attacks
   * Returns detailed report
   */
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

  /**
   * Calculates risk level based on number and type of lookalikes
   */
  calculateRiskLevel(lookalikes) {
    if (lookalikes.length === 0) return 'safe';
    if (lookalikes.length === 1) return 'warning';
    return 'danger';
  }
}

// Export for use in service worker
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomographDetector;
}