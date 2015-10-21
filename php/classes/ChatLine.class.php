<?php

/**
 * Created by PhpStorm.
 * User: Vladislav
 * Date: 21.10.2015
 * Time: 22:22
 */
class ChatLine extends ChatBase
{
    protected $text = '', $author = '', $gravatar = '';

    public function save()
    {
        DB::query("INSERT INTO webchat_lines (author, gravatar,text)
                  VALUES (
                '" . DB::esc($this->author)."',
                '".DB::esc($this->gravatar)."',
                '".DB::esc($this->text)."'
                )");
        return DB::getMySQLiObject();
    }
}