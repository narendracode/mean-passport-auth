var module = angular.module('authorization.services',['ngResource','ngCookies']);

module.factory('AuthService',function($resource,$rootScope,$location,$cookieStore){

  var LoginResource = $resource('/auth/login');
  var LogoutResource = $resource('/auth/logout');
  var SignupResource = $resource('/auth/signup'); 
  var CurrentUserResource = $resource('/auth/userinfo');

  // The public API of the service
  var service = {
      login: function(user,callback){
	var loginResource = new LoginResource();
	loginResource.email = user.email;
	loginResource.password = user.password;
	loginResource.$save(function(result){
		if(!(!!result['message'])){
         		$cookieStore.put('user',result);
			$rootScope.currentUser = result;
		}
		callback(result);
	}); 
      },
      logout : function(callback){
	var logoutResource = new LogoutResource();
	logoutResource.$save(function(result){
			$rootScope.currentUser = null;
			$cookieStore.remove('user');
			callback(result);
	});
      },
      signup: function(user,callback){
	var signupResource = new SignupResource();
	signupResource.email = user.email;
	signupResource.password = user.password;
	signupResource.$save(function(result){
		if(!(!!result['message'])){
			$rootScope.currentUser = result;
		}
		callback(result);
	});
      },
     currentUser: function(callback){
     	var currentUserResource = new CurrentUserResource();
	currentUserResource.$get(function(result){
		if(result){
			$cookieStore.put('user',result);
			$rootScope.currentUser = result;
		}
		callback(result);
	});
     }
     /*,
     changePassword: function(){},
     removeUser: functionk(){}
      */
  }
  return service;
  
});
