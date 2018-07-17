<?php
	$dbhost = 'localhost';
	$dbuser = 'root';
	$dbpass = '';
	$dbname = 'adviceStorage';
	$type = $_POST['type'];

	$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
	$query = "select adviceText from hints where adviceType = '$type' and hidden='false'";

	$queryResult = $conn->query($query);

	$pArray = array();

	while($row = mysqli_fetch_array($queryResult))
	{
		$pArray[] = $row['adviceText'];
	}

	$json_array = json_encode($pArray);
	echo $json_array;
	$conn->close();
?>
