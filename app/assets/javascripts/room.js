var ready = function() {

	// Search for a specified string.
	var search = function() {
	  var q = $('#query').val();
	  var request = gapi.client.youtube.search.list({
	    q: q,
	    part: 'snippet',
	    type: 'video'
	  });

	  request.execute(function(response) {
	  	$("#search-pane").empty();
	  	var items = response.result.items;
	  	var data = {}
	  	for (var r in items) {
	  		data["youtube-"+items[r].id.videoId] = {
	  			title: items[r].snippet.title,
	  			thumbnail: items[r].snippet.thumbnails.default.url
	  		}
	  	}
	  	$.get("/template", {data: data}, function(data) {
	  		$("#search-pane").html(data);
	  	});
	  });
	}

	$("#search-button").click(search);
	$("#query").keyup(function(e) {
		if (e.keyCode == 13) {
			$("#search-button").click();
		}
	});

	var poll = function() {
		$.get(location.pathname + ".json", function(data) {
			console.log(data);
			// read cookie
		});
	}

	// setInterval(poll, 10000);

	$(document).on('click', '.btn-add', function() {
		var id = $(this).attr('data-id');
		$.get(location.pathname + '/add/' + id, function(data) {

		});
	});
}


$(document).ready(ready);