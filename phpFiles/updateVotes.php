<?php
	$text = $_POST['adviceText'];
	$votes = $_POST['votes'];
	$bridge = mysqli_connect('localhost', 'root', '', 'test8');
	$query = "UPDATE table8 SET upVotes = '$votes' WHERE adviceText = '$text'";
	if($bridge -> query($query))
	{
		echo 'database updated';
	}
?>
