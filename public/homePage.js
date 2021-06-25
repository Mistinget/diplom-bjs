"use strict"

const logoutButton = new LogoutButton();

logoutButton.action = function logoutBtn() {
    ApiConnector.logout(function(response) {
        if (response.success) {
            document.location.reload();
        }
    });
};

//запрос на получение текущего пользователя
ApiConnector.current(function(response) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard(); //курсы валют

function exchangeRate() {
    ApiConnector.getStocks(function(response) {
        if (response.success) {
            ratesBoard.clearTable(response.data);
            ratesBoard.fillTable(response.data);
        }
    })
};
window.setInterval(exchangeRate, 1000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function add(data) {
    ApiConnector.addMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
        moneyManager.setMessage(response.success, response.success ? `${data.amount} ${data.currency} успешно внесены!` : response.error);
    })
};

moneyManager.conversionMoneyCallback = function conversion(data) {
    ApiConnector.convertMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
        moneyManager.setMessage(response.success, response.success ? `Конвертировано ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}` : response.error);
    })
};

moneyManager.sendMoneyCallback = function add(data) {
    ApiConnector.transferMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
        moneyManager.setMessage(response.success, response.success ? `${data.amount} ${data.currency} успешно переведены!` : response.error);
    })
};

const favorites = new FavoritesWidget();
//Запрос начальног списка избранного
ApiConnector.getFavorites(function(response) {
    if (response.success) {
        favorites.clearTable(response.data);
        favorites.fillTable(response.data);
        moneyManager.updateUsersList(response.data); //заполнение выпадающго списка для перевода денег
    }
});

favorites.addUserCallback = function addUsers(data) {
    ApiConnector.addUserToFavorites(data, function(response) {
        if (response.success) {
            favorites.clearTable(response.data);
            favorites.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
        moneyManager.setMessage(response.success, response.success ? `${data.name} добавлен!` : response.error);
    })
};

favorites.removeUserCallback = function removeUsers(data) {
    ApiConnector.removeUserFromFavorites(data, function(response) {
        if (response.success) {
            favorites.clearTable(response.data);
            favorites.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
        moneyManager.setMessage(response.success, response.success ? `Пользователь удалён!` : response.error);
    })
};