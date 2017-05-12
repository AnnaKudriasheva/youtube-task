import generateHTML from './modules/generateHTML';
import {cache, resultRequest, cleanCache} from './modules/request';
import {addMultipleListeners, swipeStart, swipeEnd, swipeMove} from './modules/swipe';

export let query;

window.onload = function () {
    generateHTML();

    const searchInput = document.getElementById('search-input');
    const startBlock = document.getElementById('start-block');
    const resultPageInput = document.getElementById('result-input');
    let resultPage = document.getElementById('result');
    let container = document.getElementsByClassName('container')[0];
    let itemsContainer = document.getElementById('items');
    let targetElement = document.getElementsByClassName('result-page')[0];
    let resultInput = document.getElementById('result-input');
    let prevPage = document.getElementById('prev-circle');
    let nextPage = document.getElementById('next-circle');
    let currPage = document.getElementById('curr-circle');
    let displayedItems = 0;
    let itemInfo = {};
    let page = 1;

    searchInput.addEventListener('keyup', function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            query = searchInput.value;
            resultRequest(drawItems);
            startBlock.style.display = 'none';
            resultPage.style.display = 'block';
            resultInput.value = query;
        }
    });

    resultPageInput.addEventListener('keyup', function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            while (itemsContainer.firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }
            query = resultPageInput.value;
            page = 1;
            currPage.innerHTML = page;
            displayedItems = 0;
            shift = getElementsToDisplay();
            cleanCache();
            resultRequest(drawItems);
        }
    });

    window.addEventListener('resize', function (event) {
        drawItems();
    });

    let fillInfo = function (i) {
        itemInfo.title = cache[i].snippet.title;
        itemInfo.videoId = cache[i].id.videoId;
        itemInfo.preview = cache[i].snippet.thumbnails.medium.url;
        itemInfo.author = cache[i].snippet.channelTitle;
        itemInfo.publishedAt = cache[i].snippet.publishedAt.split('T')[0];
        itemInfo.views = cache[i].snippet.viewCount;
        itemInfo.description = cache[i].snippet.description;
        createContentItem(itemInfo);
    };

    let drawItems = function () {
        let count = getElementsToDisplay();
        if (displayedItems < count) {
            for (let i = displayedItems; i < count; i++) {
                fillInfo(i);
            }
            displayedItems = count;
        } else if (displayedItems > count && displayedItems !== 0) {
            let lastChild = document.getElementsByClassName('item-block');
            let lastIndex = lastChild[lastChild.length - 1];
            itemsContainer.removeChild(lastIndex);
            displayedItems = count;
        }
    };

    let getElementsToDisplay = function () {
        return Math.floor(container.offsetWidth / 200);
    };

    let shift = getElementsToDisplay();

    let drawRightSwipe = function () {
        let count = getElementsToDisplay();
        if (shift - count * 2 > 0) {
            while (itemsContainer.firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }

            for (let i = shift - count * 2; i < shift - count; i++) {
                fillInfo(i);
            }
            shift -= count;
        }
        if (page > 1) {
            page--;
            currPage.innerHTML = page;
        }
        if (page === 1) {
            prevPage.classList.add('page-disabled');
        }
    };

    let drawLeftSwipe = function () {
        let count = getElementsToDisplay();
        if (cache[shift + count] === undefined) {
            resultRequest(drawLeftSwipe);
        } else {
            while (itemsContainer.firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }
            if (cache[shift] === undefined) {
                resultRequest();
            }
            for (let i = shift; i < shift + count; i++) {
                fillInfo(i);
            }
            shift += count;
            page++;
            currPage.innerHTML = page;
            prevPage.classList.remove('page-disabled');
        }
    };

    let numberWithSpaces = function (number) {
        let parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return parts.join('.');
    };

    let createContentItem = function (info) {
        let itemBlock = document.createElement('div');
        let itemTitle = document.createElement('h5');
        itemTitle.class = 'item-title';

        let titleLink = document.createElement('a');
        titleLink.href = 'https://www.youtube.com/watch?v=' + info.videoId;
        titleLink.innerHTML = info.title;
        titleLink.target = '_blank';
        itemTitle.appendChild(titleLink);

        let itemPreview = document.createElement('div');
        itemPreview.className = 'item-preview';

        let itemImg = document.createElement('img');
        itemImg.src = info.preview;
        itemPreview.appendChild(itemImg);

        let itemAuthor = document.createElement('p');
        itemAuthor.className = 'item-author';
        itemAuthor.innerHTML = info.author;

        let itemPublishedAt = document.createElement('p');
        itemPublishedAt.className = 'item-data';
        itemPublishedAt.innerHTML = info.publishedAt;

        let viewCount = document.createElement('p');
        viewCount.className = 'item-views';
        viewCount.innerHTML = numberWithSpaces(info.views);

        let itemDescription = document.createElement('p');
        itemDescription.className = 'item-description';
        itemDescription.innerHTML = info.description;

        itemBlock.className = 'item-block';
        itemBlock.appendChild(itemPreview);
        itemBlock.appendChild(itemTitle);
        itemBlock.appendChild(itemAuthor);
        itemBlock.appendChild(itemPublishedAt);
        itemBlock.appendChild(viewCount);
        itemBlock.appendChild(itemDescription);
        itemsContainer.appendChild(itemBlock);
    };

    nextPage.addEventListener('click', function (e) {
        drawLeftSwipe();
    });

    prevPage.addEventListener('click', function (e) {
        drawRightSwipe();
    });

    addMultipleListeners(targetElement, 'mousedown touchstart', swipeStart);
    addMultipleListeners(targetElement, 'mousemove touchmove', swipeMove);
    addMultipleListeners(targetElement, 'mouseup touchend', function (e) {
        swipeEnd(e, drawLeftSwipe, drawRightSwipe);
    });
};
