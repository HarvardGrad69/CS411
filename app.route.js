var app = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngStorage']);

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
				$location.path('/search');
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
                "api/filterCrimeData.php",
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
	var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.markers = [];
    //create some markers
    for (var i = 1; i < 11; ++i) {
        $scope.markers.push(new google.maps.Marker({
            position: new google.maps.LatLng(0, 0),
            desc: '<div class="iw">description for Marker#' + i + '</div>',
            icon: 'https://mt.google.com/vt/icon?psize=12&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=' + i
        }))
    }
    $scope.oms = new OverlappingMarkerSpiderfier($scope.map, {
        keepSpiderfied: true
    });
    $scope.oms.addListener('unspiderfy', function () {
        $scope.iw.close();
    });

    //create a single InfoWindow-instance
    $scope.iw = new google.maps.InfoWindow();
    google.maps.event.addListener($scope.iw, 'closeclick', function () {
        $scope.oms.unspiderfy();
    });
    //add click-listener
    $scope.oms.addListener('click', function (marker) {
        $scope.iw.close();
        $scope.iw.setContent(marker.desc);
        $scope.iw.open($scope.map, marker);

    });

    //add the markers to the oms
    for (var i = 0; i < $scope.markers.length; ++i) {
        $scope.markers[i].setMap($scope.map);
        $scope.oms.addMarker($scope.markers[i]);
    }

});
