'use strict';

/* Directives */


angular.module('filestop.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
    .directive('editable', function() {
        var inputTemplate = '<form class="form-inline" ng-show="isEditMode"><input type="text" ng-dblclick="switchToPreview()" ng-model="text"></input><button type="submit" class="btn" ng-click="switchToPreview()">Save</button></form>';
        var showTemplate = '<span class="editable" ng-hide="isEditMode || isEmpty()" ng-click="isEditMode = !isEditMode" >{{text}}</span>';
        var emptyTemplate = '<span class="editable editable-empty" ng-show="isEmpty()" ng-click="isEditMode = !isEditMode">Click to change title</span>';
        return {
            scope: {
                text: '=editable',
                onChange: '&editableChange'
            },
            template: inputTemplate + showTemplate + emptyTemplate,
            link: function(scope, elm, attrs) {
                scope.isEditMode = false;
                scope.isEmpty = function() {
                    return !scope.text && !scope.isEditMode;
                };
                scope.switchToPreview = function() {
                    scope.isEditMode = !scope.isEditMode;
                    if (scope.onChange) {
                        scope.onChange();
                    }
                }
            }
        }
    }).directive('textable', function() {
        var inputTemplate = '<form ng-show="isEditMode"><textarea  type="text" ng-dblclick="switchToPreview()" ng-model="text" rows="5"></textarea><button type="submit" class="btn" ng-click="switchToPreview()">Save</button></form>';
        var showTemplate = '<span class="editable" ng-hide="isEditMode || isEmpty()" ng-click="isEditMode = !isEditMode" >{{text}}</span>';
        var emptyTemplate = '<span class="editable editable-empty" ng-show="isEmpty()" ng-click="isEditMode = !isEditMode">Click to add a description</span>';
        return {
            scope: {
                text: '=textable',
                onChange: '&textableChange'
            },
            template: inputTemplate + showTemplate + emptyTemplate,
            link: function(scope, elm, attrs) {
                scope.isEditMode = false;
                scope.isEmpty = function() {
                    return !scope.text && !scope.isEditMode;
                };
                scope.switchToPreview = function() {
                    scope.isEditMode = !scope.isEditMode;
                    if (scope.onChange) {
                        scope.onChange();
                    }
                }
            }
        }
    });
