/*
 *
 * Client js
 *
 */

 // Variablen
var fn = function() {};
var $window = $(window);
var minimap = $('#editorcontainer');
var region = $('<div class="miniregion"> </div>');
// var bodyHeight = document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].style.height;
var $scrollingFrame = $('iframe[name="ace_outer"]').contents().find('iframe');
var innerdocbody =  $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody");
// parse string to html
var heatmapContent = $.parseHTML('<div class="heatmap"></div>');

$($('body')[0]).append(region);
$($('body')[0]).append(heatmapContent);

var settings = {
	  heightRatio : 0.6,
	  widthRatio : 0.15,
	  offsetHeightRatio : 0.085,
	  offsetWidthRatio : 0.015,
	  position : "right",
	  touch: true,
	  smoothScroll: true,
	  smoothScrollDelay: 200,
	  onPreviewChange: fn
};

var miniElement = $('.heatmap');

miniElement.addClass('minimap noselect');
// remove events & customized cursors
miniElement.children().each(function() {$(this).css({'pointer-events': 'none'});});

onResizeHandler();
$window.on('resize', onResizeHandler());

/* 	TO DO
		HIER MUSS HANDLER AUF iframe ace_inenr gelegt werden */
// scrollingFrame.on('scroll', onScrollHandler());
$scrollingFrame.on('scroll', function() {
	onScrollHandler()
});
$window.on('scroll', function() {
	onScrollHandler();
});

region.on('mousedown', onMousedownHandler);
region.on('mouseup', onMouseupHandler);
region.on('mousemove', onMousemoveHandler);
region.on('click', onClickHandler);

miniElement.on('mousedown', onMousedownHandler);
miniElement.on('mouseup', onMouseupHandler);
miniElement.on('mousemove', onMousemoveHandler);
miniElement.on('click', onClickHandler);

miniElement.on('click', function( event) {
	onClickHandler(event);
});

function showHeatMap() {
	if ($('.heatmapContent').length) {
		$('.heatmapContent').remove();
	} else {
		setHeatmapContent();
    findAnchorAndScrollTo();
	}

	$('.heatmap').toggleClass('active');
	$('.miniregion').toggleClass('active');

}

function setHeatmapContent() {
	// get divs from iFrame
	var content = getElementByIdInFrames("innerdocbody", window).innerHTML;
	$('<div class="heatmapContent">'+content+'</div>').appendTo( ".heatmap" );
	onResizeHandler();
}

function changeHeatMapStatus() {

  heatmap_status = !heatmap_status;
  console.log("heatmap_status => "+(heatmap_status?"true":"false"));

  if (heatmap_status) {
    //console.log("enableHeatMapSidebar()");
    createNumericModel();
    console.log("generateHeatMap()");
  }
  else {
    console.log("disableHeatMapSidebar()");
  }

}

function findAnchorAndScrollTo() {
  var count = 1;
  $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function() {
    console.log("hier");
    //if ($(this).text().trim() == '#') {
      console.log("trim");
      var newY = $(this).context.offsetTop + "px";
      var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
      var $outerdocHTML = $('iframe[name="ace_outer"]').contents().find("#outerdocbody").parent();
      console.log(newY);
      // $outerdoc.animate({scrollTop: newY});
      // if($.browser.mozilla) $outerdocHTML.animate({scrollTop: newY}); // needed for FF
      return false;
    //}
    count++;
  });
}
// getText of pad and generate array for heatmap
function createNumericModel() {
  console.log("createNumericModel()");

}

