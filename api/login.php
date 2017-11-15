<?php
//login.php

$connect = mysqli_connect("localhost", "root", "password123", "crimedata");  
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$data = json_decode(file_get_contents("php://input"));


if(count($data)>0)//Checking if there was some data sent or not
{
	$username = mysqli_real_escape_string($connect, $data->username);
	$password = mysqli_real_escape_string($connect, $data->password);
	$password = md5($password);
	$output = array();
	$query = 
		"SELECT username, admin FROM users 
		WHERE username='$username' AND password='$password'";
	$result = mysqli_query($connect, $query);
	if(mysqli_num_rows($result)>0){
		while($row = mysqli_fetch_array($result))
		{
			$output[] = $row;
		}
		echo json_encode($output);
	}
}
?>
