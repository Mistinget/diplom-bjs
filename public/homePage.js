"use strict"

const nLogoutBtn = new LogoutButton;

nLogoutBtn.action = function logoutBtn() {
    ApiConnector.logout(function(response) {
        if (response.success === true) {
            document.location.reload();
        }
    });
};

//запрос на получение текущего пользователя
ApiConnector.current(function(response) {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBrd = new RatesBoard; //курсы валют

function exchangeRate() {
    ApiConnector.getStocks(function(rate) {
        if (rate.success === true) {
            ratesBrd.clearTable(rate.data);
            ratesBrd.fillTable(rate.data);
        }
    })
};
window.setInterval(exchangeRate, 1000);

const moneyMngr = new MoneyManager;

moneyMngr.addMoneyCallback = function add(data) {
    ApiConnector.addMoney(data, function(rate) {
        if (rate.success === true) {
            ProfileWidget.showProfile(rate.data);
            moneyMngr.setMessage(rate.success, `${data.amount} ${data.currency} успешно внесены!`);
        } else {
            moneyMngr.setMessage(rate.success, rate.error);
        }
    })
};

moneyMngr.conversionMoneyCallback = function conversion(data) {
    ApiConnector.convertMoney(data, function(rate) {
        if (rate.success === true) {
            ProfileWidget.showProfile(rate.data);
            moneyMngr.setMessage(rate.success, `Конвертировано ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
        } else {
            moneyMngr.setMessage(rate.success, rate.error);
        }
    })
};

moneyMngr.sendMoneyCallback = function add(data) {
    ApiConnector.transferMoney(data, function(rate) {
        if (rate.success === true) {
            ProfileWidget.showProfile(rate.data);
            moneyMngr.setMessage(rate.success, `${data.amount} ${data.currency} успешно переведены!`);
        } else {
            moneyMngr.setMessage(rate.success, rate.error);
        }
    })
};

const favorites = new FavoritesWidget;
//Запрос начальног списка избранного
ApiConnector.getFavorites(function(response) {
    if (response.success === true) {
        favorites.clearTable(response.data);
        favorites.fillTable(response.data);
        moneyMngr.updateUsersList(response.data); //заполнение выпадающго списка для перевода денег
    }
});

favorites.addUserCallback = function addUsers(data) {
    ApiConnector.addUserToFavorites(data, function(response) {
        if (response.success === true) {
            favorites.clearTable(response.data);
            favorites.fillTable(response.data);
            moneyMngr.updateUsersList(response.data);
            moneyMngr.setMessage(response.success, `${data.name} добавлен!`);
        } else {
            moneyMngr.setMessage(response.success, response.error);
        }
    })
};

favorites.removeUserCallback = function removeUsers(data) {
    ApiConnector.removeUserFromFavorites(data, function(response) {
        if (response.success === true) {
            favorites.clearTable(response.data);
            favorites.fillTable(response.data);
            moneyMngr.updateUsersList(response.data);
            moneyMngr.setMessage(response.success, `Пользователь удалён!`);
        } else {
            moneyMngr.setMessage(response.success, response.error);
        }
    })
};