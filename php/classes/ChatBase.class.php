<?php

/**
 * Created by PhpStorm.
 * User: Vladislav
 * Date: 21.10.2015
 * Time: 22:18
 */
class ChatBase
{
 public  function  __construct(array $options){
     foreach($options as $k=>$v){
         if (isset($this->$k)){
             $this->$k=$v;
         }
     }
 }
}