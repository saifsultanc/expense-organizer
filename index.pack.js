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

const state = {
  files: [],
  rootPath: ''
}

const updateFiles = files => {
  state.files = [...state.files, ...files];
  renderFiles();
}

const renderFiles = () => {
  fileListElem.innerHTML = state.files.sort((a, b) => {
    // sort alphabetically, folders first
    if ((a['.tag'] === 'folder' || b['.tag'] === 'folder')
      && !(a['.tag'] === b['.tag'])) {
      return a['.tag'] === 'folder' ? -1 : 1;
    } else {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    }
  }).map(file => {
    const type = file['.tag'];
    let thumbnail;
    if (type === 'file') {
      thumbnail = fileIcon;
    } else {
      thumbnail = folderIcon;
    }
    return `
      <li class="dbx-list-item ${type}">
        <img class="dbx-thumb" src="${thumbnail}">
        ${file.name}
      </li>
    `;
  }).join('');
}

const moveFiles = async () => {
  const entries = state.files
    .filter(file => file['.tag'] === 'file')
    .map(file => {
      const date = new Date(file.client_modified);
      return {
        from_path: file.path_lower,
        to_path: `${state.rootPath}/${date.getFullYear()}/${date.getUTCMonth() + 1}/${file.name}`
      }
    });
  let res = await dbx.filesMoveBatchV2({ entries });
  const { async_job_id } = res;
  if (async_job_id) {
    do {
      rest = await dbx.filesMoveBatchCheckV2({ async_job_id });
      console.log(res);
    } while (res['.tag'] === 'in_progress')
  }
}

const reset = () => {
  state.files = [];
  init();
}

init();