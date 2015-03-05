<?php

header('Content-Type: application/json');

$url = "http://tamtech.ddns.net/mktshare/json/?start=20150107&end=20150108&minutes=60&display=%";

$result = file_get_contents($url);

echo $result;
?>