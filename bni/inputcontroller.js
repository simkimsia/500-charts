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

    var niSpinner = new wijmo.input.InputNumber('#theGuestCounter', {
        min: 0,
        max: 100,
        format: 'n0',
        step: 1,
        placeholder: 'integer between zero and hundred'
    });

    var referralSpinner = new wijmo.input.InputNumber('#theReferralCounter', {
        min: 0,
        max: 100,
        format: 'n0',
        step: 1,
        placeholder: 'integer between zero and hundred'
    });

    var niAmount = new wijmo.input.InputNumber('#theDoneDealCounter', {
        format: 'c',
        step: 100,
        max: 1000000,
        placeholder: 'amount below $1,000,000'
    });
});