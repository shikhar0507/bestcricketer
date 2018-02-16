app.service('service',function($http){
const url = "http://localhost:8000/n";
const gmaps = "AIzaSyBJTGYSpyjSwPoa_raHDwjiREvjHU0yfjg";
this.getData = function(){
	

	
 return $http.get(url).then(function(response) {
	var data =  response.data;
	return data;

});


}

var stripCountry = function(address){
	var newaddress = address.split(",");
	var formatterAddress = newaddress[newaddress.length -1].replace(" ","");
	return formatterAddress;
}

this.getLocation = function(ground) {
	
return $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+ground+"&key="+gmaps).then(function(response) {

	
return stripCountry(response.data.results[0].formatted_address);
})
}



});