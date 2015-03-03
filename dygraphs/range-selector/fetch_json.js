function getJSON() {
	var json;
	return JSON.parse($.ajax({
		type: "GET",
		url: "http://simkimsia.github.io/500-charts/dygraphs/range-selector/data.json",
		dataType: "json",
		success: function( data ) {
			return data;
		}
	}).responseText);

}