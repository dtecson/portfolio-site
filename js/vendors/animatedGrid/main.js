/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
$(document).ready(function () {
	var bodyEl = $('body'),
		docElem = window.document.documentElement,
		gridEl = $('#portfolio-carousel'),
		gridContainer = $('div.grid'),
		contentItemsContainer = $('#portfolio-detail-page'),
		gridItems = $('.grid__item'),
		contentItems = $('.content__item'),
		//closeCtrl = contentItemsContainer.querySelector('.close-button'),
		current = -1,
		currentPortfolio = "testfile",
		lockScroll = false, xscroll, yscroll,
		isAnimating = false;

	/**
	 * gets the viewport width and height
	 * based on http://responsejs.com/labs/dimensions/
	 */
	function getViewport(axis) {
		var client, inner;
		if (axis === 'x') {
			client = docElem['clientWidth'];
			inner = window['innerWidth'];
		}
		else if (axis === 'y') {
			client = docElem['clientHeight'];
			inner = window['innerHeight'];
		}

		return client < inner ? inner : client;
	}

	function scrollX() {
		return window.pageXOffset || docElem.scrollLeft;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	function init() {
		initEvents();
	}

	function initEvents() {
		[].slice.call(gridItems).forEach(function (item, pos) {
			// grid item click event
			item.addEventListener('click', function (ev) {
				ev.preventDefault();
				if (isAnimating || current === pos) {
					return false;
				}
				isAnimating = true;
				// index of current item
				current = pos;
				// simulate loading time..
				$(item).addClass('grid__item--loading');
				setTimeout(function () {
					$(item).addClass('grid__item--animate');
					// reveal/load content after the last element animates out (todo: wait for the last transition to finish)
					setTimeout(function () {
						loadContent(item);
					}, 500);
				}, 1000);
			});
		});



		// keyboard esc - hide content
		document.addEventListener('keydown', function (ev) {
			if (!isAnimating && current !== -1) {
				var keyCode = ev.keyCode || ev.which;
				if (keyCode === 27) {
					ev.preventDefault();
					if ("activeElement" in document)
						document.activeElement.blur();
					hideContent();
				}
			}
		});
	}

	function loadContent(item) {

		currentPortfolio = item.getAttribute("data-portfolio");
		var gridItem = $(item);

		//create placeholder div

		var placeholder = $('<div/>')
			.addClass('placeholder')
			.css({
				left:gridItem.position().left+2,
				top:gridItem.position().top+2,
				display:'none'
			})
			.width(gridItem.width())
			.height(gridItem.height())
			.appendTo(gridContainer);

		// body overlay
		bodyEl.addClass('view-single');


		$(placeholder).velocity({
			translateX: -$(gridItem).position().left + 'px',
			translateY: -$(gridItem).offset().top + scrollY() -5 + 'px',
			translateZ: '0px',
			width:'100%',
			//height:getViewport('y')-80 + 'px'
			height:getViewport('y') + 200 + 'px',
			opacity:1
		},{
			display:'block',
			easing:"easeInSine",
			duration: 200,
			begin:function(elements){
				// disallow scroll
				window.addEventListener('scroll', noscroll);
			},
			complete: function(elements){
				// show content item:
				//contentItemsContainer.css({
				//	top:$(elements).position().top + 'px'
				//});
				contentItemsContainer.addClass('content--show');
				contentItems.addClass('content__item--show');
				//load portfolio data
				//need to know the exact DOM elements to target
				loadPortfolio(contentItems, currentPortfolio);

				// sets overflow hidden to the body and allows the switch to the content scroll
				$('body').addClass('noscroll');

				isAnimating = false;

				var delay = (function(){
					var timer = 0;
					return function(callback, ms){
						clearTimeout (timer);
						timer = setTimeout(callback, ms);
					};
				})();

				$(window).on('resize', function(e){
					contentItemsContainer.css({
						opacity:0
					});
					delay(function(){
						//hideContent();
						$(elements).velocity({
							translateY: -$(gridItem).offset().top + scrollY() -5 + 'px',
							translateZ: '0px',
							height:'100vh'
						},{
							easing:"easeInSine",
							duration: 200,
							complete:function(element){
								contentItemsContainer.css({
									opacity:1
								});
							}
						});

						//contentItemsContainer.css({
						//	top:$(elements).position().top + 'px'
						//});
					}, 500);
				});
			}
		});
	}

	function hideContent() {
		$(".footer").addClass("stuck");
		contentItemsContainer.removeClass('content--show');
		contentItems.removeClass('content__item--show');
		closeCtrl.removeClass('close-button--show');
		//bodyEl.removeClass('view-single');

		//reset scroll
		lockScroll = false;
		contentItems.scrollTop(0);
		bodyEl.removeClass('noscroll');
		window.removeEventListener('scroll', noscroll);

		$('.placeholder').velocity(
			'reverse',{
				easing:"easeOuSine",
				duration: 400,
			complete: function(elements){
				$(elements).remove();

				$(gridItems[current]).removeClass('grid__item--loading');
				$(gridItems[current]).removeClass('grid__item--animate');


				current = -1;
			}
		});
	}

	function noscroll() {
		if (!lockScroll) {
			lockScroll = true;
			xscroll = scrollX();
			yscroll = scrollY();
		}
		window.scrollTo(xscroll, yscroll);
	}

	//creates the slick carousel with lightbox
	function loadPortfolio(contentItems, currentPortfolio) {
		$(".footer").removeClass("stuck");
		var elName = '.portolio-detail-name';
		var elCarousel = '.portfolio-detail-carousel';
		var elInvolvement = '.my-involvement';
		var elCategories = '.my-categories';

		var thisPortfolio = portfolioCards.filter(function (portfolio) {
			return portfolio.file === currentPortfolio;
		});

		var thisPortfolioImages = thisPortfolio[0].portfolioImages;
		var thisPortfolioCategories = thisPortfolio[0].categories;
		var thisPortfolioInvolvement = thisPortfolio[0].involvement;

		$(contentItems[0]).load(portfolioPath + currentPortfolio + ' #portfolio-content', function (response, status, xhr) {
			if (status === "success") {

				//create the list of images
				$.each(thisPortfolioImages, function (i) {
					var div = $('<div/>')
						.appendTo(elCarousel);
					var anchor = $('<a/>')
						.attr('href', portfolioImagePath + thisPortfolio[0].project + thisPortfolioImages[i])
						.attr('data-lightbox', 'image' + i)
						.appendTo(div);
					var img = $('<img/>')
						.attr('src', portfolioImagePath + thisPortfolio[0].project + 'med_' + thisPortfolioImages[i])
						.appendTo(anchor);
				});

				//append name
				$(elName).html(thisPortfolio[0].name);

				//create the list of categories
				$.each(thisPortfolioCategories, function (cat) {
					$('<li/>')
						.html(thisPortfolioCategories[cat])
						.appendTo(elCategories);
				});

				//create the list of involvement
				$.each(thisPortfolioInvolvement, function (cat) {
					$('<li/>')
						.html(thisPortfolioInvolvement[cat])
						.appendTo(elInvolvement);
				});

				//initialize slick carousel
				$(elCarousel).slick({
					dots: true,
					infinite: false,
					///centerMode:true,
					variableWidth: true,
					//initialSlide:0
				});

				//turn off dots at the small size
				var mySize = Foundation.utils.is_small_only();
				if(mySize){
					$('.portfolio-detail-carousel').slick(
						'slickSetOption','dots','false',true
					);
				}
				// show close control
				closeCtrl = $('.close-button');
				closeCtrl.on('click', function () {
					// hide content
					hideContent();
				});
				closeCtrl.addClass('close-button--show');
			}
		});
	}

	init();

	lightbox.option({
		'ignoreSets': true
	});
});