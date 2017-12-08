var app = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngStorage', 'uiGmapgoogle-maps', 'highcharts-ng']);

app.config(function($routeProvider){
	$routeProvider
	.when("/home",
		{
			templateUrl:"partials/home.html",
			controller:"homeCtrl"
		}
	     )
	.when("/login",
		{
			templateUrl:"partials/login.html",
			controller:"loginCtrl"
		}
         )
    .when("/search",
		{
			templateUrl:"partials/Search.html",
			controller:"searchCtrl"
		}
         )
    .when("/map",
		{
			templateUrl:"partials/map.html",
			controller:"mapCtrl"
		}
         )
    .when("/statistics",
        {
            templateUrl:"partials/statistics.html",
            controller:"statisticsCtrl"
        }
         )
	.otherwise(
		{
			redirectTo:"/home"
		}
	);
});

app.factory('AuthService', function(){
    var user ={
        username:'default',
        admin: 0
    };

    user.isLoggedIn = function(){
		if(user.username != 'default')
			return true;
		else
			return false;
    };

    user.isAdmin = function(){
		//console.log(user);
		if(user.admin==1)
			return true;
		else
			return false;
    };

    return user;
});

app.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if (!AuthService.isLoggedIn()) {
            console.log('No User Logged in!');
            $location.path('/login');
		}
    });
}]);

app.directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];

        // map config
        var mapOptions = {
            center: new google.maps.LatLng(50, 2),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };

        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }

        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array

            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }

        // show the map and place some markers
        initMap();

        setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
        setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    };

    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };
});

app.controller('homeCtrl',function($scope,$location){
	$scope.gotoLogin = function () {
		$location.path('/login');
	};
});

app.controller('headerCtrl',function($scope,$location,AuthService){
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};

	$scope.isAdmin = function(){
		var bool =  AuthService.isAdmin();
		return bool;
	}
});

app.controller('loginCtrl', function($scope,$location,$http,$localStorage, AuthService){
	$scope.login = function(){
		$http.post(
            "api/login.php",
            { 'username':$scope.username, 'password':$scope.password}
        ).success(function(data){
            if(data==null){
                alert('Wrong username or password! Try again.')
            }
            else
            {
				console.log(data);
				AuthService.username = data[0].username;
				AuthService.admin = data[0].admin;
                console.log(AuthService);
				$scope.$storage = $localStorage.$default({user:AuthService});
				$location.path('/map');
            }

        });
	};
});

app.controller("searchCtrl", function($scope, $http, AuthService) {
    $scope.initSearch = function(){
        $http.get(
            "api/initialSearch.php"
        ).success(function(data){
            $scope.crimeList = data;
            console.log($scope.crimeList);
        });
    };

    $scope.search = function(){
        if($scope.keyword == null)
            alert("Please input a field");
        else{
            $http.post(
                "api/neighborhoodsearch.php",
                {'keyword':$scope.keyword}
            ).success(function(data){
                $scope.crimeList = data;
                console.log($scope.crimeList);
            });
        }
    };

    $scope.deleteEntry = function(id){
        if(AuthService.isAdmin()){
            if(confirm("Delete crime entry with ID" + id) == true){
                $http.post(
                    "api/deleteCrimeEntry.php",
                    {'ID':id}
                ).success(function(data){
                    alert("Deleted successfully!");
                    $scope.initSearch();
                })
            }
        }
    };

    $scope.updateEntry = function(){
        if($scope.selectedCrime != null && AuthService.isAdmin()){
            console.log($scope.selectedCrime)
            $http.post(
                "api/updateEntry.php",
                {'ID':$scope.selectedCrime.ID, 'Description':$scope.selectedCrime.Description}
            ).success(function(data){
                alert("Updated successfully!");
                $scope.initSearch();
            })
        }
    };

    $scope.updateSelected = function(crime){
	    $scope.selectedCrime = crime;
	    console.log($scope.selectedCrime);
    };

    $scope.addCrime = function(){
        if($scope.newCrime != null && AuthService.isAdmin()){
            $http.post(
                "api/addEntry.php",
                {'Arrest':$scope.newCrime.Arrest, 'Description':$scope.newCrime.Description,'Datetime':$scope.newCrime.Datetime, 'Neighbourhood':$scope.newCrime.Neighbourhood}
            ).success(function(data){
                console.log(data);
                alert("Added successfully!");
                $scope.initSearch();
            })
        }
    }
});

