var app = angular.module('radiator', []);

app.config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://jenkins.rel.corp.telenet.be/**']);
    // $httpProvider.defaults.headers.common['Authorization'] = "Basic " + btoa("nvanderh:4758c085e4c4874ac6c28dceb4d09163");
    $httpProvider.defaults.useXDomain = true;
	//delete $httpProvider.defaults.headers.common['X-Requested-With'];
	console.log("configured app");
}])