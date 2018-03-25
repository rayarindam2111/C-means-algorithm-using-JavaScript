$('#fileUP').on('click touchstart', function () {
	$(this).val('');
});

//Trigger when any file is selected
$("#fileUP").change(function (e) {
	var fileP = document.getElementById('fileUP');
	if (window.File && window.FileReader && window.FileList) {
		if (!( /*fileP.files[0].size<=3145728 && */ fileP.files[0].type.startsWith("image/"))) {
			alert("Only image files allowed!");
			return;
		}
		handleDrop(fileP.files[0]);
		choosefile = 1;
	} else
		alert("Your browser does not support file processing!");
});

handleDrop = function (file) {
	resizeImage(file, 90, function (result) {
		$('#resultImage').attr('src', result);
	});
};

$("#noofpoints").change(function (e) {
	choosefile = 0;
	$('#fileUP').val('');
	$('#resultImage').attr('src', "");
});

var picD = [];
var picU = [];

resizeImage = function (file, size, callback) {
	var fileTracker = new FileReader;
	fileTracker.onload = function () {
		var image = new Image();
		image.onload = function () {
			var canvas = document.createElement("canvas");
			if (image.height > size) {
				image.width *= size / image.height;
				image.height = size;
			}
			if (image.width > size) {
				image.height *= size / image.width;
				image.width = size;
			}
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.width = image.width;
			canvas.height = image.height;
			ctx.drawImage(image, 0, 0, image.width, image.height);
			picU = [];
			picD = [];
			for (var i = 0; i < image.width; i++)
				for (var j = 0; j < image.height; j++) {
					var rgb = ctx.getImageData(i, j, 1, 1).data;
					var t = rgb[0] + rgb[1] + rgb[2];
					if (t > 0)
						picU.push([rgb[0] / t, rgb[1] / t, rgb[2] / t]);
					else
						picU.push([1 / 3, 1 / 3, 1 / 3]);
					picD.push([(i / size) * maxRange, maxRange - (j / size) * maxRange - (maxRange / size) * (size - image.height)]);
				}
			$('#noofpoints').val(i * j);
			callback(canvas.toDataURL("image/png"));
		};
		image.src = this.result;
	}
	fileTracker.readAsDataURL(file);
	fileTracker.onabort = function () {
		alert("The upload was aborted.");
	}
	fileTracker.onerror = function () {
		alert("An error occured while reading the file.");
	}
};