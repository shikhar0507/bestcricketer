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

				if(val[i].wickets === "-") {
					val[i].wickets = 0;

				}
				else {
					val[i].wickets = parseInt(val[i].wickets);
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
					var scoreResult ={};
				
					var count =1;
					
					if (opp) {
					
						
						val.map(function (s) {

							if (s.batting_score >= 100 && s.opposition === opp) {
								sc[s.date] ={ "score" : s.batting_score,"result": s.match_result};
								scoreResult["Match"] = sc;
								scoreResult["total"] = count++

							}
						});

						return scoreResult;
					} else {
						
							val.map(function(s){

							if (s.batting_score >= 100) {
								sc[s.date] ={ "score" : s.batting_score,"result": s.match_result};
								scoreResult["Match"] = sc;
								scoreResult["total"] = count++

							}
						});
						
						return scoreResult;
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

		wickets : function(data){
			var wicket = {};
			var wicketTaken = [];
			for (let index = 0; index < data.length; index++) {
				
				if (data[index].wickets >= 1) {
					wicketTaken.push(data[index].wickets);
				}
				}
			var wicketTotal = wicketTaken.reduce(function (a, b) {
					return a + b;
			});

			
			wicket["totalWickets"] =wicketTotal;
			
			return wicket;
		},

		sortByOpposition: function (val, country) {
			var holder = {};
			
			val.forEach(function (d) {

				
				if (holder.hasOwnProperty(d.opposition)) {
					holder[d.opposition] = holder[d.opposition] + d.batting_score ;

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

		matchesPlayedAgainst : function(totalData,sortedOpposition){

					

			var teamList = Object.keys(sortedOpposition);
			var matches = {};
			var matchCount =0;
			for (let index = 0; index < teamList.length; index++) {
				var matchCount =1;
				
				for (let j = 0; j < totalData.length; j++) {
						if(totalData[j].opposition === teamList[index]) {
							matches[teamList[index]] = matchCount++;
						}
				}
								
			}

			return matches;

		},

		
		
		
		sortWeighted : function(dataSet,homeMatches,totalScore){
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
			var matches = homeMatches;
			
			var teams = Object.keys(matches);
			
			var weightedSet = {};
			
			for (let index = 0; index < teams.length; index++) {
		  
	  
				  av = Math.round(totalScore[teams[index]] / matches[teams[index]] * weights[teams[index]]);
					
				  weightedSet[teams[index]] = {"average":av,"totalRuns":totalScore[teams[index]],"totalMatches":matches[teams[index]]}
			   
			  }
			  return weightedSet;
		  }

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
		multiBar :{
			options : multibarOptions,
			data : multibarData
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
		},
		homeVaway : {
			options :horizontalBarOptions,
			data :horizontalBarData
		}
	};

	function barGraphOptions() {
			return {
				chart : {
					type: "discreteBarChart",
					x: function(d){return d.label;},
					y: function(d){return d.value;},
					showValues: true,
					height:250,
					valueFormat: function(d){
						return d3.format(',')(d);
					},
					
					duration: 500,
					xAxis: {
						axisLabel: 'Oppostion',
						rotateLabels: -50,
						axisLabelDistance: 10
					},
					yAxis: {
						axisLabel: 'Score ',
						axisLabelDistance: 10,
					}
				}
			}
	}
	
	function barGraphData(data,mode) {
	
		if(mode === 'asc') {
			list = Object.keys(data).sort(function (a,b) {return data[a] - data[b]})
		}
		else if (mode === 'dsc') {
			list = Object.keys(data).sort(function (a,b) {return data[b] - data[a]})
			
		}
		else {
			 list =Object.keys(data);;
		}

		

		var adder = [{
			"key" : "country Vs Score",
			values :[]
		}]	


		
		for(var i=0;i<list.length;i++) {
			adder[0].values.push({"label":list[i],"value":data[list[i]]})
		}
		
		return adder;		
			
	}

	function multibarOptions(){
		return {
			chart: {
                type: 'multiBarChart',
                height: 375,
                clipEdge: true,
                duration: 500,
				stacked: true,
				showControls:false,
				tooltip : {
					contentGenerator: function(d) { return '<p><span class="mode-select" style="background-color:'+d.color+'"></span> '+ d.data.key +' <span><b>'+ d.data.y +'</b></span>  </p>'; }
				},
				
                xAxis: {
                    axisLabel: '',
                    showMaxMin: true,
                    tickFormat: function(d){
                        return d3.format('')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Total Score',
                    // axisLabelDistance: -20,
                    // tickFormat: function(d){
                    //     return d3.format(',.1f')(d);
                    // }
                }
            }
		}
	}

	function multibarData(data,mode){
		if(mode === 'asc') {
			list = Object.keys(data).sort(function (a,b) {return data[a] - data[b]})
		}
		else if (mode === 'dsc') {
			list = Object.keys(data).sort(function (a,b) {return data[b] - data[a]})
			
		}
		else {
			 list =Object.keys(data);;
		}
		
		var adder = [];

		for (let index = 0; index < list.length; index++) {
			
			adder.push({"key":list[index],values:[{x:"",y:data[list[index]]}] })
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
					showMaxMin:true,
					
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
				
				
				return datum;
			}
			
			for (var i = 0; i < c.length; i++) {
			
				
				adder[0].values.push([convertDate(c[i]), score[i]]);
			}
			
			return adder;
			
			
		}


		function selfishGraphOption(){
			return {
				chart: {
					type: 'pieChart',
					x: function(d){return d.key;},
					y: function(d){return d.y;},
					showLabels: true,
					duration: 500,
					labelThreshold: 0.01,
					labelSunbeamLayout: true,
				
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
                        top: 10,
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
		

	function horizontalBarOptions() {
		return {
			chart: {
                type: 'multiBarHorizontalChart',
                // height: 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showControls: true,
                showValues: true,
                duration: 300,
                xAxis: {
                    showMaxMin: true
				},
                yAxis: {
                    axisLabel: 'score',
                    tickFormat: function(d){
                        return d3.format('')(d);
                    }
                }
            }
		}
	}

	function horizontalBarData(home,away) {
		
		var commonTeams = Object.keys(home);
		var adder = [{
			"key": "Home",
			"color": "#d62728",
			values :[]
		}, {
			"key":"Away",
			"color":"#1f77b4",
			values:[]
		}]

		for (let index = 0; index < commonTeams.length; index++) {
			adder[0].values.push({"label":commonTeams[index],"value":home[commonTeams[index]].totalRuns})
			adder[1].values.push({"label":commonTeams[index],"value":away[commonTeams[index]].totalRuns })
		}

		
		return adder;

	}


}]);