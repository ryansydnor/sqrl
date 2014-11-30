define([], function(){
    

    var AcornService = function($http, $q, UserService){
        var self = this;

        self.acorns = [];

        var getUserName = function(){
            return UserService.getUserName();
        };

        self.getAcorns = function() {
            return $http.get('http://localhost:1337/api/'+getUserName()+'/acorns')
                .then(function(response){
                    self.acorns = response.data;
                    return self.acorns;
                });
        };

        self.getAcorn = function (acornName){
          return $http.get('http://localhost:1337/api/'+getUserName()+'/acorns/'+acornName)
              .then(function(response){
                  return response.data;
              });
        };

        self.setAcorns = function(acorns) {
            self.acorns = acorns;
        };

        self.addAcorn = function(newAcorn) {
            self.acorns.push(newAcorn);

            return $http.post('http://localhost:1337/api/'+getUserName()+'/acorns/add', {
                acornName: newAcorn
            }).then(function(response){
                return response.data;
            });

        };

        return self;
    };
    return ["$http", '$q', 'UserService', AcornService];
});
