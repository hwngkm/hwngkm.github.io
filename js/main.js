(function ($) {
	"use strict";
	// Spinner
	var spinner = function () {
		setTimeout(function () {
			if ($('#spinner').length > 0) {
				$('#spinner').removeClass('show');
			}
		}, 1);
	};
	spinner();
	// Sidebar Toggler
	$('.sidebar-toggler').click(function () {
		$('.sidebar, .content').toggleClass("open");
		return false;
	});
	// Progress Bar
	$('.pg-bar').waypoint(function () {
		$('.progress .progress-bar').each(function () {
			$(this).css("width", $(this).attr("aria-valuenow") + '%');
		});
	}, {offset: '80%'});
	// Calender
	$('#calender').datetimepicker({
		inline: true,
		format: 'L'
	});
})(jQuery);

var loi_chuc = document.getElementById('loi_chuc');
var objDate = new Date();
var hours = objDate.getHours();
if(hours >= 4 && hours <= 12){
	loi_chuc.innerHTML = 'Chúc bạn có một buổi sáng tốt lành và tràn đầy năng lượng';
} else if (hours > 12 && hours <= 19) {
	loi_chuc.innerHTML = 'Chúc bạn có một buổi chiều làm việc và học tập vui vẻ';
} else {
	loi_chuc.innerHTML = 'Chúc bạn có một buổi tối thư giãn sau ngày dài làm việc';
}

async function registerSW() {
	if ("serviceWorker" in navigator) {
		try {
			await navigator.serviceWorker.register("./sw.js");
		} catch (e) {
			console.log('SW install fail');
		}
	} else {
		console.log('error');
	}
}

window.addEventListener("load", (event) => {
	registerSW();
	exportData(document.getElementById('chose').value);
	if (getSavedValue().length > 0) {
		localStorage.setItem('chose', '');
	}
});

document.getElementById("chose").value = getSavedValue("chose");
function saveValue(e) {
	var id = e.id;
	var val = e.value;
	localStorage.setItem(id, val);
	exportData(val)
}
function getSavedValue(v) {
	if (!localStorage.getItem(v)) {
		return '';
	}
	return localStorage.getItem(v);
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
	document.getElementById('btnn').removeAttribute("style")
    deferredPrompt = e;
});

function installApp() {
    if (deferredPrompt !== null) {
        deferredPrompt.prompt();
        const { outcome } = deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            deferredPrompt = null;
        }
    }
}