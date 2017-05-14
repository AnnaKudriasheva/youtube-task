import generateHTML from './modules/generateHTML';
import { cache, resultRequest, cleanCache } from './modules/request';
import { addMultipleListeners, swipeStart, swipeEnd, swipeMove } from './modules/swipe';

export let query;

window.onload = function main () {
    generateHTML();

    const searchInput = document.getElementById('search-input');
    const startBlock = document.getElementById('start-block');
    const resultPageInput = document.getElementById('result-input');
    const resultPage = document.getElementById('result');
    const container = document.getElementsByClassName('container')[0];
    const itemsContainer = document.getElementById('items');
    const targetElement = document.getElementsByClassName('items')[0];
    const resultInput = document.getElementById('result-input');
    const prevPage = document.getElementById('prev-circle');
    const nextPage = document.getElementById('next-circle');
    const currPage = document.getElementById('curr-circle');
    let displayedItems = 0;
    const itemInfo = {};
    let page = 1;

    searchInput.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            query = searchInput.value;
            resultRequest(drawItems);
            startBlock.style.display = 'none';
            resultPage.style.display = 'block';
            resultInput.value = query;
        }
    });

    resultPageInput.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            while (itemsContainer.firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }
            query = resultPageInput.value;
            page = 1;
            currPage.innerHTML = page;
            prevPage.classList.add('page-disabled');
            displayedItems = 0;
            shift = getElementsToDisplay();
            cleanCache();
            resultRequest(drawItems);
        }
    });

    window.addEventListener('resize', (e) => {
        if (query) {
            drawItems();
        }
    });

    const fillInfo = function fillInfo (i) {
        itemInfo.title = cache[i].snippet.title;
        itemInfo.videoId = cache[i].id.videoId;
        itemInfo.preview = cache[i].snippet.thumbnails.medium.url;
        itemInfo.author = cache[i].snippet.channelTitle;
        itemInfo.publishedAt = cache[i].snippet.publishedAt.split('T')[0];
        itemInfo.views = cache[i].snippet.viewCount;
        itemInfo.description = cache[i].snippet.description;
        createContentItem(itemInfo);
    };

    const drawItems = function draw () {
        const count = getElementsToDisplay();
        if (cache.length === 0) {
            resultNotFound();
        } else if (displayedItems < count) {
            for (let i = displayedItems; i < count; i++) {
                fillInfo(i);
            }
            displayedItems = count;
        } else if (displayedItems > count && displayedItems !== 0) {
            const lastChild = document.getElementsByClassName('item-block');
            const lastIndex = lastChild[lastChild.length - 1];
            itemsContainer.removeChild(lastIndex);
            displayedItems = count;
        }
    };

    let getElementsToDisplay = function getElements () {
        return Math.floor(container.offsetWidth / 200);
    };

    let shift = getElementsToDisplay();

    const drawRightSwipe = function rightSwipe () {
        const count = getElementsToDisplay();
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
            page -= 1;
            currPage.innerHTML = page;
        }
        if (page === 1) {
            prevPage.classList.add('page-disabled');
        }
    };

    const drawLeftSwipe = function leftSwipe () {
        const count = getElementsToDisplay();
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
            page += 1;
            currPage.innerHTML = page;
            prevPage.classList.remove('page-disabled');
        }
    };

    const numberWithSpaces = function createNumber (number) {
        const parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return parts.join('.');
    };

    const createContentItem = function createItem (info) {
        const itemBlock = document.createElement('div');
        itemBlock.className = 'item-block';

        const itemTitle = document.createElement('h5');
        itemTitle.class = 'item-title';

        const titleLink = document.createElement('a');
        titleLink.href = `https://www.youtube.com/watch?v=${info.videoId}`;
        titleLink.innerHTML = info.title;
        titleLink.target = '_blank';
        itemTitle.appendChild(titleLink);

        const itemPreview = document.createElement('div');
        itemPreview.className = 'item-preview';

        const itemImg = document.createElement('img');
        itemImg.src = info.preview;
        itemPreview.appendChild(itemImg);

        const itemAuthor = document.createElement('p');
        itemAuthor.className = 'item-author';
        itemAuthor.innerHTML = info.author;

        const itemPublishedAt = document.createElement('p');
        itemPublishedAt.className = 'item-data';
        itemPublishedAt.innerHTML = info.publishedAt;

        const viewCount = document.createElement('p');
        viewCount.className = 'item-views';
        viewCount.innerHTML = numberWithSpaces(info.views);

        const itemDescription = document.createElement('p');
        itemDescription.className = 'item-description';
        itemDescription.innerHTML = info.description;

        itemBlock.appendChild(itemPreview);
        itemBlock.appendChild(itemTitle);
        itemBlock.appendChild(itemAuthor);
        itemBlock.appendChild(itemPublishedAt);
        itemBlock.appendChild(viewCount);
        itemBlock.appendChild(itemDescription);
        itemsContainer.appendChild(itemBlock);
    };

    let resultNotFound = function notFound () {
        itemsContainer.innerHTML =
            `Sorry, information about '${query}' not found :(`;
        nextPage.classList.add('page-disabled');
    };

    nextPage.addEventListener('click', e => drawLeftSwipe());

    prevPage.addEventListener('click', e => drawRightSwipe());

    addMultipleListeners(targetElement, 'mousedown touchstart', swipeStart);
    addMultipleListeners(targetElement, 'mousemove touchmove', swipeMove);
    addMultipleListeners(targetElement, 'mouseup touchend', e =>
        swipeEnd(e, drawLeftSwipe, drawRightSwipe));
};
