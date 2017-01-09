// Testing getting JSON

function movieSearchRequest(movieUrl) {
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
        xhr.open('GET', movieUrl)
        xhr.send()
    })

}


function getMovieJSON(movieURL) {
    return movieSearchRequest.then(JSON.parse)
}


// Event listener for search button
