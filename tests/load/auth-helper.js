/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');

module.exports = {
  createUser: function (context, events, done) {
    const timestamp = Date.now();
    const username = `user_${timestamp}`;
    const password = 'Test123!';
    const email = `${username}@test.com`;

    axios
      .post('http://localhost:3001/signUp', {
        email: email,
        nickname: username,
        password: password,
      })
      .then(() => {
        console.log('User created', username);
        context.vars.nickname = username;
        context.vars.email = email;
        context.vars.password = password;
        done();
      })
      .catch((error) => {
        done(error);
      });
  },
};
