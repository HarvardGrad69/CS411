<?php
//initialSearch.php

$connect = mysqli_connect("localhost", "root", "password123", "crimedata");  
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

	$keyword = mysqli_real_escape_string($connect, $data->keyword);
	$output = array();
	$querySubTbl = 
		"SELECT ID, Latitude, Longitude, Neighbourhood, Description FROM crime";
	$resultSubTbl = mysqli_query($connect, $querySubTbl);
	if(mysqli_num_rows($resultSubTbl)>0){
		while($row = mysqli_fetch_array($resultSubTbl))
		{
			$output[] = $row;
		}
		echo json_encode($output);
	}
?>