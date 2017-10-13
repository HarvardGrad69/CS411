<?php
    //test php script
    $connect = mysqli_connect("localhost", "root", "password123", "test");  
    /* check connection */
    if (mysqli_connect_errno()) {
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
    }

    $output = array();
    $query = "SELECT * FROM team";
	$result = mysqli_query($connect, $query);

	if(mysqli_num_rows($result)>0){
		while($row = mysqli_fetch_array($result))
		{
			$output[] = $row;
		}
		echo json_encode($output);
	}

?>