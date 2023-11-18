// Tạo đối tượng XMLHttpRequest
let xhttp = new XMLHttpRequest;

// Khởi tạo một yêu cầu GET đến tệp "lich.csv" với chế độ đồng bộ
if (xhttp.open("GET", "lich.csv", false), xhttp.send(), 200 === xhttp.status) {
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
        let r;
        return [n, l, t.slice(13, 20), t.slice(24, 31)];
    });
} else {
    document.getElementById("noti").innerHTML = "Đã xảy ra lỗi, vui lòng thử lại";
}

// Hàm chọn màu ngẫu nhiên
function randomColor() {
    let e = ["primary", "secondary", "success", "danger", "warning", "info"];
    return e[Math.floor(Math.random() * e.length)];
}

// Hàm xử lý nội dung để hiển thị
function fill(e) {
    if (e.includes("thể chất")) {
        return e.split("--")
                .filter(e => e.length > 0)
                .map(e => e.replace('"', "")
                            .replace("gian:", "gian: ")
                            .replace(/\r?\n|\r/g, "<br>"))
                .join("\n");
    } else {
        return e.replace("gian:", "gian: ")
                .replace(/"/g, "")
                .replace(/\r?\n|\r/g, "<br>")
                .replace("***", ", ");
    }
}

// Hàm lấy kết quả dựa trên radio button được chọn
function getResultFromRadio(e) {
    let t = new Date().getDay();
    let n = "";
    let l = document.querySelector('input[name="radioOption"]:checked');
    l && (n = l.value);
    let r = [];
    for (let i of e) {
        if ("0" === n && i[0] === t) {
            r.push(i);
        }
    }
    return r.length === 0 ? e : r;
}

// Hàm xuất dữ liệu lịch học dựa trên môn học
function exportData(e) {
    if (e) {
        let t = [0, 1, 2, 3, 4, 5, 6];
        let n = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        let l = [];
        for (var r of slist) {
            for (var i of t) {
                let tn = i > 6 ? 0 : i + 1;
                let a = r[1][i].includes(e);
                let s = r[2][i].includes(e);
                let c = r[3][i].includes(e);
                if (a || s || c) {
                    let h = r[0];
                    let g = fill(a ? r[1][i] : s ? r[2][i] : r[3][i]);
                    let o;
                    if (a) {
                        o = "Sáng";
                    } else if (s) {
                        o = "Chiều";
                    } else if (c) {
                        o = "Tối";
                    }
                    l.push([tn, o, h, g]);
                }
            }
        }
        if (l.length === 0) {
            document.getElementById("noti").innerHTML = "Bạn hiện không có lịch học, quẩy thôi 😄";
            document.getElementById("result").innerHTML = "";
        } else {
            l.sort((e, t) => e[0] - t[0]);
            let p = "";
            for (let d of l) {
                p += `<div class="d-flex align-items-center border-bottom py-3 alert alert-${randomColor()}">
                        <div class="w-100 ms-3">
                            <div class="d-flex w-100 justify-content-between">
                                <h3 class="mb-0">${d[1]} ${n[d[0]]}</h3>
                                <small style="margin-right: 1rem;">Giảng đường <h3>${d[2]}</h3></small>
                            </div>
                            <span>${d[3]}</span>
                        </div>
                    </div>`;
            }
            document.getElementById("noti").innerHTML = "Dưới đây là lịch học của bạn";
            document.getElementById("result").innerHTML = p;
        }
    }
}
