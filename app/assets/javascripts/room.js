function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}


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
		setCookie('vote-'+$(this).data('id'), 1, 10);
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
		setCookie('vote-'+$(this).data('id'), -1, 10);
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
						// $(button.siblings('span')[0]).text(data['popularity']);
					}
				}
			});
		}
	});

	var setUpvotesAndDownvotes = function() {
		var cookies = document.cookie.split(";");
		for (var i in cookies) {
			if (cookies[i].indexOf("vote-") != -1) {
				var v = cookies[i];
				var id = v.split("=")[0].split("vote-")[1];
				v = v.split("=")[1];
				if (v == 1) {
					$(".tm-up[data-id="+id+"]").removeClass("btn-default");
					$(".tm-up[data-id="+id+"]").addClass("btn-success");
				} else if (v == -1) {
					$(".tm-down[data-id="+id+"]").removeClass("btn-default");
					$(".tm-down[data-id="+id+"]").addClass("btn-danger");
				}
			}
		}
	}


	var poll = function() {
		$.get(location.pathname + "/queue.json", function(data) {
			$("#queue_col .queue-pane").html(data);
			// read cookie
			setUpvotesAndDownvotes()
		});
	}

	setInterval(poll, 1000);

	$(document).on('click', '.btn-add', function() {
		var id = $(this).attr('data-id');
		$.get(location.pathname + '/add/' + id, function(data) {

		});
	});

	setUpvotesAndDownvotes();
}



$(document).ready(ready);