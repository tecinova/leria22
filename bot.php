<?php
function requestSheetdb($url, $method = 'GET', $data = []) {

  $options = array(
    'http' => array(
      'header'  => 'Content-type: application/x-www-form-urlencoded',
      'method'  => strtoupper($method),
      'content' => http_build_query([
        'data' => $data
      ])
    )
  );

  try {
    $raw = @file_get_contents($url, false, stream_context_create($options));
    $result = json_decode($raw);
  } catch (Exception $e) {
    return false;
  }

  return $result;
}

// returns all spreadsheets data
$content = requestSheetdb('https://sheetdb.io/api/v1/58f61be4dda40');

// returns when name="Steve" AND age=22
$content = requestSheetdb('https://sheetdb.io/api/v1/58f61be4dda40/search?name=Steve&age=22');

// insert one row
$content = requestSheetdb('https://sheetdb.io/api/v1/58f61be4dda40', 'POST', ['name'=>'Mark','age'=>'35']);

// etc.
