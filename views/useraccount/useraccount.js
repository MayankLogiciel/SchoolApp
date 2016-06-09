'use strict';

app.userAccount = kendo.observable({
    model: {
        Id: ''
    },
    dataSource: $.lss.ajax.listDataSource({
        transport: {
            read: {
                url: app.host + 'Grid/_AjaxData/UserAccount',
                data: function() {
                    return { columns: JSON.stringify(['Id', 'Username']) };
                }
            }
        },
        serverPaging: true,
        serverFiltering: true,
        pageSize: 60
    }),
    navigate: {
        create: function () {
            $.ajax({
                type: 'GET',
                url: app.host + 'UserAccount/Add'
            }).success(function (data) {
                app.userAccount.set('model', data);
                app.mobileApp.navigate('views/useraccount/add.html');
            });
        },
        update: function (id) {
            $.ajax({
                type: 'GET',
                url: app.host + 'UserAccount/Edit?id=' + id
            }).success(function (data) {
                app.userAccount.set('model', data);
                app.mobileApp.navigate('views/useraccount/edit.html');
            });
        },
        list: function() {
            app.mobileApp.navigate('views/useraccount/list.html');
        }
    },
    create: function () {
        var self = app.userAccount,
            model = self.model;
        
        $.ajax({
            url: app.host + 'UserAccount/Add',
            data: app.security.addVerificationToken(model.toJSON())
        }).success(function (result) {
            kendo.history.locations.pop();
            app.userAccount.navigate.update(result.Id);
        });
    },
    update: function() {
        var self = app.userAccount,
            model = self.model;

        $.ajax({
            url: app.host + 'UserAccount/Edit?id=' + model.Id,
            data: app.security.addVerificationToken(model.toJSON())
        }).success(function(result) {
            app.userAccount.navigate.update(result.Id);
        });
    },
    destroy: function () {
        var self = app.userAccount,
            model = self.model;
        
        $.ajax({
            url: app.host + 'UserAccount/Delete?id=' + model.Id,
            data: app.security.addVerificationToken({})
        }).success(function () {
            app.mobileApp.navigate('#:back');
        });
    }
});

