////////////////////////////////////////
///   Store Commonly Used Elements   ///
////////////////////////////////////////

// buttons or links from navbar
let searchYourMoviesButton = $("#search-your-movies");
let findNewMoviesButton = $("#find-new-movies");

// divs to hide or show
let userMoviesView = $("#userMovies");
let newMoviesView = $("#findNewMovies");
let loginView = $('.login-page');

// links from user watch or unwatched movies tab selection
let unwatchedMoviesTab = $("#unwatchedTab");
let watchedMoviesTab = $("#watchedTab")

// div to hide or show users watched or unwatched movies
let watchedMoviesDiv = $("#userWatchedMovies");
let unwatchedMoviesDiv = $("#userUnwatchedMovies");

//////////////////////
/////    XHR     /////
//////////////////////

let storeSearchedMoviesPromise;
let storedSearchedMovies;

// Promise Factory for Movies
function requestMovieInfo(url){
  return new Promise (function(resolve, reject){
    let xhr = new XMLHttpRequest()
    xhr.addEventListener('load', function(event){
      if (event.target.status < 400) {
        resolve(JSON.parse(event.target.responseText))
      } else {
        reject(event.target.status)
      }
    })
    xhr.addEventListener('error', reject)
    xhr.open('GET', url)
    xhr.send()
  })
}

///////////////////////////
///   Event Listeners   ///
///////////////////////////

///// function to add event listeners to changing divs
function changeView (button1, button2, view1, view2, view3) {
  button2.click(function(e) {
    e.preventDefault();

    if (firebase.auth().currentUser !== null) {
      button1.removeClass('active');
      button2.addClass('active');

      view1.addClass("hidden");
      view2.addClass("hidden");
      view3.removeClass("hidden");
    }
  })
}
// when 'search your movies' is clicked show the users movie views
changeView(findNewMoviesButton, searchYourMoviesButton, loginView, newMoviesView, userMoviesView)
// when 'find new movies' link is clicked show the search bar in new movies div
changeView(searchYourMoviesButton, findNewMoviesButton, loginView, userMoviesView, newMoviesView)

// when 'show watched' tab is clicked show the users watched movies and hide unwatched movies
watchedMoviesTab.click(function(event) {
  event.preventDefault();

  if (firebase.auth().currentUser !== null) {
    //logged in
    watchedMoviesTab.addClass('activeWatch');
    unwatchedMoviesTab.removeClass('activeWatch');

    loginView.addClass("hidden");
    watchedMoviesDiv.removeClass('hidden');
    unwatchedMoviesDiv.addClass('hidden');
  }
})

// when 'show unwatched' tab is clicked show the users unwatched movies and hide users watched movies
unwatchedMoviesTab.click(function(event) {
  event.preventDefault();

  if (firebase.auth().currentUser !== null) {
    //logged in
    watchedMoviesTab.removeClass('activeWatch');
    unwatchedMoviesTab.addClass('activeWatch');

    loginView.addClass("hidden");
    watchedMoviesDiv.addClass('hidden');
    unwatchedMoviesDiv.removeClass('hidden');
  }
})


// when search button clicked, getting searched movies and adding to DOM
$('#searchMovies--button').click(function(event){
    event.preventDefault()

    // store search query
    var searchQuery = $('#searchMovies--input-field').val()

    // Promise for searching for new movies
    storeSearchedMoviesPromise = requestMovieInfo('http://www.omdbapi.com/?s=' + searchQuery)
      .then(function(movieValue){
        storedSearchedMovies = movieValue;
        addNewSearchedMovies(storedSearchedMovies.Search) // was just storedSearchedMovies
    })
})


// when enter key pressed, SEARCH new movies
$('#searchMovies--input-field').on('keydown', function(event){
  if (event.keyCode === 13) {
    var searchQuery = $('#searchMovies--input-field').val();

    // Promise for searching for new movies
    storeSearchedMoviesPromise = requestMovieInfo('http://www.omdbapi.com/?s=' + searchQuery)
      .then(function(movieValue){
        storedSearchedMovies = movieValue;
        addNewSearchedMovies(storedSearchedMovies.Search) // was just storedSearchedMovies
      })
  }
})

