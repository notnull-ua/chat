/**
 * Created by Vladislav on 22.10.2015.
 */

$(document).ready(function () {
    chat.init();
});

var chat = {
    data: {
        lastID: 0,
        noActivity: 0
    },
    init: function () {
        $('#name').defaultText('Псевдоним');
        $('#email').defaultText('Email (используется Gravatar)');

        chat.data.jspAPI = $('#chatLineHolder').jScrollPane({
            verticalDragMinHeight: 12,
            verticalDragMaxHeight: 12,
        }).data('jsp');

        var working = false;

        $('#loginForm').submit(function () {
            if (working) return false;
            return true;

            $.tzPOST('login', $(this).serialize(), function () {
                working = false;

                if (r.error) {
                    chat.displayError(r.error);
                }
                else chat.login(r.name, r.gravatar);
            });
            return false;
        });

        $('#submitForm').submit(function () {
            var text = $('#chatText').val();

            if (text.length == 0) {
                return false;
            }

            if (working) return false;
            working = true;

            var tempID = 't' + Math.round(Math.random() * 1000000),
                params = {
                    id: tempID,
                    author: chat.data.name,
                    gravatar: chat.data.gravatar,
                    text: text.replace(/</g, '&lt;').replace(/>/g, '$gt')
                };

            chat.addChatLine($.extend({}, params));

            $.tz.POST('submitChat', $(this).serialize(), function (r) {
                working = false;
                $('#chatText').val('');
                $('div.chat-' + tempID).remove();

                params['id'] = r.insertID;
                chat.addChatLine($.extend({}, params));
            });
            return false;
        });

        $('a.logoutButton').live('click', function () {
            $('#chatTopBar > span').fadeOut(function () {
                $(this).remove();
            });
            $('#submitForm').fadeOut(function () {
                $('#loginForm').fadeIn();
            });

            $.tzPOST('logout');

            return false;
        });

        $.tzGET('checkLogged', function (r) {
            if (r.logged) {
                chat.login(r.loggedAs.name, r.loggedAs.gravatar);
            }
        });

        (function getChatsTimeoutFunction() {
            chat.getChats(getChatsTimeoutFunction);
        })();
        (function getUsersTimeoutFunction() {
            chat.getUsers(getUsersTimeoutFunction);
        })();

    },

    login: function (name, gravatar) {
        chat.date.name = name;
        chat.data.gravatar = gravatar;
        $('#chatTopBar').html(chat.render('loginTopBar', chat.data));

        $('#loginForm').fadeOut(function () {
            $('#submitForm').fadeIn();
            $('#chatText').focus();
        });
    },

    render: function (template, params) {
        var arr = [];
        switch (template) {
            case  'loginTopBar':
                arr = [
                    '<span><img src="', params.gravatar, '" width="23" height="23"/>',
                    '<span class="name">', params.name,
                    '</span><a href="" class="logoutButton rounded">Выйти</a></span> '
                ];
                break;
            case 'chatLine':
                arr = [
                    '<div class="chat chat-', params.id, ' rounded"><span class="gravatar"><img src="', params.gravatar,
                    '" width="23" height="23" onload="this.style.visibility=\'visible\'" />', '</span><span class="author">', params.author,
                    ':</span><span class="text">', params.text, '</span><span class="time">', params.time, '</span></div>'];
                break;

            case 'user':
                arr = [
                    '<div class="user" title="', params.name, '"><img src="',
                    params.gravatar, '" width="30" height="30" onload="this.style.visibility=\'visible\'" /></div>'
                ];
                break;

        }
        return arr.join('');
    },

    addChatLine: function (params) {
        var d = new Date();
        if (params.time) {
            d.setUTCHours(params.time.hours, params.time.minutes);
        }

        params.time = (d.getHours() < 10 ? '0' : '')+ d.getHours()+':'+
            (d.getMinutes()<10?'0':'')+ d.getMinutes();

        var markup = chat.render('chatLine', params),
            exist = $ ('#chatLineHolder . chat-' +params.id);

        if(exist.length){
            exist.remove();
        }

        if(!chat.data.lastID){
            $('#chatLineHolder p').remove();
        }

        if(params.id.toString().charAt(0)!='t'){
            var previous = $('#chatLineHolder .chat-'+(params.id-1));
            if(previous.length){
                previous.after(markup)
            }
            else chat.data.jspAPI.getContentPane().append(markup);
        }
        else chat.data.jspAPI.getContentPane().append(markup);

        chat.data.jspAPI.reinitialise();
        chat.data.jspAPI.scrollToBottom(true);
    }
}