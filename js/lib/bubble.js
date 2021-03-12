/*
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/.
 * Copyright (c) 2016 Julian Garnier
 */

function createBubbles() {

    var messagesEl = document.querySelector('.messages');
    var typingSpeed = 20;
    var loadingText = '<b>•</b><b>•</b><b>•</b>';
    var messageIndex = 0;

    var getCurrentTime = function() {
        var date = new Date();
        var hours =  date.getHours();
        var minutes =  date.getMinutes();
        var current = hours + (minutes * .01);
        return '지금 '+hours+'시네! 밥은 먹었어?';
    }

    var messages = [
       '지원아 안녕 👋👋',
       '생일 진짜 축하해🥳🥳🥳',
       '우리가 처음 본게 2014년인데..<br> 시간진짜 빠르다 그치',
       '시간이 촉박해서 대강한게 너무 아쉽지만<br> 시험공부 하는 널 위해 준비해봤어ㅎㅎ',
       '암튼..',
       '우리 코로나좀 괜찮아지면 꼭 보자,, <br>안본지 1년넘은거 실화,,?😷',
       '그럼 나는 이만 사라질게..',
       '살앙훼..💖',
       'ps. 밑에 특별한 무언가가 준비되어 있습니다,,희희',
    ]

    var getFontSize = function() {
        return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
    }

    var pxToRem = function(px) {
        return px / getFontSize() + 'rem';
    }

    var createBubbleElements = function(message, position) {
        var bubbleEl = document.createElement('div');
        var messageEl = document.createElement('span');
        var loadingEl = document.createElement('span');
        bubbleEl.classList.add('bubble');
        bubbleEl.classList.add('is-loading');
        bubbleEl.classList.add('cornered');
        bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
        messageEl.classList.add('message');
        loadingEl.classList.add('loading');
        messageEl.innerHTML = message;
        loadingEl.innerHTML = loadingText;
        bubbleEl.appendChild(loadingEl);
        bubbleEl.appendChild(messageEl);
        bubbleEl.style.opacity = 0;
        return {
            bubble: bubbleEl,
            message: messageEl,
            loading: loadingEl
        }
    }

    var getDimentions = function(elements) {
        return dimensions = {
            loading: {
                w: '4rem',
                h: '2.25rem'
            },
            bubble: {
                w: pxToRem(elements.bubble.offsetWidth + 4),
                h: pxToRem(elements.bubble.offsetHeight)
            },
            message: {
                w: pxToRem(elements.message.offsetWidth + 4),
                h: pxToRem(elements.message.offsetHeight)
            }
        }
    }

    var sendMessage = function(message, position) {
        var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
        var elements = createBubbleElements(message, position);
        messagesEl.appendChild(elements.bubble);
        messagesEl.appendChild(document.createElement('br'));
        var dimensions = getDimentions(elements);
        elements.bubble.style.width = '0rem';
        elements.bubble.style.height = dimensions.loading.h;
        elements.message.style.width = dimensions.message.w;
        elements.message.style.height = dimensions.message.h;
        elements.bubble.style.opacity = 1;
        var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
        if (bubbleOffset > messagesEl.offsetHeight) {
            var scrollMessages = anime({
                targets: messagesEl,
                scrollTop: bubbleOffset,
                duration: 750
            });
        }
        var bubbleSize = anime({
            targets: elements.bubble,
            width: ['0rem', dimensions.loading.w],
            marginTop: ['2.5rem', 0],
            marginLeft: ['-2.5rem', 0],
            duration: 800,
            easing: 'easeOutElastic'
        });
        var loadingLoop = anime({
            targets: elements.bubble,
            scale: [1.05, .95],
            duration: 1100,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
        var dotsStart = anime({
            targets: elements.loading,
            translateX: ['-2rem', '0rem'],
            scale: [.5, 1],
            duration: 400,
            delay: 25,
            easing: 'easeOutElastic',
        });
        var dotsPulse = anime({
            targets: elements.bubble.querySelectorAll('b'),
            scale: [1, 1.25],
            opacity: [.5, 1],
            duration: 300,
            loop: true,
            direction: 'alternate',
            delay: function(i) {return (i * 100) + 50}
        });
        setTimeout(function() {
            loadingLoop.pause();
            dotsPulse.restart({
                opacity: 0,
                scale: 0,
                loop: false,
                direction: 'forwards',
                update: function(a) {
                    if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
                        elements.bubble.classList.remove('is-loading');
                        anime({
                            targets: elements.message,
                            opacity: [0, 1],
                            duration: 300,
                        });
                    }
                }
            });
            bubbleSize.restart({
                scale: 1,
                width: [dimensions.loading.w, dimensions.bubble.w ],
                height: [dimensions.loading.h, dimensions.bubble.h ],
                marginTop: 0,
                marginLeft: 0,
                begin: function() {
                    if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
                }
            })
        }, loadingDuration - 50);
    }

    var sendMessages = function() {
        var message = messages[messageIndex];
        if (!message) return;
        sendMessage(message);
        ++messageIndex;
        setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
    }

    sendMessages();

}
