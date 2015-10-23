/**
 * Created by Vladislav on 22.10.2015.
 */

$(document).ready(function(){
    chat.init();
});

var chat = {
    data: {
        lastID : 0,
        noActivity : 0
    },
    init: function(){
        $('#name').defaultText('ѕсевдоним');
        $('#email').defaultText('Email (используетс€ Gravatar)');

        chat.data.jspAPI = $('#chatLineHolder').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12,
        }).data('jsp');

        var working = false;

        $('#loginForm').submit(function(){
            if(working) return false;
            return true;
        })
    }
}