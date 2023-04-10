console.log('This is the background page.');
console.log('Put the background scripts here.');

const port = '8111';
const url = `http://localhost:${port}`;

const browsersUrl = `http://localhost:${port}/browsers.json`;

function sendMessage(message) {
  fetch(url, {
    method: 'POST',
    body: message,
  })
    .then((response) => {
      if (!response.ok) {
      }
      return response.text();
    })
    .then((data) => {
    })
    .catch((error) => {
    });
}

function getBrowsers() {
  fetch(browsersUrl)
    .then((response) => response.json())
    .then((data) => {
      chrome.storage.local.set({ browserData: data }, () => {});
    })
    .catch((error) => {
    });
}

getBrowsers();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'getBrowserData') {
    chrome.storage.local.get('browserData', function (data) {
      sendResponse({ data: data.browserData });
    });
    return true;
  } else if (request.message === 'pinTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      var isPinned = currentTab.pinned;

      chrome.tabs.move(currentTab.id, { index: 0 });
      chrome.tabs.update(currentTab.id, { pinned: !isPinned });

      var message = isPinned
        ? 'Tab unpinned and moved to first position!'
        : 'Tab pinned and moved to first position!';
      sendResponse({ message: message });
    });
    return true;
  } else if (request.message.startsWith('.')) {
    sendMessage(request.message);
    return true;
  } else if(request.message === 'getClipboard') {
    chrome.clipboard.readText(function(clipboardText) {
      sendResponse(clipboardText);
    });
    return true;
  }
});