'use strict';

console.log('Multiple Github Statuses extension is enabled.');

var apiurl = 'https://api.github.com/repos' + window.location.pathname.replace('pull', 'pulls');

$.ajax({
  type: 'GET',
  url: apiurl,
  success: function(data){
  	$.ajax({
	  type: 'GET',
	  url: data.statuses_url,
	  success: function(json){
	  	try {
		  	$('.branch-status').css('display', 'block')

			var types = {}, isfailing = false
			json.forEach(function (s) {
				if (types[s.context]) {
					if (new Date(types[s.context].updated_at) > new Date(s.updated_at)) {
						return;
					}
				}
				types[s.context] = s;
			})

			var isfailing = false, issuccess = true;
			Object.keys(types).forEach(function (context) {
				if (types[context].state == 'failure') {
					isfailing = true;
				}
				if (types[context].state != 'success') {
					issuccess = false
				}
			});

			$('.branch-status').removeClass('status-success').removeClass('status-failure').removeClass('status-pending')
			$('.branch-action').removeClass('branch-action-state-clean').removeClass('branch-action-state-unstable').removeClass('branch-action-state-pending')
			if (isfailing) {
				$('.branch-action').addClass('branch-action-state-unstable');
				$('.branch-status').addClass('status-failure');
			} else if (issuccess) {
				$('.branch-action').addClass('branch-action-state-clean');
				$('.branch-status').addClass('status-success');
			} else {
				$('.branch-action').addClass('branch-action-state-unstable');
				$('.branch-status').addClass('status-pending');
			}

			Object.keys(types).forEach(function (context) {
				var status = types[context];

				console.log(status)

				var $span = $('<span class="build-status-description">')
				.append($('<span class="octicon">').addClass('octicon-' + (status.state == 'failure' ? 'x' : status.state == 'success' ? 'check' : 'pending')))
				.append(' ')
				.append($('<strong>').text(status.state == 'failure' ? 'Failed' : status.state == 'success' ? 'All is well' : 'Pending'))
				.append(' — ')
				.append(status.description)
				.append(' ')
				.append($('<span class="divider">·</span>'))
				.append(' ')
				.append($('<a class="branch-status-details">Details</a>').prop('href', status.target_url))
				.appendTo($('.branch-status'))
			});
		} catch (e) {
			console.log(e);
		}
	  },
	  error: function (err) {
	  	console.error('Multiple Github Status failed:', err.response)
	  	$('.branch-status').css('display', 'block')
	  }
	});
  },
  error: function (err) {
  	console.error('Multiple Github Status failed:', err.response)
  	$('.branch-status').css('display', 'block')
  }
})
