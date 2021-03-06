/**
 * @copyright  Copyright (C) 2005 - 2017 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
Joomla = window.Joomla || {};

Joomla.MediaManager = Joomla.MediaManager || {};

Joomla.MediaManager.Edit = Joomla.MediaManager.Edit || {};
(function() {
	"use strict";

	var initRotate = function(imageSrc) {
		// Clear previous cropper
		if (Joomla.cropper) Joomla.cropper = {};

		// Initiate the cropper
		Joomla.cropperRotate = new Cropper(imageSrc, {
			restore: true,
			responsive:true,
			dragMode: false,
			autoCrop: false,
			autoCropArea: 1,
			guides: false,
			center: false,
			highlight: false,
			cropBoxMovable: false,
			scalable: false,
			zoomable:false,
			rotatable: true,
			cropBoxResizable: false,
			toggleDragModeOnDblclick: false,
			minContainerWidth: imageSrc.offsetWidth,
			minContainerHeight: imageSrc.offsetHeight,
		});
	};

	// Update image
	var updateImage = function(data) {

		var format = Joomla.MediaManager.Edit.original.extension === 'jpg' ? 'jpeg' : 'jpg';

		Joomla.MediaManager.Edit.current.contents = Joomla.cropperRotate.getCroppedCanvas(data).toDataURL("image/" + format, 1.0);

		// Notify the app that a change has been made
		window.dispatchEvent(new Event('mediaManager.history.point'));

		// Make sure that the plugin didn't remove the preview
		document.getElementById('image-preview').src = Joomla.MediaManager.Edit.current.contents;
	};

	// Register the Events
	Joomla.MediaManager.Edit.rotate = {
		Activate: function(mediaData) {

			// Create the images for edit and preview
			var imageSrc = document.createElement('img'),
			    imagePreview = document.createElement('img');

			imageSrc.src = mediaData.contents;
			imagePreview.src = mediaData.contents;
			imagePreview.style.maxWidth = '100%';
			imagePreview.id = 'image-preview';

			imageSrc.style.maxWidth = '100%';
			document.getElementById('originalMedia').appendChild(imageSrc);
			document.getElementById('previewMedia').appendChild(imagePreview);

			// Initialize
			initRotate(imageSrc);

			var funct = function() {
				imageSrc = document.getElementById('media-manager-edit-container').querySelector('img');

				// Set the values for the range fields
				var rotate = document.getElementById('jform_rotate');

				rotate.min = -360;
				rotate.max = 360;
				rotate.value = 0;

				rotate.addEventListener('change', function(event) {
					var label = document.getElementById('jform_rotate-lbl');
					var txt = label.innerText.replace(/:.*/, '');
					label.innerHTML = txt + ' : ' + event.target.value + ' degs';

					Joomla.cropperRotate.rotate(parseInt(event.target.value));

					updateImage({rotate: parseInt(event.target.value)})
				});
			};

			setTimeout(funct, 1000);
		},
		Deactivate: function() {
			if (!Joomla.cropperRotate) {
				return;
			}
			// Destroy the instance
			Joomla.cropperRotate.destroy();
		}
	};

})();
