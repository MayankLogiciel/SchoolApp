'use strict';

app.profile = kendo.observable({
    model: {
      Id: ''  
    },
    navigate: {
        update: function () {
            $.ajax({
                url: app.host + 'UserAccount/Edit',
                data: app.security.addVerificationToken({
                    id: app.security.userAccountId
                }),
                type: 'GET'
            }).success(function (data) {
                var model = $.extend({
                    Password: '',
                    ConfirmPassword: ''
                }, data);

                console.log(data);
                console.log(model);

                app.profile.set('model', model);
                app.mobileApp.navigate('views/profile/edit.html');
            });
        }
    },
    update: function() {
        var self = app.profile,
            model = self.model,
            data = model.toJSON();
        
        if (data.Password === '') {
            delete data.Password;
            delete data.ConfirmPassword;
        }

        $.ajax({
            url: app.host + 'UserAccount/Edit?id=' + model.Id,
            data: app.security.addVerificationToken(data)
        }).success(function () {
            app.mobileApp.navigate('#:back');
        });
    }
});

