export default function generateHTML () {
    let body = document.getElementsByTagName('body')[0];

    let mainContainer = createElem('div', 'container');
    body.appendChild(mainContainer);

    let startPage = createElem('div', 'start-page', 'start-block');
    mainContainer.appendChild(startPage);

    let logoImg = document.createElement('img');
    logoImg.src = './assets/logo.png';
    startPage.appendChild(logoImg);

    let _searchInput = document.createElement('input');
    _searchInput.type = 'text';
    _searchInput.id = 'search-input';
    startPage.appendChild(_searchInput);

    // RESULT PAGE

    let _resultPage = createElem('div', 'result-page', 'result');
    mainContainer.appendChild(_resultPage);

    let resultPageSearch = createElem('div', 'result-search', 'result-search');
    _resultPage.appendChild(resultPageSearch);

    let resultPageLogo = document.createElement('img');
    resultPageLogo.id = 'result-logo';
    resultPageLogo.src = './assets/logo.png';
    resultPageSearch.appendChild(resultPageLogo);

    let resultInput = document.createElement('input');
    resultInput.type = 'text';
    resultInput.id = 'result-input';
    resultPageSearch.appendChild(resultInput);

    let items = createElem('div', 'items', 'items');
    _resultPage.appendChild(items);

    let pagingBlock = document.createElement('div');
    pagingBlock.className = 'paging-block';
    _resultPage.appendChild(pagingBlock);

    let pageCircle1 = document.createElement('div');
    pageCircle1.className = 'page-circle page-disabled';
    pageCircle1.id = 'prev-circle';
    pagingBlock.appendChild(pageCircle1);

    let pageLink1 = document.createElement('a');
    pageLink1.className = 'page-link';
    pageLink1.href = '#';
    pageLink1.innerHTML = '&#10094;';
    pageCircle1.appendChild(pageLink1);

    let pageCircle2 = document.createElement('div');
    pageCircle2.className = 'page-circle page-active';
    pagingBlock.appendChild(pageCircle2);

    let pageLink2 = document.createElement('a');
    pageLink2.className = 'page-link';
    pageLink2.id = 'curr-circle';
    pageLink2.href = '#';
    pageLink2.innerHTML = '1';
    pageCircle2.appendChild(pageLink2);

    let pageCircle3 = document.createElement('div');
    pageCircle3.className = 'page-circle';
    pageCircle3.id = 'next-circle';
    pagingBlock.appendChild(pageCircle3);

    let pageLink3 = document.createElement('a');
    pageLink3.className = 'page-link';
    pageLink3.innerHTML = '&#10095;';
    pageLink3.href = '#';
    pageCircle3.appendChild(pageLink3);
}

function createElem (elem, _class, id) {
    let element = document.createElement(elem);
    element.className = _class;
    element.id = id || null;
    return element;
}
