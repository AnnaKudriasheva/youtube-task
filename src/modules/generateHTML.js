export default function generateHTML () {
    const body = document.getElementsByTagName('body')[0];

    const mainContainer = createElem('div', 'container');
    body.appendChild(mainContainer);

    const startPage = createElem('div', 'start-page', 'start-block');
    mainContainer.appendChild(startPage);

    const startLogo= createElem('div', 'logo-block', 'logo-block');
    startPage.appendChild(startLogo);

    const logoImg = createElem('img', 'start-logo');
    logoImg.src = './assets/logo.png';
    startLogo.appendChild(logoImg);

    const startSearch = createElem('div', 'search-block');
    startPage.appendChild(startSearch);

    const searchInputWrapper = createElem('div', 'search-input-wrapper');
    startSearch.appendChild(searchInputWrapper);

    const startInput = createElem('input', 'start-input', 'search-input');
    startInput.type = 'text';
    searchInputWrapper.appendChild(startInput);

    // RESULT PAGE

    const resultPage = createElem('div', 'result-page', 'result');
    mainContainer.appendChild(resultPage);

    const resultSearch = createElem('div', 'result-search', 'result-search');
    resultPage.appendChild(resultSearch);

    const resultLogo = createElem('img', 'result-logo', 'result-logo');
    resultLogo.src = './assets/logo.png';
    resultSearch.appendChild(resultLogo);

    const searchWrapper = createElem('div', 'result-input-wrapper');
    resultSearch.appendChild(searchWrapper);

    const resultInput = createElem('input', 'result-input', 'result-input');
    resultInput.type = 'text';
    searchWrapper.appendChild(resultInput);

    const items = createElem('div', 'items', 'items');
    resultPage.appendChild(items);

    const pagingBlock = createElem('div', 'paging-block');
    resultPage.appendChild(pagingBlock);

    const pageCircle1 = createElem('div', 'page-circle page-disabled',
        'prev-circle');
    pagingBlock.appendChild(pageCircle1);

    const pageLink1 = createElem('a', 'page-link');
    pageLink1.href = '#';
    pageLink1.innerHTML = '&#10094;';
    pageCircle1.appendChild(pageLink1);

    const pageCircle2 = createElem('div', 'page-circle page-active');
    pagingBlock.appendChild(pageCircle2);

    const pageLink2 = createElem('a', 'page-link', 'curr-circle');
    pageLink2.href = '#';
    pageLink2.innerHTML = '1';
    pageCircle2.appendChild(pageLink2);

    const pageCircle3 = createElem('div', 'page-circle', 'next-circle');
    pagingBlock.appendChild(pageCircle3);

    const pageLink3 = createElem('a', 'page-link');
    pageLink3.innerHTML = '&#10095;';
    pageLink3.href = '#';
    pageCircle3.appendChild(pageLink3);
}

function createElem (elem, _class, id) {
    const element = document.createElement(elem);
    element.className = _class;
    if (id) {
        element.id = id;
    }
    return element;
}
