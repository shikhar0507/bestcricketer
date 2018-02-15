app.directive('lineChart',['nv','d3', function(nv,d3){


return {
	restrict :'E',
	scope : {
		data:'=',
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
			chart = nv.models.lineChart().showLegend(false).showYAxis(true).showXAxis(true);

			chart.xAxis.axisLabel('x').tickFormat(d3.format('.2f'));
			chart.yAxis.axisLabel('y').tickFormat(d3.format('.2f'));

			scope.$emit('lineChartLoad');
			return chart;
		})



	}
}
}]);