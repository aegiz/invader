var tabid;

// Send to the edit page
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      var currentUrl = tabs[0].url;
      chrome.tabs.captureVisibleTab(
        chrome.windows.WINDOW_ID_CURRENT,
        { format: "png" },
        function(image) {
          chrome.tabs.create({ url: "edit.html" }, function(t) {
            tabid = t.id;
            // Slight delay to allow tab time to add listener.
            setTimeout(function() {
              chrome.tabs.sendMessage(tabid, {
                image: image,
                url: currentUrl
              });
            }, 200);
          });
        }
      );
    }
  );
});

// Send to the last page
chrome.extension.onMessage.addListener(function(e) {
  chrome.windows.getCurrent(function(win) {
    chrome.tabs.captureVisibleTab(win.id, { format: "png" }, function(image) {
      chrome.tabs.sendMessage(tabid, image);
    });
  });
});
