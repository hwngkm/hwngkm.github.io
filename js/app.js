// Tạo đối tượng XMLHttpRequest
let xhttp = new XMLHttpRequest();

// Khởi tạo yêu cầu GET đến tệp "lich.csv" với chế độ đồng bộ
xhttp.open("GET", "lich.csv", false);
xhttp.send();

// Kiểm tra trạng thái của yêu cầu
if (xhttp.status === 200) {
    // Lấy dữ liệu CSV
    let csvData = xhttp.responseText;

    // Xử lý dữ liệu CSV
    csvData = csvData.replace(/GDTC_/g, "HUPHTT")
                     .replace(/, /g, "***")
                     .replace(/PKĐK/g, "HUPHPK");

    var slist = csvData.split("HUPH").slice(1).map(e => {
        let t = e.split(",");
        let n = t[0].match(/[BCD]|TT|PK/) ? t[0] : "";
        let l = t.slice(2, 9);
        let r = [n, l, t.slice(13, 20), t.slice(24, 31)];
        return r;
    });
} else {
    document.getElementById("noti").innerHTML = "Đã xảy ra lỗi, vui lòng thử lại";
}

// Hàm chọn màu ngẫu nhiên
function randomColor() {
    let colors = ["primary", "secondary", "success", "danger", "warning", "info"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Hàm xử lý nội dung để hiển thị
function fill(content) {
    if (content.includes("thể chất")) {
        return content.split("--")
                      .filter(e => e.length > 0)
                      .map(e => e.replace('"', "")
                                  .replace("gian:", "gian: ")
                                  .replace(/\r?\n|\r/g, "<br>"))
                      .join("\n");
    } else {
        return content.replace("gian:", "gian: ")
                      .replace(/"/g, "")
                      .replace(/\r?\n|\r/g, "<br>")
                      .replace("***", ", ");
    }
}

// Hàm lấy kết quả dựa trên radio button được chọn
function getResultFromRadio(data) {
    let currentDay = new Date().getDay();
    let selectedOption = "";
    let radio = document.querySelector('input[name="radioOption"]:checked');
    if (radio) {
        selectedOption = radio.value;
    }
    let result = [];
    for (let entry of data) {
        if (selectedOption === "0" && entry[0] === currentDay) {
            result.push(entry);
        }
    }
    return result.length === 0 ? data : result;
}

// Hàm xuất dữ liệu lịch học dựa trên môn học
function exportData(selectedClass) {
    if (selectedClass) {
        let weekdays = [0, 1, 2, 3, 4, 5, 6];
        let dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        let filteredData = [];
        for (var entry of slist) {
            for (var day of weekdays) {
                let dayNumber = day > 6 ? 0 : day + 1;
                let hasMorningClass = entry[1][day].includes(selectedClass);
                let hasAfternoonClass = entry[2][day].includes(selectedClass);
                let hasEveningClass = entry[3][day].includes(selectedClass);
                if (hasMorningClass || hasAfternoonClass || hasEveningClass) {
                    let classType = hasMorningClass ? entry[1][day] : hasAfternoonClass ? entry[2][day] : entry[3][day];
                    let formattedContent = fill(classType);
                    let timeOfDay;
                    if (hasMorningClass) {
                        timeOfDay = "Sáng";
                    } else if (hasAfternoonClass) {
                        timeOfDay = "Chiều";
                    } else if (hasEveningClass) {
                        timeOfDay = "Tối";
                    }
                    filteredData.push([dayNumber, timeOfDay, entry[0], formattedContent]);
                }
            }
        }
        if (filteredData.length === 0) {
            document.getElementById("noti").innerHTML = "Bạn hiện không có lịch học, quẩy thôi 😄";
            document.getElementById("result").innerHTML = "";
        } else {
            filteredData.sort((a, b) => a[0] - b[0]);
            let resultHTML = "";
            for (let item of filteredData) {
                resultHTML += `<div class="d-flex align-items-center border-bottom py-3 alert alert-${randomColor()}">
                                    <div class="w-100 ms-3">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h3 class="mb-0">${item[1]} ${dayNames[item[0]]}</h3>
                                            <small style="margin-right: 1rem;">Giảng đường <h3>${item[2]}</h3></small>
                                        </div>
                                        <span>${item[3]}</span>
                                    </div>
                                </div>`;
            }
            document.getElementById("noti").innerHTML = "Dưới đây là lịch học của bạn";
            document.getElementById("result").innerHTML = resultHTML;
        }
    }
}
