/**
 * This class manages the activity information of all text-lines of the pad
 *
 * @class activity
 */

var panel = function() {

  var debug = true;

  // Variablen
  var windowItem = $(window);
  var containerPanel = $('#editorcontainer');
  var viewport = $('<div class="viewport"> </div>');


  var settings = {
    heightRatio : 0.6,
    widthRatio : 0.15,
    offsetHeightRatio : 0.085,
    offsetWidthRatio : 0.015,
    position : "right",
    touch: true,
    smoothScroll: true,
    smoothScrollDelay: 200,
    onPreviewChange: function() {}
  };

  var _init = function() {
    _bindEvents();
  }

  var _bindEvents = function() {
    $(window).on('resize', function() {
      _onResizeHandler();
    });

    $('.viewport').on('click', function(event) {
      event.preventDefault();
      console.log('click');
    });

    var outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
    console.log(outerdoc);
    // .trigger('change');

    // $(window).on('scroll', function() {
    //   _onScrollHandler();
    // });

    if( outerdoc.is(':animated') ) {
      console.log("jtzt");
    }
  }


  var _buildPanel = function() {
    var heatmapContent = $.parseHTML('<div class="heatmap"></div>');
    $($('body')[0]).append(viewport);
    $($('body')[0]).append(heatmapContent);
  }

  var _buildViewport = function() {
    var heatmapPanel = $('.heatmap');
    heatmapPanel.addClass('minimap noselect');
    // remove events & customized cursors
    heatmapPanel.children().each(function() {$(this).css({'pointer-events': 'none'});});
    _onResizeHandler();
  }

  var _openPanel = function() {
    _buildViewport();

    if ($('.heatmapContent').length) {
      $('.heatmapContent').remove();
    } else {
      _setHeatmapContent();
    }

    $('.heatmap').toggleClass('active');
    $('.viewport').toggleClass('active');

    _onResizeHandler();
  };

  var _resizeMap = function() {
    windowItem.on('resize', onResizeHandler());
  }

  var _setHeatmapContent = function() {
    var content = getElementByIdInFrames("innerdocbody", window).innerHTML;
    $('<div class="heatmapContent">'+content+'</div>').appendTo( ".heatmap" );
    _onResizeHandler();
  };

  var _onResizeHandler = function() {
    var heatmapPanel = $('.heatmap');

    var innerFrameHeight = parseFloat(document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.height.slice(0,-2));
    var innerFrameWidth = parseFloat(document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.width.slice(0,-2));
    var outerFrameHeight = document.getElementsByName("ace_outer")[0].style.height;

    // console.log(document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.height);
    // console.log($('iframe[name="ace_outer"]').contents().find("#outerdocbody")[0].style.height);

    var s = _scale();
    var sc = 'scale(' + s.x + ','+ s.y + ')';

    var offsetTop = windowItem.height() * settings.offsetHeightRatio;
    var offsetLeftRight = windowItem.width() * settings.offsetWidthRatio;

    // var top = containerPanel.height() * (s.y - 1) / 2 + offsetTop;
    // var top = containerPanel.height() * (s.y - 1) / 1 + offsetTop;
    var top = innerFrameHeight * (s.y - 1) / 2 + offsetTop;
    //var leftRight = containerPanel.width() * (s.x - 1) / 2  + offsetLeftRight;
    var leftRight = containerPanel.width() * (s.x - 1) / 3.5  + offsetLeftRight;

    // var top = containerPanel.height() * (s.y - 1) / 2 + offsetTop;
    // var leftRight = offsetLeftRight;

    var width = innerFrameWidth * (1/s.x) * settings.widthRatio;
    var height = innerFrameHeight  * (1/s.y) * settings.heightRatio;

    // var width = containerPanel.width() * (1/s.x) * settings.widthRatio;
    // var height = innerFrameHeight * (1/s.y) * settings.heightRatio;

    var css = {
        '-webkit-transform': sc,
        '-moz-transform': sc,
        '-ms-transform': sc,
        '-o-transform': sc,
        'transform': sc,
        'top' : top,
        'width' : width,
        'height' : height,
        'margin' : '0px',
        'padding' : '0px'
    };

    css[settings.position] = leftRight;

    heatmapPanel.css(css);

    var viewportTop = containerPanel.offset().top * s.y;
    var cssViewport = {
        width : containerPanel.width() * s.x,
        // height: innerFrameHeight * s.y,
        // height : $('#editorcontainerbox').height() * s.y,
        // height : windowItem.height() * s.y,
        height: containerPanel.height() * s.y,
        margin : '0px',
        top : windowItem.scrollTop() * s.y + offsetTop - viewportTop + 'px'
    };

    cssViewport[settings.position] = offsetLeftRight + 'px';
    viewport.css(cssViewport);

    settings.onPreviewChange($('.heatmap'), s);
  }

  var _scale = function () {
    return {
        x: (windowItem.width() / containerPanel.width()) * settings.widthRatio,
        y: (windowItem.height() / containerPanel.height()) * settings.heightRatio
    };
  }

  var getElementByIdInFrames = function(id, base) {
    var el;
    if(el = base.document.getElementById(id)) {
      return el;
    }

    for(var i = 0, len = base.frames.length; i < len; i++) {
      if(el = getElementByIdInFrames(id, base.frames[i])) {
        return el;
      }
    }
  }

  var _onScrollHandler = function() {
    //if(!shown) return;
    var s = _scale();
    var offsetTop = windowItem.height() * settings.offsetHeightRatio;

    var top = containerPanel.offset().top * s.y;
    var pos = $('iframe[name="ace_outer"]').contents().find("#outerdocbody")[0].scrollTop * s.y;
    var viewportHeight = viewport.outerHeight(true);
    var bottom = containerPanel.outerHeight(true) * s.y + top;// - viewportHeight;
    if(pos + viewportHeight + offsetTop < top || pos >  bottom) {
      console.log("if");
      // viewport.css({
      //     display: 'none',
      // });
      viewport.css({
          top : pos + offsetTop - top + 'px',
          display : 'block'
      });
    } else {
      console.log("else");
      viewport.css({
          top : pos + offsetTop - top + 'px',
          display : 'block'
      });
      console.log(pos + offsetTop - top + 'px');
    }
  };

//   var scrollTop = function(e) {
//             // if(!shown) return;
//     var s = _scale();
//     var offsetTop = windowItem.height() * settings.offsetHeightRatio;
//     var top = containerPanel.offset().top * s.y;
//     var target = (e.clientY  - offsetTop + top) / s.y;

//     if(e.type === 'click' && settings.smoothScroll) {
//         var current = windowItem.scrollTop();
//         var maxTarget = containerPanel.outerHeight(true);
//         target = Math.max(target, Math.min(target, maxTarget));
//         var direction = target > current;
//         var delay = settings.smoothScrollDelay;
//         var distance = Math.abs(current - target);
//         var r = delay / distance;
//         var unitScroll = 1;
//         var unitDelay = 4;
//         if(r >= 4) {
//             unitDelay = parseInt(unitScroll);
//         } else if(r >= 1) {
//             unitScroll = parseInt(r) * 4;
//         } else {
//             unitScroll = (4 / r);
//         }

//         var next = current;
//         var count = parseInt(distance / unitScroll);
//         onSmoothScroll = true;

//         console.log("if");
//         // linear translate
//         var smoothScroll = function() {
//             next = next + (direction ? unitScroll : -unitScroll);
//             if(--count <= 0) {
//                 clearInterval(timer);
//                 onSmoothScroll = false;
//                 next = target;
//             }
//             windowItem.scrollTop(next);
//         };
//         var timer = window.setInterval(smoothScroll, unitDelay);
//     } else {
//         console.log("else");
//         // windowItem.scrollTop(target);
//         $('#editorcontainerbox').scrollTop(target);
//     }
//     e.stopPropagation();
// };

  var _scrollToLine = function(lineNumber){
    var count = 1;
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){
      if(count == lineNumber){
        var newY = $(this).context.offsetTop + "px";
        var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
        var $outerdocHTML = $('iframe[name="ace_outer"]').contents().find("#outerdocbody").parent();
        $outerdoc.animate({scrollTop: newY});
        if(browser.firefox) $outerdocHTML.animate({scrollTop: newY}); // needed for FF
        return false;
      }
      count++;
    });

    _onScrollHandler();
  }

  return {
    init : _init,
    buildPanel : _buildPanel,
    openPanel : _openPanel,
    onResizeHandler : _onResizeHandler,
    scrollToLine : _scrollToLine

  };

}();

module.exports = panel;
