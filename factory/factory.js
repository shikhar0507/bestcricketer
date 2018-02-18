app.factory('helper', function () {

	var obj = {};
	var dataArray = [];
	return {



		parse: function (val, parser) {

			var regex = new RegExp("[" + parser + "]$");

			for (var i = 0; i < val.length; i++) {

				val[i].opposition = val[i].opposition.replace("v", '').replace(" ", '');

				if (regex.test(val[i].batting_score)) {

					val[i].batting_score = val[i].batting_score.replace(regex, "");

				}


				if (val[i].batting_score != "DNB" && val[i].batting_score != "TDNB") {

					val[i].batting_score = parseInt(val[i].batting_score);
					dataArray.push(val[i]);
				}



			}

			return dataArray;

		},

		score: function (val, league) {

			var totalRuns = [];
			var hasWon = [];
			var hasLost = [];
			totalRuns.push(val.map(function (q) {
				return q.batting_score
			}));

			var scoreData = {
				totalCenturies: function (opp) {

					var centuryAgaistOpp = [];
					var sc = {};
					if (opp) {
						// console.log(val);
						
						val.map(function (s) {

							if (s.batting_score >= 100 && s.opposition === opp) {
								sc[s.date] = { "score" : s.batting_score,"result": s.match_result}
							}
						});

						return sc;
					} else {
						val.map(function (s) {
							
							if (s.batting_score >= 100) {
								sc[s.date] = { "score" : s.batting_score,"result": s.match_result}
							}
						});

						return sc;
					}

				},
				result: function () {

					var isSelfish = {};
					val.map(function (q) {

						if (q.match_result === "won" && q.batting_score >= league) {
							hasWon.push(q)

						} else if (q.match_result === "lost" && q.batting_score >= league) {
							hasLost.push(q);
						}

					});

					isSelfish["won"] = hasWon;
					isSelfish["lost"] = hasLost;
					
					
					if (hasWon.length > hasLost.length) {
						 isSelfish["selfish"] = "no"
					} else {
						 isSelfish["selfish"] = "yes"
					}
					
					return isSelfish;

				},
				totalRuns: function () {
					return totalRuns[0].reduce(function (a, b) {
						return a + b;
					});
				}
			};
			return scoreData;
		},

		sortByOpposition: function (val, country) {

			var holder = {};
			val.forEach(function (d) {

				if (holder.hasOwnProperty(d.opposition)) {
					holder[d.opposition] = holder[d.opposition] + d.batting_score;
				} else {
					holder[d.opposition] = d.batting_score;
				}
			})

			if (country) {
				newObj = {};
				newObj[country] = holder[country];
				return newObj;
			} else {
				return holder;
			}
		},

	}

})

app.factory('d3', [function () {
	return d3;
}])

app.factory('nv', [function () {
	return nv;
}])


app.factory('chartService',['helper',function(helper){
var timeline =[];
var tickV =[];
	return {
		barGraph : {
			options : barGraphOptions,
			data : barGraphData
		},
		lineChart : {
			options: lineGraphOptions,
			data : lineGraphData
		},
		selfishPie : {
			options : selfishGraphOption,
			data : selfishGraphData
		},
		donutChart : {
			options: donutChartOptions,
			data : donutChartData
		}
	};

	function barGraphOptions() {
			return {
				chart : {
					type: "discreteBarChart",
					x: function(d){return d.label;},
					y: function(d){return d.value;},
					showValues: true,
					valueFormat: function(d){
						return d3.format(',')(d);
					},
					
					duration: 500,
					xAxis: {
						axisLabel: 'X Axis'
					},
					yAxis: {
						axisLabel: 'Y Axis',
						axisLabelDistance: -10,
					}
				}
			}
	}
	
	function barGraphData(data) {
		
		var list = Object.keys(data);

		var adder = [{
			"key" : "country Vs Score",
			values :[]
		}]	

		for(var i=0;i<list.length;i++) {
			adder[0].values.push({"label":list[i],"value":data[list[i]]})
		}
		
		return adder;		
			
	}

	function lineGraphOptions(){
		return {
				chart: {
				  type: 'lineChart',
			  
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
				  clipEdge: true,
		
				  xAxis: {
					  axisLabel: 'Date of Centuries Scored',
					  tickFormat: function (d) {
						  
						  return d3.time.format('%m/%d/%y')(new Date(d))
						  
						},
						// showMaxMin: true,
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
			}
			
		}
		
		function lineGraphData(data) {
			
			// console.log(data);
			
			var c = [];
			
			var score = [];
			Object.keys(data).forEach(function (d) {
				c.push(d);
				score.push(data[d].score);
			});


			
			
			var adder = [{
				key: "Century vs Date",
				values: [
				]
			}]
			
			
			function convertDate(inputFormat) {
				
				var datum = Date.parse(inputFormat);
				// console.log(datum);
				
				return datum;
			}
			
			for (var i = 0; i < c.length; i++) {
				// console.log(score[i]);
				
				adder[0].values.push([convertDate(c[i]), score[i]]);
			}
			
			return adder;
			
			
		}


		function selfishGraphOption(){
			return {
				chart: {
					type: 'pieChart',
					height: 500,
					x: function(d){return d.key;},
					y: function(d){return d.y;},
					showLabels: true,
					duration: 500,
					labelThreshold: 0.01,
					labelSunbeamLayout: true,
					legend: {
						margin: {
							top: 5,
							right: 35,
							bottom: 5,
							left: 0
						}
					}
			}
		}
	}

	function selfishGraphData(data){

			var adder = [{
				key: "won",
				y: data.won.length
			}, {
				key: 'lost',
				y: data.lost.length
			}];

			return adder;
		
	}

	
	function donutChartOptions(){
		return {
			chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                legend: {
                    margin: {
                        top: -30,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                }
		}
	}	
}

	function donutChartData(val1,val2){
		
		var adder = [{
			key: "win",
			y: val1
		},{
			key:"loss",
			y:val2
		}]
		return adder;
	}
		



}]);