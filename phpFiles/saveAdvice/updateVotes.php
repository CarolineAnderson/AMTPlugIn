<?php
	$text = $_POST['adviceText'];
	$votes = $_POST['votes'];
	$bridge = mysqli_connect('localhost', 'root', '', 'adviceStorage');
	$query = "UPDATE hints SET upVotes = '$votes' WHERE adviceText = '$text'";
	if($bridge -> query($query))
	{
		echo 'database updated';
	}
?>
