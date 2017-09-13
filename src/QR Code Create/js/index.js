$(function () {
    var name = "",company = "",title = "",address = "",mobile = "",email = "",web = "",desc = "";
    $("#b_btn").click(function () {
        if($("#name").val().length > 1){
            name = "FN:"+ $("#name").val() +"\n";
        }
        if($("#company").val().length > 1){
            company = "ORG:"+ $("#company").val() +"\n";
        }
        if($("#title").val().length > 1){
            title = "TITLE:"+ $("#title").val() +"\n";
        }
        if($("#address").val().length > 1){
            address = "ARD:WORK:"+ $("#address").val() +"\n";
        }
        if($("#mobile").val().length > 1){
            mobile = "TEL;WORK:"+ $("#mobile").val() +"\n";
        }
        if($("#email").val().length > 1){
            email = "EMAIL;WORK"+ $("#email").val() +"\n";
        }
        if($("#web").val().length > 1){
            web = "URL:"+ $("#web").val() +"\n";
        }
        if($("#desc").val().length > 1){
            desc = "NOTE:"+ $("#desc").val() +"\n";
        }
        var info = "BEGIN:VCARD\n"+name+company+title+address+mobile+email+web+desc+"END:VCARD";
        $("#qrcode p").css({
            "z-index":-9999
        });
        $("#qrcode").html();
        var qrcode = new QRCode("qrcode");
        qrcode.makeCode(info);
    });
});