<?php
	$name = $_POST['adviceText'];
	$workerId = $_POST['workerId'];
	$adviceType = $_POST['adviceType'];
	$bridge = mysqli_connect('localhost', 'root', '', 'test8');
	$query = "INSERT INTO table8 (adviceText, workerId, adviceType, upVotes, hidden) VALUES ('$name', '$workerId','$adviceType', 0, 'false')";
	if($bridge -> query($query))
	{
		echo 'values were added to database';
	}
?>
