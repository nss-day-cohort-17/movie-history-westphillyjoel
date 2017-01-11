// buttons or links
let movieSearchLink = $("#search-your-movies");
let findMoviesLink = $("#find-new-movies");
let unwatchedMoviesTab = $("#unwatchedTab");
let watchedMoviesTab = $("#watchedTab")


// divs to hide or show
let userMoviesView = $("#userMovies");
let newMoviesView = $("#searchNewMovies");


///////////////////////////
///   Event Listeners   ///
///////////////////////////

// when 'search your movies' is clicked show the users movie views
movieSearchLink.click(function(event) {
    event.preventDefault();

    findMoviesLink.removeClass('active');
    movieSearchLink.addClass('active');

    newMoviesView.addClass("hidden");
    newMoviesView.removeClass('show');

    userMoviesView.addClass("show");
    userMoviesView.removeClass("hidden");
});

findMoviesLink.click(function(event) {
    event.preventDefault();

    movieSearchLink.removeClass('active');
    findMoviesLink.addClass('active');

    userMoviesView.addClass('hidden');
    userMoviesView.removeClass('show');

    newMoviesView.addClass('show');
    newMoviesView.removeClass('hidden');
})


/*---------------------*/
// Testing getting JSON
/*---------------------*/

var storeSearchedMoviesPromise;

var storedSearchedMovies;


function getMovieJSON(movieURL) {
    return movieSearchRequest.then(JSON.parse)
}

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


/***************************************/
/******  EVENT LISTENERS      **********/
/***************************************/

// Event listener for search button

$('#searchMovies--button').click(function(event){
    console.log("Search for Movies Button Clicked")
    event.preventDefault()

    var searchQuery = $('#searchMovies--input-field').val()
    console.log(searchQuery)

    // Promise for searching for new movies
    storeSearchedMoviesPromise = requestMovieInfo('http://www.omdbapi.com/?s=' + searchQuery)
        .then(function(movieValue){
            storedSearchedMovies = movieValue;

            addNewSearchedMovies(storedSearchedMovies)
        })
    // storeMovie = getMovieJSON(movieSearchRequest('http://www.omdbapi.com/?s=' + searchQuery))
    // addNewSearchedMovies(storedSearchedMovies)
})


// Event Listener for watchedMoviesTab
$("#watchedTab").click(function(event){
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
    showWatchedMovies(watchedMoviesList)
  })
})




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






/****************************************/
/******   FUNCTIONS       ***************/
/****************************************/


function addNewSearchedMovies(moviesList){
    console.log("addNewSearchedMovies function called")

    // Clear Movie Div
    $('.foundMovies').empty()

    var movieArray = moviesList;
    console.log(movieArray)

    movieArray = moviesList.Search
    console.log(movieArray)

    // Loop over searched movies and add them to the DOM
    for (var i = 0; i < movieArray.length; i++) {
        console.log(movieArray[i])
        console.log(movieArray[i].Title)

        // Grab Div to store Searched Movies
        $('.foundMovies').append(`  <div class="col-md-4">

                                      <!--Card-->
                                      <div class="card card-cascade narrower">

                                      <!--Card image-->
                                      <div class="view overlay hm-white-slight">
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

                                      </div>
                                        <!--/.Card-->
                                        <div id="to-watch">
                                        <a href="">Add to watch list</a>
                                      </div>

                                    </div>`)

    }
}



// Add searched movies to a will watch list on firebase

function addNewToMovieWatchList(){

  // grab add to watch list div
  // $('to-watch').click(
  //   function(event){}
}



// show YOUR Watched movies

function showWatchedMovies(watchedMovies){
  console.log("showWatchedMovies function called")
  console.log("watchedMovies", watchedMovies)
  //loop over watched movies
  for(var i = 0; i < watchedMovies.length; i++){
    console.log("current movie", watchedMovies[i])
    // grab div that will show Watched movies
    $('.watchedMoviesDiv').append(`  <div class="col-md-4">

                                      <!--Card-->
                                      <div class="card card-cascade narrower">

                                      <!--Card image-->
                                      <div class="view overlay hm-white-slight">
                                        <img src="${watchedMovies[i].Poster}" class="img-fluid" alt="">
                                        <a>
                                            <div class="mask"></div>
                                        </a>
                                      </div>
                                      <!--/.Card image-->

                                      <!--Card content-->
                                      <div class="card-block">
                                        <!--Title-->
                                        <h4 class="card-title">${watchedMovies[i].Title}</h4>
                                        <!--Year-->
                                        <p class="card-text">${watchedMovies[i].Year}</p>
                                        <!--Actors-->
                                        <p>Working on this</p>
                                        <!-- Add description? -->
                                      </div>
                                        <!--/.Card content-->

                                      </div>
                                        <!--/.Card-->
                                        <div id="to-watch">
                                        <a href="">Add to watch list</a>
                                      </div>

                                    </div>`)
  }
}


// show YOUR UNwatched movies

function showMoviesNotWatched(){

}
