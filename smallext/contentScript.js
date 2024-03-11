




function checkAttributeValue(lastState) {
    
    //Айди элемента в нашем случае это знак в нижнем правом углу
    const element = document.getElementById('ctInfoIcon01');
    //Кнопка сохранить, которая является выбором фильтра
    const saveButton = document.getElementsByClassName('sButton cntntf');

    const trElements = document.querySelectorAll('tr');
    let trWithOASPU = null;
    //Поиск фильтра для выбора, здесь ищет таблицу с значением OASPU
    Array.from(trElements).forEach(tr => {
        const tdWithOASPU = Array.from(tr.getElementsByTagName('td')).find(td => td.textContent.includes('OASPU'));
        if (tdWithOASPU) {
            trWithOASPU = tr;
        }
    });


    //Поиск кнопки по классу и содержанию
    var buttonSave = null;
    var buttonReload = null;
    for (var i = 0; i < saveButton.length; i++) {
        if (saveButton[i].getAttribute('value') === 'Сохраненные') {
            buttonSave = saveButton[i];
            break;
        }
    }
    for (var i = 0; i < saveButton.length; i++) {
        if (saveButton[i].getAttribute('value') === 'Обновить') {
            buttonReload = saveButton[i];
            break;
        }
    }
    //оповещение при активном знаке
    if (element) {
        if (lastState.value === "inactive" && element.getAttribute('state') === "active") {
            lastState.value = "active";
            chrome.runtime.sendMessage({ notification: true });
            document.getElementsByClassName("myAudio")[0].play();
        } else if (lastState.value === "active" && element.getAttribute('state') === "inactive") {
            lastState.value = "inactive";
        }
    }
    //клик по кнопке сохранить
    if (buttonSave) {
        buttonSave.click();
    }
    //Костыль даблклика по фильтру
    if (trWithOASPU) {
        trWithOASPU.click();
        trWithOASPU.click();
        trWithOASPU.click();

    }
    //Обновление страницы
    if (buttonReload) {
        buttonReload.click();
    }
};
//Запуск таймера и создание аудио элемента
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let SignState = {value : "inactive"};    
    let timerId = null;

    if (request.runTimer === true) {
        if (timerId !== null) {
            clearInterval(timerId);
        }

        timerId = setInterval(() => checkAttributeValue(SignState), 5 * 1000);
        var audio = document.createElement('audio');
        audio.className = 'myAudio';
        audio.setAttribute('src', chrome.runtime.getURL('bell.mp3'));
        audio.setAttribute('controls', '');
        var container = document.getElementById('audioContainer');
        document.body.appendChild(audio);
        console.log('Timer started');

    } else if (request.runTimer === false) {
        clearInterval(timerId);
        timerId = null;
        console.log('Timer stopped');
    }
});
