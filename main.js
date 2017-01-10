// buttons or links
let addLink = $("#link-add");
let addView = $("#add-view");
let addSongButton = $('#addSong');

var listLink = $("#link-list");
var listView = $("#list-view");


///////////////////////////
///   Event Listeners   ///
///////////////////////////
listLink.click(function(event) {
    event.preventDefault();
    addView.addClass("hidden");

    listView.addClass("visible");
    listView.removeClass("hidden");
});


// Change sections
addLink.click(function() {
    //console.log('this was clicked')
    listView.addClass("hidden");
    addView.addClass("visible");
    addView.removeClass("hidden");
});


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

    var movieArray = moviesList;
    console.log(movieArray)

    movieArray = moviesList.Search
    console.log(movieArray)

    // Loop over searched movies and add them to the DOM
    for (var i = 0; i < movieArray.length; i++) {
        console.log(movieArray[i])
        console.log(movieArray[i].Title)


    }
}
