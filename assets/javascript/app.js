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



    // check database for seat availability
    database.ref('/seatStatus/').on('value', function (snap) {
        // set database values to local variables
        seatStatus = {
            player1: snap.val().player1,
            player2: snap.val().player2,
        }
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
        if (seatStatus.player1 === true && seatStatus.player2 === true && seatOccupied !== 'spectator') {
            
        }
    });

    // check database for player name info
    database.ref('/playerNames/').on('value', function (snap) {
        playerNames = {
            player1: snap.val().player1,
            player2: snap.val().player2,
        }
        $('#player-1-name').text(playerNames.player1);
        $('#player-2-name').text(playerNames.player2);
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
    });



    // join game in seat 1
    $(document).on('click', '#join-1-btn', function (e) {
        e.preventDefault();
        $('#player-1-name').text(userName);
        $('#player-2-btn-div').empty();
        seatOccupied = 'player1';
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





});