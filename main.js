// Testing getting JSON

var storeMovies;


function getMovieJSON(movieURL) {
    return movieSearchRequest.then(JSON.parse)
}

function requestMovieInfo(url){
    return new Promise (function(resolve, reject){
        var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', function(event){
            if (event.target.status < 400) {
                resolve(event.target.responseText)
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

$('#searchButton').click(function(){
    var searchQuery = $('#searchText').val()
    console.log(searchQuery)
    storeMovie = requestMovieInfo('http://www.omdbapi.com/?s=' + searchQuery)
        .then(storeMovies = JSON.parse)
    // storeMovie = getMovieJSON(movieSearchRequest('http://www.omdbapi.com/?s=' + searchQuery))
})
