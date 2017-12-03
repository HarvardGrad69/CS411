<?php
//filterCrimeData.php

$connect = mysqli_connect("localhost", "root", "password123", "crimedata");
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
    $data = json_decode(file_get_contents("php://input"));

    $keyword = mysqli_real_escape_string($connect, $data->keyword);
	$output = array();
	$querySubTbl =
		"SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='$keyword'";
	$resultSubTbl = mysqli_query($connect, "call whyomg('$keyword')");
	if(mysqli_num_rows($resultSubTbl)>0){
		while($row = mysqli_fetch_array($resultSubTbl))
		{
			$output[] = $row;
		}
    // Hi
		echo json_encode($output);
	}
?>
