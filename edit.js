var lat;
var lng;
var image;
var init = true;

chrome.extension &&
	chrome.extension.onMessage.addListener(function(request) {
		image = request.image || {};
		if (init) {
			// TODO Need to make sure this exist
			// $("body").addClass("invalid")
			lat = request.url.split(",")[0].split("@")[1];
			lng = request.url.split(",")[1];
			document.getElementById("base").style.backgroundImage =
				"url(" + image + ")";
			document.getElementById("cropped").style.backgroundImage =
				"url(" + image + ")";
			init = false;
		} else {
			// Create an empty canvas element
			var l = parseInt($("#cropped").css("left"), 10);
			var t = parseInt($("#cropped").css("top"), 10);
			var w = parseInt($("#cropped").css("width"), 10);
			var h = parseInt($("#cropped").css("height"), 10);
			var canvas = document.getElementById("final");
			canvas.width = w;
			canvas.height = h;
			// Copy the image contents to the canvas
			var ctx = canvas.getContext("2d");
			var img = new Image();
			img.src = image;
			img.onload = function() {
				ctx.drawImage(img, l, t, w, h, 0, 0, w, h);
				var ImageURL = canvas.toDataURL("image/png");
				fetch(ImageURL)
					.then(res => res.blob())
					.then(blob => {
						console.log(blob);
						var form = new FormData();
						form.append("image", blob, "test.png");
						form.append("projects", "42");
						form.append("source", credentials.source);
						form.append(
							"source_description",
							lat + "," + lng + "," + credentials.username
						);
						$("body").removeClass();
						$("body").addClass("pending");
						console.log("** Making the call **");
						console.log(lat + "," + lng + "," + credentials.username);
						var settings = {
							url: "http://space-invaders.com/api/v1/queries/",
							data: form,
							type: "POST",
							contentType: false,
							processData: false,
							cache: false,
							dataType: "json",
							headers: {
								"Accept-Language":
									"en-NL, nl-NL, fr-FR, vi-VN, en-us;q=0.8",
								Authorization: credentials.token,
								"Cache-Control": "no-cache"
							}
						};
						$.ajax(settings).done(function(response) {
							$("body").removeClass("pending");
							console.log(response);
							if (response.source.slice(0, 15) === "ALREADY FLASHED") {
								$("body").addClass("already-flashed");
							} else if (response.source.slice(0, 9) === "YOU FOUND") {
								$("body").addClass("valid");
							} else if (response.source.slice(0, 6) === "MISSED") {
								$("body").addClass("invalid");
							}
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
