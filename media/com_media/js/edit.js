// OUR CODE
// NEEDS CORE.JS
(function() {
	"use strict";

	var options = Joomla.getOptions('com_media', {});

	if (!options) {
		return;
	}
	// The upload object
	Joomla.UploadFile = {};
	Joomla.UploadFile.removeProgressBar = function() {
		setTimeout(function() {
//			document.querySelector('#jloader').outerHTML = "";
//			delete document.querySelector('#jloader');
//			document.querySelector('.media-browser').style.borderWidth = '1px';
//			document.querySelector('.media-browser').style.borderStyle = 'solid';
		}, 200);
	};

	/**
	 *
	 * @param name        the name of the file
	 * @param file       the file
	 * @param uploadPath the file
	 * @param url        the file
	 * @param type       the file
	 * @constructor
	 */
	Joomla.UploadFile.exec = function (name, file, uploadPath, url, type) {

		// var reader = new FileReader();
		//
		// reader.onload = function() {
		// 	window.file = reader.result;
		// };
		// reader.readAsText(file)

		var forUpload = {
			'name': name,
			'content': 'Some content' // window.file ///file.replace(/data:+.+base64,/, '')
		};


		forUpload[options.csrfToken] = 1;

// @TODO get these from the store
		uploadPath = '';
		url = options.apiBaseUrl + '&task=api.files&path=' + uploadPath;
		type = 'application/json';

		var xhr = new XMLHttpRequest();

		xhr.upload.onprogress = function(e) {
			var percentComplete = (e.loaded / e.total) * 100;
			//document.dispatchEvent(new Event('upload.progress', {"progress": percentComplete + '%'}));
		};

		xhr.onload = function() {
			try {
				var resp = JSON.parse(xhr.responseText);
			} catch (e) {
				var resp = null;
			}

			if (resp) {
				if (xhr.status == 200) {
					if (resp.success == true) {
						item =resp.data;
						Joomla.UploadFile.removeProgessBar();
					}

					if (resp.status == '1') {
						Joomla.renderMessages({'success': [resp.message]}, 'true');
						Joomla.UploadFile.removeProgessBar();
					}
				}
			} else {
				Joomla.UploadFile.removeProgessBar();
			}
		};

		xhr.onerror = function() {
			Joomla.UploadFile.removeProgessBar();
		};

		xhr.open("POST", url, true);
		xhr.setRequestHeader('Content-Type', type);
		xhr.send(JSON.stringify(forUpload));
	};



	document.addEventListener('DOMContentLoaded', function() {


		// function toDataURL(url, callback){
		// 	var xhr = new XMLHttpRequest();
		// 	xhr.open('get', url);
		// 	xhr.responseType = 'blob';
		// 	xhr.onload = function(){
		// 		var fr = new FileReader();
		// 		fr.onload = function(){
		// 			callback(this.result);
		// 		};
		// 		fr.readAsDataURL(xhr.response);
		// 	};
		// 	xhr.send();
		// }

		//  Upload cropped image to server
		// var openFile = function(f) {
		// 	var reader = new FileReader();
		// 	reader.onloadend = function(e) {
		// 		Joomla.UploadFile.exec(f.name, reader.result);
		// 	};
		// 	reader.readAsDataURL(f);
		// };

			// // This Joomla.cropper.getCroppedCanvas() needs to be the media file
			// Joomla.cropper.getCroppedCanvas().toBlob(function (blob) {
			// 	var imgFileName = document.getElementById('media-edit-file').src.split('/').pop();
			//
			// 	Joomla.UploadFile.exec(imgFileName, blob);
			// });


		// This needs a good refactoring once we'll get the new UI/CE
		// Crap to satisfy jQuery's slowlyness!!!
		var func = function() {
				jQuery('[data-toggle="tab"]').on('shown.bs.tab', function(event) {
					if (event.relatedTarget) {
						EventBus.dispatch('onDeactivate', this, event.relatedTarget.hash.replace('#attrib-', ''), document.getElementById('media-edit-file'));
					}
					EventBus.dispatch('onActivate', this, event.target.hash.replace('#attrib-', ''), document.getElementById('media-edit-file'));
				});

			// Hardcoded loading the first tab!!!!!!!
			EventBus.dispatch('onActivate', this, 'crop', document.getElementById('media-edit-file'));
		};
		setTimeout(func, 1000); // jQuery...

		// jQuery(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
		// 	if (e.relatedTarget) {
		// 		EventBus.dispatch('onDeactivate', this, e.relatedTarget.hash.replace('#attrib-', ''), document.getElementById('media-edit-file'));
		// 	}
		// 	EventBus.dispatch('onActivate', this, e.target.hash.replace('#attrib-', ''), document.getElementById('media-edit-file'));
		// });

		/**
		 * Toolbar custom functionality
		 */
		var close, save, subHead = document.getElementById('subhead'),
		    toolbarButtons = [].slice.call(subHead.querySelectorAll('.btn.btn-sm'));

		close = function(event) {
			event.preventDefault();
			var pathName = window.location.pathname.replace(/&view=file.*/g, '');
			window.location = pathName + '?option=com_media';
		};

		save = function(event) {
			event.preventDefault();

			var filename = document.getElementById('media-edit-file-new').src.split('/').pop();
			//
			// var cont = toDataURL(document.getElementById('media-edit-file-new').src, function(dataURL){
			// 	document.getElementById('media-edit-file-new').src = dataURL;
			//
			// 	var canvas = document.createElement('canvas');
			// 	canvas.width = document.getElementById('media-edit-file-new').naturalWidth;
			// 	canvas.height = document.getElementById('media-edit-file-new').naturalHeight;
			// 	canvas.getContext('2d').drawImage(document.getElementById('media-edit-file-new'), 0,0);
			//
			// 	return canvas.toDataURL();
			// 	// console.log(canvas.toDataURL() === dataURL);
			// });

			Joomla.UploadFile.exec(filename, 'whatever');

			// Do the upload
			// var filename = document.getElementById('media-edit-file-new').src.split('/').pop();
			//
			// openFile(document.getElementById('media-edit-file-new').src);

		};

		toolbarButtons.forEach(function(item) {
			// Cancel
			if (item.classList.contains('btn-danger')) {
				item.removeAttribute('onclick');
				item.addEventListener('click', close);
			}

			// Save
			if (item.classList.contains('btn-success')) {
				item.removeAttribute('onclick');
				item.addEventListener('click', save);
			}

			// save and close
			if (item.classList.contains('btn-outline-success')) {
				item.removeAttribute('onclick');
				item.addEventListener('click', save);
				item.addEventListener('click', close);
			}
		})
	});
})();