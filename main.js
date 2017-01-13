////////////////////////////////////////
///   Store Commonly Used Elements   ///
////////////////////////////////////////

// buttons or links from navbar
let movieSearchLink = $("#search-your-movies");
let findMoviesLink = $("#find-new-movies");

// divs to hide or show
let userMoviesView = $("#userMovies");
let newMoviesView = $("#findNewMovies");
let loginView = $('.login-page');

// links from watch or unwatched movies tab selection
let unwatchedMoviesTab = $("#unwatchedTab");
let watchedMoviesTab = $("#watchedTab")

// div to hide or show watched or unwatched users movies
let watchedMoviesDiv = $("#userWatchedMovies");
let unwatchedMoviesDiv = $("#userUnwatchedMovies");

/*----------------------------------*/
// Getting JSON Variables/Functions
/*----------------------------------*/

var storeSearchedMoviesPromise;

var storedSearchedMovies;


// function getMovieJSON(movieURL) {
//     return movieSearchRequest.then(JSON.parse)
// }

// Promise Factory for Movies
function requestMovieInfo(url){
    return new Promise (function(resolve, reject){
        var xhr = new XMLHttpRequest()
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

// when 'search your movies' is clicked show the users movie views
movieSearchLink.click(function(event) {
  event.preventDefault();

  if (firebase.auth().currentUser !== null) {
    //logged in
    findMoviesLink.removeClass('active');
    movieSearchLink.addClass('active');

    loginView.addClass("hidden");
    newMoviesView.addClass("hidden");
    userMoviesView.removeClass("hidden");
  }
});

// when 'find new movies' link is clicked show the search bar in new movies div
findMoviesLink.click(function(event) {
  event.preventDefault();

  if (firebase.auth().currentUser !== null) {
    //logged in
    movieSearchLink.removeClass('active');
    findMoviesLink.addClass('active');

    loginView.addClass("hidden");
    userMoviesView.addClass('hidden');
    newMoviesView.removeClass('hidden');
  }
})

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


// Event listener for search button

$('#searchMovies--button').click(function(event){
    console.log("Search for Movies Button Clicked")
    event.preventDefault()

    // store search query
   var searchQuery = $('#searchMovies--input-field').val()
    console.log(searchQuery)

    // Promise for searching for new movies
    storeSearchedMoviesPromise = requestMovieInfo('http://www.omdbapi.com/?s=' + searchQuery)
        .then(function(movieValue){
            storedSearchedMovies = movieValue;

            console.log("checking storeSearchedMovies", storedSearchedMovies)
            addNewSearchedMovies(storedSearchedMovies.Search) // was just storedSearchedMovies
    })
})


// Event listener on search field with enter key pressed
$('#searchMovies--input-field').on('keydown', function(event){
  if (event.keyCode === 13) {  //checks whether the pressed key is "Enter"
    var searchQuery = $('#searchMovies--input-field').val()
    console.log(searchQuery)

    // Promise for searching for new movies
    storeSearchedMoviesPromise = requestMovieInfo('http://www.omdbapi.com/?s=' + searchQuery)
        .then(function(movieValue){
            storedSearchedMovies = movieValue;

            console.log("checking storeSearchedMovies", storedSearchedMovies)
            addNewSearchedMovies(storedSearchedMovies.Search) // was just storedSearchedMovies
        })
  }
})


// Event Listener for watchedMoviesTab
watchedMoviesTab.click(function(event){
  console.log("Watched Tab Button Clicked")

  let watchedMoviePromise = new Promise(function(resolve, reject){

    var request = new XMLHttpRequest()
    request.addEventListener('load', function(event){
            if (event.target.status < 400) {
                resolve(JSON.parse(event.target.responseText))
            } else {
                reject(event.target.status)
              }
    })
    request.addEventListener('error', reject)
    request.open('GET', 'https://west-philly-joel-movie-history.firebaseio.com/watchedMoviesList.json')
    request.send()
  })

  watchedMoviePromise.then(function(watchedMoviesList){
    console.log(watchedMoviesList)
    addWatchedMoviesToPage(watchedMoviesList)
  })
})


// Event Listener for unwatched Movies tab
unwatchedMoviesTab.click(function(event){
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
    request.addEventListener('error', reject)
    request.open('GET', 'https://west-philly-joel-movie-history.firebaseio.com/unwatchedMoviesList.json')
    request.send()
  })

  unwatchedMoviePromise.then(function(unwatchedMoviesList){
    console.log(unwatchedMoviesList)
    addUnwatchedMoviesToPage(unwatchedMoviesList)
  })
})



// Event listener to add movies to non-watched list
$('body').on("click", '#add-movie-to-unwatched-list', function(event){
  console.log('add movie to unwatched list link clicked')
  //console.log("test", event.target.parentElement.parentElement.getElementsByClassName('card-title')[0].innerText)

  var target = $('event.target') // JQUERY SUCKS

  var movieTitle = event.target.parentElement.parentElement.getElementsByClassName('card-title')[0].innerText
  var movieYear = event.target.parentElement.parentElement.getElementsByClassName('card-text')[0].innerText
  console.log(movieTitle)
  console.log(movieYear)
  //event.preventDefault();

  // get selected movies info
  var selectedMoviePromise = requestMovieInfo('http://www.omdbapi.com/?t=' + movieTitle + "&y=" + movieYear)

  selectedMoviePromise.then(function(movie){
    console.log(movie)

    // send movie to the unwatched list
    //add movie info to firebase database
    var request = new XMLHttpRequest()
    request.open('POST', 'https://west-philly-joel-movie-history.firebaseio.com/unwatchedMoviesList.json')
    request.send(JSON.stringify(movie))
  })

})


// Event listener to add movies to the watched list
$('body').on("click", '#add-to-watched-movies-link', function(event){
  console.log('add-movie-to-watched-movies-link clicked')
  //console.log("test", event.target.parentElement.parentElement.getElementsByClassName('card-title')[0].innerText)

  //

  var target = $('event.target') // JQUERY SUCKS

  var movieTitle = event.target.parentElement.parentElement.getElementsByClassName('card-title')[0].innerText
  var movieYear = event.target.parentElement.parentElement.getElementsByClassName('card-text')[0].innerText
  console.log(movieTitle)
  console.log(movieYear)
  //event.preventDefault();

  // get selected movies info
  var selectedMoviePromise = requestMovieInfo('http://www.omdbapi.com/?t=' + movieTitle + "&y=" + movieYear)

  selectedMoviePromise.then(function(movie){
    console.log(movie)

    // send movie to the watched list
    //add movie info to firebase database
    var request = new XMLHttpRequest()
    request.open('POST', 'https://west-philly-joel-movie-history.firebaseio.com/watchedMoviesList.json')
    request.send(JSON.stringify(movie))
  })

})

// Delete Button(tash can iamge) event listener
$('body').on("click", '.delete-movie-button', function(event){
  console.log("Delete button clicked - Trash can Image")

  // var target = $('event')
  // console.log("target", target.find('.unwatched-movie'))
  // console.log("event target", event.target)
  // console.log("event", event)
  // console.log('find parent unwatchedmovie div', event.target.parentElement.parentElement.parentElement)

  //find out if movie has unwatched or watched class
  var selectedMovie = event.target.parentElement.parentElement.parentElement
  console.log($(selectedMovie))
  console.log($(selectedMovie).hasClass('unwatched-movie'))
  var selectedMovieKey = $(selectedMovie).attr('id')
  console.log("selectedMovieKey", selectedMovieKey)

  // check if selected movie is unwatched or watched

  // if unwatched delete movie from unwatched database
  // if($(selectedMovie).hasClass('unwatched-movie')) {
  //   console.log("deleting unwatched-movie from database")

  //   $.ajax({
  //     url: 'https://west-philly-joel-movie-history.firebaseio.com/unwatchedMoviesList/.json',
  //     type: 'DELETE',
  //     success: function(result) {
  //         // Do something with the result
  //         console.log("movie deleted")

  //     }
  //   });

  // }


  //find out if movie has unwatched or watched class

  //removeMovieFromList()
})

/****************************************/
/******   FUNCTIONS       ***************/
/****************************************/

// Function for adding searched movies to the page

function addNewSearchedMovies(moviesList){
    console.log("addNewSearchedMovies function called")

    // Clear Movie Div
    $('.foundMovies').empty()

    var movieArray = moviesList; // was moviesList.Searched

    // Loop over searched movies and add them to the DOM
    for (var i = 0; i < movieArray.length; i++) {
        // console.log("Is this for loop in addNewSearchedMovies running?")
        // console.log(movieArray[i])
        // console.log(movieArray[i].Title)
        if (i % 3 === 0) {
            $('.foundMovies').append(`<div class="row">`)
        }
        // Grab Div to store Searched Movies
        $('.foundMovies').append(`  <div class="col-sm-4">

                                      <!--Card-->
                                      <div class="card card-cascade narrower">

                                        <!--Card image-->
                                        <div class="view overlay hm-white-slight">
                                          <a class='fa fa-trash-o fa-2x'></a>
                                          <img src="${movieArray[i].Poster}" class="img-fluid" alt="">
                                          <a>
                                          <div class="mask"></div>
                                          </a>
                                        </div>

                                        <!--/.Card image-->

                                        <!--Card content-->
                                        <div class="card-block">
                                          <!--Title-->
                                          <h4 class="card-title">${movieArray[i].Title}</h4>
                                          <!--Year-->
                                          <p class="card-text">${movieArray[i].Year}</p>
                                          <!--Actors-->
                                          <p>Working on this</p>
                                          <!-- Add description? -->
                                         </div>
                                        <!--/.Card content-->

                                      </div><!--/.Card-->

                                      <div id="add-movie-to-unwatched-list">
                                        <a href="#">Add movie to your unwatched list</a>
                                      </div>

                                    </div>`);
        if (i%3 === 2) {
            $('.foundMovies').append(`</div>`)
        } else if (i === (movieArray.length - 1)) {
            $('.foundMovies').append(`</div>`)
        }
    }
}


// function for adding WATCHED movies to the page

function addWatchedMoviesToPage(watchedMovies){
  console.log("addWatchedMoviesToPage function called")
  console.log("watchedMovies", watchedMovies)

  // clear watched movies div
  $('#userWatchedMovies').empty()

  // store current iteration over objects
  var i = 0;
  //var objectSize = Object.keys(watchedMovies).length; // don't need this

  //loop over watched movies
  for(key in watchedMovies){
    console.log("current movie", watchedMovies[key])
    // grab div that will show Watched movies
    if (i % 3 === 0) {
        $('#userWatchedMovies').append(`<div class="row">`)
    }
    $('#userWatchedMovies').append(`  <div class="col-sm-4">

                                      <!--Card-->
                                      <div class="card card-cascade narrower">

                                      <!--Card image-->
                                      <div class="view overlay hm-white-slight">
                                        <a class='fa fa-trash-o fa-2x'></a>
                                        <img src="${watchedMovies[key].Poster}" class="img-fluid" alt="">
                                        <a>
                                            <div class="mask"></div>
                                        </a>
                                      </div>
                                      <!--/.Card image-->

                                      <!--Card content-->
                                      <div class="card-block">
                                        <!--Title-->
                                        <h4 class="card-title">${watchedMovies[key].Title}</h4>
                                        <!--Year-->
                                        <p class="card-text">${watchedMovies[key].Year}</p>
                                        <!--Actors-->
                                        <p>Working on this</p>
                                        <!-- Add description? -->
                                      </div>
                                        <!--/.Card content-->

                                      </div>
                                        <!--/.Card-->
                                        <div id="watched-movie">
                                        <a href="#">What do I do here?</a>
                                      </div>

                                    </div>`);
    if (i%3 === 2) {
        $('#userWatchedMovies').append(`</div>`)
    }
    if (i === (watchedMovies.length - 1)) {
        $('#userWatchedMovies').append(`</div>`)
    }
    i++
  }
  // reset i
  i = 0;
}


// function to add UNWATCHED movies to the page

function addUnwatchedMoviesToPage(unwatchedMovies){
  console.log("addUnwatchedMoviesToPage function called")
  console.log("unwatchedMovies", unwatchedMovies)
  console.log("unwatchedMovies length", unwatchedMovies.length)
  // clear watched movies div
  $('#userUnwatchedMovies').empty()

  //loop over watched movies
  // for(var i = 0; i < Object.keys(unwatchedMovies).length; i++){
  for (key in unwatchedMovies){
    console.log("current movie key?", key)
    // grab div that will show Watched movies

    $('#userUnwatchedMovies').append(`  <div id="${key}" class="unwatched-movie card-holder col-sm-4">

                                      <!--Card-->
                                      <div class="card card-cascade narrower">

                                      <!--Card image-->
                                      <div class="view overlay hm-white-slight">

                                      <a class='delete-movie-button fa fa-trash-o fa-2x'></a>

                                        <img src="${unwatchedMovies[key].Poster}" class="img-fluid" alt="">
                                        <a>
                                            <div class="mask"></div>
                                        </a>
                                      </div>
                                      <!--/.Card image-->

                                      <!--Card content-->
                                      <div class="card-block">
                                        <!--Title-->
                                        <h4 class="card-title">${unwatchedMovies[key].Title}</h4>
                                        <!--Year-->
                                        <p class="card-text">${unwatchedMovies[key].Year}</p>
                                        <!--Actors-->
                                        <p>Working on this</p>
                                        <!-- Add description? -->
                                      </div>
                                        <!--/.Card content-->

                                      </div>
                                        <!--/.Card-->
                                        <div id="add-to-watched-movies-link">
                                        <a href="#">Add movie to your watched list</a>
                                      </div>

                                    </div>`)
  }
}


function removeMovieFromList(){
  console.log("remove movie function called")

  // Find out if movie has an unwatched or watched class

}

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
