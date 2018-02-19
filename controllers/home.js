app.controller('home', function ($scope, $location, $http, helper, service, chartService) {

  var vm = this;








  var mainData;
  service.getData().then(function (res) {

    vm.parsedData = helper.parse(res, "*");
    mainData = angular.copy(vm.parsedData)

    // vm.getCenturies = helper.score(vm.parsedData, 100).totalCenturies();
    // $scope.totalCenturies = Object.keys(vm.getCenturies).length;

    $scope.totalRuns = helper.score(vm.parsedData, 100).totalRuns();



    //bar graph    
    var initBarGraph = function () {

      var countryVscore = helper.sortByOpposition(mainData);
      $scope.datac = chartService.barGraph.data(countryVscore);
      $scope.optionsc = chartService.barGraph.options();

    }

    initBarGraph(mainData);


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

        
        $scope.win = winLength.length;
        $scope.loss = losLength.length;
        // console.log(helper.score(vm.parsedData,100).totalCenturies(c));
        
      $scope.totalCenturies = helper.score(mainData,100).totalCenturies(c).total;        
      });
      initDonutForCentury(winLength.length, losLength.length);
    }

    initGraph();


    function initDonutForCentury(win, loss) {

      $scope.donutData = chartService.donutChart.data(win, loss);
      // console.log($scope.donutData);

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


      $scope.$apply();

    }, 2000);

  }

  initSelfish(scoreInAway, scoreInHome);


  function performanceInUserState(v) {
    var dataArr = [];
    $http.get("http://extreme-ip-lookup.com/json/").then(function success(res) {

      for (let index = 0; index < scoreInGround(scoreInHome).length; index++) {
        if (res.data.city === scoreInGround(scoreInHome)[index].ground) {
          dataArr.push(scoreInGround(scoreInHome)[index]);

        }

      }

      $scope.userStateRuns = helper.score(dataArr, 0).totalRuns();

      $scope.userStateAverage = $scope.userStateRuns / dataArr.length;
      $scope.userStateWickets = helper.wickets(dataArr);

    });
  }

  setTimeout(function () {

    performanceInUserState();
  }, 1000);



});