(function ($) {
    var LssAjax = {

        setup: function () {
            var self = this;
            
            $.ajaxSetup({
                cache: false,
                error: $.proxy(self.errorHandler, self),
                traditional: true,
                type: 'POST',
                crossDomain: false,
                beforeSend: function(xhr) {
                    app.mobileApp.showLoading();
                },
                complete: function(xhr, status) {
                    app.mobileApp.hideLoading();
                }
            });
        },

        errorHandler: function (jqXhr, textStatus, errorThrown) {
            var self = this,
                xhr = jqXhr.xhr || jqXhr;
            
            if (xhr) {
                switch (xhr.status) {
                    case 401:
                        // redirect
                        window.app.mobileApp.hideLoading();
                        window.app.authenticated = false;
                        window.app.mobileApp.navigate('views/signin.html');
                        return false;
                    default:
                        break;
                }

                var response =  $.parseJSON(xhr.responseText),
                    errors = self.normalizeErrors(response);

                if (errors) {
                    // show errors in modal view
                    var modalViewElement = $('#errors'),
                        errorsElement = modalViewElement.find('ul'),
                        modalView = modalViewElement.data('kendoMobileModalView');

                    errorsElement.empty();
                    $.each(errors, function(index, error) {
                        errorsElement.append($('<li>' + error + '</li>'));
                    });

                    modalView.open();
                }
            }
            return true;
        },
        
        normalizeErrors: function(response) {
            var errors = null;

            if (response.modelErrors) {
                errors = $.map(response.modelErrors, function(modelError) {
                    return $.map(modelError.errors, function (error) {
                        return error.ErrorMessage;
                    });
                });
            } else if (response.errorMessage) {
                errors = [response.errorMessage];
            }

            return errors;
        },
        
        listDataSource: function (options) {
            var self = this,
                dataSource;
            
            options = $.extend({}, {
                type: 'aspnet-mvc',
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                schema: {
                    model: {
                        id: 'Id'
                    },
                    data: 'Data',
                    total: 'Total',
                    errors: 'Errors'
                }
            }, options);

            dataSource = new kendo.data.DataSource(options);
            dataSource.bind('error', self.errorHandler);
            
            return dataSource;
        },

        comboBoxDataSource: function (options) {
            var self = this,
                dataSource;

            options = $.extend({}, {
                pageSize: 20,
                serverPaging: true
            }, options);

            dataSource = new kendo.data.DataSource(options);
            dataSource.bind('error', self.errorHandler);

            return dataSource;
        },
        
        confirmDelete: function(callback) {
            var actionSheetElement = $('#confirmDelete'),
                actionSheet = actionSheetElement.data('kendoMobileActionSheet'),
                deleteButton = actionSheetElement.find('a:first');

            deleteButton.off('click');
            deleteButton.on('click', function () {
                if (callback) {
                    callback();
                }
                actionSheet.close();
            });

            actionSheet.open();
        }
    };

    LssAjax.setup();

    $.lss = $.lss || {};
    $.lss.ajax = LssAjax;

}(jQuery));
