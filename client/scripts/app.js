var app = {
  init() {
    app.autoRefresh();
    app.handleUsernameClick();
    app.handleSubmit();
  },

  server: 'http://127.0.0.1:3000/classes/messages',

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      // data: {
      //   limit: 30,
      //   order: '-createdAt',
      // },
      success: function (data) {
        app.messages = data.results;
        app.renderMessage();        
        console.log('chatterbox: Fetched new messages');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },

  messages: {},

  rooms: {},

  currentRoom: 'All messages',

  addRooms: function(room) {
    if (!app.rooms[room]) {
      app.rooms[room] = room;
      var $newRoom = '<option value="' + room + '">' + room + '</option>';
      $('#selectRoom').append($newRoom);
      app.selectRoom();
    }
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function() {
    app.clearMessages();

    var postmessage = function(message) {
      var $text = '<div id="text">' + message.text.replace(/[^a-z]/gi, ' ') + '</div>';
      var $createdAt = '<div id="createdAt">' + message.createdAt + '</div>';
      var $username = '<a  href="#" id="username">' + message.username + '</a>';
      var $message = '<div id="message">' + $username + $text + $createdAt + '</div>';
      $('#chats').append($message);
      if (message.roomname) {
        app.addRooms(message.roomname);          
      }
    };    

    app.messages.forEach(function(message) {
      if (typeof message.text === 'string' && app.currentRoom === 'All messages') {
        postmessage(message);
      } else if (typeof message.text === 'string' && message.roomname === app.currentRoom) {
        postmessage(message);
      }      
    });
  },

  selectRoom: function() {
    $('#selectRoom').change(function(event) {
      event.stopPropagation();
      app.currentRoom = $('#selectRoom :selected').text();
      if (app.currentRoom !== 'New room...') {
        app.renderMessage();
      } //else { app.createRoom(); }
    });
  },

  createRoom: function() {
    var newRoom = prompt('Please enter a room name', '');
    app.addRooms(newRoom);
    app.currentRoom = newRoom;
    $('selectRoom').val(newRoom);
  },

  handleUsernameClick: function() {
    $(document).on('click', '#username', function(event) {
      $(this).toggleClass('befriend');
    });
  },
  handleSubmit: function() {
    $(document).on('click', '#send', function() {
      var username = window.location.search.split('=');
      var message = {
        username: username.pop(),
        text: $('#messageBox').val(),
        roomname: $('#selectRoom :selected').text(),
      };
      app.send(message);
    }); 
  },
  autoRefresh: function() {
    app.fetch();
    setTimeout(this.autoRefresh.bind(this), 10000);
  }
};



// Dropdown Button Script

// var myFunction = function() {
//   document.getElementById('myDropdown').classList.toggle('show');
// };

// var filterFunction = function() {
//   var input, filter, ul, li, a, i;
//   input = document.getElementById('myInput');
//   filter = input.value.toUpperCase();
//   div = document.getElementById('myDropdown');
//   a = div.getElementsByTagName('a');
//   for (i = 0; i < a.length; i++) {
//     if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
//       a[i].style.display = '';
//     } else {
//       a[i].style.display = 'none';
//     }
//   }
// };

$(document).ready(app.init());
















