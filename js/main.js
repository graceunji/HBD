function setTime() {
    var today = new Date();
    $('#now_time').text(today.toLocaleTimeString())
}

function animation() {
    var title1 = new TimelineMax();
    title1.to(".button", 0, {visibility: 'hidden', opacity: 0})
    title1.staggerFromTo(".title span", 0.5,
        {ease: Back.easeOut.config(1.7), opacity: 0, bottom: -80},
        {ease: Back.easeOut.config(1.7), opacity: 1, bottom: 0}, 0.05);
    title1.to(".button", 0.2, {visibility: 'visible' ,opacity: 1})
}

function typoAnime(txt) {
    TweenMax.staggerFromTo(txt, 1, {
        ease: Back.easeOut.config(1),
        opacity: 0,
        bottom: -100
    }, {
        ease: Back.easeOut.config(1),
        opacity: 1,
        bottom: 0
    }, 0.3);
}

function checkVisible( elm, eval ) {
    eval = eval || "object visible";
    var viewportHeight = $(window).height(), // Viewport Height
        scrolltop = $(window).scrollTop(), // Scroll Top
        y = $(elm).offset().top + ($(window).height()/3),
        elementHeight = $(elm).height();

    if (eval == "object visible") return ((y < (viewportHeight + scrolltop)) && (y > (scrolltop - elementHeight)));
    if (eval == "above") return ((y < (viewportHeight + scrolltop)));
}

$(function () {
    // aos init
    AOS.init();

    // time
    setTime();

    // slide1 script
    $('a.scroll-link').click(function(e){
        e.preventDefault();
        $id = $(this).attr('href');
        $('body,html').animate({
            scrollTop: $($id).offset().top
        }, 750);
    });

    $("#slide1 .title").lettering();
    $("#slide1 .button").lettering();

    setTimeout(animation(), 1000);
    $('#slide1 .button').click(function() {
        animation();
    });

    // slide2
    var slide2IsVisible = false;
    $(window).on('scroll',function() {
        if (checkVisible($('#slide2'))&&!slide2IsVisible) {
            createBubbles();
            slide2IsVisible=true;
        }
    });

    // slide3
    $(".card").on('click',function(){
        $(".cardRotate").addClass("backRotate").removeClass("cardRotate");
        $(this).addClass("cardRotate").removeClass("backRotate");
    });
})