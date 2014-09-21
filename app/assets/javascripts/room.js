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

	$(document).on('click', '.btn-add', function() {
		var id = $(this).data('id');
		console.log("ADDDD", id);
		$.ajax({
			url: location.pathname + '/add/' + id,
			data: {title: $(this).data('title'), thumbnail: $(this).data('thumbnail')},
			type: "PUT",
			success: function(data) {
				console.log('success');
			}
		});
	});


	$(document).on('click', '.tm-up', function() {
		var ammount;
		var sibling = $($(this).siblings('button')[0]);
		if (sibling.hasClass('btn-info')) {
			ammount = '2';
		} else {
			ammount = '1';
		}
		var button = $(this);
		if (!($(this).hasClass('btn-info'))) {
			$.ajax({
				url: location.pathname + '/' + $(this).attr('data-id') + '/up/' + ammount,
				type: 'PUT',
				success: function(data) {
					if (data) {
						button.addClass('btn-info');
						button.removeClass('btn-default')
						sibling.removeClass('btn-info').addClass('btn-default');
						$(button.siblings('span')[0]).text(data['popularity']);
						console.log('yeahhh');
					}
				}
			});
		}
	});

	$(document).on('click', '.tm-down', function() {
		var ammount;
		var sibling = $($(this).siblings('button')[0]);
		if (sibling.hasClass('btn-info')) {
			ammount = '2';
		} else {
			ammount = '1';
		}
		var button = $(this);
		if (!($(this).hasClass('btn-info'))) {
			$.ajax({
				url: location.pathname + '/' + $(this).attr('data-id') + '/down/' + ammount,
				type: 'PUT',
				success: function(data) {
					if (data) {
						button.addClass('btn-info');
						button.removeClass('btn-default')
						sibling.removeClass('btn-info').addClass('btn-default');
						$(button.siblings('span')[0]).text(data['popularity']);
						console.log('yeahhh');
					}
				}
			});
		}
	});


	var poll = function() {
		$.get(location.pathname + "/queue.json", function(data) {
			$("#queue_col .queue-pane").html(data);
			console.log(data);
			// read cookie
		});
	}

	setInterval(poll, 1000);

	$(document).on('click', '.btn-add', function() {
		var id = $(this).attr('data-id');
		$.get(location.pathname + '/add/' + id, function(data) {

		});
	});
}



$(document).ready(ready);