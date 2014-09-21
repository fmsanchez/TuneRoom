var ready = function() {
<<<<<<< HEAD
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
=======
>>>>>>> 23e76a75d02aa18f089758e9adc5256b65d74a17

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

<<<<<<< HEAD
	$(document).on('click', '.btn-add', function() {
		var id = $(this).attr('data-id');
		$.ajax({
			url: location.pathname + '/add/' + id,
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

}



	var poll = function() {
		$.get(location.pathname + ".json", function(data) {
			console.log(data);
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