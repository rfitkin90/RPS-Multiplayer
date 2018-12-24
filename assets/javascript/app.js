$(document).ready(function () {

    // firebase config
    var config = {
        apiKey: "AIzaSyCnIQMlvdKoINPnmhqB6AtAImcqFwUnzMo",
        authDomain: "trainschedules-1c06e.firebaseapp.com",
        databaseURL: "https://trainschedules-1c06e.firebaseio.com",
        projectId: "trainschedules-1c06e",
        storageBucket: "",
        messagingSenderId: "785465134374"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    var provider = new firebase.auth.GoogleAuthProvider();

    var user = firebase.auth().currentUser;
    console.log(user);
    if (user || firebase.auth().getRedirectResult()) {
       // User is signed in.
       firebase.auth().getRedirectResult().then(function (result) {
          console.log(result)

          if (result.credential) {
             // This gives you a Google Access Token. You can use it to access the Google API.
             var token = result.credential.accessToken;
          }
          else {
             var provider = new firebase.auth.GoogleAuthProvider();
             console.log(1)
             firebase.auth().signInWithRedirect(provider);
          }
          // The signed-in user info.
          var user = result.user;
       }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
       });

    } else {
       // No user is signed in.
       console.log("No user signed in.")
    }


    

});