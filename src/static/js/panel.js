/**
 * This class manages the positioning of the minimap
 * and the scrolling functions
 *
 * @class panel
 */

var panel = function() {

  var debug = true;

  /**
   * Caching of DOM Items
   */

  var windowItem = $(window);
  var containerPanel = $('#editorcontainerbox');
  var containerPanelInner = $('#editorcontainer');
  var viewport = $('<div class="viewport"> </div>');


  // init default settings for minimap
  var settings = {
    heightRatio : 0.6,
    widthRatio : 0.05,
    offsetHeightRatio : 0.035,
    offsetWidthRatio : 0.035,
    position : "right",
    touch: true,
    smoothScroll: true,
    smoothScrollDelay: 200,
    onPreviewChange: function() {}
  };

  /**
   * init Events
   *
   * @method _init
   */
  var _init = function() {
    _bindEvents();
  }

  /**
   * bind user generated events
   *
   * @method _bindEvents
   */
  var _bindEvents = function() {

    // on window resize, resize also minimap
    windowItem.on('resize', function() {
      _onResizeHandler();
    });

  }

  /**
   * append viewport and heatmap div for minimap
   * to body
   *
   * @method _buildPanel
   */
  var _buildPanel = function() {
    // parses the string into an array of DOM elements
    var heatmapContent = $.parseHTML('<div class="heatmap"></div>');
    $($('body')[0]).append(viewport);
    $($('body')[0]).append(heatmapContent);
  }

  /**
   * Is called by clicking on Show-Heatmap-Button,
   * if heatmap is actually displayed, this function removes the div and
   * hide the active class,
   * else this function clones the content of etherpad to the heatmap div and
   * adds class active to heatmap and viewport for displaying the minimap
   *
   * @method _openPanel
   */
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

  /**
   * customize viewport
   *
   * @method _buildViewport
   */
  var _buildViewport = function() {
    var heatmapPanel = $('.heatmap');
    heatmapPanel.addClass('minimap noselect');

    // remove events & customized cursors
    heatmapPanel.children().each(function() {$(this).css({'pointer-events': 'none'});});
    _onResizeHandler();
  }

  /**
   * this function appends the content of etherpad to the heatmap div
   *
   * @method _setHeatmapContent
   */
  var _setHeatmapContent = function() {
    if ($('.heatmapContent').length) {
      $('.heatmapContent').remove();
    } else {
      var content = getElementByIdInFrames("innerdocbody", window).innerHTML;
    $('<div class="heatmapContent">'+content+'</div>').appendTo( ".heatmap" );
      _onResizeHandler();
    }

  };

  /**
   * handles the calculations for minamp and viewport
   *
   * @method _onResizeHandler
   */
  var _onResizeHandler = function() {
    var heatmapPanel = $('.heatmap');

    // get ace_inner height
    var innerFrameHeight = parseFloat(document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.height.slice(0,-2));
    // get ace_inner width
    var innerFrameWidth = parseFloat(document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.width.slice(0,-2));
    // get ace_outer height
    var outerFrameHeight = document.getElementsByName("ace_outer")[0].style.height;

    // get actual scaling values
    var s = _scale();
    // set transformation scale
    var sc = 'scale(' + s.x + ','+ s.y + ')';
    // calc offset to top
    var offsetTop = windowItem.height() * settings.offsetHeightRatio;
    // calc offset to left and right
    var offsetLeftRight = windowItem.width() * settings.offsetWidthRatio;

    // calc top value: get height of plugin bar plus custom offset
    var top = $('.readwrite').height() + 10;
    // width and height of minimap
    var width = containerPanel * (1/s.x) * settings.widthRatio;
    var height = innerFrameHeight  * (1/s.y) * settings.heightRatio;

    // CSS Settings vor minimap
    var css = {
        '-webkit-transform': sc,
        '-moz-transform': sc,
        '-ms-transform': sc,
        '-o-transform': sc,
        'transform': sc,
        'transform-origin':  'right top',
        'top' : top + 'px',
        'right' : '30px',
        'width' : width,
        'height' : height,
        'margin' : '0px',
        'padding' : '0px'
    };

    // set heatmap CSS
    heatmapPanel.css(css);

    // Positionierung Viewport Top - funktioniert nicht weil Werte nicht ausgelesen werden
    if ($('iframe[name="ace_outer"]').contents().find("#outerdocbody")[0].scrollTop == 0) {
      var viewportTop = -6;
    } else {
      var viewportTop = $('iframe[name="ace_outer"]').contents().find("#outerdocbody")[0].scrollTop * s.y;
    }

    // CSS Settings for Viewport
    var cssViewport = {
        width : containerPanel.width() * s.x + 10,
        height: containerPanelInner.height() * s.y / 2,
        margin : '0px',
        // calc the top position of viewport
        top : $('iframe[name="ace_outer"]').contents().find("#outerdocbody")[0].scrollTop  * s.y + top - viewportTop,
        right: '20px'
    };

    // set viewport CSS
    viewport.css(cssViewport);

    settings.onPreviewChange($('.heatmap'), s);
  }

  /**
   * Calculation of scaling properties
   * in dependency of window size and etherped content size
   *
   * @method _scale
   * @return {Array} scaling values for x and y
   */
  var _scale = function () {
    var innerFrameHeight = parseFloat(document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.height.slice(0,-2));
    var innerFrameWidth = parseFloat(document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.width.slice(0,-2));
    return {
        x: (windowItem.width() / innerFrameWidth) * settings.widthRatio,
        y: (windowItem.height() / innerFrameHeight) * settings.heightRatio
    };
  }

  /**
   * get the content of DOM-Element
   *
   * @method getElementByIdInFrames
   * @param {object} div which should be cloned
   * @param {object} base element
   * @return {Object} divs
   */
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

  /**
   * should set the correct positiong of minimap if a scroll event is detected
   * actually no correct functionality
   *
   * @method _onScrollHandler
   */

  var _onScrollHandler = function() {
    var s = _scale();
    var innerFrameHeight = parseFloat(document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.height.slice(0,-2));

    var offsetTop = windowItem.height() * settings.offsetHeightRatio;

    var top = containerPanel.offset().top * s.y;

    var pos = $('iframe[name="ace_outer"]').contents().find("#outerdocbody")[0].scrollTop * s.y;

    var viewportHeight = viewport.outerHeight(true);

    var bottom = containerPanel.outerHeight(true) * s.y + top;// - viewportHeight;

    // TO DO: Anweisung überprüfen und optimieren
    if(pos + viewportHeight + offsetTop < top || pos >  bottom) {
      // viewport.css({
      //     display: 'none',
      // });
      viewport.css({
          top : pos + offsetTop - top + 'px',
          display : 'block'
      });
    } else {
      viewport.css({
          top : pos + offsetTop - top + 'px',
          display : 'block'
      });

      viewport.animate({scrollTop: top});
    }
  };

  /**
   * scrolls the iframe to line number
   * calculates the offset of given div to outerdoc body element
   *
   * @method _scrollToLine
   * @param {integer} line number
   */
  var _scrollToLine = function(lineNumber){
    var count = 1;
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function() {
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
    _onResizeHandler();
  }

  return {
    init : _init,
    buildPanel : _buildPanel,
    openPanel : _openPanel,
    onResizeHandler : _onResizeHandler,
    scrollToLine : _scrollToLine,
    onScrollHandler : _onScrollHandler,
    setHeatmapContent : _setHeatmapContent

  };

}();

module.exports = panel;
