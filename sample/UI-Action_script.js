try {
    /***  ----- ServiceNow POST Parameters ----- ***/
    var params = {
        calledNumberList: ["+819000000000", "+815000000000", "+81300000000"],
        message: "message",
        callbackUrl: "https://example.com",
        options: {
            sysId: "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345",
            value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        },
    };

    /***  ----- Twilio Variable ----- ***/
    var authToken = "TWILIO_AUTH_TOKEN";
    var endpoint = "TWILIO_FUNCTION_ENDPOINT";

    /***  ----- Twilio Authenticate ----- ***/
    var body = JSON.stringify(params);
    var digest = new GlideDigest();
    var hash = digest.getSHA256Hex(body);
    var url = endpoint + "?bodySHA256=" + hash.toLowerCase();
    var key = GlideStringUtil.base64Encode(authToken);
    var mac = new GlideCertificateEncryption();
    var signature = mac.generateMac(key, "HmacSHA1", url);

    /***  ----- send request ----- ***/
    var r = new sn_ws.RESTMessageV2();
    r.setHttpMethod("post");
    r.setEndpoint(url);
    r.setHttpTimeout(10000);
    r.setRequestBody(body);
    r.setRequestHeader("content-type", "application/json");
    r.setRequestHeader("x-twilio-signature", signature);

    /*** ----- get response ----- ***/
    var response = r.execute();
    if (response.getStatusCode() == "200") {
        gs.addInfoMessage("Success");
    } else {
        gs.addInfoMessage("Failed");
        gs.addInfoMessage("httpStatus:" + response.getStatusCode());
        gs.addInfoMessage("httpBody:" + response.getBody());
    }
} catch (ex) {
    var message = ex.message;
    gs.addInfoMessage("error:" + message);
}