<?php
	$dbhost = 'localhost';
	$dbuser = 'root';
	$dbpass = '';
	$dbname = 'adviceStorage';
	$text = $_POST['searchText'];

	$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
	$query = "select upVotes from hints where adviceText = '$text'";

	$queryResult = $conn->query($query);

	$pArray = array();

	while($row = mysqli_fetch_array($queryResult))
	{
		$pArray[] = $row['upVotes'];
	}

	$json_array = json_encode($pArray);
	echo $json_array;
	$conn->close();
?>
