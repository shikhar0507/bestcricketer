app.controller('home', function ($scope, $location, $http, helper, service, chartService) {

  var vm = this;


  var mainData;

  service.getData().then(function (res) {
    
    vm.parsedData = helper.parse(res, "*");
    mainData = angular.copy(vm.parsedData)
    var countryVscore = helper.sortByOpposition(mainData);
  
    $scope.totalRuns = helper.score(vm.parsedData, 100).totalRuns();
    

    vm.calculateAverage =function(){
      var average = {};
      const totalMatches = mainData.length;
      const runs = helper.score(mainData).totalRuns();
      $scope.carrerAverage = Math.round(runs / totalMatches);  
    }

    vm.calculateAverage();
    
    vm.averageAgainstCountry = function(match,opp){

      
      var teams = Object.keys(match);
 
      var set = {};
      
      for (let index = 0; index < teams.length; index++) {
    
        
           
            av = Math.round(opp[teams[index]] / match[teams[index]]);
          
          
           set[teams[index]] = {"average":av,"totalRuns":opp[teams[index]],"totalMatches":match[teams[index]]}
         
        }
        return set;
     
      }

      function initWeightedSystem(){
        var totalScore = helper.sortByOpposition(mainData);
        console.log(totalScore)
        var countMatches = helper.matchesPlayedAgainst(mainData,totalScore);
        console.log(countMatches);
        
        $scope.weightedResult = helper.sortWeighted(mainData,countMatches,totalScore);
        console.log($scope.weightedResult)
      }
      initWeightedSystem();
      // vm.averageAgainstCountry();



   
    //bar graph    
     vm.initBarGraph = function (mode) {

      document.querySelector('.discrete-bar').style.display = "block";
      document.querySelector('.average-analysis').style.display = "block";

      $scope.battingScoreTotal = chartService.barGraph.data(countryVscore,mode);
      $scope.battingScoreTotalOptions = chartService.barGraph.options();

    }

    // vm.initBarGraph();

    vm.initStackedMultiBar = function(mode){
      document.querySelector('.totalRuns').style.display = "block";
      // totalRuns
      $scope.stackedBarData = chartService.multiBar.data(countryVscore,mode);
      $scope.stackedBarOptions = chartService.multiBar.options();
    }
    vm.initStackedMultiBar();



    // line graph
    $scope.selectCountry = function (c) {
     
      initGraph(c);
    }

    var initGraph = function (c) {

      $scope.dataForLine = helper.score(vm.parsedData, 100).totalCenturies(c);


      $scope.data = chartService.lineChart.data($scope.dataForLine.Match);
      $scope.options = chartService.lineChart.options();

      calculateLoss($scope.dataForLine,c)
    }



    function calculateLoss(resultArr,c) {
      console.log(resultArr);
      
      var winLength = [];
      var losLength = [];
      var tempCentury = [];
      Object.keys(resultArr.Match).forEach(function (date) {
        if (resultArr.Match[date].result === "won") {
          winLength.push(resultArr.Match[date].result);
        } else {
          losLength.push(resultArr.Match[date].result)
        }
        
        
        c ? $scope.againstTeam = "against "+ c : $scope.againstTeam = '(Overall)';
        
        $scope.win = winLength.length;
        $scope.loss = losLength.length;
        
        $scope.totalCenturiesAgasintOpp = helper.score(mainData,100).totalCenturies(c).total;    
        $scope.totalCenturies = helper.score(mainData,100).totalCenturies(c).total;    
      

      });
      initDonutForCentury(winLength.length, losLength.length);
    }

    initGraph();


    function initDonutForCentury(win, loss) {

      $scope.donutData = chartService.donutChart.data(win, loss);
  

      $scope.donutOptions = chartService.donutChart.options();
    }


    isSelfish(mainData, vm.parsedData);

  })





  /* Home vs Away & isSelfish    */


  var scoreInHome = [];
  var scoreInAway = [];
  var userGround = [];

  function isSelfish(mainData, parsed) {


    setTimeout(function () {
      for (var v = 0; v < parsed.length; v++) {
        isHome(v, mainData)
        // performanceInUserState(v);
      }
    }, 100)
  }



  function isHome(v, mainData) {


    service.getLocation(mainData[v].ground).then(function (groundCountry) {
      if (groundCountry.country === "India") {
        scoreInHome.push(v);
      } else {
        scoreInAway.push(v);

      }

    });

  }

  function scoreInGround(arr, type) {
    var miniArrayResult = [];

    for (var i = 0; i < arr.length; i++) {
      miniArrayResult.push(mainData[arr[i]]);
    }

    if (type === "total") {

      return helper.score(miniArrayResult).totalRuns();
    } else {
      return miniArrayResult;
    }

  }



  function initSelfish(scoreInAway, scoreInHome, league) {
    setTimeout(function () {

      // $scope.api.refresh();
      $scope.dataaway = chartService.selfishPie.data(helper.score(scoreInGround(scoreInAway), 0).result());

      $scope.optionsaway = chartService.selfishPie.options();

      $scope.$apply();

      $scope.datahome = chartService.selfishPie.data(helper.score(scoreInGround(scoreInHome), 0).result());
      $scope.optionshome = chartService.selfishPie.options();
      
      $scope.$apply();

      
      homePerformance();
    }, 2000);
  }
  
  initSelfish(scoreInAway, scoreInHome);
  
  
  function homePerformance (){
    var homeSats = scoreInGround(scoreInHome);
    var homeOpp = helper.sortByOpposition(scoreInGround(scoreInHome))
    var homeMatches = helper.matchesPlayedAgainst(homeSats,homeOpp);

    var awaySats = scoreInGround(scoreInAway);
    var awayOpp = helper.sortByOpposition(scoreInGround(scoreInAway))
    var awayMatches = helper.matchesPlayedAgainst(awaySats,awayOpp);
    console.log(vm.averageAgainstCountry(homeMatches,homeOpp));
    
    console.log(vm.averageAgainstCountry(homeMatches,awayOpp));
    
  }
  
  

  // function performanceInUserState(v) {
  //   var dataArr = [];
  //   $http.get("http://extreme-ip-lookup.com/json/").then(function success(res) {

  //     for (let index = 0; index < scoreInGround(scoreInHome).length; index++) {
  //       if (res.data.city === scoreInGround(scoreInHome)[index].ground) {
  //         dataArr.push(scoreInGround(scoreInHome)[index]);

  //       }

  //     }

  //     $scope.userStateRuns = helper.score(dataArr, 0).totalRuns();

  //     $scope.userStateAverage = $scope.userStateRuns / dataArr.length;
  //     $scope.userStateWickets = helper.wickets(dataArr);

  //   });
  // }

  // setTimeout(function () {

  //   performanceInUserState();
  // }, 1000);



});