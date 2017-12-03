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
  $qry =  mysqli_query($connect, "create procedure `getlove`(IN keyword) BEGIN SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood=@keyword; END");
  // $stmt = $connection->prepare("SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='$keyword'");
  // $stmt->bind_param("sss", $keyword);
  //$stmt->execute();
  //$res = mysqli_query($connect,"call doot()");

  // while ($row = mysqli_fetch_array($res)){
  //   $output[] = $row;
  // }
  // echo json_encode($output);


?>
