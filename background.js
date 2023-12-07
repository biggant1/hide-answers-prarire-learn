let allowedUrls = ["https://us.prairielearn.com/pl/"]

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.runtime.onStartup.addListener(async () => {
    try {
        await chrome.scripting.unregisterContentScripts({ ids: ["prevent_leak"] })
    } catch (e) { /* errors if the content script wasn't registered but it doesn't really matter */ }
    
    chrome.action.setBadgeText({
        text: "OFF",
    });
})

chrome.action.onClicked.addListener(async (tab) => {
    const state = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = state === "OFF" ? "ON" : "OFF";
    const nextIcon = nextState === "ON" ? "images/icon-128.png" : "images/icon_open-128.png";
    if (nextState == "ON") {
        await chrome.scripting.registerContentScripts([{ id: "prevent_leak", js: ["preventLeak.js"], runAt: "document_start", matches: ["https://us.prairielearn.com/pl/*/*/instance_question/*"] }])
    }
    else {
        try {
            await chrome.scripting.unregisterContentScripts({ ids: ["prevent_leak"] })
        } catch (e) { /* errors if the content script wasn't registered but it doesn't really matter */ }
    }

    await chrome.action.setBadgeText({
        text: nextState
    })

    await chrome.action.setIcon({
        path: {
            128: nextIcon
        }
    })
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" || !tab.active) return;
    if (allowedUrls.some(url => !tab.url.startsWith(url))) return;
    if (!tab.url.includes("instance_question")) return;

    const state = await chrome.action.getBadgeText({ tabId: tab.id });
    if (state == "OFF") return;

    await chrome.scripting.executeScript({
        target: {
            tabId: tabId
        },
        files: ["hide.js"]
    })

    try {
        await chrome.tabs.sendMessage(tabId, { action: "show_page" })
    } catch(e) {
        // i don't think i have to do anything 
    }
})