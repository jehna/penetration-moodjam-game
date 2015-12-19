<?php
$file = str_replace("/","",($_GET[f]));

header('access-control-allow-origin: *');
//header('access-control-allow-credentials: true');
//header('Access-Control-Allow-Headers: origin, x-requested-with, content-type');
header("Access-Control-Allow-Methods: GET");
header('Content-Type: image/png');

echo file_get_contents($file);