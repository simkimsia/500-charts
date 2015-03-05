function getJSON() {
	return $.ajax({
		type: "GET",
		url: "http://mktshare.oppoin.com/dygraphs/range-selector/json.php",
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
	month = timestamp.substring(5,7);
	day = timestamp.substring(8,10);

	hour = timestamp.substring(11,13);
	minute = timestamp.substring(14,16);

	result[0] = new Date(year, month, day, hour, minute, 0);
	result[1] = data_point.SG / 100;
	result[2] = data_point.OS / 100;

	return result;
}