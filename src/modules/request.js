import { query } from '../main';

let nextPageToken = null;
let cache = [];

export { nextPageToken };
export { cache };

const XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
const apiKey = 'AIzaSyAlMFARTLXCJpYkIf9N-Y5eD2s0JjRrdV4';

export function resultRequest (callback) {
    const xhr = new XHR();

    xhr.open('GET', `https://www.googleapis.com/youtube/v3/search?key=${
        apiKey}&type=video&part=snippet&maxResults` +
        `=15${(!nextPageToken) ? '' : (`&pageToken=${nextPageToken}`)
        }&q=${query}`, true);

    xhr.onload = function load () {
        const result = JSON.parse(this.responseText);
        nextPageToken = result.nextPageToken;
        if (result.items.length) {
            statisticsRequest(callback, result.items);
        } else {
            callback();
        }
    };

    xhr.onerror = function error () {
        alert(`Error ${this.status}`);
    };

    xhr.send();
}

let statisticsRequest = function getStatistic (callback, items) {
    const xhr = new XHR();
    const ids = [];
    for (let i = 0; i < items.length; i++) {
        ids.push(items[i].id.videoId);
    }

    xhr.open('GET', `https://www.googleapis.com/youtube/v3/videos?key=${
        apiKey}&part=statistics&id=${ids.join()}`);

    xhr.onload = function load () {
        const result = JSON.parse(this.responseText);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.snippet.viewCount = result.items[i].statistics.viewCount;
            cache.push(item);
        }
        callback();
    };

    xhr.onerror = function error () {
        alert(`Ошибка ${this.status}`);
    };

    xhr.send();
};

export function cleanCache () {
    nextPageToken = null;
    cache = [];
}
