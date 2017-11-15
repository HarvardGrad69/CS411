<?php
//initialSearch.php

$connect = mysqli_connect("localhost", "root", "password123", "crimedata");  
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

	$output = array();
	$querySubTbl = 
		"SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID LIMIT 50";
	$resultSubTbl = mysqli_query($connect, $querySubTbl);
	if(mysqli_num_rows($resultSubTbl)>0){
		while($row = mysqli_fetch_array($resultSubTbl))
		{
			$output[] = $row;
		}
		echo json_encode($output);
	}
?>