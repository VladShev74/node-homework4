const yup = require('yup');

exports.authRegister = yup.object().shape({
  password: yup.string().min(6).required(),
  email: yup.string().email().required(),
  subscription: yup.string(),
});

exports.authLogin = yup.object().shape({
  password: yup.string().min(6).required(),
  email: yup.string().email().required(),
});