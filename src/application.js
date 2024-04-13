import axios from "axios";

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
}

export default () => {
  const state = {
    values: {
      name: '',
      email: '',
    }
  }
  renderForm();
  const formHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.values.name = formData.get('name');
     state.values.email = formData.get('email');
    axios.post('/users', state.values).then((r) => document.body.innerHTML = `<p>${r.data.message}</p>`).catch(console.log);
  }
  document.querySelector('form').addEventListener('submit', formHandler);
}