/**
 * Some test files for offline testing (Use Internet Explorer 8+, latest IE recommended)
 **/
if (typeof(window.external.RunningFromRPS)=== "undefined") {
	var i = 0;
	var a = new Array(
		{
			"source": "file://F:\\photos\\Wales 2003\\Angel\\thumbs\\2787 Angel In The Making.jpg",
			"metadata": "no meta",
			"settings":{"animated": "true", "mediatype": "image"}
		},
		{
			"source": "file://F:\\tests\\panorama\\9227-9230 Wide view of the castle.jpg",
			"settings":{"metadata": "no meta","animated": "true", "mediatype": "image"}
		},
		{
			"source": "file://F:\\photos\\Wales 2003\\Bath\\movies\\MVI_2312.AVI",
			"settings":'{"metadata": "no meta","animated": "true", "mediatype": "video","stretchSmallVideos":"false"}'
		},
		{
			"source": "file://F:\\photos\\Wales 2003\\Brecon Beacons\\thumbs\\1942.jpg",
			"settings":'{"metadata": "no meta","animated": "true", "mediatype": "image"}'
		},
		{
			"source": "file://F:\\photos\\Wales 2003\\Angel\\2788 Angel.jpg",
			"settings":'{"metadata": "no meta","animated": "true", "mediatype": "image"}'
		},
		{
			"source": "file://F:\\photos\\2014\\20140201 Reel Big Fish and Less Than Jake\\20140201_212242 Reel Big Fish - Nirvana.mp4",
			"settings":'{"metadata": "no meta","animated": "true", "mediatype": "video"}'
		},
		{
			"source": "file://F:\\photos\\Wales 2003\\Angel\\thumbs\\2789 Angel Halo.jpg",
			"settings":'{"metadata": "no meta","animated": "true", "mediatype": "image"}'
		},
		{
			"source": "file://F:\\photos\\Wales 2003\\Angel\\thumbs\\2788 Angel.jpg",
			"settings":'{"metadata": "no meta","animated": "true", "mediatype": "image"}'
		}
	);

	window.onclick = function() {
		i++;
		if (i >= a.length) i = 0;
		//console.log(a[i]["source"]);
		showImage(a[i]["source"], a[i]["source"], a[i]["settings"]);
		//identify();
	}
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (searchString, position) {
		var subjectString = this.toString();
		if (position === undefined || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	}
}

function getStyleSheet(stylesheet) {
	for(i = 0; i < document.styleSheets.length; i++){
		if (document.styleSheets[i].href.endsWith(stylesheet)) return document.styleSheets[i];
	}
	return undefined;
}

function getStyleSheetRule(stylesheet, selector) {
	sheet = getStyleSheet("monitor.css"); // styles defined on page
	if (sheet != undefined && sheet.cssRules != undefined) {
		for(i = 0; i < sheet.cssRules.length; i++){
			if (selector == sheet.cssRules[i].selectorText) return sheet.cssRules[i];
		}
	}
	return undefined;
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function setVisibility(id, visibility) {
	if (visibility) {
	} else {
	}
}

function toggle(id, visibility) {
	if (visibility == undefined) {
			$(id).toggle();
	} else switch(visibility.toLowerCase()) {
		case "true":
			$(id).show();
		break;
		case "false":
			$(id).hide();
		break;
	}
	//alert(id + " " + visibility);
	if ($(id).is(":visible")) return "true";
	else return "false";
}

function show(id) {
	$(id).show();
}

function hide(id) {
	$(id).hide();
}

function setBackgroundColour(colour) {
	cssRule = getStyleSheetRule(null, "html, .card");
	if (cssRule != undefined && cssRule.style != undefined) {
		cssRule.style.backgroundColor = colour;
	}
}

// identify monitor nr
function identify() {
	$("#identify").stop(true, true);
	$("#identify").show();
	$("#identify").fadeOut(5000);
}

function beep() {
		var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
		snd.play();
}

// identify monitor nr
function showInfo(info, fade) {
	document.getElementById("showinfo").innerHTML = info;
	$("#showinfo").stop(true, true);
	$("#showinfo").show();
	if (fade.toLowerCase() == "true") {
		$("#showinfo").stop().fadeOut(5000);
	}
	return true;
}

// identify monitor nr
function showPriorityInfo(info, fade) {
	document.getElementById("showpriorityinfo").innerText = info;
	//$("#showpriorityinfo").stop(true, true);
	$("#showpriorityinfo").show();
	if (fade.toLowerCase() == "true") $("#showpriorityinfo").stop().fadeOut(5000);
}

function showUpdateInfo(info) {
	document.getElementById("updateinfomessage").innerHTML = info;
	$("#updateinfo").stop(true, true);
	$("#updateinfo").show("blind", "direction:up");
	return true;
}

function showMetadata(metadata) {
	document.getElementById("quickMetadata").innerText = metadata;
}

function showIndexProgress(info) {
	document.getElementById("indexprogress").innerText = info;
}

function setImageRotation(deg, scale) {
	$(".card .image").last().attr("style", "transform:rotate(" + deg + "deg) scale(" + scale + ");");
}

var g_source, g_displayPath, g_settings;

function useBackupVideoSolution(me) {
	g_settings.mediatype = "object";
	showImage(g_source, g_displayPath, g_settings);
}

function getVideoObjectElement(source, settings) {
	var playCount = 1;
	var stretch = "";
	if (settings.stretchSmallVideos) stretch = " stretch";
	if (settings.loop) playCount = 9999;
	html = '<object class="object media' + stretch + '" id="mediaPlayer" classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95"'
			+ 'codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"'
			+ 'standby="Loading Microsoft� Windows� Media Player components..." type="application/x-oleobject">'
			+ '<param name="FileName" value="' + source + '" />'
			+ '<param name="Mute" value="' + settings.mute + '"/>'
			+ '<param name="playCount" value="' + playCount + '"/>'
			+ '<param name="AutoStart" value="True" />'
			+ '<param name="DefaultFrame" value="mainFrame" />'
			+ '<param name="ShowStatusBar" value="0" />'
			+ '<param name="windowlessVideo" value="true" />'
			+ '<param name="ShowPositionControls" value="' + settings.showcontrols + '" />'
			+ '<param name="showcontrols" value="' + settings.showcontrols + '" />'
			+ '<param name="ShowAudioControls" value="' + settings.showcontrols + '" />'
			+ '<param name="ShowTracker" value="0" />'
			+ '<param name="EnablePositionControls" value="0" />'
	html += '</object>';
	return html;
}

function showImage(source, displayPath, settings) {
	if (typeof settings == "string") settings = JSON.parse(settings);

	var html = '';
	var stretch = false;
	if (settings.mediatype == undefined) settings.mediatype = "image";

	g_source = source;
	g_displayPath = displayPath;
	g_settings = settings;

	switch(settings.mediatype) {
		case "image":
			style = '';
			classes = '';
			if ((settings.exifRotate != undefined && settings.exifRotate != 0) || (settings.resizeRatio != undefined && settings.resizeRatio != 1)) {
				if (settings.exifRotate == undefined) settings.exifRotate = 0;
				if (settings.resizeRatio == undefined) settings.resizeRatio = 1;
				style='transform:rotate(' + settings.exifRotate + 'deg) scale(' + settings.resizeRatio + ');';
			}
			if (settings["pano"] != undefined && settings["pano"] == true) {
				classes += 'pano ';
				style +=
					'width: ' + settings["pano.width"] + 'px;'+
					'height: ' + settings["pano.height"] + 'px;'+
					'left: ' + settings["pano.left"] + 'px;'+
					'top: ' + settings["pano.top"] + 'px;'
				;

			}
			html = '<img ';
			if (style != '') html += 'style="' + style + '"';
			html += 'class="image ' + classes +'media" src="' + source + '"/>';
			//alert(html);
			//window.clipboardData.setData("Text", html);
			if (settings.stretchSmallImages) stretch = true;
		break;
		case "video":
			html = '<video class="video media" src="' + source + '" onerror="useBackupVideoSolution()" autoplay';
			if (settings.loop) html += ' loop';
			if (settings.mute) html += ' muted';
			if (settings.showcontrols) html += ' controls';
			html += '></video>';
			if (settings.stretchSmallVideos) stretch = true;
		break;
		case "object":
			html = getVideoObjectElement(source, settings);
		break;
	}

	card = $("<div class='card stretch'>" + html + "</div>").hide();
	$("#rolodex").append(card);
	if (settings.animated == "true" && settings.effect != undefined) card.show(JSON.parse(settings.effect));
	else card.show("fade", 250);
	if (stretch) {
		$(".media").objectFit('contain');
	}
	while($("#rolodex .card").length > 2) {
		first = $("#rolodex .card").first();
		first.hide();
		first.remove();
	}
	if ($("#rolodex .card").length > 1) {
		first = $("#rolodex .card").first();
		if ($(first.get(0).childNodes[0]).hasClass("video")) {
			if(typeof first.get(0).childNodes[0].pause === 'function') {
				first.get(0).childNodes[0].pause();
			}
			if ($(first.get(0).childNodes[0]).hasClass("object")) first.remove();
		}
		if ($(first.get(0).childNodes[0]).hasClass("object")) {
			var player = document.getElementById("mediaPlayer");
			try {
				player.PlayState = 0;
				player.controls.stop();
			} catch(e) {

			}
			first.get(0).childNodes[0].pause();
			$(first.get(0)).hide()
		}
	}

	document.getElementById("filename").innerText = displayPath;
	document.getElementById("quickMetadata").innerText = settings["metadata"];

	if (settings["pano"] != undefined && settings["pano"] == true) {
//				window.prompt("Copy to clipboard: Ctrl+C, Enter", html);
	}

}

function resize() {
	height = window.innerHeight;
	document.getElementById("identify").setAttribute("style", "font-size:" + (height*0.9) + "px; line-height:" + (height*0.9) + "px");
}

function setClockType(type) {
	clockType = type;
	$("#clock").toggle(clockType != "no" && clockType != "none");
}

var startTime = new moment();
var clockType = "current";
function clockTick() {
	//window.onclick();
	var m = new moment();
	if (clockType == "elapsed") {
		document.getElementById('clock').innerText = m.subtract(startTime).format("HH:mm:ss");
	} else { // current
		document.getElementById('clock').innerText = m.format("HH:mm:ss");
	}
	var t = setTimeout(function(){clockTick()},100);
}

window.onresize = function() {
	resize();
}

$(function(){
	$(".closeX").click(function() {
		$(this).parent().hide("blind", "direction:down");
	});
});

window.onload = function() {

	resize();
	clockTick();
	if (typeof(window.external.RunningFromRPS)=== "undefined") {
		setBackgroundColour("#000000");
		clockTick();
//				window.onclick();
	} else {
		$(".info").each(function() {
			if ($(this).text().substr(0,1) == "#" && $(this).text().substr(-1, 1) == "#") $(this).text("");
		});
	}
}

