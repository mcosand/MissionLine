﻿angular.module('missionlineApp').controller('ModalController', [
  '$scope', '$element', '$q', 'title', 'model', 'save', 'options', 'close',
    function ($scope, $element, $q, title, model, save, options, close) {
      var self = this;
      options = $.extend({
        saveText: 'Save'
      }, options);

      $scope.close = function () {
        self.close();
      }

      var bootstrapDialog = new BootstrapDialog({
        title: title,
        message: $element,
        buttons: [{
          label: options.saveText,
          action: function (dialogRef) {
            var invalid = false;
            $element.find('form[name]').addBack('form[name]').each(function (idx, item) {
              var ngForm = $scope[item.getAttribute('name')];
              ngForm.$setSubmitted();
              invalid = invalid || ngForm.$invalid;
            })
            if (invalid) {
              $scope.$digest();
              return;
            }
            var btn = this;
            btn.disable().spin();
            save(model)
              .then($scope.close)
              .finally(function () { btn.enable().stopSpin(); });
          }
        }, {
          label: 'Cancel',
          action: $scope.close
        }]
      });

      self.close = function () {
        bootstrapDialog.close();
        close(false, 500);
      }

      self.open = bootstrapDialog.open.bind(bootstrapDialog);

      $scope.model = model;
      $scope.options = options;

      $scope.isInvalid = function (form, name) {
        return form[name].$invalid && (form[name].$dirty || form.$submitted);
      }
    }]);

angular.module('missionlineApp').service('EditModalService', ['ModalService', function (ModalService) {
  this.edit = function (template, title, model, saveAction, options) {
    ModalService.showModal({
      templateUrl: template,
      controller: "ModalController",
      inputs: {
        title: title,
        model: model,
        save: function (model) {
          console.log(model);
          return saveAction(model);
        },
        options: options
      }
    }).then(function (modal) {
      modal.controller.open();
    });
  }
}]);
