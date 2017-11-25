var browser = new Object();
browser.version = parseInt(navigator.appVersion);
browser.isNetscape = false;
browser.isMicrosoft = false;
if (navigator.appName.indexOf("Netscape") != -1) 
    browser.isNetscape = true;
else if (navigator.appName.indexOf("Microsoft") != -1)
    browser.isMicrosoft = true;

var siteTagLast = '';
var masterKeyLast = '';

function validate(focus=false)
{
    var siteTag   = document.getElementById('site-tag');
    var masterKey = document.getElementById('master-key');
    if (!siteTag.value)
    {
      if (focus) {
        siteTag.focus();
      }
        return false;
    }
    if (!masterKey.value)
    {
      if (focus) {
        masterKey.focus();
      }
        return false;
    }
    return true;
}

function update() 
{
    var siteTag   = document.getElementById('site-tag');
    var masterKey = document.getElementById('master-key');
    var hashWord  = document.getElementById('hash-word');
    var submit    = document.getElementById('submit');

    if (!validate()) {
      return;
    }

    if (submit.value == 'Another')
    {
        siteTag.focus();
        submit.value = 'OK';
        hashWord.value = '';
    }
    else
    {
        //var hashapass = b64_hmac_sha1(masterKey.value, siteTag.value).substr(0,8);
        var hashWordSize       = document.getElementById("size").value;
        var requireDigit       = document.getElementById("digit").checked;
        var requirePunctuation = document.getElementById("punctuation").checked;
        var requireMixedCase   = document.getElementById("mixedCase").checked;
        var restrictSpecial    = document.getElementById("noSpecial").checked;
        var restrictDigits     = document.getElementById("digitsOnly").checked;

        hashWord.value = PassHashCommon.generateHashWord(
                siteTag.value,
                masterKey.value,
                hashWordSize,
                requireDigit,
                requirePunctuation,
                requireMixedCase,
                restrictSpecial,
                restrictDigits);
    }

    siteTagLast = siteTag.value;
    masterKeyLast = masterKey.value;
}

function onNoSpecial(fld)
{
    document.getElementById('punctuation').disabled = fld.checked;
    update();
}

function onDigitsOnly(fld)
{
    document.getElementById('punctuation').disabled = fld.checked;
    document.getElementById("digit"      ).disabled = fld.checked;
    document.getElementById("punctuation").disabled = fld.checked;
    document.getElementById("mixedCase"  ).disabled = fld.checked;
    document.getElementById("noSpecial"  ).disabled = fld.checked;
    update();
}

function onBump()
{
    var siteTag = document.getElementById("site-tag");
    siteTag.value = PassHashCommon.bumpSiteTag(siteTag.value);
    update();
}
