'use strict';

window.onload = function() {

    // chat object
    var chat = {
        socket: io.connect('http://localhost:3200', { path: '' }),
        username: document.getElementById("auth-username").value,
        container: document.getElementById("public-chat"),
        messageInput: document.getElementById("message-input"),
        messageButton: document.getElementById("message-button"),
        publicMessage: 'public-message',
        messages: []
    };


    // on message
    chat.socket.on(chat.publicMessage, function (data) {
        // console
        console.log(data);

        // message error
        if(data.message){
            // add message to chat object
            chat.messages.push(data);

            // Display messages
            var messagesHTML = '';
            for(var i=0; i<chat.messages.length; i++) {
                messagesHTML += '<span class="username">'+ chat.messages[i].username +'</span> '+ chat.messages[i].message + '<br />';
            }

            // add messages
            chat.container.innerHTML = messagesHTML;
            //scroll to bottom
            chat.container.scrollTop = chat.container.scrollHeight;
        }
        else {
            console.log("No message.");
        }
    });


    // Send message
    function sendMessage(){
        var text = chat.messageInput.value;
        chat.socket.emit(chat.publicMessage, {
            username: chat.username,
            message: text
        });
        chat.messageInput.value = null;
    }

    // keydown handler
    function keydownHandler(e) {
        // enter key
        if(e.keyCode == 13){
            sendMessage();
        }
    }

    chat.messageButton.onclick = sendMessage;
    document.onkeydown = keydownHandler;
};