// when WATCHED movies tab clicked, add movies to DOM
watchedMoviesTab.click(function(event){
  let watchedMoviePromise = new Promise(function(resolve, reject){
    let uid = firebase.auth().currentUser.uid;
    var request = new XMLHttpRequest()
    request.addEventListener('load', function(event){
      if (event.target.status < 400) {
        resolve(JSON.parse(event.target.responseText))
      } else {
        reject(event.target.status)
      }
    });
    request.addEventListener('error', reject);
    request.open('GET', `https://west-philly-joel-movie-history.firebaseio.com/${uid}/watchedMoviesList.json`);
    request.send();
  });
  watchedMoviePromise.then(function(watchedMoviesList){
    addWatchedMoviesToPage(watchedMoviesList)
  })
})

// when UNWATCHED movies tab clicked, add movies to DOM
unwatchedMoviesTab.click(function(event) {
  console.log("Unwatched Tab Button Clicked")

  let unwatchedMoviePromise = new Promise(function(resolve, reject){

    var request = new XMLHttpRequest()
    request.addEventListener('load', function(event){
      if (event.target.status < 400) {
        resolve(JSON.parse(event.target.responseText))
      } else {
        reject(event.target.status)
      }
    })
    request.addEventListener('error', reject);
    let uid = firebase.auth().currentUser.uid;
    console.log('uid', uid);
    request.open('GET', `https://west-philly-joel-movie-history.firebaseio.com/${uid}/unwatchedMoviesList.json`);
    request.send();
  })

  unwatchedMoviePromise.then(function(unwatchedMoviesList){
    console.log(unwatchedMoviesList)
    addUnwatchedMoviesToPage(unwatchedMoviesList)
  })
})

// ADD movies to UNWATCHED list
$('body').on("click", '#add-movie-to-unwatched-list', function(event){
  var target = $('event.target');

  var movieTitle = event.target.parentElement.parentElement.getElementsByClassName('card-title')[0].innerText
  var movieYear = event.target.parentElement.parentElement.getElementsByClassName('card-text')[0].innerText

  // get selected movies info
  var selectedMoviePromise = requestMovieInfo('http://www.omdbapi.com/?t=' + movieTitle + "&y=" + movieYear)
  selectedMoviePromise.then(function(movie){
    // add movie info to firebase database unwatched list
    var request = new XMLHttpRequest()
    let uid = firebase.auth().currentUser.uid;
    request.open('POST', `https://west-philly-joel-movie-history.firebaseio.com/${uid}/unwatchedMoviesList.json`)
    request.send(JSON.stringify(movie))
  })
})

// ADD movies to the watched list
$('body').on("click", '#add-to-watched-movies-link', function(event){
  var target = $('event.target') // JQUERY SUCKS

  var movieTitle = event.target.parentElement.parentElement.getElementsByClassName('card-title')[0].innerText
  var movieYear = event.target.parentElement.parentElement.getElementsByClassName('card-text')[0].innerText

  // get selected movies info
  var selectedMoviePromise = requestMovieInfo('http://www.omdbapi.com/?t=' + movieTitle + "&y=" + movieYear)
  selectedMoviePromise.then(function(movie){
    console.log(movie)

    // send movie to the watched list
    // add movie info to firebase database
    var request = new XMLHttpRequest()
    let uid = firebase.auth().currentUser.uid;
    request.open('POST', `https://west-philly-joel-movie-history.firebaseio.com/${uid}/watchedMoviesList.json`)
    request.send(JSON.stringify(movie))
  })

})

// Delete Button (trash can image) event listener
$('body').on("click", '.delete-movie-button', function(event){
  console.log("Delete button clicked - Trash can Image")

  // Get the selected movies div - so we can delete from the right list
  var selectedMovieToDelete = event.target.parentElement.parentElement.parentElement

 removeMovieFromList(selectedMovieToDelete)
})


///////////////////////////////
////    Stars Ratings     /////
///////////////////////////////
$(document).ready(function(){

  /* 1. Visualizing things on Hover - See next part for action on click */
  $('#stars li').on('mouseover', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

    // Now highlight all the stars that's not after the current hovered star
    $(this).parent().children('li.star').each(function(e){
      if (e < onStar) {
        $(this).addClass('hover');
      }
      else {
        $(this).removeClass('hover');
      }
    });

  }).on('mouseout', function(){
    $(this).parent().children('li.star').each(function(e){
      $(this).removeClass('hover');
    });
  });


  /* 2. Action to perform on click */
  $('#stars li').on('click', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently selected
    var stars = $(this).parent().children('li.star');
    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }
  });
});


function responseMessage(msg) {
  $('.success-box').fadeIn(200);
  $('.success-box div.text-message').html("<span>" + msg + "</span>");
}
