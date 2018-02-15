app.directive('lineChart',['nv','d3', function(nv,d3){


return {
	restrict :'E',
	scope : {
		data:'=',
		country:'=',
		score:'=',
		height:'@' ,
		width:'@'

	},
	template:'<svg ng-attr-height="{{height}}" ng-attr-width="{{width}}"></svg>',
	
	link : function(scope,element) {
		var svg = element.find('svg');
	
		
		
		
		
	
		
		var chart;
		
		var update = function() {
			d3.select(svg[0]).datum(scope.data).call(chart);
		}
		
		scope.$watch(function() {
			return angular.toJson(scope.data);
		},function() {
			if(chart) {
				update();
			}
		}
	);
	
	scope.$on('lineChartLoad',update);
	nv.addGraph(function(){
		setTimeout(function(){
		chart = nv.models.discreteBarChart().showValues(false).staggerLabels(true)  
			
			chart.xAxis.tickValues([0,1,2,3,4,5,6,7]).tickFormat(function(d){return scope.country[d]})
			
			chart.yAxis.tickValues([0,1,2,3,4,5,6,7]).tickFormat(function (d) { return scope.score[d]});
			
			scope.$emit('lineChartLoad');
			return chart;
		},1000);	
	})
	
	
	
	
}
}
}]);