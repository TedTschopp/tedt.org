// Debug script for hex-multi-scale troubleshooting
console.log('[DEBUG] Starting hex-multi-scale diagnostics...');

// Check if required dependencies are loaded
const checkDeps = () => {
  console.log('[DEBUG] Checking dependencies:');
  console.log('  - Layout:', typeof Layout !== 'undefined' ? '✓' : '✗');
  console.log('  - Hex:', typeof Hex !== 'undefined' ? '✓' : '✗');
  console.log('  - Point:', typeof Point !== 'undefined' ? '✓' : '✗');
};

// Check if canvas element exists and has proper setup
const checkCanvas = () => {
  const canvas = document.getElementById('hex-multi-scale');
  console.log('[DEBUG] Canvas element:');
  console.log('  - Found:', !!canvas ? '✓' : '✗');
  if (canvas) {
    console.log('  - Display style:', window.getComputedStyle(canvas).display);
    console.log('  - Visibility:', window.getComputedStyle(canvas).visibility);
    console.log('  - Canvas size:', canvas.width + 'x' + canvas.height);
    console.log('  - Style size:', canvas.style.width + ' x ' + canvas.style.height);
    
    // Try to draw something simple to test canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(10, 10, 50, 50);
      console.log('  - Test rectangle drawn');
    }
  }
};

// Run diagnostics when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      checkDeps();
      checkCanvas();
    }, 100);
  });
} else {
  setTimeout(() => {
    checkDeps();
    checkCanvas();
  }, 100);
}
