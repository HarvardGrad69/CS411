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
  // $res = mysqli_query($connect, "
  //                               SELECT crime.ID, Arrest, crime.Description, crime.ID, Neighbourhood
  //                               FROM crime, location, date
  //                               WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='$keyword'");
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
  if ($stmt = mysqli_prepare($connect, "SELECT crime.ID, Arrest, crime.Description, DateTime, Neighbourhood
  FROM crime, location, date
  WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood=?")) {
  mysqli_stmt_bind_param($stmt, "s", $keyword);
  mysqli_stmt_execute($stmt);
  $res = $stmt->get_result();
  //mysqli_store_result($stmt);
  //$res = mysqli_query($connect,"call searched($keyword)");
  //
  //echo $stmt;
  //$count = mysqli_stmt_num_rows($stmt);
  //if((mysqli_num_rows($res)>0) {
  //for(;$count>0;count--){
		// while($row = mysqli_get_result($stmt))
		// {
		// 	$output[] = $row;
		// }
    // Hi
    echo $res;
    while($result=$res->fetch_assoc()) {
      $output[] = $result;
    }
		echo json_encode($output);
	//}
  //mysqli_stmt_close($stmt);
}


?>
