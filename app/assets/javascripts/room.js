var ready = function() {

	var youtube_result_template = function(item) {
		var html = $('\
				<div class="yt_result">\
					<img src="https://i.ytimg.com/vi/qCL5aiK1-7g/default.jpg" class="thumbnail">\
					<p class="">Arcangel - Tremenda Sata</p>\
					<div style="clear: both;"></div>\
				</div>\
			');
		$(html.find("img")[0]).attr("src", item.snippet.thumbnails.default.url);
		$(html.find("p")[0]).text(item.snippet.title);
		return html;
	}

	// Search for a specified string.
	var search = function() {
	  var q = $('#query').val();
	  var request = gapi.client.youtube.search.list({
	    q: q,
	    part: 'snippet'
	  });

	  request.execute(function(response) {
	  	var items = response.result.items;
	  	$("#search-container").empty();
	  	for (var r in items) {
	  		console.log(items[r].snippet.title);
	  		var html = youtube_result_template(items[r]);
	  		$("#search-container").append(html);
	  	}


	    var str = JSON.stringify(response.result, null, 4);
	    // $('#search-container').html('<pre>' + str + '</pre>');
	    $('#response').html('<pre>' + str + '</pre>');
	  });
	}

	$("#search-button").click(search);
	$("#query").keyup(function(e) {
		if (e.keyCode == 13) {
			$("#search-button").click();
		}
	});

	$(document).on('click', '.btn-add', function() {
		var id = $(this).attr('data-id');
		$.get(location.pathname + '/add/' + id, function(data) {

		});
	})

	queue = Queue();

	library = Library();
	library.addSong({"id": 12, "title": "Tremenda Sata", "artist": "Arcangel", "duration":"3:04", "rating": 0});
	library.addSong({"id": 1, "title": "Panamiur", "artist": "Arcangel", "duration":"4:04", "rating": 0});
	library.addSong({"id": 123, "title": "Rocket", "artist": "Hardwell", "duration":"3:14", "rating": 0});

	repaintLibrary(library);
}


function Song() {
	var title = "";

function Library() {
	var songs = {};
	return {
		addSong: function(song) {
			songs[song.id] = song;
		},
		getSongs: function() {
			return songs;
		},
		deleteSong: function(id) {
			delete songs[id];
		}
	}


function Queue() {
	var songs = [];
	return {
		addSong: function(song) {
			for (var i in songs) {
				if (songs[i].rating <= song.rating) {
					break;
				}
			}
			songs.splice(i, 0, song);
		},
		getSong: function() {
			var ratings = [];
			for (var i in songs) {
				ratings.push([songs[i].rating, i]);
			}
			console.log(ratings);
			ratings.sort(function(x) { return x[0]; });
			console.log(ratings);
			var ans = [];
			for (var i in ratings) {
				ans.push(songs[i]);
			}
			return ans;
		}
	}
}

var add_to_queue = function() {
	var id = $(this).data("id");
	library.deleteSong(id);
	repaintLibrary(library);
	// queue.addSong
}

var build_song_html = function(song, column) {
	var s = '\
		<div class="song">\
			<div class="thumbnail active">\
				<p class="position lead text-center">1</p>\
			</div>\
			<p class="title-row"><span class="title"></span> - <small class="artist"></small></p>\
			<div class="action-buttons"></div>\
			<p class="duration text-muted"></p>\
			<div style="clear: both;"></div>\
		</div>';
	var html = $(s);
	$(html.find(".title")[0]).text(song.title);
	$(html.find(".artist")[0]).text(song.artist);
	$(html.find(".duration")[0]).text(song.duration);
	if (column == "library") {
		var button = $('<button class="pull-right btn btn-sm btn-success"><i class="fa fa-plus"></i></button>');
		button.data("id", song.id);
		button.click(add_to_queue);
		$(html.find(".action-buttons")[0]).append(button);
	}
	return html;
}


function repaintQueue(queue) {
	console.log("repainting", queue);
	var songs = queue.getSongs();
	$("#queue_col .song-pane").empty();
	for (var i in songs) {
		var html = build_song_html(songs[i], "queue");
		$(html.find(".position")[0]).text(i);
		$("#queue_col .song-pane").append(html);
	}
}

function repaintLibrary(library) {
	var songs = library.getSongs();
	$("#library_col .song-pane").empty();
	console.log("adsf");
	var pos = 0;
	for (var i in songs) {
		pos += 1;
		console.log(songs[i]);
		var html = build_song_html(songs[i], "library");
		$(html.find(".position")[0]).text(pos);
		$("#library_col .song-pane").append(html);
	}
}


$(document).ready(ready);