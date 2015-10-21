<?php

/**
 * Created by PhpStorm.
 * User: Vladislav
 * Date: 22.10.2015
 * Time: 0:08
 */
class Chat
{
    public static function login($name, $email)
    {
        if (!$name || !$email) {
            throw new Exception ('Заполните все необходиміе поля.');
        }
        if (!filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) {
            throw new Exception ("Неправильный адрес email.");
        }

        $gravatar = md5(strtolower(trim($email)));

        $user = new ChatUser (array(
            'name' => $name,
            'gravatar' => $gravatar
        ));

        if ($user->save()->affected_rows != 1) {
            throw new Exception ('Данное имя используется.');
        }

        $_SESSION['user'] = array(
            'name' => $name,
            'gravatar' => $gravatar
        );
        return array(
            'status' => 1,
            'name' => $name,
            'gravatar' => $gravatar
        );
    }

    public static function checkLogged()
    {
        $response = array('logged' => false);

        if ($_SESSION['user']['name']) {
            $response['logged'] = true;
            $response['loggedAs'] = array(
                'name' => $_SESSION['user']['name'],
                'gravatar' => Chat::gravatarFromHash($_SESSION['user']['gravatar'])
            );
        }
        return $response;
    }
    public static function logout(){
        DB::query("DELETE FROM webchat_users WHERE name= '".DB::esc($_SESSION['user']['name'])."'");
        $_SESSION = array();
        unset($_SESSION);
        return array('status'=>1);
    }
}