(function ($) {
    "use strict";

    // Ẩn spinner sau 1ms
    setTimeout(function () {
        $("#spinner").removeClass("show");
    }, 1);

    // Xử lý khi click nút toggle sidebar
    $(".sidebar-toggler").click(function () {
        $(".sidebar, .content").toggleClass("open");
        return false;
    });

    // Xử lý thanh tiến trình
    $(".pg-bar").waypoint(function () {
        $(".progress .progress-bar").each(function () {
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
var greetingMessage = document.getElementById("loi_chuc");
var objDate = new Date();
var hours = objDate.getHours();
greetingMessage.innerHTML = (4 <= hours && hours <= 12) ? "Chúc bạn có một buổi sáng tốt lành và tràn đầy năng lượng" :
    (12 < hours && hours <= 19) ? "Chúc bạn có một buổi chiều làm việc và học tập vui vẻ" :
        "Chúc bạn có một buổi tối thư giãn sau ngày dài làm việc";

// Đăng ký Service Worker
async function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("sw.js");
        } catch (error) {
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
    return localStorage.getItem(key) || "";
}

// Xử lý khi trang web được tải
window.addEventListener("load", (event) => {
    registerServiceWorker();
    var chosenValue = document.getElementById("chose").value;
    if (chosenValue) {
        exportData(chosenValue);
    }
});

// Gán giá trị cho #chose từ localStorage
document.getElementById("chose").value = getSavedValue("chose");

// Xử lý cài đặt ứng dụng
let deferredPrompt;

function installApp() {
    if (deferredPrompt !== null) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(({ outcome }) => {
            if (outcome === "accepted") {
                deferredPrompt = null;
            }
        });
    }
}

// Sự kiện trước khi cài đặt ứng dụng
window.addEventListener("beforeinstallprompt", (event) => {
    document.getElementById("btnn").removeAttribute("style");
    deferredPrompt = event;
});
