"use strict"

const nUser = new UserForm();

nUser.loginFormCallback = function logCollback(data) {
    ApiConnector.login(data, function(response) {
        if (response.success) {
            document.location.reload();
        } else {
            nUser.setLoginErrorMessage(response.error);
        }
    });
};

nUser.registerFormCallback = function register(data) {
    ApiConnector.register(data, function(response) {
        if (response.success) {
            document.location.reload();
        } else {
            nUser.setRegisterErrorMessage(response.error);
        }
    });
};