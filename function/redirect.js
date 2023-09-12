document.addEventListener('readystatechange', async event => {

    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        console.log("interactive");
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        $.ajax({
            url: window.location.href,
            data: { },
            type: 'POST',
            success: function (response) {
                if (response.success) {
                    window.location.href = "/account/verifyResult?isVerify=0";
                }
            },
            error: function (e) {
                console.log('Error: ' + JSON.stringify(e));
                if (!e.responseText.success) {
                    window.location.href = "/account/verifyResult?isVerify=1";
                }
            }
        });
    }
});