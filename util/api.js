import fetch from 'isomorphic-unfetch';

const baseUrl = 'https://api.github.com'
const coerceWithBaseUrl = url => url.startsWith('http') ? url : `${baseUrl}${url}`; 
const parse = response => response.json();
const headers = token => ({
  ...(!!token && { 'Authorization': `token ${token}` }),
  'Content-Type': 'application/json',
  'accept': 'application/json',
});

const api = {
  get: (url, token) => fetch(coerceWithBaseUrl(url), {
    method: 'GET',
    headers: headers(token),
  }).then(parse),
  post: (url, token, body) => fetch(coerceWithBaseUrl(url), {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  }).then(parse),
}

export default api;
