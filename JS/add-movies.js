/////////////////////////////
/////    add movies     /////
/////////////////////////////

///// add SEARCHED movies to the page
function addNewSearchedMovies(moviesList) {
  // Clear Movie Div
  $('.foundMovies').empty()

  var movieArray = moviesList; // was moviesList.Searched

  // Loop over searched movies and add them to the DOM
  for (var i = 0; i < movieArray.length; i++) {
    if (i % 3 === 0) {
      $('.foundMovies').append(`<div class="row">`)
    }
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

///// add WATCHED movies to the page
function addWatchedMoviesToPage(watchedMovies){
  // clear watched movies div
  $('#userWatchedMovies').empty()

  var i = 0;

  //loop over watched movies
  for (key in watchedMovies) {
    // grab div that will show Watched movies
    if (i % 3 === 0) {
      $('#userWatchedMovies').append(`<div class="row">`)
    }
    $('#userWatchedMovies').append(`  <div class="col-sm-4">

                                      <!--Card-->
                                      <div class="card card-cascade narrower">

                                      <!--Card image-->
                                      <div class="view overlay hm-white-slight">
                                        <a class='delete-movie-button fa fa-trash-o fa-2x'></a>
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
    } else if (i === (watchedMovies.length - 1)) {
      $('#userWatchedMovies').append(`</div>`)
    }
    i++
  }
  // reset i
  i = 0;
}


///// add UNWATCHED movies to the page
function addUnwatchedMoviesToPage(unwatchedMovies) {
  // clear watched movies div
  $('#userUnwatchedMovies').empty()
  console.log('function addUnwatchedMoviesToPage runs')

  //loop over watched movies
  for (key in unwatchedMovies) {
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

///// REMOVE movies from users list
function removeMovieFromList(deleteThisMovie) {
  console.log("removeMovieFromList function called")

  // Make sure the clicked target is passed to the delete function
  console.log("deleteThisMovie", deleteThisMovie)

  // store the key of the clicked movie
  var deleteThisMovieKey = $(deleteThisMovie).attr('id')
  console.log("deleteThisMovieKey", deleteThisMovieKey)


  // check if selected movie is in unwatched list or watched list

  // if movie is in unwatched-movie class list
  if ($(deleteThisMovie).hasClass('unwatched-movie')) {
    $(deleteThisMovie).addClass('animated zoomOutUp')
    $.ajax({
      url: 'https://west-philly-joel-movie-history.firebaseio.com/unwatchedMoviesList/.json',
      type: 'DELETE',
      success: function(result) {
          alert("Movie sent to trash");

      }
   });
  }

    // delet movie from users unwatched list on firebase

  // if movie card has watched-movie class
  if ($(deleteThisMovie).hasClass('watched-movie')) {
    $(deleteThisMovie).addClass('animated zoomOutUp')
    $.ajax({
      url: 'https://west-philly-joel-movie-history.firebaseio.com/unwatchedMoviesList/.json',
      type: 'DELETE',
      success: function(result) {

          alert("Movie sent to trash!");

      }
   });
  }

    //delete movie from users watched list on firebase


    // the code below is what I was working on on friday

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

}
