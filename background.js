function showDPSDataTestId(tabId, changeInfo, tab) {
  if (tab.url && tab.url.indexOf('digitalpublishing.adobe.com') > -1) {
    chrome.pageAction.show(tabId);
  }
};

chrome.tabs.onUpdated.addListener(showDPSDataTestId);

chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    var iconPath = 'tid-blue.png',
        title = 'Display data-test-id attribute';
    chrome.tabs.sendMessage(activeTab.id, {"message": "isLive"}, function(response) {
      iconPath = response && response.state ? 'icons/tid-green.png' : 'icons/tid-blue.png';
      tiltle = response && response.state ? 'Display data-test-id attribute' : 'Turn off';
    });

    setTimeout(function(){
      chrome.pageAction.setIcon({tabId: tab.id, path: iconPath});
      chrome.pageAction.setTitle({tabId: tab.id, title: title});
    }, 200);
  });
});
