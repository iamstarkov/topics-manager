import fetch from 'isomorphic-unfetch';

const baseUrl = 'https://github.com'
const parse = response => response.json();
const headers = token => ({
  ...(!!token && { 'Authorization': `token ${token}` }),
  'Content-Type': 'application/json',
  'accept': 'application/json',
});

const api = {
  get: (url, token) => fetch(`${baseUrl}/${url}`, {
    method: 'GET',
    headers: headers(token),
  }).then(parse),
  post: (url, token, body) => fetch(`${baseUrl}/${url}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  }).then(parse),
}

export default api;
