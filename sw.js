/* The Tavern — Common Room push service worker.
   Receives Web Push word from the room and shows it like a text;
   tapping the notification opens the tracker straight into The Tavern. */
self.addEventListener("push", event => {
  let data = {
    title: "The Tavern",
    body: "New word in the Common Room",
    url: "https://11durrum11.github.io/APOC-Campaign-Tracker/?tavern=1"
  };
  try { if (event.data) data = Object.assign(data, event.data.json()); } catch (e) {}
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    tag: "tavern-common-room",
    data: { url: data.url }
  }));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url)
    || "https://11durrum11.github.io/APOC-Campaign-Tracker/?tavern=1";
  event.waitUntil((async () => {
    const wins = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of wins) {
      if (w.url.includes("APOC-Campaign-Tracker")) {
        try { await w.navigate(url); } catch (e) {}
        return w.focus();
      }
    }
    return clients.openWindow(url);
  })());
});
