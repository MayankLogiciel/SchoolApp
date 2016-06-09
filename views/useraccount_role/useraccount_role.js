'use strict';

app.userAccount_Role = kendo.observable({
    model: {
        Id: ''
    },
    dataSource: $.lss.ajax.listDataSource({
        transport: {
            read: {
                url: function () { return app.host + 'Grid/_AjaxData/UserAccount_Role?parentRecordId=' + app.userAccount.model.Id; },
                data: function() {
                    return {
                        columns: JSON.stringify(['Id', 'Display'])
                    };
                }
            }
        },
        serverPaging: true,
        serverFiltering: true,
        pageSize: 60
    }),
    roles: [],
    getRoles: function() {
        $.ajax({
            url: app.host + 'UserAccount_Role/_GetListRoleId',
            data: {
                comboBoxName: 'RoleId',
                sourceAction: 'Edit',
                pageSize: 500
            },
            beforeSend: function () { },
            complete: function() { }
        }).success(function(response) {
            app.userAccount_Role.set('roles', response);
        });
    },
    navigate: {
        create: function () {
            app.userAccount_Role.getRoles();
            $.ajax({
                type: 'GET',
                url: app.host + 'UserAccount_Role/Add'
            }).success(function (data) {
                data.userAccountId = app.userAccount.model.Id;
                
                app.userAccount_Role.set('model', data);
                app.mobileApp.navigate('views/useraccount_role/add.html');
            });
        },
        update: function (id) {
            app.userAccount_Role.getRoles();
            $.ajax({
                type: 'GET',
                url: app.host + 'UserAccount_Role/Edit?id=' + id
            }).success(function (data) {
                app.userAccount_Role.set('model', data);
                app.mobileApp.navigate('views/useraccount_role/edit.html');
            });
        },
        list: function() {
            app.mobileApp.navigate('views/useraccount_role/list.html');
        }
    },
    create: function () {
        var self = app.userAccount_Role,
            model = self.model;
        
        $.ajax({
            url: app.host + 'UserAccount_Role/Add',
            data: app.security.addVerificationToken(model.toJSON())
        }).success(function (result) {
            kendo.history.locations.pop();
            app.userAccount_Role.navigate.update(result.Id);
        });
    },
    update: function() {
        var self = app.userAccount_Role,
            model = self.model;

        $.ajax({
            url: app.host + 'UserAccount_Role/Edit?id=' + model.Id,
            data: app.security.addVerificationToken(model.toJSON())
        }).success(function(result) {
            app.userAccount_Role.navigate.update(result.Id);
        });
    },
    destroy: function () {
        var self = app.userAccount_Role,
            model = self.model;
        
        $.ajax({
            url: app.host + 'UserAccount_Role/Delete?id=' + model.Id,
            data: app.security.addVerificationToken({})
        }).success(function () {
            app.mobileApp.navigate('#:back');
        });
    }
});

