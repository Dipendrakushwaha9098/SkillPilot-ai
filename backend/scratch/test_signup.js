const axios = require('axios');

const testSignup = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/signup', {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'password123'
    });
    console.log('Signup Success:', res.status, res.data);
  } catch (error) {
    if (error.response) {
      console.log('Signup Failed:', error.response.status, error.response.data);
    } else {
      console.log('Signup Error:', error.message);
    }
  }
};

testSignup();
