var data_json = [];

$.getJSON(
	"http://simkimsia.github.io/500-charts/dygraphs/range-selector/data.json", 
	function( data ) {
		data_json = data;
	}
);