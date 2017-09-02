const notifications = {};

$(() => {
    $('#infoBox').click((event) => $(event.target).hide());
    $('#errorBox').click((event) => $(event.target).hide());

    $(document).on({
        ajaxStart: () => {
            $('#loadingBox').show();
            $('#errorBox').hide();
        },
        ajaxStop: () => {
            $('#loadingBox').fadeOut();
        }
    });

    notifications.showInfo = function (message) {
        $('#infoBox').find("span").text(message);
        $('#infoBox').show();
        setTimeout(() => $('#infoBox').fadeOut(), 3000);
    };

    notifications.showError = function (message) {
        $('#errorBox').find("span").text(message);
        $('#errorBox').show();
    };

    notifications.handleError = function (reason) {
        notifications.showError(reason.responseJSON.description);
    };
});