importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

self.addEventListener("notificationclick", function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close();
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === feClickAction) {
          matchingClient = windowClient;
          break;
        }
      }
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(feClickAction);
      }
    });
  event.waitUntil(promiseChain);
});

if (firebase.messaging.isSupported()) {
  let config = {
    apiKey: "AIzaSyDmZBDeHQq0tkGJXRx3yat9gJRca5zbeRg",
    authDomain: "charsi-e0f9c.firebaseapp.com",
    databaseURL: "https://charsi-e0f9c-default-rtdb.firebaseio.com",
    projectId: "charsi-e0f9c",
    storageBucket: "charsi-e0f9c.appspot.com",
    messagingSenderId: "731644100182",
    appId: "1:731644100182:web:b9f63493d05db258e645f7",
    measurementId: "G-HFX9DEWYS7",
  };

  firebase.initializeApp(config);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = "Charsi Notification";
    const options = {
      body: payload.data.body,
      icon: "https://charsi.vercel.app/icons/logo_gradient.svg",
      vibrate: [100, 100, 100],
    };

    const channel = new BroadcastChannel("fcm-notifications");
    channel.postMessage({
      payload: payload,
    });
    return self.registration.showNotification(title, options);
  });
}
