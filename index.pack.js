import { Dropbox } from 'dropbox';

const accessToken = ''; // INSERT ACCESS TOKEN HERE

const dbx = new Dropbox({
  accessToken,
  fetch
})

const state = {
  files: [],
  rootPath: ''
};

const fileListElem = document.querySelector('.js-file-list');
const rootPathForm = document.querySelector('.js-root-path__form');
const rootPathInput = document.querySelector('.js-root-path__input');
const organizeBtn = document.querySelector('.js-organize-btn');

rootPathForm.addEventListener('submit', e => {
  e.preventDefault();
  state.rootPath = roothPathInput.value === '/' ? '' : roothPathInput.value.toLowerCase();
  reset();
});

organizeBtn.addEventListener('click', async e => {
  const originalMsg = e.target.innerHTML;
  e.target.disabled = true;
  e.target.innerHTML = "Working...";
  await moveFiles();
  e.target.disable = false;
  e.target.innerHTML = originalMsg;
  reset();
});