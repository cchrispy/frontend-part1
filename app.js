var app = angular.module('app', []);

/*
** Controller for rendering the elapsed time since application was refreshed
*/
app.controller('clockController', ['$scope', '$interval', function($scope, $interval) {
  var hour = 0, minute = 0, second = 0;
  $scope.time = format(hour, minute, second);

  $interval(() => {      // Increment the seconds counter
    second++;
    if (second === 60) { // Increment the minutes counter @ 60 seconds
      second = 0;
      minute++;
    }
    if (minute === 60) { // Increment the hours counter @ 60 minutes
      minute = 0;
      hour++;
    }
    $scope.time = format(hour, minute, second);
  }, 1000);

  function format(hr, min, sec) {
    return `${ hr } hour${ hr !== 1 ? 's' : '' } ${ min } minute${ min !== 1 ? 's' : '' } ${ sec } second${ sec !== 1 ? 's' : '' }`;
  }
}])


/*
** Controller for rendering a table with data parsed from JSON file
** URL: https://friendpaste.com/71KNTMaFCZ6diD2esfC4Vo/raw?rev=626665323233
*/
app.controller('tableController', ['$scope', '$http', function($scope, $http) {

  $scope.data;
  $scope.keys_c;
  $scope.keys_m;

  $http({
    method: 'GET',
    url: 'https://friendpaste.com/71KNTMaFCZ6diD2esfC4Vo/raw?rev=626665323233'
  }).then(res => {
    $scope.data = res.data;
    $scope.keys_c = Object.keys(res.data).reverse(); // array of cXX values
    $scope.keys_m = Object.keys(res.data[$scope.keys_c[$scope.keys_c.length - 1]]).reverse(); // array of mXX values
  }, err => console.log('Error loading JSON: ', err));

  $scope.getBlanks = (data, key) => { // returns blanks for unfilled squares in the table
    var blanks = [];
    var total  = Object.keys(data).length;
    var cur    = Object.keys(data[key]).length + 1;
    for ( ; cur <= total; cur++) {
      blanks.push('x');
    }
    return blanks;
  }
  
}]);

app.filter('parse', function() { // grabs the appropriate "recv" values as an array
  return function(data) {
    var keys = Object.keys(data).reverse();
    return keys.map(key => data[key].recv);
  }
});