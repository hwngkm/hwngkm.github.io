(function($) {
    "use strict";
    
    // Ẩn spinner sau 1ms
    setTimeout(function() {
        if ($("#spinner").length > 0) {
            $("#spinner").removeClass("show");
        }
    }, 1);
    
    // Xử lý khi click nút toggle sidebar
    $(".sidebar-toggler").click(function() {
        $(".sidebar, .content").toggleClass("open");
        return false;
    });
    
    // Xử lý thanh tiến trình
    $(".pg-bar").waypoint(function() {
        $(".progress .progress-bar").each(function() {
            $(this).css("width", $(this).attr("aria-valuenow") + "%");
        });
    }, {
        offset: "80%"
    });
    
    // Khởi tạo datetimepicker cho #calender
    $("#calender").datetimepicker({
        inline: true,
        format: "L"
    });
})(jQuery);

// Xác định thông điệp dựa trên thời gian
var loi_chuc = document.getElementById("loi_chuc");
var objDate = new Date();
var hours = objDate.getHours();
loi_chuc.innerHTML = (4 <= hours && hours <= 12) ? "Chúc bạn có một buổi sáng tốt lành và tràn đầy năng lượng" : 
                     (12 < hours && hours <= 19) ? "Chúc bạn có một buổi chiều làm việc và học tập vui vẻ" : 
                     "Chúc bạn có một buổi tối thư giãn sau ngày dài làm việc";

// Đăng ký Service Worker
async function registerSW() {
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("sw.js");
        } catch (e) {
            console.log("SW install fail");
        }
    }
}

// Lưu giá trị vào localStorage và gọi hàm exportData
function saveValue(element) {
    var id = element.id;
    var value = element.value;
    localStorage.setItem(id, value);
    exportData(value);
}

// Lấy giá trị đã lưu từ localStorage
function getSavedValue(key) {
    return localStorage.getItem(key) ? localStorage.getItem(key) : "";
}

// Xử lý khi trang web được tải
window.addEventListener("load", (e) => {
    registerSW();
    var choseValue = document.getElementById("chose").value;
    if (choseValue) {
        exportData(choseValue);
    }
});

// Gán giá trị cho #chose từ localStorage
document.getElementById("chose").value = getSavedValue("chose");

// Xử lý cài đặt ứng dụng
let deferredPrompt;

function installApp() {
    var e;
    if (null !== deferredPrompt) {
        deferredPrompt.prompt();
        ({ outcome: e } = deferredPrompt.userChoice);
        if ("accepted" === e) {
            deferredPrompt = null;
        }
    }
}

// Sự kiện trước khi cài đặt ứng dụng
window.addEventListener("beforeinstallprompt", (e) => {
    document.getElementById("btnn").removeAttribute("style");
    deferredPrompt = e;
});
