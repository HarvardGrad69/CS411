<?php
//initialSearch.php

$connect = mysqli_connect("localhost", "root", "password123", "crimedata");
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
  mysqli_query($connect, "DROP TRIGGER trig");
  mysqli_query($connect, "CREATE TRIGGER trig
BEFORE INSERT ON crime FOR EACH ROW
BEGIN
  IF new.Arrest > '1' THEN
      SET new.Arrest = '0';
  END IF;
END");
mysqli_query($connect, "DROP INDEX on_neigh");
mysqli_query($connect, "CREATE INDEX on_neigh ON location(Neighbourhood)");
mysqli_query($connect, "ALTER TABLE crime DROP CONSTRAINT CHK_crime");
mysqli_query($connect, "ALTER TABLE crime WITH CHECK ADD CONSTRAINT CHK_crime CHECK((crime.Description<>N''))");
mysqli_query($connect, "DROP PROCEDURE searched");
mysqli_query($connect, "CREATE PROCEDURE `searched`() AS
                        BEGIN
                        SELECT crime.ID, Arrest, crime.Description, date.Year, Neighbourhood
                        FROM crime, location, date
                        WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood=?
                        END;");
	$output = array();
	$querySubTbl =
		"SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID LIMIT 50";
	$resultSubTbl = mysqli_query($connect, $querySubTbl);
	if(mysqli_num_rows($resultSubTbl)>0){
		while($row = mysqli_fetch_array($resultSubTbl))
		{
			$output[] = $row;
		}
		echo json_encode($output);
	}
?>
