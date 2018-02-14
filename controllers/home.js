app.controller('home',function($scope,$location,$http){

var vm = this;
$http.get("http://localhost:8000/n").then(function(response){

console.log(response);


});







})