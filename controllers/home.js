app.controller('home', function ($scope, $location, $http, helper, service, chartService) {

  var vm = this;








  var mainData;
  service.getData().then(function (res) {

    vm.parsedData = helper.parse(res, "*");
    mainData = angular.copy(vm.parsedData)

  
    $scope.totalRuns = helper.score(vm.parsedData, 100).totalRuns();
    
    var countryVscore = helper.sortByOpposition(mainData);

    vm.calculateAverage =function(){
      var average = {};
      const totalMatches = mainData.length;
      const runs = helper.score(mainData).totalRuns();
      $scope.carrerAverage = Math.round(runs / totalMatches);

      
    }
    vm.calculateAverage();
    
    
    vm.averageAgainstCountry = function(weightedAv){
   
      

      var matches = helper.matchesPlayedAgainst(mainData,countryVscore);
      var teams = Object.keys(matches);
      var av = {};
      var set = {};
      
      for (let index = 0; index < teams.length; index++) {

      
       
          if(weightedAv) {
            av = Math.round(countryVscore[teams[index]] / matches[teams[index]] * weightedAv[teams[index]]);
          }
          else {
           
            av = Math.round(countryVscore[teams[index]] / matches[teams[index]]);
          }
          
          set[teams[index]] = {"average":av,"totalRuns":countryVscore[teams[index]],"totalMatches":matches[teams[index]]}
         





        }
        // var DscSort = Object.keys(set).sort(function(a,b){
        //   return set[b].average - set[a].average; 
        // })

        // for (let index = 0; index < DscSort.length; index++) {
        //   set[DscSort[index]] = {"average":Math.round(countryVscore[DscSort[index]] / matches[DscSort[index]] * weightedAv[DscSort[index]]),"totalRuns":countryVscore[DscSort[index]],"totalMatches":matches[DscSort[index]]}

        // }
        // console.log(set)
        // $scope.set = set;
                
        sortWeighted(set)
      }
      
      vm.averageAgainstCountry();

    vm.weightedAverage = function(){
      const weights = {                          
        'Australia' : 1,
        'England' :0.7,
        'Sri Lanka' :0.75,
        'South Africa':0.7,
        'Pakistan': 0.75,
        'New Zealand' : 0.7,
        'West Indies' :0.6,
        'Bangladesh':0.4,
        'Kenya':0.1,
        'Netherlands':0.1,
        'Namibia':0.1,
        'Bermuda':0.1,
        'Ireland':0.1,
        'U.A.E.':0.1,
        'Zimbabwe':0.4,
      }

      vm.averageAgainstCountry(weights);


    }

    vm.weightedAverage();

     function sortWeighted(dataSet){
      var sortedSet = {};    
      var DscSort = Object.keys(dataSet).sort(function(a,b){
          return dataSet[b].average - dataSet[a].average; 
        })
        for (let index = 0; index < DscSort.length; index++) {
         
          sortedSet[DscSort[index]] = {"average":dataSet[DscSort[index]].average,"totalRuns":dataSet[DscSort[index]].totalRuns,"totalMatches":dataSet[DscSort[index]].totalMatches}


        }
        console.log(sortedSet)
        $scope.set = sortedSet;  

    }


   
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


  // function sachinPerformanceInUserGround(mainData) {
  //   $http.get("http://extreme-ip-lookup.com/json/").then(function success(res){
  //     var userGround = [];
  //        console.log(helper.score(scoreInGround(scoreInHome)).result());       
  //   })
  // }

  // setTimeout(function(){
  //   sachinPerformanceInUserGround(mainData);
  // },1500)


  // $http.get("http://extreme-ip-lookup.com/json/").then(function success(res){

  //   if(res.data.city === mainData[v].ground) {
  //    userGround.push(mainData[v]);

  //   }


  // })



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

      console.log(helper.score(scoreInGround(scoreInHome), 0).result());

      $scope.$apply();

    }, 2000);

  }

  initSelfish(scoreInAway, scoreInHome);


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