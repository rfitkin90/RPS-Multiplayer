$(document).ready(function () {

    // firebase config
    var config = {
        apiKey: "AIzaSyCufwmr74IKdNKKlUISG3yCHBaESHf6QTk",
        authDomain: "rps-multiplayer-c8da7.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-c8da7.firebaseio.com",
        projectId: "rps-multiplayer-c8da7",
        storageBucket: "rps-multiplayer-c8da7.appspot.com",
        messagingSenderId: "81500581625"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    // declare user variables
    var user1;
    var user2;
    var playingAs = "notPlaying";

    // get current user data from database
    database.ref().on('value', function (snap) {
        console.log(snap.val());
        user1 = {
            connected: snap.val().user1.connected,
            name: snap.val().user1.name,
        };
        user2 = {
            connected: snap.val().user2.connected,
            name: snap.val().user2.name,
        };
    });

    // player joins game
    $(document).on('click', '#btn-enter-name', function (e) {
        e.preventDefault();
        // join the first available seat
        if (user1.connected === false && playingAs === 'notPlaying') {
            joinGame(user1.connected, user1.name, 'user1');
        } else if (user2.connected === false && playingAs === 'notPlaying') {
            joinGame(user2.connected, user2.name, 'user2');
        } else {
            alert('Game is full.');
        }

        function joinGame(userConnected, userName, userSlot) {
            // update local variables
            userConnected = true;
            userName = $('#form-enter-name').val().trim();
            playingAs = userSlot;
            // update database
            database.ref(userSlot).set({
                connected: true,
                name: userName,
            });
            // clear form
            $('#form-enter-name').val('');
        }
    });

    // player leaves game
    database.ref(playingAs).onDisconnect().update({
        connected: false,
        name: null,
    });

});

/*
var adaNameRef = firebase.database().ref('users/ada/name');
adaNameRef.child('first').set('Ada');
adaNameRef.child('last').set('Lovelace');

var ref = firebase.database().ref("users/ada");
ref.update({
   onlineState: true,
   status: "I'm online."
});
ref.onDisconnect().update({
  onlineState: false,
  status: "I'm offline."
});

*/