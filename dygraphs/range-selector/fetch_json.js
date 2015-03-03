function getJSON() {
	var json;
	$.ajax({
		type: "GET",
		url: "http://simkimsia.github.io/500-charts/dygraphs/range-selector/data.json",
		dataType: "json",
		success: function( data ) {
			json = data;
		}
	});

	if (json) return json;

}