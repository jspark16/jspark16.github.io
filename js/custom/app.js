function onChangeRadio(bShow) {
    if (bShow === true) {
        $('#hourly_rate_wrapper').show();
    } else {
        $('#hourly_rate_wrapper').hide(400);
    }
}

function is_caPostalCode(str) {
    let regexp = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/;

    return regexp.test(str);
}

function onSubmitForm(event) {
    event.preventDefault();


    if ($('#city').val() == '0') {
        toastr.error("Please select city!");
        $('#city').focus();
        return;
    }
    let postal_code = $('#postal_code').val();

    if (!is_caPostalCode(postal_code)) {
        toastr.error("Postal code is not correct!");
        $('#postal_code').focus();
        return;
    }


    $('#btn-submit').addClass('disabled');
    $('#btn-close').addClass('disabled');

    let form = $(event.target);

    let url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function (res) {
            toastr.success("Successfully submitted!");

            setTimeout(function () {
                $('#contact-modal').modal('hide');
                $('#name').val("");
                $('#email').val("");
                $('#address').val("");
                $('#city').val("");
                $('#postal_code').val("");
                $('#radio-question').attr("checked", true);
                $('#message').attr("checked", true);
                $('#hourly_rate_wrapper').hide();
                $('#hourly_rate').val(0);
            }, 1000);
        },
        error: function (error) {
            console.log(error);
            toastr.error("There are some error!");
        },
        complete: function () {
            $('#btn-submit').removeClass('disabled');
            $('#btn-close').removeClass('disabled');
        }
    });

    return false;
}

function onClickResume() {
    let doc = new jspdf();

    let elementHtml = $('#about-me').html();
    let specialElementHandlers = {
        '#elementH': function (element, renderer) {
            return true;
        }
    };

    doc.fromHTML(elementHtml, 15, 15, {
        width: 300,
        'elementHandlers': specialElementHandlers
    });

    doc.save("personal-data.pdf");

}

function onCheckValid(event) {
    event.preventDefault();

    let value = event.target.value;

    if (value !== "" && !is_caPostalCode(value)) {
        toastr.error("Postal code is not correct!");
    }
}

$(document).ready(function () {


    let optionHtml = `<option value='0'></option>`;

    cities.forEach(item => {

        let value = item[0];

        if (item.length > 1) {
            let provinceKey = item[1];
            let province = provinces[provinceKey];

            value += ", " + province;
        }

        optionHtml += `<option value='${value}'>${value}</option>`;
    });

    $('#city').html(optionHtml);
    $('#city').selectpicker();
});


