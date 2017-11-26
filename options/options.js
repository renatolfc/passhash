var background = chrome.extension.getBackgroundPage();
var cached_data = null;
var file_elem = null;

browser.storage.sync.get(null).then(function(data) {
  cached_data = data;
});

function export_settings() {
  download({
    'url': 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(cached_data)),
    'filename': 'quantum-hasher.json'
  });
}

function import_settings(event) {
  if (file_elem) {
    file_elem.click();
  } else {
    alert('Something went wrong. Failed to import data.');
  }
  event.preventDefault();
}

function actually_import_files(event) {
  var key = null;
  try {
    key = JSON.parse(event.target.result);
  } catch(e) {
    alert('Unable to parse settings. Import failed.');
    return;
  }

  if (key === null) {
    alert('Unable to parse settings. Import failed.');
  }

  browser.storage.sync.set(key).then(function() {
    alert('Settings imported successfully');
  }).catch(function() {
    alert('Failed to import settings.');
  });
}

function handle_files(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = actually_import_files;

  reader.readAsText(file);
}

function download(details) {
  if ( !details.url ) {
    return;
  }

  var a = document.createElement('a');
  a.href = details.url;
  a.setAttribute('download', details.filename || '');
  a.dispatchEvent(new MouseEvent('click'));
}

window.addEventListener('load', function(event) {
  document.querySelector("#import-settings").addEventListener("click", import_settings, false);
  document.querySelector("#export-settings").addEventListener("click", export_settings);
  document.querySelector("#file-elem").addEventListener("change", handle_files);
  file_elem = document.getElementById("file-elem");
}, true);
