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
}


$(document).ready(ready);