chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.get('siteUrls', function (data) {
        const sites = data.siteUrls || [];

        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if (changeInfo.status === 'complete') {
                sites.forEach(site => {
                    const regex = new RegExp(site.replace('.', '\\.').replace('*', '.*'), 'i');
                    if (tab.url.match(regex)) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['scripts/content.js']
                        });
                    }
                });
            }
        });
    });
});
