app.controller('home', function ($scope, $location, $http, helper, service, chartService) {

  var vm = this;


  var mainData;
  setTimeout(function(){

  service.getData().then(function (res) {


    vm.parsedData = helper.parse(res, "*");
    mainData = angular.copy(vm.parsedData)
    
    vm.initProfile = function(){
      vm.profileInnings = mainData.length;
      vm.profileRuns = helper.score(mainData).totalRuns();
      vm.profileCenturies = helper.score(mainData, 100).totalCenturies().total;
      vm.profileWickets = helper.wickets(mainData).totalWickets;
      console.log(vm.profileWickets);
    }
    vm.initProfile();


    var countryVscore = helper.sortByOpposition(mainData);

    $scope.totalRuns = helper.score(vm.parsedData, 100).totalRuns();

    vm.sendDataforAverage = function () {
      return vm.calculateAverage(mainData);
    }


    vm.calculateAverage = function (data) {

      const totalMatches = data.length;
      const runs = helper.score(data).totalRuns();
      return Math.round(runs / totalMatches);
    }

    // vm.calculateAverage(mainData);

    vm.averageAgainstCountry = function (match, opp) {


      var teams = Object.keys(match);
      var set = {};

      for (let index = 0; index < teams.length; index++) {



        av = Math.round(opp[teams[index]] / match[teams[index]]);


        set[teams[index]] = {
          "average": av,
          "totalRuns": opp[teams[index]],
          "totalMatches": match[teams[index]]
        }

      }
      return set;

    }

    function initWeightedSystem() {
      var totalScore = helper.sortByOpposition(mainData);
     
      var countMatches = helper.matchesPlayedAgainst(mainData, totalScore);
     

      $scope.weightedResult = helper.sortWeighted(mainData, countMatches, totalScore);
      
    }
    initWeightedSystem();
  




    //bar graph    
    vm.initBarGraph = function (mode) {

      document.querySelector('.discrete-bar').style.display = "block";
      document.querySelector('.average-analysis').style.display = "block";

      $scope.battingScoreTotal = chartService.barGraph.data(countryVscore, mode);
      $scope.battingScoreTotalOptions = chartService.barGraph.options();

    }

    // vm.initBarGraph();

    vm.initStackedMultiBar = function (mode) {
      document.querySelector('.totalRuns').style.display = "block";
      // totalRuns
      $scope.stackedBarData = chartService.multiBar.data(countryVscore, mode);
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

      calculateLoss($scope.dataForLine, c)
    }



    function calculateLoss(resultArr, c) {
 

      var winLength = [];
      var losLength = [];
      var tempCentury = [];
      Object.keys(resultArr.Match).forEach(function (date) {
        if (resultArr.Match[date].result === "won") {
          winLength.push(resultArr.Match[date].result);
        } else {
          losLength.push(resultArr.Match[date].result)
        }


        c ? $scope.againstTeam = "against " + c : $scope.againstTeam = '(Overall)';

        $scope.win = winLength.length;
        $scope.loss = losLength.length;

        $scope.totalCenturiesAgasintOpp = helper.score(mainData, 100).totalCenturies(c).total;
        $scope.totalCenturies = helper.score(mainData, 100).totalCenturies(c).total;


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
},600)





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
    }, 300)
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
      var winLossAway = helper.score(scoreInGround(scoreInAway),0).result();
      $scope.dataaway = chartService.selfishPie.data(winLossAway);

      $scope.optionsaway = chartService.selfishPie.options();

     
      $scope.$apply();

      var winLossHome = helper.score(scoreInGround(scoreInHome), 0).result();
      
      $scope.datahome = chartService.selfishPie.data(winLossHome);
      $scope.optionshome = chartService.selfishPie.options();

      $scope.$apply();


      homePerformance(winLossHome,winLossAway);
      // awayPerformance(winLossAway);

    }, 2000);
  }
  
  initSelfish(scoreInAway, scoreInHome);
  
  
  function homePerformance(home,away) {
    var homeSats = scoreInGround(scoreInHome);
    $scope.wonInHome =  home.won.length;
    $scope.totalMatchesHome = home.won.length + home.lost.length;
    $scope.ratioHome = ($scope.wonInHome / home.lost.length).toFixed(2);
    $scope.runsInHome = helper.score(homeSats,0).totalRuns();
    $scope.homeGroundAverage = vm.calculateAverage(scoreInGround(scoreInHome));


    var homeOpp = helper.sortByOpposition(scoreInGround(scoreInHome))
    var homeMatches = helper.matchesPlayedAgainst(homeSats, homeOpp);
    var performanceInHome = vm.averageAgainstCountry(homeMatches, homeOpp);




    var awaySats = scoreInGround(scoreInAway);
    $scope.totalMatchesAway = away.won.length + away.lost.length;
    $scope.wonInAway = away.won.length;
    $scope.ratioAway = ($scope.wonInHome / away.lost.length).toFixed(2);
    $scope.runsInAway = helper.score(awaySats,0).totalRuns();
    $scope.awayGroundAverage = vm.calculateAverage(scoreInGround(scoreInAway));

    var awayOpp = helper.sortByOpposition(scoreInGround(scoreInAway))
    var awayMatches = helper.matchesPlayedAgainst(awaySats, awayOpp);
    var performanceInAway = vm.averageAgainstCountry(awayMatches, awayOpp);
    




    $scope.$apply();
    homeVsAwayResult(performanceInHome,performanceInAway)

  
  }
  

  
  
  
  function homeVsAwayResult(home,away){

     var miniSortedAway = {};
     var miniSortedHome = {};
    const majorTeams =['Australia','Sri Lanka','South Africa','Pakistan','England','New Zealand'];

    
    $scope.horizData = chartService.homeVaway.data(home,away);
    $scope.horizOptions = chartService.homeVaway.options();
    
    for (let index = 0; index < majorTeams.length; index++) {
      miniSortedAway[majorTeams[index]] = away[majorTeams[index]];
      miniSortedHome[majorTeams[index]] = home[majorTeams[index]];

    }

   
    $scope.away = miniSortedAway;

     
    $scope.home = miniSortedHome;
     
     $scope.$apply();

  }

  


  function performanceInUserState(v) {
      var dataArr = [];
      $http.get("https://extreme-ip-lookup.com/json/").then(function success(res) {
        console.log(res)
      
          for (let index = 0; index < scoreInGround(scoreInHome).length; index++) {
              if (res.data.city === scoreInGround(scoreInHome)[index].ground) {
                  dataArr.push(scoreInGround(scoreInHome)[index]);

        }

      }

      vm.userStateRuns = helper.score(dataArr, 0).totalRuns();

     vm.userStateAverage =  vm.userStateRuns / dataArr.length;
      vm.userStateWickets = helper.wickets(dataArr);

     

    });
  }

  setTimeout(function () {

    performanceInUserState();
  }, 2000);



});