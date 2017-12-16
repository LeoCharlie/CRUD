$(document).ready(function() {
    $("#onoffswitch").on('click', function(){
        clickSwitch()
    });

    var clickSwitch = function() {
        if ($("#onoffswitch").is(':checked')) {
            console.log("在ON的状态下");
        } else {
            console.log("在OFF的状态下");
        }
    };
});