angular.module('radiator').factory('fetchMultipleAndMerge', function($q, $http){
  
  return function(jobNames, base){

    var promises = [];
    
    angular.forEach(jobNames, function(jobName){
      
      var url = base + "/job/" + jobName + "/lastBuild/api/json";
      var deffered  = $q.defer();

      $http.get(url).
          success(function(data) {
            deffered.resolve(data);
          }).
          error(function(data) {
            deffered.reject();
      });
      
      promises.push(deffered.promise);

    })
    
    return $q.all(promises);
  }
  
});