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
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then((data) => {
      console.log('Message sent:', message);
      console.log('Server response:', data);
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function getBrowsers() {
  fetch(browsersUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log('Browsers:', data);
      // Store the fetched data in the Chrome local storage
      chrome.storage.local.set({ browserData: data }, () => {
      });
    })
    .catch((error) => {
      console.error('There was a problem fetching the browsers data:', error);
    });
}

getBrowsers();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "getBrowserData") {
    let browserData = localStorage.getItem("browserData");
    sendResponse({ data: browserData });
  } else if (request.message.startsWith('.')) {
    sendMessage(request.message)
  }
});
