// buttons or links from navbar
let movieSearchLink = $("#search-your-movies");
let findMoviesLink = $("#find-new-movies");

// divs to hide or show
let userMoviesView = $("#userMovies");
let newMoviesView = $("#findNewMovies");

// links from watch or unwatched movies tab selection
let unwatchedMoviesTab = $("#unwatchedTab");
let watchedMoviesTab = $("#watchedTab")

// div to hide or show watched or unwatched users movies
let watchedMoviesDiv = $("#userWatchedMovies");
let unwatchedMoviesDiv = $("#userUnwatchedMovies");


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

// when 'find new movies' link is clicked show the search bar in new movies div
findMoviesLink.click(function(event) {
    event.preventDefault();

    movieSearchLink.removeClass('active');
    findMoviesLink.addClass('active');

    userMoviesView.addClass('hidden');
    userMoviesView.removeClass('show');

    newMoviesView.addClass('show');
    newMoviesView.removeClass('hidden');
})

// when 'show watched' tab is clicked show the users watched movies and hide unwatched movies
watchedMoviesTab.click(function(event) {
    event.preventDefault();

    watchedMoviesTab.addClass('activeWatch');
    unwatchedMoviesTab.removeClass('activeWatch');

    watchedMoviesDiv.addClass('show');
    watchedMoviesDiv.removeClass('hidden');

    unwatchedMoviesDiv.addClass('hidden');
    unwatchedMoviesDiv.removeClass('show');
})

// when 'show unwatched' tab is clicked show the users unwatched movies and hide users watched movies
unwatchedMoviesTab.click(function(event) {
    event.preventDefault();

    watchedMoviesTab.removeClass('activeWatch');
    unwatchedMoviesTab.addClass('activeWatch');

    watchedMoviesDiv.addClass('hidden');
    watchedMoviesDiv.removeClass('show');

    unwatchedMoviesDiv.addClass('show');
    unwatchedMoviesDiv.removeClass('hidden');
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
