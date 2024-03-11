document.getElementById('startTimer').addEventListener('click', function () {
    chrome.runtime.sendMessage({ startTimer: true });
});

document.getElementById('stopTimer').addEventListener('click', function () {
    chrome.runtime.sendMessage({ startTimer: false });
});
