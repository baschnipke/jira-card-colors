document.addEventListener('DOMContentLoaded', () => {
    // Load saved preferences
    chrome.storage.local.get(['backgroundType', 'transparency', 'colorblindMode', 'colorblindType'], (data) => {
        if (data.backgroundType) {
            document.querySelector(`input[name="background-type"][value="${data.backgroundType}"]`).checked = true;
        }
        if (data.transparency !== undefined) {
            document.getElementById('transparency').value = data.transparency;
        }
        if (data.colorblindMode) {
            document.getElementById('colorblind-mode').checked = data.colorblindMode;
            document.getElementById('colorblind-type').disabled = !data.colorblindMode;
            if (data.colorblindType) {
                document.getElementById('colorblind-type').value = data.colorblindType;
            }
        }
    });

    // Enable/Disable colorblind type selector based on checkbox
    document.getElementById('colorblind-mode').addEventListener('change', (e) => {
        document.getElementById('colorblind-type').disabled = !e.target.checked;
    });

    // Save preferences when Save button is clicked
    document.getElementById('save').addEventListener('click', () => {
        const backgroundType = document.querySelector('input[name="background-type"]:checked').value;
        const transparency = parseInt(document.getElementById('transparency').value, 10);
        const colorblindMode = document.getElementById('colorblind-mode').checked;
        const colorblindType = document.getElementById('colorblind-type').value;

        // Ensure transparency is within bounds
        if (transparency < 0 || transparency > 100) {
            alert("Please enter a valid transparency percentage between 0 and 100.");
            return;
        }

        chrome.storage.local.set({
            backgroundType,
            transparency,
            colorblindMode,
            colorblindType
        }, () => {
            alert('Settings saved!');
        });
    });
});
