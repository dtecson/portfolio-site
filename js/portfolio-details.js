/**
 * Created by Dan Tecson on 7/4/2015.
 * only used to load the page independently of the main site
 */

$(document).ready(function () {
	var elName = '.portolio-detail-name';
	var elCarousel = '.portfolio-detail-carousel';
	var elInvolvement = '.my-involvement';
	var elCategories = '.my-categories';
	var portfolioImagePath = "../images/portfolio/";

	var thisPortfolio = portfolioCards.filter(function (portfolio) {
		return portfolio.file === currentPortfolio;
	});

	var thisPortfolioImages = thisPortfolio[0].portfolioImages;
	var thisPortfolioCategories = thisPortfolio[0].categories;
	var thisPortfolioInvolvement = thisPortfolio[0].involvement;

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
	$('.portfolio-detail-carousel').slick({
		dots: true,
		//centerMode: true,
		infinite: false,
		variableWidth: true
	});

	var mySize = Foundation.utils.is_small_only();
	if(mySize){
		$('.portfolio-detail-carousel').slick(
			'slickSetOption','dots','false',true
		);
	}

	lightbox.option({
		'ignoreSets': true
	});
//        $('.portfolio-detail-carousel-nav').slick({
//            slidesToShow: 3,
//            slidesToScroll: 1,
//            asNavFor: '.portfolio-detail-carousel',
//            dots: true,
//            centerMode: true,
//            focusOnSelect: true
//        });
});
