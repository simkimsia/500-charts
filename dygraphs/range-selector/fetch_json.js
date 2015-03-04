function getJSON() {
	return $.ajax({
		type: "GET",
		url: "http://simkimsia.github.io/500-charts/dygraphs/range-selector/data.json",
		dataType: "json"
	});
}

function transformDataArray(data_points) {
	var length = data_points.length;
	var result = [];
	for (var i = 0; i < length; i++) {
		result[i] = transformDataPoint(data_points[i]);
	};
	return result;
}

function transformDataPoint(data_point) {
	var result = [];
	timestamp = data_point.timestamp;

	year = timestamp.substring(0,4);
	month = timestamp.substring(5,2);
	day = timestamp.substring(8,2);

	hour = timestamp.substring(11,2);
	minute = timestamp.substring(14,2);

	console.log(year);
	console.log(month);
	console.log(day);
	console.log(hour);
	console.log(minute);
	result[0] = new Date(year, month, day, hour, minute, 0);
	console.log(result[0]);
	result[1] = data_point.sg;
	result[2] = data_point.os;

	return result;
}