app.controller('mapCtrl', function($scope,$http, AuthService){
    //$scope.map = { center: { latitude: 41.8781, longitude: -87.6298 }, zoom: 8 };
    $scope.map = {
        center: {
          latitude: 41.8781,
          longitude: -87.6298
        },
        zoom: 12,
      };
    $scope.options = {
        scrollwheel: false
    };
    $scope.randomMarkers = [];
    var createRandomMarker = function(i, lat, long, year, idKey) {
        if (idKey == null) {
            idKey = "id";
        }

        var latitude = lat;
        var longitude = long;
	console.log(year);
	if(year == 2012){
	    var ic = 'static/yellow_MarkerC.png'
	}
	else if(year == 2013){
	    var ic = 'static/purple_MarkerC.png'
	}
        else if(year == 2014){
            var ic = 'static/orange_MarkerC.png'
        }
        else if(year == 2015){
            var ic = 'static/blue_MarkerC.png'
        }
        else
            var ic = 'static/red_MarkerC.png'
        var ret = {
            latitude: latitude,
            longitude: longitude,
            title: 'm' + i,
            icon: ic
        };
        ret[idKey] = i;
        return ret;
    };
    $scope.search = function(){
        if($scope.keyword == null)
            alert("Please input a field");
        else{
            $http.post(
                "api/filterCrimeData.php",
                {'keyword':$scope.keyword}
            ).success(function(data){
                $scope.crimeList = data;
                console.log($scope.crimeList);
               var markers = [];

                for (var i = 0; i < $scope.crimeList.length; i++) {
                    markers.push(createRandomMarker(i, $scope.crimeList[i].Latitude, $scope.crimeList[i].Longitude, $scope.crimeList[i].Year));
                }
                $scope.randomMarkers = markers;
                console.log($scope.randomMarkers.length)
            });
        }
    };
});

app.controller('statisticsCtrl', function($scope,$location,$http,$localStorage, AuthService){
    var year=[]
    var crimeNumber=[]
    var neighborhood
    $scope.chartConfig = {
        options: {
            chart: {
                type: 'bar',
            },
            title:{
                text: 'Crime Numbers by Neighborhood'
            },
            yAxis: {
                title: {
                    text: 'Crimes'
                },
                labels: {
                    overflow: 'justify'
                }
            }
        },
        series: null
    };     
    $scope.search = function(){
        if($scope.keyword == null)
            alert("Please input a field");
        else{
            neighborhood = $scope.keyword
            $http.post(
                "api/generateGraph.php",
                {'keyword':$scope.keyword}
            ).success(function(data){
                $scope.crimeList = data;
                console.log(data);
                for(var index = 0; index<data.length; index++){
                    year.push(data[index].Year)
                    var arr = []
                    arr.push(parseInt(data[index].Crime_Count))
                    console.log(arr)
                    crimeNumber.push({name: $scope.keyword + " " + data[index].Year, data:arr})
                }
		        console.log(crimeNumber);
		        $scope.chartConfig.series = crimeNumber;
            });
        }
    };




});

