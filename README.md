# Realtime-chat-user-interface
## User interface app with real-time chat. (ExpressJS, MongoDB, SocketIO, Foundation)

This seed provide a set of multi-level administration, users administration and real-time chat for administrators.
Foundation (Zurb) has been used to provide a convenient UI.

#### Root access
When the server start it create automatically the root user:
 - username: root  
 - firstname: root  
 - lastname: root  
 - password: root  
 - status: 3  

This code is written in '/database/config .js' if you would like to modify or delete it.


#### Site map
<table>
    <thead>
        <tr>
            <th>URL</th>
            <th>Status access</th>
            <th>Info</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/</td>
            <td>null</td>
            <td>Home</td>
        </tr>
        
        <tr>
            <td>/login</td>
            <td>null</td>
            <td>Login</td>
        </tr>
        <tr>
            <td>/login/out</td>
            <td>1</td>
            <td>Logout</td>
        </tr>
        
        <tr>
            <td>/profile</td>
            <td>1</td>
            <td>Show profile</td>
        </tr>
        <tr>
            <td>/profile/edit</td>
            <td>1</td>
            <td>Edit profile</td>
        </tr>
        <tr>
            <td>/profile/avatar</td>
            <td>1</td>
            <td>Edit avatar</td>
        </tr>
        
        <tr>
            <td>/user</td>
            <td>3</td>
            <td>Show users</td>
        </tr>
        <tr>
            <td>/user/create</td>
            <td>3</td>
            <td>Create user</td>
        </tr>
        <tr>
            <td>/user/id/:id</td>
            <td>3</td>
            <td>Show user</td>
        </tr>
        <tr>
            <td>/user/id/:id/edit</td>
            <td>3</td>
            <td>Edit user</td>
        </tr>
        
        <tr>
            <td>/chat</td>
            <td>3</td>
            <td>Chat</td>
        </tr>
    </tbody>
</table>
 
  
#### Database schema:
  - users  
  - user-images  
  - user-session  
  - passwords  
  - chat-messages  


#### Directory schema:
  /bin  
  _ www .js
  /database  
  _ _ /models  
  _ _ _ _ chat-message .js  
  _ _ _ _ password .js   
  _ _ _ _ user .js  
  _ _ _ _ user-image .js  
  _ _ _ _ user-session .js  
   _ _ config .js  
  /node_modules  
  /public  
  _ _ /bower_components  
  _ _ /default  
  _ _ _ _ avatar.png  
  _ _ /font  
  _ _ /partials  
  _ _ /scripts  
  _ _ _ _ chat .js  
  _ _ _ _ foundation-setup .js  
  _ _ /styles  
  _ _ _ _ font-face .css  
  _ _ _ _ style .css  
  _ _ /uploads  
  _ _ _ _ /avatars  
  /routes  
  _ _ /api  
  _ _ chat .js  
  _ _ index .js  
  _ _ login .js  
  _ _ post .js  
  _ _ profile .js  
  _ _ session .js  
  _ _ upload .js  
  _ _ user .js  
  /views  
  _ _ /chat  
  _ _ _ _ user .jade  
  _ _ /login  
  _ _ _ _ index .jade  
  _ _ /profile  
  _ _ _ _ avatar .jade  
  _ _ _ _ edit .jade  
  _ _ _ _ index .jade  
  _ _ /user  
  _ _ _ _ create .jade  
  _ _ _ _ edit .jade  
  _ _ _ _ index .jade  
  _ _ _ _ show .jade  
  _ _ big-title .jade  
  _ _ error .jade  
  _ _ header .jade  
  _ _ index .jade  
  _ _ layout .jade  
  .bowerrc  
  app.js  
  bower.json  
  package.json  

