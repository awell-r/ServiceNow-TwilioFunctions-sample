(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    /***  ----- Request Variable ----- ***/
    var requestHeader = request.getHeader("x-twilio-signature");
    var requestUrl = request.url;
    var requestQueryString = request.queryString;

    /***  ----- Twilio Variable ----- ***/
    var authToken = "TWILIO_AUTH_TOKEN";
    var key = GlideStringUtil.base64Encode(authToken);

    /***  ----- x-twilio-signature validate ----- ***/
    var url = requestUrl + "?" + requestQueryString;
    var mac = new GlideCertificateEncryption();
    var signature = mac.generateMac(key, "HmacSHA1", url);
    var responseBody = {};
    if (signature != requestHeader) {
        responseBody = { status: "NG", message: "Unauthorized - you are not authenticated to perform this request" };
        response.setContentType('application/json');
        response.setStatus(403);
        response.setBody(responseBody);
    } else {
        responseBody = { status: "OK" };
        response.setContentType('application/json');
        response.setStatus(200);
        response.setBody(responseBody);
    }

    /* implement resource here */

})(request, response);