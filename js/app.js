if (localStorage.getItem('csvData') == null) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "lich.csv", false);
	xhttp.send();
	if (xhttp.status === 200) {
		var csvData = xhttp.responseText;
		localStorage.setItem('csvData', csvData);
	} else {
		document.getElementById('noti').innerHTML = 'ĐÃ XẢY RA LỖI, VUI LÒNG THỬ LẠI';
	}
} else {
	var csvData = localStorage.getItem('csvData');
}

let csvData11, csvData12 = ''
while ((csvData.includes('GDTC_')) || (csvData.includes('PKĐK')) || (csvData.includes(', '))) {
    if (csvData.includes('GDTC_')) {
        csvData = csvData.replace('GDTC_', 'HUPHTT');
    } else if (csvData.includes(', ')) {
    	csvData = csvData.replace(', ', '***');
    } else {
        csvData = csvData.replace('PKĐK', 'HUPHPK');
    }
}

// Cắt chuỗi
csvData11 = csvData.slice(csvData.indexOf('HUPH'), csvData.lastIndexOf('HUPH'));
csvData12 = csvData.slice(csvData.lastIndexOf('HUPH'), csvData.lastIndexOf('CKI'));
csvData12 = csvData12.slice(csvData12.indexOf('HUPH'), csvData12.indexOf('CKI'));

csvData = csvData11 + csvData12
// csvData = csvData.replace(/\r?\n|\r/g, '').split('HUPH');
csvData = csvData.split('HUPH');

// =====================
var count = 1;
var slist = new Array()
// =====================

while (count < csvData.length) {
	var sublist = new Array()
	var csvData2 = csvData[count].split(',')
	// console.log(csvData2)
	for (var i of csvData2) {
		sublist.push(i)
	}
	var sang = sublist.slice(2,9);
	var chieu = sublist.slice(13,20);
	var toi = sublist.slice(24,31);

	var giang_duong = '';
	if (sublist[0].includes('B')) {
		giang_duong = sublist[0].slice(sublist[0].indexOf('B'), sublist[0].indexOf('B') + 4)
	} else if (sublist[0].includes('C')) {
		giang_duong = sublist[0].slice(sublist[0].indexOf('C'), sublist[0].indexOf('C') + 4)
	} else if (sublist[0].includes('D')) {
		giang_duong = sublist[0].slice(sublist[0].indexOf('D'), sublist[0].indexOf('D') + 4)
	} else if (sublist[0].includes('TT')) {
		giang_duong = 'Sân thể dục'
	} else if (sublist[0].includes('PK')) {
		giang_duong = 'Phòng khám Đa khoa'
	}

	slist.push([giang_duong, sang, chieu, toi])
	count ++
}

function randomColor(i) {
	return i[Math.floor(Math.random() * i.length)];   
}

function fill(a) {
	let b = '';
	if (a.includes('thể chất')) {
		a = a.split('--')
		for (var i of a) {
			if (i.length > 0) {
				i = i.replace('"', '').replace('gian:', 'gian: ').replace(/\r?\n|\r/g, '<br>');
				b = b + i.split('-(')[0] + i.split('2023')[1] + '\n'
			}
		}
	} else {
		b = a.replace('gian:', 'gian: ').replace('"', '').replace('"', '').replace(/\r?\n|\r/g, '<br>').replace('***', ', ');
		b = b.split('-(')[0] + b.split('2023')[1]
	}
	return b
}

function exportData(lop) {
	if (lop.length > 0) {
		var dow = [0,1,2,3,4,5,6], dayofweek = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7']
		var result = []

		for (var i of slist) {
			for (var j of dow) {
				var tn, nd, b, gd = '';
				var sang = i[1][j].includes(lop), chieu = i[2][j].includes(lop), toi = i[3][j].includes(lop);
				if (j > 6) {
					tn = 0;
				} else {
					tn = j + 1;
				}
				if (sang) {
					b = 'Sáng';
					gd = i[0];
					nd = fill(i[1][j]);
					result.push([tn, b, gd, nd])
				}
				if (chieu) {
					b = 'Chiều';
					gd = i[0];
					nd = fill(i[2][j]);
					result.push([tn, b, gd, nd])
				}
				if (toi) {
					b = 'Tối';
					gd = i[0];
					nd = fill(i[3][j]);
					result.push([tn, b, gd, nd])
				}
			}
		}

		if (result.length == 0) {
			document.getElementById('noti').innerHTML = 'Bạn hiện không có lịch học, quẩy thôi 😆';
			document.getElementById('result').innerHTML = '';
		} else {
			result.sort(function (a,b) {
				return a[0] - b[0];
			})
			let html = '';
			var colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'], check = [];
			var color;
			const d = new Date();
			let day = d.getDay();
			for (let i of result) {
				color = randomColor(colors);
				console.log(i[0] == day)
				if ((document.querySelector('input[name="radioOption"]:checked').value == '0') && (i[0] == day)) {
					html += `
						<div class="d-flex align-items-center border-bottom py-3 alert alert-${color}">
							<div class="w-100 ms-3">
								<div class="d-flex w-100 justify-content-between">
									<h3 class="mb-0">${i[1]} ${dayofweek[i[0]]}</h3>
									<small style="margin-right: 1rem;">Giảng đường <h3>${i[2]}</h3></small>
								</div>
								<span>${i[3]}</span>
							</div>
						</div>
					`
				} else if (document.querySelector('input[name="radioOption"]:checked').value == '1') {
					html += `
						<div class="d-flex align-items-center border-bottom py-3 alert alert-${color}">
							<div class="w-100 ms-3">
								<div class="d-flex w-100 justify-content-between">
									<h3 class="mb-0">${i[1]} ${dayofweek[i[0]]}</h3>
									<small style="margin-right: 1rem;">Giảng đường <h3>${i[2]}</h3></small>
								</div>
								<span>${i[3]}</span>
							</div>
						</div>
					`	
				}
			}
			document.getElementById('noti').innerHTML = 'Dưới đây là Lịch học của bạn'
			document.getElementById('result').innerHTML = html;
		}
	}
}