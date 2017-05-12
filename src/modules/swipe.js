let touchStartCoords = {x: -1, y: -1};
let touchEndCoords = {x: -1, y: -1};
let direction = 'undefined';
let minDistanceXAxis = 30;
let maxDistanceYAxis = 30;
let maxAllowedTime = 1000;
let startTime = 0;
let elapsedTime = 0;

export function swipeStart(e) {
    e = e || window.event;
    e = ('changedTouches' in e) ? e.changedTouches[0] : e;
    touchStartCoords = {x: e.pageX, y: e.pageY};
    startTime = new Date().getTime();
}

export function swipeMove (e) {
    e = e || window.event;
    e.preventDefault();
}

export function swipeEnd (e, drawLeftSwipe, drawRightSwipe) {
    e = e || window.event;
    e = ('changedTouches' in e) ? e.changedTouches[0] : e;
    touchEndCoords = {
        x: e.pageX - touchStartCoords.x,
        y: e.pageY - touchStartCoords.y
    };
    elapsedTime = new Date().getTime() - startTime;
    if (elapsedTime <= maxAllowedTime) {
        if (Math.abs(touchEndCoords.x) >= minDistanceXAxis &&
            Math.abs(touchEndCoords.y) <= maxDistanceYAxis) {
            direction = (touchEndCoords.x < 0) ? 'left' : 'right';
            switch (direction) {
                case 'left':
                    drawLeftSwipe();
                    break;
                case 'right':
                    drawRightSwipe();
                    break;
            }
        }
    }
}

export function addMultipleListeners (el, s, func) {
    let events = s.split(' ');
    for (let i = 0, len = events.length; i < len; i++) {
        el.addEventListener(events[i], func, false);
    }
}
