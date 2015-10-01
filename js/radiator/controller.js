angular.module('radiator').controller('RadiatorController', function($scope, $http, $interval, fetchMultipleAndMerge) {

    $scope.url = "http://jenkins.rel.corp.telenet.be/jenkins.1.584/job/eDev_Care_MT/job/ocapi-core/";
    $scope.stages = ['15.2','15.3'];
    $scope.pipelines = [];
    $scope.servers = [];
    
    $http.get('config/config.json').then(function(res){
     $scope.pipelines = res.data.products;
     $scope.stages = res.data.releases;
     $scope.servers = res.data.servers;
     $scope.refresh();
    });

    $scope.startFetching = function() {
      $scope.refresh();
      $interval($scope.refresh, 10000);
    };

    $scope.fetch = function($job) {
      if ($job.jobName.indexOf(",") > -1) {
        $scope.fetchMultiple($job);
      } else {
        $scope.fetchSingle($job);
      }
    };

    $scope.fetchMultiple = function($job){

      var jobNames = $job.jobName.split(",");

      fetchMultipleAndMerge(jobNames, $scope.url).then(function(datas){
        
        var result = true;   
        var building = false;     
        var totalprogress = 0;
        var totalestimated = 0;
        var failCount = 0;
        var skipCount = 0;
        var totalCount = 0;

        datas.forEach(function(data){
          result   &= (data.result == "SUCCESS");
          building = building || data.building; 
          if (data.building){
            totalprogress += new Date().getTime() - data.timestamp;
            totalestimated +=  data.estimatedDuration
          }

          for (var i = 0; i < data.actions.length; i++) {
              if (typeof data.actions[i].failCount !== 'undefined'){
                 failCount += data.actions[i].failCount;
                 skipCount += data.actions[i].skipCount;
                 totalCount += data.actions[i].totalCount;
              }
          }

        });

        $job.status = result ? "SUCCESS" : "FAILED";
        $job.building = building;
        $job.failCount = failCount;
        $job.skipCount = skipCount;
        $job.totalCount = totalCount;

        if (building){
          $job.progress = Math.round(100*totalprogress/totalestimated);
        }

      });
    
    }

    $scope.fetchSingle = function($job){

      $server = $scope.servers[$job.server];

      var url = $server.url + "/" + $job.path + "/job/" + $job.jobName + "/lastBuild/api/json";

      console.log("In fetchSingle");

      //$http.defaults.headers.common.Authorization = "Basic " + btoa("nvanderh:4758c085e4c4874ac6c28dceb4d09163");
      //$http.defaults.headers.common["Content-Type"] = "text/plain";

      $http.defaults.useXDomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];

      var config = {
        headers:  {
          "Content-Type" : "application/json"
          //'Authorization': "Basic " + btoa("nvanderh:4758c085e4c4874ac6c28dceb4d09163")
        },
        method : "GET",
        withCredentials: true
      };

      $http.get(url, config).
          success(function(data, status, headers, config) {
            if (typeof data.result !== 'undefined' && data.result != null && data.result != "null"){
              $job.status = data.result;
            }
            $job.building = data.building;
            if (data.building){
              $job.progress = $scope.progress(data.timestamp, data.estimatedDuration);
            }
            for (var i = 0; i < data.actions.length; i++) {
              if (typeof data.actions[i].failCount !== 'undefined'){
                 $job.failCount = data.actions[i].failCount;
                 $job.skipCount = data.actions[i].skipCount;
                 $job.totalCount = data.actions[i].totalCount;
              }
            }
          }).
          error(function(data, status, headers, config) {
            console.log("error fetching url : " + url);
            console.log("error received: " + data);
            $job.status = "ERROR";
          });
    }

    $scope.refresh = function() {
       $scope.pipelines.forEach(function(pipeline){
          for (var stage in pipeline.jobs){
             if (pipeline.jobs.hasOwnProperty(stage)) {
                pipeline.jobs[stage].forEach(function(job){
                  $scope.fetch(job);
                });
             }
          }                
       });
    };

    $scope.progress = function($timestamp, $estimatedDuration){
      var start = $timestamp;
      var now   = new Date().getTime();
      var progression = now - start;
      return Math.round(100*progression/$estimatedDuration);
    }

    $scope.successful = function($job) {
      return $job.status == "SUCCESS";
    }

    $scope.progressclass = function($job) {
      return $job.building && $scope.successful($job) ? "progress-bar-success" : "progress-bar-danger";
    }

    $scope.hasToShowStatistics = function($job){
      return (!$scope.successful($job) && $job.failCount != null && $job.skipCount != null ) || 
             ( $scope.successful($job) && $job.failCount != null && $job.skipCount != null && $job.skipCount > 0 );
    }

});

