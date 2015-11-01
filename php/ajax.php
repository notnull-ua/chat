<?php

/* Конфигурация базы данных. */

$dbOptions = array(
    'db_host' => 'localhost',
    'db_user' => 'root',
    'db_pass' => '',
    'db_name' => 'chat_db'
);

/* Конец секции конфигурации базы данных */

error_reporting(E_ALL ^ E_NOTICE);

require "classes/DB.class.php";
require "classes/Chat.class.php";
require "classes/ChatBase.class.php";
require "classes/ChatLine.class.php";
require "classes/ChatUser.class.php";

session_name('webchat');
session_start();


// Удаляем лишнии слэши и пробелы
array_walk_recursive($_GET, create_function('&$v,$k', '$v = stripslashes($v);'));
array_walk_recursive($_POST, create_function('&$v,$k', '$v = stripslashes($v);'));
array_walk_recursive($_GET, create_function('&$v,$k', '$v = trim($v);'));
array_walk_recursive($_POST, create_function('&$v,$k', '$v = trim($v);'));

try {

    DB::init($dbOptions);

    $response = array();


    switch ($_GET['action']) {

        case 'login':
            $response = Chat::login($_POST['name'], $_POST['email']);
            break;

        case 'checkLogged':
            $response = Chat::checkLogged();
            break;

        case 'logout':
            $response = Chat::logout();
            break;

        case 'submitChat':
            $response = Chat::submitChat($_POST['chatText']);
            break;

        case 'getUsers':
            $response = Chat::getUsers();
            break;

        case 'getChats':
            $response = Chat::getChats($_GET['lastID']);
            break;

        default:
            throw new Exception('Wrong action');
    }

    echo json_encode($response);
} catch (Exception $e) {
    die(json_encode(array('error' => $e->getMessage())));
}
