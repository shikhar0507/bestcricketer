

app.service('service',function($http){
const url = "https://player-analysis.herokuapp.com/";
const gmaps = "AIzaSyBJTGYSpyjSwPoa_raHDwjiREvjHU0yfjg";

var groundDetails = {};

this.getData = function(){
	

	
 return $http.get(url).then(function(response) {
	var data =  response.data;
	return data;

});


}

var stripGroundDetails = function(address){
	var newaddress = address.split(",");
	var formattedCountry = newaddress[newaddress.length -1].replace(" ","");
	groundDetails["city"] = newaddress[0];
	groundDetails["country"] = formattedCountry;	
	return groundDetails;
}

this.getLocation = function(ground) {
	
return $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+ground+"&key="+gmaps).then(function(response) {
	
		
		return stripGroundDetails(response.data.results[0].formatted_address);
})


}



this.groundNearMe = function(res){
// console.log(res);


return $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+res.data.lat+","+res.data.lon+"&key"+gmaps).then(function(lookup){
		
			var address = lookup.data.results[0].address_components;
			var myarea;	
			var place =	 address.map(function(findType) {
				if(findType.types.includes("locality")) {
					myarea = findType.short_name;
				}

			});
			// console.log(myarea);
			
			return myarea;

				
	},function error(err){
		console.log(err);
		
	})



	
}






});