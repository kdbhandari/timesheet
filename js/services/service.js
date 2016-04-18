'use strict';
angular.module('myApp.services', [])
.service('EmployeeService', function () {
  this.empUsername;
    this.getEmployee = function() {
      return this.empUsername;

    },
    this.setEmployee = function(username) {
      console.log("username :" + username);
      this.empUsername = username;
    }
})

.factory('submitTimesheetService', function ($http, $q) {
    return {
        submitForm: function (emp) {

            var deferred = $q.defer();

			$http.post('/timesheet/data/ft.json', emp)
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise
        }
    }
});
