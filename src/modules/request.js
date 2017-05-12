import {query} from '../main';

export let nextPageToken = null;
export let cache = [];
let XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
const apiKey = 'AIzaSyAlMFARTLXCJpYkIf9N-Y5eD2s0JjRrdV4';

export function resultRequest (callback) {
    let xhr = new XHR();

    xhr.open('GET', 'https://www.googleapis.com/youtube/v3/search?key=' +
        apiKey + '&type=video&part=snippet&maxResults' +
        '=15' + ((!nextPageToken) ? '' : ('&pageToken=' + nextPageToken)) +
        '&q=' + query, true);

    xhr.onload = function () {
        let result = JSON.parse(this.responseText);
        console.log(result);
        nextPageToken = result.nextPageToken;
        if (result.items.length) {
            statisticsRequest(callback, result.items);
        }
    };

    xhr.onerror = function () {
        alert('Ошибка ' + this.status);
    };

    xhr.send();
}

let statisticsRequest = function (callback, items) {
    let xhr = new XHR();
    let ids = [];
    for (let i = 0; i < items.length; i++) {
        ids.push(items[i].id.videoId);
    }
    console.log('ids: ' + ids.join());

    xhr.open('GET', 'https://www.googleapis.com/youtube/v3/videos?key=' +
        apiKey + '&part=statistics&id=' + ids.join());

    xhr.onload = function () {
        let result = JSON.parse(this.responseText);
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.snippet.viewCount = result.items[i].statistics.viewCount;
            cache.push(item);
        }
        callback();
    };

    xhr.onerror = function () {
        alert('Ошибка ' + this.status);
    };

    xhr.send();
};

export function cleanCache () {
    nextPageToken = null;
    cache = [];
}
