"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloClient = {
    on: function (client) {
        return new HelloClientAPI(client);
    }
};
var HelloClientAPI = /** @class */ (function () {
    function HelloClientAPI(client) {
        var _this = this;
        this.whatsUp = function (args) {
            return _this.client
                .call("whatsUp/whatsUp.sjs", { params: args })
                .then(function (response) {
                if (!response.ok) {
                    throw Error("Invalid response");
                }
                return response.text();
            });
        };
        this.client = client;
    }
    return HelloClientAPI;
}());
exports.HelloClientAPI = HelloClientAPI;
