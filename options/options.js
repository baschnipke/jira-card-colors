document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['backgroundType', 'transparency'], (data) => {
        if (data.backgroundType) {
            document.querySelector(`input[name="background-type"][value="${data.backgroundType}"]`).checked = true;
        }
        if (data.transparency !== undefined) {
            document.getElementById('transparency').value = data.transparency;
        }
    });

    document.getElementById('save').addEventListener('click', () => {
        const backgroundType = document.querySelector('input[name="background-type"]:checked').value;
        let transparency = parseInt(document.getElementById('transparency').value, 10);

        if (transparency < 0 || transparency > 100) {
            alert("Please enter a valid transparency percentage between 0 and 100.");
            return;
        }

        chrome.storage.local.set({ backgroundType, transparency }, () => {
            alert('Settings saved!');
        });
    });
});
