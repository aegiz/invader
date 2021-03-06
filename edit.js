var lat;
var lng;
var image;
var init = true;
var blobUrl;
var response;

var shoot = new Audio(chrome.runtime.getURL("resources/sounds/shoot.mp3"));
var already = new Audio(chrome.runtime.getURL("resources/sounds/already.mp3"));
var destroy = new Audio(chrome.runtime.getURL("resources/sounds/destroy.mp3"));
var die = new Audio(chrome.runtime.getURL("resources/sounds/die.mp3"));

chrome.extension &&
	chrome.extension.onMessage.addListener(function(request) {
		image = request.image || {};
		if (init) {
			document.getElementById("base").style.backgroundImage =
				"url(" + image + ")";
			document.getElementById("cropped").style.backgroundImage =
				"url(" + image + ")";

			lat = request.url.split(",")[0].split("@")[1];
			lng = request.url.split(",")[1];
			if (typeof lat === "undefined" || typeof lng === "undefined") {
				die.play();
				$(".helper").text("Error: This is not a Google Streetview page");
			} else {
				init = false;
				$(".helper").text(
					"Position and resize this frame around the invader"
				);
			}
		} else {
			// Create an empty canvas element
			var l = parseInt($("#cropped").css("left"), 10);
			var t = parseInt($("#cropped").css("top"), 10);
			var w = parseInt($("#cropped").css("width"), 10);
			var h = parseInt($("#cropped").css("height"), 10);
			var canvas = document.getElementById("final");
			canvas.width = w; // TEST put: 512 here
			canvas.height = h; // TEST put: 512 here
			// Copy the image contents to the canvas
			var ctx = canvas.getContext("2d");
			var img = new Image();
			img.src = image;
			img.onload = function() {
				ctx.drawImage(img, l, t, w, h, 0, 0, w, h);
				var ImageURL = canvas.toDataURL("image/jpeg");
				fetch(ImageURL)
					.then(res => res.blob())
					.then(blob => {
						console.log(blob);
						blobUrl = URL.createObjectURL(blob);
						var form = new FormData();
						form.append("saved_date", "");
						form.append("uid", credentials.uid);
						form.append("image", blob, "image.jpg");
						form.append("latitude", lat); // TEST put: 48.8459351321735657 here
						form.append("longitude", lng); // TEST put: 2.413901983827382349 here
						$(".loader").show();
						$(".points")
							.removeClass()
							.addClass("points");
						shoot.play();
						console.log("** Making the call: ** " + lat + "," + lng);
						var settings = {
							url: "https://space-invaders.com/api/flash/",
							data: form,
							type: "POST",
							contentType: false,
							processData: false,
							cache: false,
							dataType: "json",
							headers: {
								"Accept-Language": "en-us",
								"Cache-Control": "no-cache"
							}
						};
						$.ajax(settings).done(function(res) {
							response = res;
							console.log(response);
							$(".helper").text(response.message);
							if (response.message.includes("ALREADY FLASHED")) {
								already.play();
								$(".download").show();
							} else if (response.message.includes("YOU FOUND")) {
								destroy.play();
								$(".download").show();
								$(".points").addClass(
									"points--" + response.invader.point
								);
							} else if (
								response.message.includes("MISSED") ||
								response.message.slice(0, 2) === "NO"
							) {
								die.play();
							}
							$(".loader").hide();
						});
					});
			};
		}
	});
$(function() {
	$("a[href=#call]").click(function() {
		chrome.extension.sendMessage({ action: "capture" });
		return false;
	});

	$("a[href=#close]").click(function() {
		chrome.tabs.getCurrent(function(tab) {
			chrome.tabs.remove(tab.id);
		});
		return false;
	});

	$("a[href=#download]").click(function() {
		if (response && response.invader) {
			chrome.downloads.download({
				url: blobUrl,
				filename: response.invader.name + ", " + lat + ", " + lng + ".png"
			});
		} else if (response && response.message) {
			chrome.downloads.download({
				url: blobUrl,
				filename:
					response.message.slice(0, 6) + ", " + lat + ", " + lng + ".png"
			});
		}
		return false;
	});

	var image = $("#cropped");
	image
		.draggable({
			grid: [5, 5],
			containment: "document"
		})
		.resizable({
			grid: [5, 5],
			containment: "document",
			handles: "n, e, s, w, ne, se, sw, nw"
		})
		.bind("drag", function(event, ui) {
			var left = ui.offset.left;
			var top = ui.offset.top;
			image.css({
				backgroundPosition: left * -1 + "px " + top * -1 + "px"
			});
		})
		.bind("resize", function(event, ui) {
			var l = parseInt($(ui.element).css("left"), 10);
			var t = parseInt($(ui.element).css("top"), 10);
			var w = parseInt($(ui.element).css("width"), 10);
			var h = parseInt($(ui.element).css("height"), 10);
			$(ui.element).css({
				backgroundPosition: l * -1 + "px " + t * -1 + "px"
			});
			$(".dimensions", image).text(w + "x" + h);
		});
});
