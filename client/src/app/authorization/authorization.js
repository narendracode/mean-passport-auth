angular.module('authorization',['ngResource','ui.router','ui.bootstrap.showErrors','validation.match','authorization.services']);

angular.module('authorization').config(['$stateProvider','$urlRouterProvider',

function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
   
     $stateProvider
     .state('login', {
      url: "/login/",
      templateUrl: 'app/authorization/login.tpl.html',
      controller: 'AuthController'
    })
    .state('signup',{
      url: "/signup/",
      templateUrl : 'app/authorization/signup.tpl.html',
      controller: 'AuthController'
    });
}
]);


angular.module('authorization').controller('AuthController',['$scope','$resource','$state','$location','AuthService','$window','$rootScope',
    function($scope,$resource,$state,$location,AuthService,$window,$rootScope){
        var AuthSignupResource = $resource('/auth/signup');   
        var AuthLoginResource = $resource('/auth/login'); 

  $scope.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };

        $scope.errorExists = false;
           $scope.signup = function(){
                $scope.$broadcast('show-errors-check-validity'); 
                if ($scope.singupForm.$valid){
                  AuthService.signup({email:$scope.email,password:$scope.password},function(result){
          if(result['message']){
                            $scope.errorExists = true;
                            $scope.loginErrorMessage = result['message'];
                        }else{
          $location.path('/') 
      }

        });
                }   
          }//signup
        
           
         $scope.login = function(){
             $scope.$broadcast('show-errors-check-validity'); 
             if ($scope.loginForm.$valid){
                 AuthService.login({
                  'email':$scope.email,
            'password':$scope.password
           },function(result){
                    if(result['message']){
                        $scope.errorExists = true;
                        $scope.loginErrorMessage = result['message'];
                    }else{
                        $location.path("/meetup/") 
                    }
                 });
             }
        }//login

  $scope.logout = function(){
    AuthService.logout(function(result){
      if(result['status'] == 200){
        $location.path('/login/');
      } 
    });
  }
    }
]);
