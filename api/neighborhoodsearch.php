<?php
$connect = mysqli_connect("localhost", "root", "password123", "crimedata");
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

  // session_start();
  // $keyword = $_SESSION['keyword'];
  //echo $keyword;
  $output = array();
  //include 'filterCrimeData.php';
  $data = json_decode(file_get_contents("php://input"));
  $keyword = mysqli_real_escape_string($connect, $data->keyword);
  $res = mysqli_query($connect, "
                                SELECT crime.ID, Arrest, crime.Description, date.Year, Neighbourhood
                                FROM crime, location, date
                                WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='$keyword'");
  //$doodoo = mysqli_query($connect, "CREATE VIEW poopoo AS SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='Bridgeport'");
  //$res = mysqli_query($connect, "SELECT * FROM poopoo");
  //mysqli_query($connect, "ALTER TABLE crime ADD CONTRAINT CHECK (Arrest<=1)");
  // if (!$rawr) {
  //   printf("Error: %s\n", mysqli_error($connect));
  //   exit();
  // }
  // $stmt = $connection->prepare("SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='$keyword'");
  // $stmt->bind_param("sss", $keyword);
  //$stmt->execute();
  //$res = mysqli_query($connect,"exec searchy @param1='$keyword' go;");
  //
  if(mysqli_num_rows($res)>0){
		while($row = mysqli_fetch_array($res))
		{
			$output[] = $row;
		}
    // Hi
		echo json_encode($output);
	}


?>
