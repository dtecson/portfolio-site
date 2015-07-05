// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

$(document)
	.foundation()
	.ready(function(){
		$who = $('#i-am'),
		$text = $( '#whoAmI' ),
		delay = 8; //seconds

		function loop ( delay ) {
			$.each( whoIam, function ( i, elm ){
				$who.delay(delay*1E3).fadeOut();
				$who.queue(function(){
					$text.html( whoIam[i] );
					$who.dequeue();
				});
				$who.fadeIn();
				$who.queue(function(){
					if(i == whoIam.length-1){
						loop(delay);
					}
					$who.dequeue();
				});
			});
		}

		//loads all the portfolio data on the page
		function loadPortfolioCards(ulEl, cards){

			$.each(cards, function(i){
				var li = $('<li/>')
					.addClass('grid__item')
					.attr('href', '#')
					.attr('data-portfolio', cards[i].file)
					.appendTo(ulEl);
				var figure = $('<figure/>')
					.addClass('card')
					.appendTo(li);
				var div = $('<div/>').appendTo(figure);
				var img = $('<img/>')
					.attr('src', portfolioImagePath + cards[i].project + cards[i].img)
					.appendTo(div);
				var figcaption = $('<figcaption/>').appendTo(figure);
				var title = $('<h4/>')
					.addClass('title title--preview')
					.html(cards[i].name)
					.appendTo(figcaption);
				var span = $('<span/>')
					.addClass('category')
					.appendTo(figcaption);
				var involveList = $('<ul/>')
					.addClass('involve-list')
					.appendTo(span);
					var myInvolvement = cards[i].involvement;
					$.each(myInvolvement, function(cat){
						$('<li/>')
							.html(myInvolvement[cat])
							.appendTo(involveList);
					});

				var loader = $('<div/>')
					.addClass('loader')
					.appendTo(figcaption);
			});
		}

		$('.summary').readmore({
			collapsedHeight: 45,
			blockCSS:'font-size:.75rem; color:#193441; float:right',
			moreLink: '<a href="#">read more</a>',
			lessLink: '<a href="#">close</a>'
		});

		loop(delay);

		loadPortfolioCards('#portfolio-grid', portfolioCards);


	});