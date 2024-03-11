var tabWithStpk = null;

function checkTabs() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (tab.url.includes('http://stpk.telecom/pages/single_damages_list')) {
                tabWithStpk = tab;
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['contentScript.js']
                });
                chrome.tabs.sendMessage(tabWithStpk.id,{runTimer: true, pathToAudio: chrome.runtime.getURL('bell.mp3')});
            }
        });
    });
}

//События кнопок старта и стопа таймера
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.startTimer){
       checkTabs();

    }else if(request.startTimer === false){
        chrome.tabs.sendMessage(tabWithStpk.id,{runTimer: false});
    }
});
//Здесь можно поменять содержимое оповещения
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.notification) {
        chrome.notifications.create('', {
            title: 'Новый ПБ!',
            message: 'Пришли новые ПБ!',
            iconUrl: 'cheese.ico',
            type: 'basic',
            requireInteraction: true
        });
       
    }
    return true;
});



