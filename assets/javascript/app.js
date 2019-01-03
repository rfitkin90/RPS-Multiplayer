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
    var phase;
    var playerOneScore = 0;
    var playerTwoScore = 0;

    // get current user data from database
    database.ref().on('value', function (snap) {
        console.log(snap.val());
        user1 = {
            connected: snap.val().user1.connected,
            name: snap.val().user1.name,
            move: snap.val().user1.move,
            score: snap.val().user1.score,
        };
        user2 = {
            connected: snap.val().user2.connected,
            name: snap.val().user2.name,
            move: snap.val().user2.move,
            score: snap.val().user2.score,
        };

        // get current phase from database
        phase = snap.val().phase;

        // update player status/name on screen
        if (user1.connected === true) {
            $('#player-1-status').text('Connected');
        } else {
            $('#player-1-status').text('Seat Empty');
        }
        if (user2.connected === true) {
            $('#player-2-status').text('Connected');
        } else {
            $('#player-2-status').text('Seat Empty');
        }
        console.log(user1);
        console.log(user2);
        $('#player-1-name').text(user1.name);
        $('#player-2-name').text(user2.name);

        // get current scores from database
        $('#player-1-score').text(playerOneScore);
        $('#player-2-score').text(playerTwoScore);

        // compare moves
        if (phase === "moveSelection") {
            if ((user1.move === rock && user2.move === scissors) ||
                (user1.move === scissors && user2.move === paper) ||
                (user1.move === paper && user2.move === rock)) {
                phase = "roundTransition";
                $('#player-1-move').text(user1.move);
                $('#player-2-move').text(user2.move);
                $('#winner-result').text('Player 1');
                playerOneScore++;
                $('#player-1-score').text(playerOneScore);
                $('#round-result').css('visibility', 'visible');
                $('#next-round-counter').text('Next round in 3...');
                setTimeout(() => {
                    $('#next-round-counter').text('Next round in 2...');
                    setTimeout(() => {
                        $('#next-round-counter').text('Next round in 1...');
                        setTimeout(() => {
                            $('#round-result').css('visibility', 'hidden');
                            phase = "moveSelection";
                            $('#player-1-move').text('');
                            $('#player-2-move').text('');
                        }, 1000);
                    }, 1000);
                }, 1000);
            }
        }

    });

    // player joins game
    $(document).on('click', '#btn-enter-name', function (e) {
        e.preventDefault();
        // join the first available seat
        if (user1.connected === false && playingAs === 'notPlaying') {
            joinGame(user1.connected, user1.name, 'user1');
            phase = "moveSelection";
            database.ref("phase").set("moveSelection");
        } else if (user2.connected === false && playingAs === 'notPlaying') {
            joinGame(user2.connected, user2.name, 'user2');
            phase = "moveSelection";
            database.ref("phase").set("moveSelection");
        } else if (playingAs === 'user1' || playingAs === 'user2') {
            alert('Already playing.');
        } else {
            alert('Game is full.');
        }

        function joinGame(userConnected, userName, userSlot) {
            // update local variables
            userConnected = true;
            userName = $('#form-enter-name').val().trim();
            console.log(userSlot);
            playingAs = userSlot;
            console.log(playingAs);
            // update database
            database.ref(userSlot).set({
                connected: true,
                name: userName,
            });
            // clear form
            $('#form-enter-name').val('');
        }
    });

    // move selection
    $(document).on('click', '.move-selection', function (e) {
        e.preventDefault();
        if (phase === "moveSelection") {
            if (playingAs === 'user1' && user1.move === null) {
                user1.move = $(this).attr('data-move');
                console.log(user1.move);
                database.ref('user1').update({ move: user1.move });
                $('#player-1-move').text('Chosen');
            } else if (playingAs === 'user2' && user2.move === null) {
                user2.move = $(this).attr('data-move');
                console.log(user2.move);
                database.ref('user2').update({ move: user2.move });
                $('#player-2-move').text('Chosen');
            }
        }
    });



    // player leaves game
    // database.ref(`/${playingAs}`).onDisconnect().update({
    //     connected: false,
    //     name: null,
    // });

    // $(document).on('click', '#btn-console-log', function (e) {
    //     e.preventDefault();
    //     console.log(playingAs);
    //     console.log(phase);
    // });

});