/* eslint-disable no-param-reassign */
import axios from 'axios';
import onChange from 'on-change';

const renderForm = () => {
  const form = `<form id="registrationForm">
  <div class="form-group">
      <label for="inputName">Name</label>
      <input type="text" class="form-control" id="inputName" placeholder="Введите ваше имя" name="name" required>
  </div>
  <div class="form-group">
      <label for="inputEmail">Email</label>
      <input type="text" class="form-control" id="inputEmail" placeholder="Введите email" name="email" required>
  </div>
  <input type="submit" value="Submit" class="btn btn-primary">
</form>`;
  document.querySelector('.form-container').innerHTML = form;
};

const renderErrors = (state) => {
  const nameInput = document.querySelector('#inputName');
  const emailInput = document.querySelector('#inputEmail');
  if (state.errors.name.length > 0) {
    nameInput.classList.add('is-invalid');
  } else if (state.errors.name.length <= 0) {
    nameInput.classList.remove('is-valid');
  }
  if (state.errors.email.length > 0) {
    emailInput.classList.add('is-invalid');
  } else if (state.errors.email.length <= 0) {
    emailInput.classList.remove('is-valid');
  }
};

const validateName = (name) => {
  console.log(name);
  return (name.trim().length ? [] : ['name is empty']);
};

const validateEmail = (email) => {
  if (!email.includes('@')) {
    return ['invalid email'];
  }
  return email.split('@').forEach((el) => (el.trim().length ? [] : ['email is invalid']));
};

const validateField = (field, state) => (field === 'name'
  ? validateName(state.values.name)
  : validateEmail(state.values.email));

const getDataForm = (state, form) => {
  const formData = new FormData(form);
  state.values.name = formData.get('name');
  state.values.email = formData.get('email');
};

const postRequest = (state) => {
  axios.post('/users', state.values).then((r) => {
    document.body.innerHTML = `<p>${r.data.message}</p>`;
  }).catch(console.log);
};

export default () => {
  const state = {
    values: {
      name: '',
      email: '',
    },
    errors: {
      name: [],
      email: [],
    },
  };

  const watchedState = onChange(state, (path) => {
    console.log(path);
    const field = path.split('.');
    if (field[0] === 'values') {
      state.errors[field[1]] = validateField(field[1], state);
      renderErrors(state);
    }
  });
  renderForm();
  const formHandler = (e) => {
    e.preventDefault();
    getDataForm(state, e.target);
    postRequest(state);
  };
  const nameHandler = (e) => {
    watchedState.values.name = e.target.value;
  };
  const emailHandler = (e) => {
    watchedState.values.email = e.target.value;
  };
  document.querySelector('form').addEventListener('submit', formHandler);
  document.querySelector('#inputName').addEventListener('input', nameHandler);
  document.querySelector('#inputEmail').addEventListener('input', emailHandler);
};
