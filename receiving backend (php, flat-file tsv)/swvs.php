<?php

	// Settings
    date_default_timezone_set('Europe/Stockholm');
    $log_filename = 'swvs.log';

    /*
        POST
            href[]
    */

    $hrefs = isset($_POST['href']) ? $_POST['href'] : '__MISSING__';
    $lang = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '__MISSING__';
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '__MISSING__';
    $ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '__MISSING__';

	$new_data_rows = array();
	
	foreach ($hrefs as $href) {
		if (!empty($href)) {
			$new_data_rows[] = array(
				date('Y-m-d'),
				$href,
				$lang,
				$ip,
				$ua
			);
		}
	}

	if (!empty($new_data_rows)) {
		file_put_contents($log_filename, rows2tsv($new_data_rows), FILE_APPEND);
	}

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: X-Requested-With');

    echo 1;
    exit;

    //
    //
    //

    function rows2tsv($rows) {
		foreach ($rows as $index => $row) {
			$rows[$index] = array2tsv($row);
		}
		return implode("\n", $rows) . "\n";
	}

    function array2tsv($array) {
		foreach ($array as $index => $value) {
			$value = str_ireplace("\t", ' ', $value);
			if ($value === "\n") {
				$value = '';
			}
			$array[$index] = $value;
		}
		return "\t" . implode("\t", $array) . "\t";
	}

	function tsv2rows($tsv) {
		$tsv = trim($tsv, "\n");
		$rows = explode("\t\n\t", $tsv);
		foreach ($rows as $index => $row) {
			$rows[$index] = explode("\t", $row);
		}
		return $rows;
	}

?>
