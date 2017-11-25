var current_url = null;
var current_domain = null;

function set_current_url(tabs) {
  current_url = tabs[0].url;
  current_domain = PassHashCommon.getDomain(current_url);
}

function nullify_url() {
  current_url = null;
}

function persist_settings(key) {
  browser.storage.sync.set(key);
}

function load_settings(callback) {
  browser.storage.sync.get(current_domain).then(callback);
}

function request_current_url() {
  browser.tabs.query({active: true, currentWindow: true}).then(set_current_url);
}

chrome.tabs.onActivated.addListener(request_current_url);

chrome.tabs.onUpdated.addListener(request_current_url);
