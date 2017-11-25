var background = chrome.extension.getBackgroundPage();

var first_ui_update = true;

$("#global-help").on('click',function() {
  var create_data = {
    url: "/help.html"
  };
  chrome.tabs.create(create_data);
});

$(".bump").on('click', function() {
  onBump();
});

$(".clipboard-copy").on('click', function() {
  hash = $("#hash-word");
  hash.select();
  document.execCommand("Copy");
});

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

// Handle Enter key on site-tag:
$('#site-tag').keypress(function (e) {
  if (e.which == 13) {
    $('#master-key').focus();
    return false;
  }
});

$("form").submit(function(event) {
  event.preventDefault();
});

window.addEventListener('input', function(event) {
  update_hasher();
}, false);

rangeSlider();

var domain = PassHashCommon.getDomain(background.current_url);
var defaultSiteTag = (false ? domain : domain.split(".")[0]);
$('#site-tag').val(defaultSiteTag);

$("#site-tag").focus();
