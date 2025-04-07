document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("openWebsite").addEventListener("click", function () {
        chrome.tabs.create({ url: "http://localhost:3000" });
    });
});
