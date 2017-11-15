<?php
//updateEntry.php

$connect = mysqli_connect("localhost", "root", "password123", "crimedata");  
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$data = json_decode(file_get_contents("php://input"));


if(count($data)>0)//Checking if there was some data sent or not
{
	$id = $data->ID;
    $description = mysqli_real_escape_string($connect, $data->Description);
	$querySubTbl = 
		"UPDATE crime 
        SET Description='$description'
		WHERE ID='$id'";
	$result = mysqli_query($connect, $querySubTbl);
	if($result)
		echo "Data updated....";
	else
		echo "error";
}
?>