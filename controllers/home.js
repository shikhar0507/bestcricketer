app.controller('home',function($scope,$location,$http,helper,service){

var vm = this;


vm.rawData = service.getData().then(function(res){

vm.data = helper.parse(res,"*");



$scope.totalRuns = helper.score(vm.data,50).totalRuns();
$scope.totalCenturies = helper.score(vm.data,50).totalCenturies();


// $scope.tempHolder = helper.sortByOpposition(vm.data);
$scope.tempHolder = [{
	key: 'Data',
    values: [{
      x: "pakistan",
      y: 5
    },{
    	x:"america",
    	y:10
    }]
  }];


})

setTimeout(function (){




},2000)

// function modifyData(){



// }






});



