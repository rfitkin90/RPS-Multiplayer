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
    var loggedIn = false;
    var userName;
    var seatOccupied = 'spectator';
    var seatStatus;
    var playerNames;
    var moveSelected;
    var moveName;



    // generate random username
    var RNG = Math.floor((Math.random() * 9999) + 1);
    if (RNG < 10) {
        userName = `Anonymous000${RNG.toString()}`;
    } else if (RNG < 100) {
        userName = `Anonymous00${RNG.toString()}`;
    } else if (RNG < 1000) {
        userName = `Anonymous0${RNG.toString()}`;
    } else {
        userName = `Anonymous${RNG.toString()}`;
    }
    console.log(userName);

    // generate username color for chat
    var redValue = Math.floor(Math.random() * 255);
    var greenValue = Math.floor(Math.random() * 255);
    var blueValue = Math.floor(Math.random() * 255);
    var userNameColor = `rgb(${redValue}, ${greenValue}, ${blueValue})`;



    // check database for player name info
    database.ref('/playerNames/').on('value', function (snap) {
        playerNames = {
            player1: snap.val().player1,
            player2: snap.val().player2,
        };
        $('#player-1-name').text(playerNames.player1);
        $('#player-2-name').text(playerNames.player2);
    });

    // save player scores from database to local variables
    database.ref('/playerScores/').on('value', function (snap) {
        playerScores = {
            player1: snap.val().player1,
            player2: snap.val().player2,
        };
        $('#player-1-score').text(`Score: ${playerScores.player1}`);
        $('#player-2-score').text(`Score: ${playerScores.player2}`);
    });

    // save move name info from database to local variables
    database.ref('/moveName/').on('value', function (snap) {
        moveName = {
            player1: snap.val().player1,
            player2: snap.val().player2,
        };

        // determine round outcome
        if (moveName.player1 !== 'none' && moveName.player2 !== 'none') {
            // put images in player divs
            $('#player-1-move').html(`<img src="./assets/images/${moveName.player1}.png">`);
            $('#player-2-move').html(`<img src="./assets/images/${moveName.player2}.png">`);
            // generate matchup text and determine winner
            if (moveName.player1 === moveName.player2) {
                $('#winner-text').text('Draw');
            } else if ((moveName.player1 === 'rock' || moveName.player1 === 'paper') &&
                (moveName.player2 === 'rock' || moveName.player2 === 'paper')) {
                $('#matchup-text').text('Paper covers rock');
                if (moveName.player1 === 'paper') {
                    $('#winner-text').text('Player 1 wins');
                    database.ref('/playerScores/').update({ player1: playerScores.player1 + 1 });
                } else if (moveName.player2 === 'paper') {
                    $('#winner-text').text('Player 2 wins');
                    database.ref('/playerScores/').update({ player2: playerScores.player2 + 1 });
                }
            } else if ((moveName.player1 === 'paper' || moveName.player1 === 'scissors') &&
                (moveName.player2 === 'paper' || moveName.player2 === 'scissors')) {
                $('#matchup-text').text('Scissors cut paper');
                if (moveName.player1 === 'scissors') {
                    $('#winner-text').text('Player 1 wins');
                    database.ref('/playerScores/').update({ player1: playerScores.player1 + 1 });
                } else if (moveName.player2 === 'scissors') {
                    $('#winner-text').text('Player 2 wins');
                    database.ref('/playerScores/').update({ player2: playerScores.player2 + 1 });
                }
            } else if ((moveName.player1 === 'scissors' || moveName.player1 === 'rock') &&
                (moveName.player2 === 'scissors' || moveName.player2 === 'rock')) {
                $('#matchup-text').text('Rock crushes scissors');
                if (moveName.player1 === 'rock') {
                    $('#winner-text').text('Player 1 wins');
                    database.ref('/playerScores/').update({ player1: playerScores.player1 + 1 });
                } else if (moveName.player2 === 'rock') {
                    $('#winner-text').text('Player 2 wins');
                    database.ref('/playerScores/').update({ player2: playerScores.player2 + 1 });
                }
            }
            // next round setup
            $('#next-round-text').text('Next round in 3...');
            setTimeout(function () { $('#next-round-text').text('Next round in 2...') }, 1000);
            setTimeout(function () { $('#next-round-text').text('Next round in 1...') }, 2000);
            setTimeout(function () {
                database.ref('/moveName/').update({ player1: 'none', player2: 'none' });
                $('#next-round-text').text('');
                $('#player-1-move').empty();
                $('#player-2-move').empty();
                $('#matchup-text').text('');
                $('#winner-text').text('');
            }, 3000);
        }
    });

    // save move selected info from database to local variables
    database.ref('/moveSelected/').on('value', function (snap) {
        moveSelected = {
            player1: snap.val().player1,
            player2: snap.val().player2,
        };
    });

    // check database for seat availability
    database.ref('/seatStatus/').on('value', function (snap) {
        // set database values to local variables
        seatStatus = {
            player1: snap.val().player1,
            player2: snap.val().player2,
        };
        // seat 1
        if (seatOccupied === 'player1') {
            $('#player-1-btn-div').html(`<button class="btn btn-primary" id="leave-1-btn">Leave Game</button>`);
        } else if (seatStatus.player1 === false && seatOccupied === 'spectator') {
            $('#player-1-btn-div').html(`<button class="btn btn-primary" id="join-1-btn">Join Game</button>`);
        } else {
            $('#player-1-btn-div').empty();
        }
        // seat 2
        if (seatOccupied === 'player2') {
            $('#player-2-btn-div').html(`<button class="btn btn-primary" id="leave-2-btn">Leave Game</button>`);
        } else if (seatStatus.player2 === false && seatOccupied === 'spectator') {
            $('#player-2-btn-div').html(`<button class="btn btn-primary" id="join-2-btn">Join Game</button>`);
        } else {
            $('#player-2-btn-div').empty();
        }

        // start game if both seats are occupied
        // stuff that happens for everyone
        if (seatStatus.player1 === true && seatStatus.player2 === true) {
            $('#player-1-score').css('visibility', 'visible');
            $('#player-2-score').css('visibility', 'visible');
            database.ref('/playerScores/').set({ player1: 0, player2: 0 });
            database.ref('/moveSelected/').set({ player1: false, player2: false });
            database.ref('/moveName/').set({ player1: 'none', player2: 'none' });
        }

        // stuff that happens if you're one of the 2 players
        if (seatStatus.player1 === true && seatStatus.player2 === true && seatOccupied !== 'spectator') {
            $('#move-selection').css('visibility', 'visible');

        }

        // end game if a player leaves a seat
        if (seatStatus.player1 === false || seatStatus.player2 === false) {
            $('#player-1-score').css('visibility', 'hidden');
            $('#player-2-score').css('visibility', 'hidden');
            $('#player-1-move').empty();
            $('#player-1-move').empty();
            $('#move-selection').css('visibility', 'hidden');
            // reset game
            database.ref('/moveSelected/').set({ player1: false, player2: false });
            database.ref('/moveName/').update({ player1: 'none', player2: 'none' });
            database.ref('/playerScores/').set({ player1: 0, player2: 0 });
            $('#next-round-text').text('');
            $('#matchup-text').text('');
            $('#winner-text').text('');
        }

    });



    // user selects move
    $(document).on('click', '.move-btn', function () {
        if (seatOccupied === 'player1' && moveName.player1 === 'none') {
            database.ref('/moveSelected/').update({ player1: true });
            database.ref('/moveName/').update({ player1: $(this).attr('data-move') });
            if (moveName.player2 === 'none') {
                $('#matchup-text').text(`Waiting for player 2's selection`);
            }
        } else if (seatOccupied === 'player2' && moveName.player2 === 'none') {
            database.ref('/moveSelected/').update({ player2: true });
            database.ref('/moveName/').update({ player2: $(this).attr('data-move') });
            if (moveName.player1 === 'none') {
                $('#matchup-text').text(`Waiting for player 1's selection`);
            }
        }
    });



    // enter username
    $(document).on('click', '#enter-name-btn', function (e) {
        e.preventDefault();
        userName = $('#enter-name-input').val().trim();
        loggedIn = true;
        $('#enter-name-input').val('');
        $('#enter-name-form').hide();
        console.log(userName);
        if (seatOccupied === 'player1') {
            database.ref('playerNames/player1').set(userName);
        } else if (seatOccupied === 'player2') {
            database.ref('playerNames/player2').set(userName);
        }
        $('#send-message-input').focus();
    });



    // join game in seat 1
    $(document).on('click', '#join-1-btn', function (e) {
        e.preventDefault();
        $('#player-1-name').text(userName);
        $('#player-2-btn-div').empty();
        seatOccupied = 'player1';
        console.log(seatOccupied);
        database.ref(`/playerNames/${seatOccupied}`).onDisconnect().set('Seat Empty');
        database.ref(`/seatStatus/${seatOccupied}`).onDisconnect().set(false);
        $('#player-1-btn-div').html(`<button class="btn btn-primary" id="leave-1-btn">Leave Game</button>`);
        database.ref('seatStatus/player1').set(true);
        database.ref('playerNames/player1').set(userName);
    });
    // join game in seat 2
    $(document).on('click', '#join-2-btn', function (e) {
        e.preventDefault();
        $('#player-2-name').text(userName);
        $('#player-1-btn-div').empty();
        seatOccupied = 'player2';
        console.log(seatOccupied);
        database.ref(`/playerNames/${seatOccupied}`).onDisconnect().set('Seat Empty');
        database.ref(`/seatStatus/${seatOccupied}`).onDisconnect().set(false);
        $('#player-2-btn-div').html(`<button class="btn btn-primary" id="leave-2-btn">Leave Game</button>`);
        database.ref('seatStatus/player2').set(true);
        database.ref('playerNames/player2').set(userName);
    });



    // leave seat 1
    $(document).on('click', '#leave-1-btn', function (e) {
        e.preventDefault();
        database.ref('playerNames/player1').set('Seat Empty');
        database.ref('seatStatus/player1').set(false);
        seatOccupied = 'spectator';
        $('#player-1-btn-div').html(`<button class="btn btn-primary" id="join-1-btn">Join Game</button>`);
        if (seatStatus.player2 === false) {
            $('#player-2-btn-div').html(`<button class="btn btn-primary" id="join-2-btn">Join Game</button>`);
        }
    });
    // leave seat 2
    $(document).on('click', '#leave-2-btn', function (e) {
        e.preventDefault();
        database.ref('playerNames/player2').set('Seat Empty');
        database.ref('seatStatus/player2').set(false);
        seatOccupied = 'spectator';
        $('#player-2-btn-div').html(`<button class="btn btn-primary" id="join-2-btn">Join Game</button>`);
        if (seatStatus.player1 === false) {
            $('#player-1-btn-div').html(`<button class="btn btn-primary" id="join-1-btn">Join Game</button>`);
        }
    });

    // if player disconnects
    // database.ref(`/playerNames/${seatOccupied}`).onDisconnect().set('Seat Empty');
    // database.ref(`/seatStatus/${seatOccupied}`).onDisconnect().set(false);

    // $(document).on('click', '#log-seat', function (e) {
    //     e.preventDefault();
    //     console.log(seatOccupied);
    //     console.log(window.innerHeight - 100);
    // });


    // send chat message
    $(document).on('click', '#send-message-btn', function (e) {
        e.preventDefault();
        database.ref('/lastChatMessage/').set(`<p><span style="font-weight:bold; color:${userNameColor}">
            ${userName}</span><span>: ${$('#send-message-input').val().trim()}</span></p>`);
        $('#send-message-input').val('');
    });

    // append message to chat window
    database.ref('/lastChatMessage/').on('value', function (snap) {
        $('#chat-messages').append(snap.val());
        // $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
        $('#chat-messages').animate({
            scrollTop: $('#chat-messages').get(0).scrollHeight
        }, 0);
    });

    $('#chat-messages').css('height', `${window.innerHeight - 105}px`);

});


/* QUESTIONS

1. How to make onDisconnect() method work so players are kicked from their seat if disconnect w/o leaving it?

2. How to make chat-messages div take up remaining y-axis space between jumbotron and compose-message div(while
    still letting jumbotraon and compose-message div be fixed heights)?

3. How to make chat-messages div automatically scroll to bottom each time a message is sent?
    .scroll() jquery

4. How to make the the last chat message database reference not run on page load?

*/