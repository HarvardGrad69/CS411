<?php
	//addEntry.php
//    $connect = mysqli_connect("localhost", "root", "password123", "crimedata");
//	/* check connection */
//	if (mysqli_connect_errno()) {
//        printf("Connect failed: %s\n", mysqli_connect_error());
//        exit();
//    }
//	$data = json_decode(file_get_contents("php://input"));
//	if(count($data) > 0)
//    {
        $Long = -87.621;
        $Lat = 41.8781;

$arrContextOptions=array(
    "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ),
);

// google map geocode api url
$url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=$Long%2C$Lat&key=AIzaSyCO0va2pQ1sb8tN9aoutLUWK3D1MwyP_zc";
print($url);
$resp_json = file_get_contents($url, false, stream_context_create($arrContextOptions));
print($resp_json);



//    // get the json response
//    $resp_json = file_get_contents($url);

    // decode the json
    $resp = json_decode($resp_json, true);

    echo $resp['results']['address_components'];

    // response status will be 'OK', if able to geocode given address
//    if($resp['status']=='OK') {
//
//        // get the important data
//        $neighborhood = $resp['results'][2]['address_components']['long_name'];
//
//        echo $neighborhood;
//    }

?>
