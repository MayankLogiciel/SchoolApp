'use strict';

app.security = kendo.observable({
    user: '',
    password: '',
    authenticated: false,
    antiForgeryToken: {},
    userAccountId: '',
    addVerificationToken: function (data) {
        return $.extend({ '__RequestVerificationToken': this.antiForgeryToken.requestVerificationToken }, data);
    },
    signin: function () {
        var model = app.security;
        
        $.ajax({
            url: app.host + 'security/signin',
            type: 'POST',
            data: {
                user: model.user,
                password: model.password,
                persistLogin: 'true'
            }
        }).success(function (xhr) {
            if (xhr.success) {
                model.set('authenticated', true);
                model.set('antiForgeryToken', xhr.antiForgeryToken);
                model.set('userAccountId', xhr.userAccountId)
                model.set('user', '');
                model.set('password', '');
                app.mobileApp.router.navigate('views/home/index.html');
            }
        });
    }
});

