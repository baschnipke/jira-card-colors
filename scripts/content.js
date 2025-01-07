const observer = new MutationObserver(() => {
    document.querySelectorAll('div[class*="cardColorInner"]').forEach(div => {
        const color = div.getAttribute('color');
        if (!color) return;

        // Get user preferences from storage
        chrome.storage.local.get(['backgroundType', 'transparency', 'colorblindMode', 'colorblindType'], (data) => {
            const backgroundType = data.backgroundType || 'solid';
            // Convert transparency from percentage (0-100) to decimal (0-1)
            const transparency = (data.transparency !== undefined) ? data.transparency / 100 : 0.8; // Convert percentage to 0-1

            const colorblindMode = data.colorblindMode || false;
            const colorblindType = data.colorblindType || 'deuteranopia';  // Default to Deuteranopia

            // Adjust the color based on the selected colorblind type if colorblind mode is enabled
            const finalColor = colorblindMode ? adjustColorForColorblindness(color, colorblindType) : color;

            // Convert color to rgba with transparency
            const rgbaColor = hexToRgba(finalColor, transparency);

            const button = div.closest('div[data-testid="platform-board-kit.ui.card.card"]')
                ?.querySelector('button[data-testid="platform-card.ui.card.focus-container"]');

            if (button) {
                // Clear previous background styles
                button.style.backgroundImage = "";
                button.style.backgroundColor = "";

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

// Adjust the observer to only observe relevant parts of the DOM
observer.observe(document.body, {
    childList: true,     // Observe for added or removed child nodes
    subtree: true,      // Don't observe entire document (this prevents a lot of unnecessary checks)
    attributes: true,    // Observe changes in attributes like the 'color' attribute
    attributeFilter: ['color'], // Only observe changes to the color and class attributes
});

// Convert hex color to rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Adjust color based on the selected colorblind type
function adjustColorForColorblindness(color, type) {
    const colorblindAdjustments = {
        'deuteranopia': {
            "#8F7EE7": "#9C88D8",  // Purple
            "#DA62AC": "#E76A8D",  // Magenta
            "#F15B50": "#F55055",  // Red
            "#E56910": "#F57C2A",  // Orange
            "#B38600": "#D19C2E",  // Yellow
            "#6A9A23": "#6A9923",  // Lime
            "#22A06B": "#30B368",  // Green
            "#2898BD": "#2988A9",  // Teal
            "#388BFF": "#4298FF",  // Blue
            "#8590A2": "#8A98B0",  // Grey
            "#5E4DB2": "#5C4B91",  // Dark Purple
            "#943D73": "#9B4875",  // Dark Magenta
            "#AE2E24": "#B44F3B",  // Dark Red
            "#A54800": "#B66E1D",  // Dark Orange
            "#7F5F01": "#A26C2A",  // Dark Yellow
            "#4C6B1F": "#557D2E",  // Dark Lime
            "#216E4E": "#278357",  // Dark Green
            "#206A83": "#268FA9",  // Dark Teal
            "#0055CC": "#0055B3",  // Dark Blue
            "#44546F": "#4D5A77"   // Dark Grey
        },
        'protanopia': {
            "#8F7EE7": "#9C6BC7",  // Adjusted for Protanopia
            "#DA62AC": "#E76C8E",
            "#F15B50": "#F55055",
            "#E56910": "#F57C2A",
            "#B38600": "#D19C2E",
            "#6A9A23": "#6A9923",
            "#22A06B": "#30B368",
            "#2898BD": "#2988A9",
            "#388BFF": "#4298FF",
            "#8590A2": "#8A98B0",
            "#5E4DB2": "#5C4B91",
            "#943D73": "#9B4875",
            "#AE2E24": "#B44F3B",
            "#A54800": "#B66E1D",
            "#7F5F01": "#A26C2A",
            "#4C6B1F": "#557D2E",
            "#216E4E": "#278357",
            "#206A83": "#268FA9",
            "#0055CC": "#0055B3",
            "#44546F": "#4D5A77"
        },
        'tritanopia': {
            "#8F7EE7": "#C9A4D1",  // Adjusted for Tritanopia
            "#DA62AC": "#D67392",
            "#F15B50": "#F56359",
            "#E56910": "#F57C3A",
            "#B38600": "#D19C2F",
            "#6A9A23": "#7C9E23",
            "#22A06B": "#30A168",
            "#2898BD": "#3194C4",
            "#388BFF": "#4298F6",
            "#8590A2": "#8A98B0",
            "#5E4DB2": "#A073D1",
            "#943D73": "#9F518D",
            "#AE2E24": "#B85459",
            "#A54800": "#B66E1F",
            "#7F5F01": "#A26C2A",
            "#4C6B1F": "#557D2E",
            "#216E4E": "#278357",
            "#206A83": "#268FA9",
            "#0055CC": "#0055B3",
            "#44546F": "#4D5A77"
        }
    };

    // Normalize the color and ensure it's in the format with uppercase letters
    const normalizedColor = color.trim().toUpperCase();

    // Look up the normalized color in the adjustment object
    const adjustedColor = colorblindAdjustments[type] && colorblindAdjustments[type][normalizedColor];

    // If an adjustment is found, return it; otherwise, return the original color
    if (adjustedColor) {
        return adjustedColor;
    } else {
        return color;
    }
}


