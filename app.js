document.addEventListener('DOMContentLoaded', (event) => {
  fetch('/.netlify/functions/api/server/ips-page')
    .then(response => response.text())
    .then(data => {
      document.body.innerHTML = data;
    })
    .catch(error => console.error('Error:', error));
});
