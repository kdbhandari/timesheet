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
		$scope.project_details = {};
		$scope.task_details = {};
		$scope.projects = [];
		$scope.release = [];
		$scope.features = [];
		$scope.task = [];
		$scope.subTask = [];
		$scope.flagDel = false;
		$scope.activity = ["activity-1", "activity-2", "activity-3", "activity-4", "activity-5"];
		$http.get("/timesheet/data/project.json")
			.success(function(data,status,headers,config){
				//console.log("inside success");
				$scope.project_details = data;
				//console.log("data : "+data);		
				angular.forEach($scope.project_details, function(key, value) {
					angular.forEach(key, function(key, value) {
						$scope.projects.push(value);
						//console.log("value : " + value );
						angular.forEach(key, function(key, value) {
							//console.log("value : " + value );
							angular.forEach(key, function(key, value) {
								//console.log("key : " + key);	
							});	
						});	
					});	
				});	
			})
			.error(function(data,status,headers,config){
				console.log("Data Not Loaded");
			});
		$http.get("/timesheet/data/task.json")
			.success(function(data,status,headers,config){
				//console.log("inside success");
				$scope.task_details = data;
				//console.log("data : "+data);		
				angular.forEach($scope.task_details, function(key, value) {
					angular.forEach(key, function(key, value) {
						$scope.task.push(value);
						//console.log("key : "+ key +" value : " + value );
						angular.forEach(key, function(key, value) {
							//console.log("key : "+ key);
						});	
					});	
				});	
			})
			.error(function(data,status,headers,config){
				console.log("Data Not Loaded");
			});
			
	$scope.setRelease = function(project, count){
		//$scope.release = [];
		$scope.temp = [];
		console.log("count : "+count);
		angular.forEach($scope.project_details, function(key, value) {
			angular.forEach(key, function(key, value) {
				if(value == project)
				{	
					angular.forEach(key, function(key, value) {
						$scope.temp.push(value);	
					});
					//$scope.release.push($scope.temp);
					$scope.release.splice(count-1, 1);
					$scope.release.splice(count-1, 0, $scope.temp);
				}		
			});
		});
	}
		
	$scope.setFeatures = function(release, count){
		//$scope.features = [];
		$scope.temp = [];
		angular.forEach($scope.project_details, function(key, value) {
			angular.forEach(key, function(key, value) {
				angular.forEach(key, function(key, value) {
					if(value == release)
					{	
						angular.forEach(key, function(key, value) {
							$scope.temp.push(key);
						}); 	
						$scope.features.splice(count-1, 1);
						$scope.features.splice(count-1, 0, $scope.temp);
					}	
				});	
			});	
		});
	}
	
	$scope.setSubTask = function(task, count){
		//console.log("inside function");
		//console.log("task : " + task);
		//$scope.subTask = [];
		$scope.temp = [];
		angular.forEach($scope.task_details, function(key, value) {
			angular.forEach(key, function(key, value) {
				if(value == task){
					angular.forEach(key, function(key, value) {
						$scope.temp.push(key);	
					});	
					$scope.subTask.splice(count-1, 1);
					$scope.subTask.splice(count-1, 0, $scope.temp);
				}
			});	
		});
	}
		
		
	$scope.addRow = function() {
		$scope.rows.push($scope.counter);
		$scope.counter++;
		$scope.flagDel = false;
		$scope.release.push("");
		$scope.features.push("");
		$scope.subTask.push("");
	}
	$scope.delteRow = function() {
		$scope.counter--;
		$scope.rows.splice($scope.counter-1, 1);
		$scope.emp[$scope.counter] = '';
		if(($scope.counter-1) == 0)
		{
			$scope.flagDel = true;
			$scope.emp[$scope.counter] = '';
			$scope.addRow();
		}
	}

	$scope.total_row = function(rowContent) {
		//console.log("function called");
		//console.log(rowContent);
		//console.log($scope.emp[rowContent].total);
		
		var a = document.querySelectorAll('input.days');
		for(var i=0; i<a.length; i++){
			a[i].addEventListener('input', function(e) {
				//$('input.days').addEventListener('input', function(e) {	
				console.log("inside queryselector");
				console.log("e.target.value : "+ e.target.value);
				if (e.target.value < '0' || e.target.value > '24') {
					alert('Invalid number!');
					e.target.value = '';
					e.preventDefault();
				}
			});	
		}
		
		
		
		
		var total = 0;
		angular.forEach($scope.emp, function(value, key) {
			//console.log("key : " + key + "value : "+ value);
			if(key == rowContent) {
				angular.forEach($scope.emp[key], function(value, key) {
					//console.log("key : " + key + "value : "+ value);
					//console.log($scope.emp[key]);
					if( key == "sunday" || key == "monday" || key == "tuesday" || key == "wednesday" || 	key	== "thursday" || key == "friday" || key == "saturday") 
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
				$('input').attr('disabled', true);
            },
            function (error) {
                console.log("OOPS Error while submitting timesheet!!!! " + JSON.stringify(error));
            }
        );
    };
});