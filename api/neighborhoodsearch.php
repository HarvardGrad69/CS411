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
  //$output = array();
  //include 'filterCrimeData.php';
  //$data = json_decode(file_get_contents("php://input"));
  //$keyword = mysqli_real_escape_string($connect, $data->keyword);
  $rawr = mysqli_query($connect, "CREATE PROCEDURE `doog`(IN doofus varchar(45)) SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='doofus'");
  if (!$rawr) {
    printf("Error: %s\n", mysqli_error($connect));
    exit();
}
  // $stmt = $connection->prepare("SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='$keyword'");
  // $stmt->bind_param("sss", $keyword);
  //$stmt->execute();
  // $res = mysqli_query($connect,"call omgdude()");
  //
  // while ($row = mysqli_fetch_array($res)){
  //   $output[] = $row;
  // }
  // echo json_encode($output);


?>