function getElementByIdInFrames(id, base) {
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

function scale () {
    return {
        x: ($window.width() / minimap.width()) * settings.widthRatio,
        y: ($window.height() / minimap.height()) * settings.heightRatio
    };
}

function onResizeHandler() {

  var s = scale();
  var sc = 'scale(' + s.x + ','+ s.y + ')';
  var offsetTop = $window.height() * settings.offsetHeightRatio;

  var offsetLeftRight = $window.width() * settings.offsetWidthRatio;

  var top = minimap.height() * (s.y - 1) / 2 + offsetTop;
  var leftRight = minimap.width() * (s.x - 1) / 2  + offsetLeftRight;

  var width = $window.width() * (1/s.x) * settings.widthRatio;
  var height = $window.height() * (1/s.y) * settings.heightRatio;

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

  miniElement.css(css);

  var regionTop = minimap.offset().top * s.y;
  var cssRegion = {
      width : miniElement.width() * s.x,
      // height: $innerdocbody.height() * s.y,
      height : $('#editorcontainerbox').height() * s.y,
      // height : $window.height() * s.y,
      margin : '0px',
      top : $window.scrollTop() * s.y + offsetTop - regionTop + 'px'
  };
  cssRegion[settings.position] = offsetLeftRight + 'px';
  region.css(cssRegion);

  settings.onPreviewChange(miniElement, s);
}

function onScrollHandler() {
  //if(!shown) return;
  var s = scale();
  var offsetTop = $window.height() * settings.offsetHeightRatio;
  var top = minimap.offset().top * s.y;
  var pos = ($window.scrollTop()) * s.y;
  var regionHeight = region.outerHeight(true);
  var bottom = minimap.outerHeight(true) * s.y + top;// - regionHeight;

  if(pos + regionHeight + offsetTop < top || pos >  bottom) {
    region.css({
        display: 'none',
    });
  } else {
    region.css({
        top : pos + offsetTop - top + 'px',
        display : 'block'
    });
  }
};

function scrollTop(e) {
            // if(!shown) return;
    var s = scale();
    var offsetTop = $window.height() * settings.offsetHeightRatio;
    var top = minimap.offset().top * s.y;
    var target = (e.clientY  - offsetTop + top) / s.y;

    if(e.type === 'click' && settings.smoothScroll) {
        var current = $window.scrollTop();
        var maxTarget = minimap.outerHeight(true);
        target = Math.max(target, Math.min(target, maxTarget));
        var direction = target > current;
        var delay = settings.smoothScrollDelay;
        var distance = Math.abs(current - target);
        var r = delay / distance;
        var unitScroll = 1;
        var unitDelay = 4;
        if(r >= 4) {
            unitDelay = parseInt(unitScroll);
        } else if(r >= 1) {
            unitScroll = parseInt(r) * 4;
        } else {
            unitScroll = (4 / r);
        }

        var next = current;
        var count = parseInt(distance / unitScroll);
        onSmoothScroll = true;

        console.log("if");
        // linear translate
        var smoothScroll = function() {
            next = next + (direction ? unitScroll : -unitScroll);
            if(--count <= 0) {
                clearInterval(timer);
                onSmoothScroll = false;
                next = target;
            }
            $window.scrollTop(next);
        };
        var timer = window.setInterval(smoothScroll, unitDelay);
    } else {
    		console.log("else");
        // $window.scrollTop(target);
        $('#editorcontainerbox').scrollTop(target);
    }
    e.stopPropagation();
};

var mousedown = false;
var onSmoothScroll = false;
var onMouseupHandler = function(e) {
    mousedown = false;
};

var onMousemoveHandler = function(e) {
    if(!mousedown || onSmoothScroll) return;
    scrollTop(e);
};

var onClickHandler = function(value) {
    scrollTop(value);
    mousedown= false;
};

var onMousedownHandler = function(e) {
    mousedown = true;
};

/*
	var newY=1000;
		if($.browser.mozilla || $.browser.opera || $.browser.msie) {	//FF and Opera ,MSIE
		var $outerdocHTML = $('iframe[name="ace_outer"]').contents().find("#outerdocbody").parent();
		var inner = $('iframe[name="ace_outer"]').contents().find("#outerdocbody").contents();	//the height varies with the content
		newY += inner.height();
		$outerdocHTML.animate({scrollTop: newY}, 2000); // needed for FF
	} else {	//Chrome
		var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
		newY += $outerdoc.height();
		$outerdoc.animate({scrollTop: newY}, 2000);
	}
	return false;
}*/
