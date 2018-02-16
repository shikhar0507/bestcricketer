app.controller('home', function ($scope, $location, $http, helper, service) {

  var vm = this;





  var mainData;
  service.getData().then(function (res) {

    vm.parsedData = helper.parse(res, "*");
    mainData = angular.copy(vm.parsedData)

    // vm.getCenturies = helper.score(vm.parsedData, 100).totalCenturies();
    // $scope.totalCenturies = Object.keys(vm.getCenturies).length;

    $scope.totalRuns = helper.score(vm.parsedData, 100).totalRuns();


    $scope.selectCountry = function (c) {
      // vm.temp = helper.score(vm.parsedData,100).totalCenturies(c);
      // $scope.totalCenturies = Object.keys(vm.temp).length;
      initGraph(c);
    }




    var initGraph = function (val) {

      // vm.addDat = helper.score(vm.parsedData, 100).totalCenturies(val);
      var c = [];
      var score = [];
      Object.keys(vm.addDat).forEach(function (d) {
        c.push(d);
        score.push(vm.addDat[d]);
      });


      $scope.options = {
        chart: {
          type: 'lineChart',
          height: 450,
          margin: {
            top: 20,
            right: 20,
            bottom: 60,
            left: 65
          },
          x: function (d) {
            return d[0];
          },
          y: function (d) {
            return d[1];
          },

          color: d3.scale.category10().range(),
          duration: 1000,
          useInteractiveGuideline: true,
          clipVoronoi: true,

          xAxis: {
            axisLabel: 'Date of Centuries Scored',
            tickFormat: function (d) {

              return d3.time.format('%m/%d/%y')(new Date(d))

            },
            showMaxMin: true,
            staggerLabels: true
          },

          yAxis: {
            axisLabel: 'Century Score',
            tickFormat: function (d) {
              return d3.format('.0f')(d);
            },
            staggerLabels: true,

          }
        }
      };

      $scope.data = [{
        key: "Cumulative Return",
        values: [

        ]
      }]


      function convertDate(inputFormat) {

        var datum = Date.parse(inputFormat);
        return datum;
      }

      for (var i = 0; i < c.length; i++) {
        $scope.data[0].values.push([convertDate(c[i]), score[i]]);
        $scope.data
      }


    }

    initGraph();

  })




  /* Home vs Away    */
  var scoreInHome = [];
  var scoreInAway= [];
  
  setTimeout(function () {
    for (var v = 0; v < vm.parsedData.length; v++) {
      isHome(v)
    }
  }, 100)
  
  function isHome(v) {
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
 
  



setTimeout(function(){
    
console.log(helper.score(scoreInGround(scoreInAway),100).result());
console.log(helper.score(scoreInGround(scoreInHome),100).result());

console.log(scoreInGround(scoreInHome,"total"));
console.log(scoreInGround(scoreInAway,"total"));

},2000)       






});