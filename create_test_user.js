const http = require('http');

function createTestUser() {
  const data = JSON.stringify({
    email: 'company@test.com',
    password: 'Company123!',
    role: 'company',
    fullName: 'Test Company Inc'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (res.statusCode === 201) {
          console.log('✅ Company user created successfully!');
          console.log('Email:', parsed.user.email);
          console.log('Role:', parsed.user.role);
          console.log('\nYou can now login with:');
          console.log('  Email: company@test.com');
          console.log('  Password: Company123!');
        } else if (res.statusCode === 400 && parsed.error.includes('already exists')) {
          console.log('ℹ️  Company user already exists. You can login with:');
          console.log('  Email: company@test.com');
          console.log('  Password: Company123!');
        } else {
          console.error('❌ Error:', parsed.error);
        }
      } catch (e) {
        console.error('❌ Parse error:', body);
      }
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
    process.exit(1);
  });

  req.write(data);
  req.end();
}

createTestUser();
