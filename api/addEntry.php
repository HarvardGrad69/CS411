<?php
	//addEntry.php
    $connect = mysqli_connect("localhost", "root", "password123", "crimedata");
	/* check connection */
	if (mysqli_connect_errno()) {
    	printf("Connect failed: %s\n", mysqli_connect_error());
    	exit();
	}
	$data = json_decode(file_get_contents("php://input"));
	if(count($data) > 0)
	{
		$Arrest = $data->Arrest;
		$Neighbourhood = mysqli_real_escape_string($connect, $data->Neighbourhood);
		$Description = mysqli_real_escape_string($connect, $data->Description);
		$ID = mt_rand(1,20000);

		//Formatting our datetime
		$date = mysqli_real_escape_string($connect, $data->Datetime);
		$timestamp = strtotime($date);
    	$Datetime = date('Y-m-d H:i:s', $timestamp);
		$month = date("m", $timestamp);
		$year = date("y", $timestamp);
		$day = date("d", $timestamp);

		$query = "INSERT INTO date(ID, Datetime, Year, Month, Day) VALUES('$ID', '$Datetime', '$year', '$month', '$day'); ";
		mysqli_query($connect, $query);
		$query2 = "INSERT INTO location(ID, Latitude, Longitude, Neighbourhood, Description) VALUES('$ID', 0, 0, '$Neighbourhood', NULL); ";
		mysqli_query($connect, $query2);
		$query3 = "INSERT INTO crime(ID, Arrest, Description, DateID, LocationID) VALUES('$ID', '$Arrest', '$Description', '$ID', '$ID');";

		$res = array(
			'ID' => $ID
		);
		if(mysqli_query($connect, $query3))
		{
			echo json_encode($res);
		}
		else
		{
		   echo json_encode($query3);
		}
 	}
 ?>
