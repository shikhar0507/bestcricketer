app.controller('home',function($scope,$location,$http,helper,service){

var vm = this;


vm.rawData = service.getData().then(function(res){
  
  vm.data = helper.parse(res,"*");
  

  
  $scope.totalRuns = helper.score(vm.data,50).totalRuns();
  $scope.totalCenturies = helper.score(vm.data,50).totalCenturies();
  
  vm.addDat = helper.sortByOpposition(vm.data);
  console.log(vm.addDat);


var countryName =[];
var score = [];
Object.keys(vm.addDat).forEach(function(c){
  
  score.push(vm.addDat[c]);
})
var sortedCountry = Object.keys(vm.addDat).sort(function(a,b){
return vm.addDat[a] - vm.addDat[b];
})




// $scope.tempHolder = helper.sortByOpposition(vm.data);
$scope.tempHolder = [{
  key: 'Data',
  values: [{
    x: 0,
    y: 0
  },{
    x:1,
    y:1
  },{
    x:2,
    y:2
  },{
    x:3,
    y:3
  },{
    x:4,
    y:4
  },{
    x:5,
    y:5
  },{
    x:6,
    y:6
  },{
    x:7,
    y:7
  }]
}];

$scope.cdata = sortedCountry;

score.sort(function(a,b){
  return a-b;
})

$scope.vsScore = score;

})


setTimeout(function (){
  
  
  
  
},2000)

// function modifyData(){
  
  
  
  // }
  
  
  

  
  
});



