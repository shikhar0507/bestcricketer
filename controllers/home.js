app.controller('home', function ($scope, $location, $http, helper, service,chartService) {

  var vm = this;





  var mainData;
  service.getData().then(function (res) {

    vm.parsedData = helper.parse(res, "*");
    mainData = angular.copy(vm.parsedData)

    vm.getCenturies = helper.score(vm.parsedData, 100).totalCenturies();
    $scope.totalCenturies = Object.keys(vm.getCenturies).length;

    $scope.totalRuns = helper.score(vm.parsedData, 100).totalRuns();


    
//bar graph    
    var initBarGraph = function() {
      
      var countryVscore = helper.sortByOpposition(mainData);
      $scope.datac = chartService.barGraph.data(countryVscore);
      $scope.optionsc = chartService.barGraph.options();
      
    }
    
    initBarGraph(mainData);
    
    
    // line graph
    $scope.selectCountry = function (c) {
      vm.temp = helper.score(vm.parsedData,100).totalCenturies(c);
      $scope.totalCenturies = Object.keys(vm.temp).length;
      initGraph(c);
      initText(c);
    }

    var initGraph = function (val) {
      
      $scope.dataForLine = helper.score(vm.parsedData,100).totalCenturies(val);

        $scope.data = chartService.lineChart.data($scope.dataForLine);
        $scope.options = chartService.lineChart.options();

      calculateLoss($scope.dataForLine)
    }

    var initText =function(c){
        $scope.country = c;
      

    }
    
    function calculateLoss(resultArr){
      var winLength = [];
      var losLength = [];
      Object.keys(resultArr).forEach(function(result) {
        if(resultArr[result].result ===  "won") {
          winLength.push(resultArr[result].result);
        }
        else {
          losLength.push(resultArr[result].result)
        }
        $scope.win = winLength.length;
        $scope.loss = losLength.length;
      });
      initDonutForCentury(winLength.length,losLength.length);
    }

     initGraph();


    function initDonutForCentury(win,loss){

          $scope.donutData = chartService.donutChart.data(win,loss);
  // console.log($scope.donutData);
            
          $scope.donutOptions = chartService.donutChart.options();
    }

    




    isSelfish(mainData,vm.parsedData);

  })




  /* Home vs Away & isSelfish    */

  
  var scoreInHome = [];
  var scoreInAway= [];

  function isSelfish(mainData,parsed){
    
    
    setTimeout(function () {
      for (var v = 0; v < parsed.length; v++) {
        isHome(v,mainData)
      }
  }, 100)
}
  function isHome(v,mainData) {
    service.getLocation(mainData[v].ground).then(function (groundCountry) {
      
      if (groundCountry === "India") {
        scoreInHome.push(v);
      }
      else {
        scoreInAway.push(v);
        
      } 
      
    });    

  }
  
  function scoreInGround(arr,type) {
    var miniArrayResult = [];
    
    for (var i = 0; i < arr.length; i++) {
      miniArrayResult.push(mainData[arr[i]]);
    }
    
    if(type === "total") {
      
      return helper.score(miniArrayResult).totalRuns();
    }
    else {
      return miniArrayResult;
    }
    
  }
  
  
  
  function initSelfish(scoreInAway,scoreInHome,league){
    setTimeout(function(){
      
      // $scope.api.refresh();
    $scope.dataaway = chartService.selfishPie.data(helper.score(scoreInGround(scoreInAway),0).result());
  
     $scope.optionsaway = chartService.selfishPie.options();

     $scope.$apply();
      
     $scope.datahome = chartService.selfishPie.data(helper.score(scoreInGround(scoreInHome),0).result());
     $scope.optionshome = chartService.selfishPie.options();
      

     $scope.$apply();
     
    },2000);

  }
  
  initSelfish(scoreInAway,scoreInHome);
  
  
  
  



});