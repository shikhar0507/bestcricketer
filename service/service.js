app.service('service',function($http){
const url = "http://localhost:8000/n";

this.getData = function(){
	

	
 return $http.get(url).then(function(response) {
	var data =  response.data;
	return data;

});





}



});