// -------------------------------
// highcharts-ng module 
// -------------------------------
angular.module('highcharts-ng', [])
.directive('highchart', function () {

  //IE8 support
  var indexOf = function(arr, find, i /*opt*/) {
    if (i===undefined) i= 0;
    if (i<0) i+= arr.length;
    if (i<0) i= 0;
    for (var n= arr.length; i<n; i++)
      if (i in arr && arr[i]===find)
        return i;
    return -1;
  };


  function prependMethod(obj, method, func) {
    var original = obj[method];
    obj[method] = function () {
      var args = Array.prototype.slice.call(arguments);
      func.apply(this, args);
      if(original) {
        return original.apply(this, args);
      }  else {
        return;
      }

    };
  }

  function deepExtend(destination, source) {
    for (var property in source) {
      if (source[property] && source[property].constructor &&
        source[property].constructor === Object) {
        destination[property] = destination[property] || {};
        deepExtend(destination[property], source[property]);
      } else {
        destination[property] = source[property];
      }
    }
    return destination;
  }

  var seriesId = 0;
  var ensureIds = function (series) {
    angular.forEach(series, function(s) {
      if (!angular.isDefined(s.id)) {
        s.id = 'series-' + seriesId++;
      }
    });
  };
  var axisNames = [ 'xAxis', 'yAxis' ];

  var getMergedOptions = function (scope, element, config) {
    var mergedOptions = {};

    var defaultOptions = {
      chart: {
        events: {}
      },
      title: {},
      subtitle: {},
      series: [],
      credits: {},
      plotOptions: {},
      navigator: {enabled: false}
    };

    if (config.options) {
      mergedOptions = deepExtend(defaultOptions, config.options);
    } else {
      mergedOptions = defaultOptions;
    }
    mergedOptions.chart.renderTo = element[0];
    axisNames.forEach(function(axisName) {
      if (config[axisName]) {
        prependMethod(mergedOptions.chart.events, 'selection', function(e){
          var thisChart = this;
          if (e[axisName]) {
            scope.$apply(function () {
              scope.config[axisName].currentMin = e[axisName][0].min;
              scope.config[axisName].currentMax = e[axisName][0].max;
            });
          } else {
            //handle reset button - zoom out to all
            scope.$apply(function () {
              scope.config[axisName].currentMin = thisChart[axisName][0].dataMin;
              scope.config[axisName].currentMax = thisChart[axisName][0].dataMax;
            });
          }
        });

        prependMethod(mergedOptions.chart.events, 'addSeries', function(e){
          scope.config[axisName].currentMin = this[axisName][0].min || scope.config[axisName].currentMin;
          scope.config[axisName].currentMax = this[axisName][0].max || scope.config[axisName].currentMax;
        });

        mergedOptions[axisName] = angular.copy(config[axisName]);
      }
    });

    if(config.title) {
      mergedOptions.title = config.title;
    }
    if (config.subtitle) {
      mergedOptions.subtitle = config.subtitle;
    }
    if (config.credits) {
      mergedOptions.credits = config.credits;
    }
    return mergedOptions;
  };

  var updateZoom = function (axis, modelAxis) {
    var extremes = axis.getExtremes();
    if(modelAxis.currentMin !== extremes.dataMin || modelAxis.currentMax !== extremes.dataMax) {
      axis.setExtremes(modelAxis.currentMin, modelAxis.currentMax, false);
    }
  };

  var processExtremes = function(chart, axis, axisName) {
    if(axis.currentMin || axis.currentMax) {
      chart[axisName][0].setExtremes(axis.currentMin, axis.currentMax, true);
    }
  };

  var chartOptionsWithoutEasyOptions = function (options) {
    return angular.extend({}, options, {data: null, visible: null});
  };

  var prevOptions = {};

  var processSeries = function(chart, series) {
    var ids = [];
    if(series) {
      ensureIds(series);

      //Find series to add or update
      angular.forEach(series, function(s) {
        ids.push(s.id);
        var chartSeries = chart.get(s.id);
        if (chartSeries) {
          if (!angular.equals(prevOptions[s.id], chartOptionsWithoutEasyOptions(s))) {
            chartSeries.update(angular.copy(s), false);
          } else {
            if (s.visible !== undefined && chartSeries.visible !== s.visible) {
              chartSeries.setVisible(s.visible, false);
            }
            if (chartSeries.options.data !== s.data) {
              chartSeries.setData(s.data, false);
            }
          }
        } else {
          chart.addSeries(angular.copy(s), false);
        }
        prevOptions[s.id] = chartOptionsWithoutEasyOptions(s);
      });
    }

    //Now remove any missing series
    for(var i = chart.series.length - 1; i >= 0; i--) {
      var s = chart.series[i];
      if (indexOf(ids, s.options.id) < 0) {
        s.remove(false);
      }
    }

  };

  var initialiseChart = function(scope, element, config) {
    config = config || {};
    var mergedOptions = getMergedOptions(scope, element, config);
    var chart = config.useHighStocks ? new Highcharts.StockChart(mergedOptions) : new Highcharts.Chart(mergedOptions);
    for (var i = 0; i < axisNames.length; i++) {
      if (config[axisNames[i]]) {
        processExtremes(chart, config[axisNames[i]], axisNames[i]);
      }
    }
    processSeries(chart, config.series);
    if(config.loading) {
      chart.showLoading();
    }
    chart.redraw();
    return chart;
  };




  return {
    restrict: 'EAC',
    replace: true,
    template: '<div></div>',
    scope: {
      config: '='
    },
    link: function (scope, element, attrs) {

      var chart = false;
      function initChart() {
        if (chart) chart.destroy();
        chart = initialiseChart(scope, element, scope.config);
      }
      initChart();

      scope.$watch('config.series', function (newSeries, oldSeries) {
        //do nothing when called on registration
        if (newSeries === oldSeries) return;
        processSeries(chart, newSeries);
        chart.redraw();
      }, true);

      scope.$watch('config.title', function (newTitle) {
        chart.setTitle(newTitle, true);
      }, true);

      scope.$watch('config.subtitle', function (newSubtitle) {
        chart.setTitle(true, newSubtitle);
      }, true);

      scope.$watch('config.loading', function (loading) {
        if(loading) {
          chart.showLoading();
        } else {
          chart.hideLoading();
        }
      });

      scope.$watch('config.credits.enabled', function (enabled) {
        if (enabled) {
          chart.credits.show();
        } else if (chart.credits) {
          chart.credits.hide();
        }
      });

      scope.$watch('config.useHighStocks', function (useHighStocks) {
        initChart();
      });

      axisNames.forEach(function(axisName) {
        scope.$watch('config.' + axisName, function (newAxes, oldAxes) {
          if (newAxes === oldAxes) return;
          if(newAxes) {
            chart[axisName][0].update(newAxes, false);
            updateZoom(chart[axisName][0], angular.copy(newAxes));
            chart.redraw();
          }
        }, true);
      });
      scope.$watch('config.options', function (newOptions, oldOptions, scope) {
        //do nothing when called on registration
        if (newOptions === oldOptions) return;
        initChart();
      }, true);

      scope.$on('$destroy', function() {
        if (chart) chart.destroy();
        element.remove();
      });

    }
  };
});
