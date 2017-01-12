///////////////////////////////
///      login form     ///////
///////////////////////////////

///// Initialize Firebase
 var config = {
   apiKey: "AIzaSyCRatUf8fnnO_WjxdGQ_erL0ssb2zsvpNw",
   authDomain: "west-philly-joel-movie-history.firebaseapp.com",
   databaseURL: "https://west-philly-joel-movie-history.firebaseio.com",
   storageBucket: "west-philly-joel-movie-history.appspot.com",
   messagingSenderId: "944219691662"
 };
 firebase.initializeApp(config);

///// event listener on authorization change
firebase.auth().onAuthStateChanged(() => {
    if (firebase.auth().currentUser !== null) {
        //logged in
        $('#userMovies').removeClass('hidden');
        $('#findNewMovies').addClass('hidden');
    } else {
        //logged out
        $('.login-page').removeClass('hidden')
        $('#userMovies').addClass('hidden');
        $('#findNewMovies').addClass('hidden');
    }
})

///// sign in
$('.form-signin').submit((e) => {
    e.preventDefault();

    let email = $('input[type="email"]').val();
    let password = $('input[type="password"]').val();

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            // reset the form to empty when you log out
            $('form')[0].reset();
        })
});

///// sign out
$('.main-page > button').click(() =>
    //console.log('clicked')
    firebase.auth().signOut()
);

///// add new user
$('#register').click((e) => {
    e.preventDefault();

    let email = $('input[type="email"]').val();
    let password = $('input[type="password"]').val();
    //console.log('register me');
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            // reset the form to empty when you log out
            $('form')[0].reset();
        });
});
