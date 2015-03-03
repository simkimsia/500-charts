function getJSON() {
	return $.ajax({
		type: "GET",
		url: "http://simkimsia.github.io/500-charts/dygraphs/range-selector/data.json",
		dataType: "json"
	});
}