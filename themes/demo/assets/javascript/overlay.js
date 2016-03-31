function overlay(objectId) {
    var jqObject;

    initialize = function (object) {
        console.log('initialize');
        jqObject = $(object);
    };

    this.open = function () {
        console.log('open');
        jqObject.addClass('overlay-open');
    };

    this.close = function () {
        console.log('close');
        jqObject.removeClass('overlay-open');
    };

    initialize(document.getElementById(objectId));
}
