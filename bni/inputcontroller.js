$(document).ready(function () {
    // create AutoComplete
    var ac = new wijmo.input.AutoComplete('#theAutoComplete', {
        itemsSource: getCountries(),
        placeholder: 'select a country'
    });
    // list of countries to select from
    function getCountries() {
        return [
            'Janssen Ho', 
            'Tong Puay Fun'
        ];
    }
});