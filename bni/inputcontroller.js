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

    $("#bigbutton").on('click', function() {
    	var dd = $('#theDoneDealCounter input').val();
    	dd = dd.replace(/\$/g, '');
    	dd = dd.replace(/\,/g, '');
    	var visitor = $("#theGuestCounter input").val();
    	var referral = $("#theReferralCounter input").val();
    	var person = $("#theAutoComplete input").val();
    	window.location.href = 'graphs.html?dd=' + dd + '&v=' + visitor + '&r=' + referral + '&name=' + person;
    });
});