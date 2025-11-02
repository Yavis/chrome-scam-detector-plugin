/**
 * Popup Script - Display analysis results
 */

async function displayAnalysis() {
  try {
    // Get stored analysis from session storage
    const result = await chrome.storage.session.get('lastAnalysis');
    const analysis = result.lastAnalysis;

    if (!analysis) {
      displayError('Could not analyze this page');
      return;
    }

    const statusCard = document.getElementById('status');
    const statusMessage = document.getElementById('statusMessage');
    const hostnameContainer = document.getElementById('hostnameContainer');
    const hostnameEl = document.getElementById('hostname');
    const lookalikesContainer = document.getElementById('lookalikesContainer');
    const lookalikesEl = document.getElementById('lookalikes');
    const infoBox = document.getElementById('infoBox');

    // Update status card
    statusCard.className = `status-card ${analysis.riskLevel}`;

    const statusTitles = {
      safe: '✓ Safe',
      warning: '⚠️ Warning',
      danger: '🚨 Danger'
    };

    const statusIcons = {
      safe: '✓',
      warning: '⚠',
      danger: '✕'
    };

    statusCard.innerHTML = `
      <span class="status-icon ${analysis.riskLevel}">${statusIcons[analysis.riskLevel]}</span>
      <div class="status-text">
        <div class="status-title">${statusTitles[analysis.riskLevel]}</div>
        <div class="status-message">${analysis.report}</div>
      </div>
    `;

    // Display hostname
    hostnameEl.textContent = analysis.hostname;
    hostnameContainer.style.display = 'block';

    // Display lookalikes
    if (analysis.lookalikes && analysis.lookalikes.length > 0) {
      lookalikesContainer.style.display = 'block';
      infoBox.style.display = 'block';

      lookalikesEl.innerHTML = analysis.lookalikes.map(item => `
        <div class="lookalike-item">
          <span class="lookalike-char">${item.char}</span>
          <span class="lookalike-info">
            <strong>${item.script}</strong> character that looks like '<strong>${item.lookalike}</strong>' 
            <code>(${item.code})</code>
          </span>
        </div>
      `).join('');
    } else {
      lookalikesContainer.style.display = 'none';
      infoBox.style.display = 'none';
    }

  } catch (error) {
    console.error('Error displaying analysis:', error);
    displayError('Error analyzing page: ' + error.message);
  }
}

function displayError(message) {
  const statusCard = document.getElementById('status');
  statusCard.className = 'status-card warning';
  statusCard.innerHTML = `
    <span class="status-icon warning">ℹ️</span>
    <div class="status-text">
      <div class="status-title">Info</div>
      <div class="status-message">${message}</div>
    </div>
  `;
}

// Run on popup open
document.addEventListener('DOMContentLoaded', displayAnalysis);