// file is needed because prarirelearn will load with the correct answers revealed and background jobs are too slow to hide it in time

(() => {
    if (!window.location.href.includes("instance_question")) return;
    document.documentElement.style.visibility = 'hidden';

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action && message.action === "show_page") {
            document.documentElement.style.visibility = 'visible';
        }
    })
})();