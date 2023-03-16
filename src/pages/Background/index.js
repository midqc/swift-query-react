console.log('This is the background page.');
console.log('Put the background scripts here.');

const port = '8111';
const url = `http://localhost:${port}`;

function sendMessage(message) {
  fetch(url, {
    method: 'POST',
    body: message
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log('Message sent:', message);
      console.log('Server response:', data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Received message:', request.message);
  sendMessage(request.message);
  sendResponse({ message: 'Message received' });
});

sendMessage("--ready to receive messages--");
