<?php
//initialSearch.php

$connect = mysqli_connect("localhost", "root", "password123", "crimedata");
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$data = json_decode(file_get_contents("php://input"));

$keyword = mysqli_real_escape_string($connect, $data->keyword);

$output = array();
$querySubTbl =
    "SELECT Year, location.Neighbourhood, COUNT(*) as Crime_Count
      FROM crime, location, date 
      WHERE crime.LocationID = location.ID and crime.DateID = date.ID 
      and location.Neighbourhood=$keyword GROUP BY Year;";

//+------+---------------+----------+
//| Year | Neighbourhood | COUNT(*) |
//+------+---------------+----------+
//| 2012 | Austin        |        9 |
//| 2013 | Austin        |        9 |
//| 2014 | Austin        |       14 |
//| 2015 | Austin        |     2559 |
//| 2016 | Austin        |     1298 |
//+------+---------------+----------+

$resultSubTbl = mysqli_query($connect, $querySubTbl);
if(mysqli_num_rows($resultSubTbl)>0){
    while($row = mysqli_fetch_array($resultSubTbl))
    {
        $output[] = $row;
    }
    echo json_encode($output);
}
?>