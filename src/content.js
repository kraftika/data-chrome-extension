var isContentLoaded = false,
    isLive = false,
    dataTestIdAttrValue;

function createTooltipNode(text){
  if (!presentInDOM()) {
    $('<p class="extension-inspect-tooltip"></p>')
      .text(text)
      .appendTo('body')
      .fadeIn('slow');
  }
}

function presentInDOM() {
  return $('.extension-inspect-tooltip').length > 0;
}

function removeTooltipNode() {
  if (presentInDOM()) {
   $('.extension-inspect-tooltip').remove();
  }
}

function putBorder(element, state) {
  state ? $(element).css('border', '1px solid #176904') : $(element).css('border', '');
}

function displayTooltip(targetItem, tooltipText){
  var eventsOnTarget = $._data(targetItem[0], 'events');

  if (!isLive) {
    $(targetItem).off('mouseover');
    $(targetItem).off('mouseout');
    $(targetItem).off('mousemove');
    removeTooltipNode();
    putBorder(targetItem, false);
    return;
  }

  if (!eventsOnTarget) {
    createTooltipNode(tooltipText);
    putBorder(targetItem, true);
  }

  $(targetItem).on('mouseover', function(e) {
    e.stopPropagation();
    createTooltipNode(tooltipText);
    putBorder(targetItem, true);
  });

  $(targetItem).on('mouseout', function(e) {
    e.stopPropagation();
    removeTooltipNode();
    putBorder(targetItem, false);
  });

  $(targetItem).on('mousemove', function(e) {
    var bounds = event.target.getBoundingClientRect();
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var deltaX;
    var deltaY;

    // The tooltip might go out of the screen for web element displayed righmost or lowermost
    deltaX = (screenWidth - bounds.right < 200) ? -150 : 15;
    deltaY = (screenHeight - bounds.bottom < 30) ? -15 : 10;
    $('.extension-inspect-tooltip').css({ top: e.pageY + deltaY, left: e.pageX + deltaX});
  });
}

$(document).mousemove(function(event){
  if (isContentLoaded) {
    var target = $(event.target);
    dataTestIdAttrValue = target.attr('data-test-id');
    dataTestIdAttrValue && displayTooltip(target, dataTestIdAttrValue);
  }
});

$(document).on("keydown", function(e){
  if (isLive && e.keyCode == 67 && (e.ctrlKey || e.metaKey)) {
    if (dataTestIdAttrValue) {
      setTimeout(function() {
        console.log("[data-test-id='" + dataTestIdAttrValue + "']");
        console.log("document.querySelector(\"[data-test-id='" + dataTestIdAttrValue + "']\")");
        console.log("@FindBy(css = \"[data-test-id='" + dataTestIdAttrValue + "']\")");
      }, 100);
    }
  }
});

$(window).load(function(event) {
  isContentLoaded = true;
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "isLive" ) {
      isLive = !isLive;
      sendResponse({state: isLive});
    }
  }
);
