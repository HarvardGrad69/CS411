<?php
$connect = mysql_connect("localhost", "root", "password123", "crimedata");
/* check connection */
if (mysql_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
  $qry =  mysql_query("create procedure neighborsearch() SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='Bridgeport'");
  echo "Stored Procedure created.";
  mysql_query($qry,$connect);

  $res = mysql_query("call neighborhoodsearch()");
  while($row=mysql_fetch_array($res))
  {

  }


?>
