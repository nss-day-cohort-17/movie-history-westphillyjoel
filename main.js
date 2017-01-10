// buttons or links
let movieSearchLink = $("#search-your-movies");
let findMoviesLink = $("#find-new-movies");

// divs to hide or show


///////////////////////////
///   Event Listeners   ///
///////////////////////////
movieSearchLink.click(function(event) {
    console.log('clicked id=movieSearchLink')
    event.preventDefault();
    findMoviesLink.addClass("hidden");

    movieSearchLink.addClass("visible");
    movieSearchLink.removeClass("hidden");
});
