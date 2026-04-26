const readline = require('readline');

// Polyfill cho fetch nếu ở Node < 18 (fallback nhẹ, nhưng Node hiện nay hầu hết > 18)
const fetchApi = typeof fetch !== 'undefined' ? fetch : require('node-fetch');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const EMAIL = process.env.TEST_AUTH_EMAIL || `testuser_${Date.now()}@example.com`;
const PASSWORD = process.env.TEST_AUTH_PASSWORD || 'TestPass123!';
const NEW_PASSWORD = process.env.TEST_AUTH_NEW_PASSWORD || 'NewPass123!';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// Tiện ích mask token
const maskToken = (token) => {
  if (!token) return 'null';
  if (typeof token !== 'string') return 'not-a-string';
  if (token.length <= 20) return token;
  return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
};

const sanitizeForLog = (data) => {
  if (!data || typeof data !== 'object') return data;
  const clone = JSON.parse(JSON.stringify(data));
  if (clone.data) {
    if (clone.data.accessToken) clone.data.accessToken = maskToken(clone.data.accessToken);
    if (clone.data.refreshToken) clone.data.refreshToken = maskToken(clone.data.refreshToken);
  }
  return clone;
};

const assertValidJwt = (token, name) => {
  if (typeof token !== 'string') {
    throw new Error(`${name} must be a string. Got: ${typeof token}`);
  }
  const dots = token.split('.').length - 1;
  if (dots !== 2) {
    throw new Error(`${name} is invalid or masked (has ${dots} dots, expected 2). Ensure the script is not using masked tokens for API calls.`);
  }
};

const printStep = (stepName) => console.log(`\n==================================\n[STEP] ${stepName}\n==================================`);
const printResult = (name, result) => {
  console.log(`[RESULT: ${name}]`);
  console.log(JSON.stringify(sanitizeForLog(result), null, 2));
};

async function runTests() {
  console.log(`Starting Auth Smoke Test against ${API_BASE_URL}`);
  console.log(`Target Email: ${EMAIL}`);
  console.log(`Target Password: ${'*'.repeat(PASSWORD.length)}`);

  let accessToken = null;
  let refreshToken = null;

  try {
    // 0. Health check
    printStep('Health Check');
    const healthRes = await fetchApi(`${API_BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    printResult('Health Check', healthData);
    if (healthRes.status !== 200) throw new Error('Health check failed');

    // 1. Register
    printStep('Register');
    const registerRes = await fetchApi(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const registerData = await registerRes.json();
    printResult('Register', registerData);

    let verifyStatus = registerRes.status;

    // Check if user existed (400)
    if (verifyStatus === 400 && registerData.code === 1001) {
      console.log('Account already exists. Proceeding directly to Login...');
    } else if (verifyStatus === 200) {
      console.log('\n[!] OTP sent. Please check your backend console logs for the OTP (or your email).');
      const otp = await askQuestion('Enter the 6-digit OTP to verify: ');
      
      printStep('Verify OTP');
      const verifyRes = await fetchApi(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, otp: otp.trim() })
      });
      const verifyData = await verifyRes.json();
      printResult('Verify OTP', verifyData);
      if (verifyRes.status !== 201) throw new Error('Verify OTP failed');
    } else {
      throw new Error(`Registration failed with status ${verifyStatus}`);
    }

    // 2. Login
    printStep('Login');
    const loginRes = await fetchApi(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const loginData = await loginRes.json();
    printResult('Login', loginData);
    if (loginRes.status !== 200) throw new Error('Login failed');

    accessToken = loginData.data.accessToken;
    refreshToken = loginData.data.refreshToken;

    // Lưu lại bản gốc để đối chiếu tính duy nhất sau này
    const loginAccessToken = accessToken;
    const loginRefreshToken = refreshToken;

    // Kiểm tra token thô (không bị mask)
    assertValidJwt(accessToken, 'accessToken');
    assertValidJwt(refreshToken, 'refreshToken');

    // 3. Profile with valid Access Token
    printStep('Get Profile');
    const profileRes = await fetchApi(`${API_BASE_URL}/api/customer/profile`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const profileData = await profileRes.json();
    printResult('Get Profile', profileData);
    if (profileRes.status !== 200) throw new Error('Get Profile failed');

    // 4. Refresh Token
    printStep('Refresh Token');
    const refreshRes = await fetchApi(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshToken })
    });
    const refreshData = await refreshRes.json();
    printResult('Refresh Token', refreshData);
    if (refreshRes.status !== 200) throw new Error('Refresh Token failed');

    accessToken = refreshData.data.accessToken;
    refreshToken = refreshData.data.refreshToken;

    assertValidJwt(accessToken, 'New accessToken');
    assertValidJwt(refreshToken, 'New refreshToken');

    // Kiểm tra tính duy nhất (Unique JTI)
    if (accessToken === loginAccessToken) {
      throw new Error('Refresh Token Error: New accessToken is identical to the old one! JTI might be missing.');
    }
    if (refreshToken === loginRefreshToken) {
      throw new Error('Refresh Token Error: New refreshToken is identical to the old one! JTI might be missing.');
    }

    // 5. Logout
    printStep('Logout');
    const logoutRes = await fetchApi(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ refreshToken: refreshToken })
    });
    const logoutData = await logoutRes.json();
    printResult('Logout', logoutData);
    if (logoutRes.status !== 200) throw new Error('Logout failed');

    // 6. Profile with blacklisted Access Token
    printStep('Get Profile (Expected to Fail)');
    const failProfileRes = await fetchApi(`${API_BASE_URL}/api/customer/profile`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const failProfileData = await failProfileRes.json();
    printResult('Get Profile Failed (Blacklisted)', failProfileData);
    if (failProfileRes.status !== 401) throw new Error('Expected 401 Unauthorized for blacklisted token');

    console.log('\n[✅] All Automated Smoke Tests Passed Successfully!');
  } catch (error) {
    console.error(`\n[❌] Test Failed: ${error.message}`);
  } finally {
    rl.close();
  }
}

runTests();
