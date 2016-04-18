angular.module('myApp.controllers', ['myApp.services'])
.controller('LoginCtrl', function($http,$scope,$routeParams, $location, EmployeeService){
        $scope.employee = {};
		$http.get("/timesheet/data/login_records.json")
			.success(function(data,status,headers,config){
				$scope.employee = data;
				
			})
			.error(function(data,status,headers,config){
				console.log("Data Not Loaded");
			});
		/* $scope.login = function() {
					EmployeeService.setEmployee($scope.emp.empCode);
        }; */
        $scope.auth = function(){
			angular.forEach($scope.employee, function(value, key) {
				if(value.userid == $scope.emp.username && value.password == $scope.emp.password) 
				{
					$scope.errorMessage = "";
					EmployeeService.setEmployee($scope.emp.username);
					$location.url('/leave');
				}
				else
				{
					$scope.errorMessage = "incorrect username or password";
				}
			});
        }
})

.controller('EmpCtrl', function($http, $scope, $filter, EmployeeService, submitTimesheetService){
        $scope.empUsername = EmployeeService.getEmployee();
		$scope.rows = ['1'];
		$scope.emp = {};
		$scope.counter = 2;
		$scope.task = {};
		$scope.projects = [];
		$scope.release = [];
		$scope.features = [];
		$http.get("/timesheet/data/project.json")
			.success(function(data,status,headers,config){
				console.log("inside success");
				$scope.task = data;
				console.log("data : "+data);		
				angular.forEach($scope.task, function(key, value) {
					angular.forEach(key, function(key, value) {
						$scope.projects.push(value);
						console.log("value : " + value );
						angular.forEach(key, function(key, value) {
							console.log("value : " + value );
							angular.forEach(key, function(key, value) {
								console.log("key : " + key);	
							});	
						});	
					});	
				});	
			})
			.error(function(data,status,headers,config){
				console.log("Data Not Loaded");
			});
		
	$scope.setRelease = function(project){
		$scope.release = [];
		angular.forEach($scope.task, function(key, value) {
			angular.forEach(key, function(key, value) {
				if(value == project)
				{	
					angular.forEach(key, function(key, value) {
						$scope.release.push(value);	
					});
				}		
			});
		});
	}
		
	$scope.setFeatures = function(release){
		$scope.features = [];
		angular.forEach($scope.task, function(key, value) {
			angular.forEach(key, function(key, value) {
				angular.forEach(key, function(key, value) {
					if(value == release)
					{	
						angular.forEach(key, function(key, value) {
							$scope.features.push(key);
						}); 	
					}	
				});	
			});	
		});
	}
		
		
	$scope.addRow = function() {
		$scope.rows.push($scope.counter);
		$scope.counter++;
	}

	$scope.total_row = function(rowContent) {
		//console.log("function called");
		//console.log(rowContent);
		//console.log($scope.emp[rowContent].total);
		var total = 0;
		angular.forEach($scope.emp, function(value, key) {
			//console.log("key : " + key + "value : "+ value);
			if(key == rowContent) {
				angular.forEach($scope.emp[key], function(value, key) {
					//console.log("key : " + key + "value : "+ value);
					//console.log($scope.emp[key]);
					if( key == "sunday" || key == "monday" || key == "tuesday" || key == "wednesday" || key 	== "thursday" || key == "friday" || key == "saturday" ) 
					{
						total = total + value;		
					}	
				});
				total = Math.round(total * 100) / 100;
				$scope.emp[key].total = total;		
			}
			
		});
	}
		
	$scope.submitForm = function () {
        submitTimesheetService.submitForm($scope.emp)
            .then(function (answer) {
				//var myEl = angular.element( document.querySelector( 'select' ));
				//myEl.attr('disabled',true);	
				//$scope.isSubmitted = true;
				$('select').attr('disabled', true);
				$('#submit').attr('disabled', true);
            },
            function (error) {
                console.log("OOPS Error while submitting timesheet!!!! " + JSON.stringify(error));
            }
        );
    };
});