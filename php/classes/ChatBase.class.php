<?php


class ChatBase{


	public function __construct(array $options){
		
		foreach($options as $k=>$v){
			if(isset($this->$k)){
				$this->$k = $v;
			}
		}
	}
}

?>