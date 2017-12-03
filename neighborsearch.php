<?php

$result = mysqli_query('CREATE PROCEDURE `neighborsearch`(IN $keyword) BEGIN SELECT crime.ID, Arrest, crime.Description, Datetime, Neighbourhood FROM crime, location, date WHERE crime.LocationID = location.ID and crime.DateID = date.ID and location.neighbourhood='$keyword'; END');

?>
