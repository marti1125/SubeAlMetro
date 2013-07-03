<?php
header('Content-Type: application/json');
session_start();
require_once("twitteroauth/twitteroauth.php");

$twitteruser = "Lineaunope";
$notweets = 7;
$consumerkey = "K55EvPSwvVjBAqF7iyZmQ";
$consumersecret = "pIw9eYXMfgAKYwX74qrBU0rcvsKul6fqASTe2FZE";
$accesstoken = "79004248-hqFbqQ9w3BWHI9aqtGfSN2qnh7RVlkX56dyF30ZG4";
$accesstokensecret = "s2R7YOJWMWYkQQk57KbNUkqwoA8VoH8eBfvi4VeNY";

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
  
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);
 
echo json_encode($tweets);
?>