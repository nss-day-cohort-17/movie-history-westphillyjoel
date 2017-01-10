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
