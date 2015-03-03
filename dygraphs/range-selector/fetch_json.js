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

	timestamp = timestamp.substring(0,16);
	result[0] = new Date(timestamp);
	result[1] = data_point.sg;
	result[2] = data_point.os;

	return result;
}