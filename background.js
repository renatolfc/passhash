var current_url = null;

function set_current_url(tabs) {
  current_url = tabs[0].url;
}

function nullify_url() {
  current_url = null;
}

chrome.tabs.onActivated.addListener(function(active) {
  browser.tabs.query({active: true, currentWindow: true}).then(set_current_url);
});

chrome.tabs.onUpdated.addListener(function(active) {
  browser.tabs.query({active: true, currentWindow: true}).then(set_current_url);
});
