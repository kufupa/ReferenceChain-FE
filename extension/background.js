chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
        sendUrlToBackend(tab.url);
    }
});

async function sendUrlToBackend(url) {
    if (!url) return;

    try {
        const response = await fetch("http://localhost:5000/api/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        console.log("URL Sent to Backend:", data);
    } catch (error) {
        console.error("Error sending URL:", error);
    }
}
