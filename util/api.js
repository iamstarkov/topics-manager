import fetch from 'isomorphic-unfetch';
import parseLinkHeader from 'parse-link-header';

const baseUrl = 'https://api.github.com'
const coerceWithBaseUrl = url => url.startsWith('http') ? url : `${baseUrl}${url}`; 
const parse = response => response.json();
const headers = token => ({
  ...(!!token && { 'Authorization': `token ${token}` }),
  'Content-Type': 'application/json',
  'accept': 'application/json',
});

var addMaxPerPage = url => `${url}${url.includes('?') ? '&' : '?'}per_page=100`;

const get = (url, token) => fetch(coerceWithBaseUrl(url), {
  method: 'GET',
  headers: headers(token),
});

const previewGet = (url, token) => fetch(coerceWithBaseUrl(url), {
  method: 'GET',
  headers: {
    ...headers(token),
    accept: 'application/vnd.github.mercy-preview+json',
  },
});

const post = (url, token, body) => fetch(coerceWithBaseUrl(url), {
  method: 'POST',
  headers: headers(token),
  body: JSON.stringify(body),
});

const previewPut = (url, token, body) => fetch(coerceWithBaseUrl(url), {
  method: 'PUT',
  headers: {
    ...headers(token),
    accept: 'application/vnd.github.mercy-preview+json',
  },
  body: JSON.stringify(body),
});

const recursiveGet = async (url, token, items=[]) => {
  const response = await get(addMaxPerPage(url), token);
  const parsedLinkHeader = parseLinkHeader(response.headers.get('link'));
  const { next } = parsedLinkHeader;
  const currentItems = await parse(response);
  const joinedItems = items.concat(currentItems);
  if (next) {
    return recursiveGet(next.url, token, joinedItems);
  } else {
    return joinedItems;
  }
}

const api = {
  get: (...args) => get(...args).then(parse),
  recursiveGet,
  post: (...args) => post(...args).then(parse),
  preview: {
    get: (...args) => previewGet(...args).then(parse),
    put: (...args) => previewPut(...args).then(parse),
  }
}


export default api;
