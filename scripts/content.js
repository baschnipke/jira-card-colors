const observer = new MutationObserver(() => {
    document.querySelectorAll('div[class*="cardColorInner"]').forEach(div => {
        const color = div.getAttribute('color');
        if (!color) return;

        // Get user preferences from storage
        chrome.storage.local.get(['backgroundType', 'transparency'], (data) => {
            const backgroundType = data.backgroundType || 'solid';
            // Convert transparency from percentage (0-100) to decimal (0-1)
            const transparency = (data.transparency !== undefined) ? data.transparency / 100 : 0.8; // Convert percentage to 0-1

            // Convert color to rgba with transparency
            const rgbaColor = hexToRgba(color, transparency);

            const button = div.closest('div[data-testid="platform-board-kit.ui.card.card"]')
                ?.querySelector('button[data-testid="platform-card.ui.card.focus-container"]');

            if (button) {
                if (backgroundType === 'stripes') {
                    button.style.backgroundImage = `linear-gradient(45deg, ${rgbaColor} 25%, transparent 25%, transparent 50%, ${rgbaColor} 50%, ${rgbaColor} 75%, transparent 75%, transparent)`;
                    button.style.backgroundSize = '10px 10px';  // Control the size of the stripes
                } else {
                    button.style.backgroundColor = rgbaColor;
                }
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
});

// Function to convert hex color to rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
