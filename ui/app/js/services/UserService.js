define([], function(){
    'use strict';

    var UserService = function($http, $q){
        var self = this;
        self.userName = '';

        self.login = function(userName) {
            self.userName = userName;
            return $http.get('http://localhost:1337/api/login/'+userName)
                .then(function(response){
                    return response.data;
            });
        };

        self.getUserName = function(){
            return self.userName;// ? self.userName : 'dean';
        };

        return self;
    };
    return ["$http", '$q', UserService];
});