const modal = document.querySelector('.modal');
const form = document.querySelector('#form');

window.addEventListener('DOMContentLoaded', (event) => {
  modal.showModal();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  modal.close();
});
