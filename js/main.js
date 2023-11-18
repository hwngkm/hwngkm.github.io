import $ from "jquery";
import { registerSW, saveValue, getSavedValue } from "./utils";

$(function() {
    "use strict";

    // Hide spinner after 1ms
    setTimeout(function() {
        if ($("#spinner").length > 0) {
            $("#spinner").removeClass("show");
        }
    }, 1);

    // Handle click event on sidebar toggle button
    $(".sidebar-toggler").on("click", function() {
        $(".sidebar, .content").toggleClass("open");
        return false;
    });

    // Handle progress bar
    $(".pg-bar").waypoint(function() {
        $(".progress .progress-bar").each(function() {
            $(this).css("width", $(this).attr("aria-valuenow") + "%");
        });
    }, {
        offset: "80%"
    });

    // Initialize datetimepicker for #calender
    $("#calender").datetimepicker({
        inline: true,
        format: "L"
    });

    // Set message based on time
    const loi_chuc = document.getElementById("loi_chuc");
    const objDate = new Date();
    const hours = objDate.getHours();
    loi_chuc.innerHTML = (4 <= hours && hours <= 12) ? "Chúc bạn có một buổi sáng tốt lành và tràn đầy năng lượng" :
        (12 < hours && hours <= 19) ? "Chúc bạn có một buổi chiều làm việc và học tập vui vẻ" :
        "Chúc bạn có một buổi tối thư giãn sau ngày dài làm việc";

    // Register Service Worker
    registerSW();

    // Save value to localStorage and call exportData
    $(".save-value").on("input", function() {
        const id = $(this).attr("id");
        const value = $(this).val();
        saveValue(id, value);
    });

    // Get saved value from localStorage
    $(".saved-value").each(function() {
        const key = $(this).attr("id");
        const savedValue = getSavedValue(key);
        $(this).val(savedValue);
    });

    // Handle install app
    let deferredPrompt;
    function installApp() {
        if (deferredPrompt !== null) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choiceResult => {
                if (choiceResult.outcome === "accepted") {
                    deferredPrompt = null;
                }
            });
        }
    }

    // Before install prompt event
    window.addEventListener("beforeinstallprompt", e => {
        $("#btnn").removeAttr("style");
        deferredPrompt = e;
    });
});