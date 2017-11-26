var background = chrome.extension.getBackgroundPage();
background.request_current_url();
var defaultSiteTag;

var first_ui_update = true;

function set_state(state) {
  state = Object.values(state)[0];
  $('#site-tag').val(state['site-tag']);
  $('#size').val(state.size);
  $('#digit').prop('checked', state.digit);
  $('#punctuation').prop('checked', state.punctuation);
  $('#mixedCase').prop('checked', state.mixedCase);
  $('#noSpecial').prop('checked', state.noSpecial);
  $('#digitsOnly').prop('checked', state.digitsOnly);
  $('.range-slider__value').html(state.size);
  $('#master-key').focus();
}

function copy_to_clipboard() {
  hash = $("#hash-word");
  hash.select();
  document.execCommand("Copy");
}

$("#global-help").on('click',function() {
  var create_data = {
    url: "/help.html"
  };
  chrome.tabs.create(create_data);
});

$(".bump").on('click', function() {
  onBump();
});

$(".clipboard-copy").on('click', copy_to_clipboard);

$(".reveal").on('click',function() {
  //var $pwd = $(".pwd");
  var $pwd = $(this).parent().siblings();

  if ($pwd.hasClass('fakepassword')) {
    if ($pwd.hasClass('key')) {
      $pwd.removeClass('key');
      $(this).addClass("active");
    } else {
      $pwd.addClass('key');
      $(this).removeClass("active");
    }
  } else {
    if ($pwd.attr('type') === 'password') {
      $pwd.attr('type', 'text');
      $(this).addClass("active");
    } else {
      $pwd.attr('type', 'password');
      $(this).removeClass("active");
    }
  }
});

function rangeSlider() {
  var slider = $('.range-slider'),
      range = $('.range-slider__range'),
      value = $('.range-slider__value');

  slider.each(function(){

    value.each(function(){
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    range.on('input', function(){
      $(this).next(value).html(this.value);
    });
  });
}

function update_hasher() {
  var hash_word = $("#hash-word");
  var clipboard_copy = $('#clipboard-copy');
  var reveal = clipboard_copy.siblings();
  clipboard_copy = clipboard_copy[0];
  if (!validate(false)) {
    if (hash_word.hasClass('key')) {
      hash_word.removeClass('key');
    }
    clipboard_copy.disabled = true;
    hash_word.val('');
  } else {
    if (!hash_word.hasClass('key') &&
       (!reveal.hasClass('reveal') || first_ui_update)) {
      hash_word.addClass('key');
    }
    clipboard_copy.disabled = false;
    first_ui_update = false;
  }
  update();
}

function persist_settings() {
  var state = {
    'domain': background.current_domain,
    'site-tag': $('#site-tag').val(),
    'size': $('#size').val(),
    'digit': $('#digit').is(':checked'),
    'punctuation': $('#punctuation').is(':checked'),
    'mixedCase': $('#mixedCase').is(':checked'),
    'noSpecial': $('#noSpecial').is(':checked'),
    'digitsOnly': $('#digitsOnly').is(':checked')
  };
  var key = {};
  key[background.current_domain] = state;
  background.persist_settings(key);
}

function load_settings() {
  var key = background.current_domain;
  background.load_settings(set_state);
}

// Handle Enter key on site-tag:
$('#site-tag').keypress(function (e) {
  if (e.which == 13) {
    $('#master-key').focus();
    return false;
  }
});

// Handle Enter key on site-tag:
$('#master-key').keypress(function (e) {
  if (e.which == 13) {
    $('form').submit();
    return false;
  }
});

$("form").submit(function(event) {
  persist_settings();
  copy_to_clipboard();
  window.close();
  event.preventDefault();
});

window.addEventListener('input', function(event) {
  update_hasher();
}, false);

window.addEventListener('unload', function(event) {
}, true);

window.addEventListener('load', function(event) {
  defaultSiteTag = (false ? background.current_domain : background.current_domain.split(".")[0]);
  rangeSlider();
  $('#site-tag').val(defaultSiteTag);
  load_settings();
}, true);
