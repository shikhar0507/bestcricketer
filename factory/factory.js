app.factory('helper',function(){

var obj ={};
var dataArray =[];		
return {



parse : function(val,parser) {

var regex = new RegExp("["+parser+"]$");

for(var i =0;i<val.length;i++) {
	
	val[i].opposition = val[i].opposition.replace("v",'').replace(" ",'');

	if(regex.test(val[i].batting_score)) {

		val[i].batting_score = val[i].batting_score.replace(regex,"");
	
	}


	 if(val[i].batting_score != "DNB" && val[i].batting_score != "TDNB") {
		
		val[i].batting_score = parseInt(val[i].batting_score);
		dataArray.push(val[i]);
	}
	
		

}

return dataArray;

},

score : function(val,league) {

var totalRuns  = [];
totalRuns.push(val.map(function(q){return q.batting_score}))

var scoreData = {
	totalCenturies : function() {

	var result = totalRuns[0].filter(a => a > league) 
			
	return result.length;
		
	},
	totalRuns : function() {

		return totalRuns[0].reduce(function(a,b){
				return a+b;
	});
	}
};


return scoreData;


},

sortByOpposition : function(val,country) {


var holder = {};
val.forEach(function(d) {

	if(holder.hasOwnProperty(d.opposition)) {
		holder[d.opposition] = holder[d.opposition] +d.batting_score;
	}
	else {
		holder[d.opposition] = d.batting_score;
	}
})


if(country) {
	
	return holder[country];
}
else {
	return holder;
}

},





}





})

app.factory('d3',[function() {
	return d3;
}])

app.factory('nv',[function() {
	return nv;
}])

