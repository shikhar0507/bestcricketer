app.service('service', function ($http) {
	const url = "https://sachindataset.herokuapp.com"
	

	var groundDetails = {};

	this.getData = function () {



		return $http.get(url).then(function (response) {
			console.log(response)
			var data = response.data;
			return data;

		});


	}

	




});