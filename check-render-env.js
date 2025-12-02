/**
 * Script to check if APP_URL is correctly set in Render backend
 * This script tests the CORS configuration to verify APP_URL
 */

const https = require('https');

// Configuration
const BACKEND_URL = process.env.RENDER_BACKEND_URL || 'https://your-backend-name.onrender.com';
const FRONTEND_URL = 'https://white-shop-web-dhzt.vercel.app';

console.log('🔍 Checking Render Backend Environment Variables...\n');
console.log(`📡 Backend URL: ${BACKEND_URL}`);
console.log(`🌐 Frontend URL: ${FRONTEND_URL}\n`);

// Test 1: Health Check
function testHealthCheck() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣ Testing Health Endpoint...');
    
    const url = new URL(`${BACKEND_URL}/health`);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Render-Env-Checker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log('   ✅ Health check passed');
            console.log(`   📊 Status: ${json.status}`);
            resolve(true);
          } catch (e) {
            console.log('   ⚠️  Health check returned non-JSON response');
            resolve(false);
          }
        } else {
          console.log(`   ❌ Health check failed: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Health check error: ${error.message}`);
      console.log(`   💡 Make sure BACKEND_URL is correct: ${BACKEND_URL}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('   ❌ Health check timeout');
      resolve(false);
    });

    req.end();
  });
}

// Test 2: CORS Check
function testCORS() {
  return new Promise((resolve, reject) => {
    console.log('\n2️⃣ Testing CORS Configuration...');
    console.log(`   Testing with Origin: ${FRONTEND_URL}`);
    
    const url = new URL(`${BACKEND_URL}/health`);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Origin': FRONTEND_URL,
        'User-Agent': 'Render-Env-Checker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      const corsHeader = res.headers['access-control-allow-origin'];
      const corsCredentials = res.headers['access-control-allow-credentials'];
      
      console.log(`   📋 CORS Headers:`);
      console.log(`      Access-Control-Allow-Origin: ${corsHeader || 'NOT SET'}`);
      console.log(`      Access-Control-Allow-Credentials: ${corsCredentials || 'NOT SET'}`);
      
      if (corsHeader === FRONTEND_URL || corsHeader === '*') {
        console.log('   ✅ CORS is correctly configured!');
        console.log('   ✅ APP_URL environment variable is set correctly');
        resolve(true);
      } else if (corsHeader) {
        console.log(`   ⚠️  CORS is configured, but for different origin: ${corsHeader}`);
        console.log(`   💡 Expected: ${FRONTEND_URL}`);
        console.log(`   💡 Make sure APP_URL=${FRONTEND_URL} is set in Render Dashboard`);
        resolve(false);
      } else {
        console.log('   ❌ CORS headers not found');
        console.log('   💡 APP_URL might not be set, or CORS is not configured correctly');
        resolve(false);
      }
      
      res.on('data', () => {});
      res.on('end', () => {});
    });

    req.on('error', (error) => {
      console.log(`   ❌ CORS test error: ${error.message}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('   ❌ CORS test timeout');
      resolve(false);
    });

    req.end();
  });
}

// Test 3: API Endpoint Check
function testAPIEndpoint() {
  return new Promise((resolve, reject) => {
    console.log('\n3️⃣ Testing API Endpoint...');
    
    const url = new URL(`${BACKEND_URL}/api/v1/products?limit=1`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Origin': FRONTEND_URL,
        'User-Agent': 'Render-Env-Checker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      const corsHeader = res.headers['access-control-allow-origin'];
      
      if (res.statusCode === 200 || res.statusCode === 401) {
        console.log(`   ✅ API endpoint is accessible (Status: ${res.statusCode})`);
        if (corsHeader === FRONTEND_URL) {
          console.log('   ✅ CORS is working for API endpoints');
          resolve(true);
        } else {
          console.log('   ⚠️  API endpoint accessible but CORS might not be configured');
          resolve(false);
        }
      } else {
        console.log(`   ⚠️  API endpoint returned: ${res.statusCode}`);
        resolve(false);
      }
      
      res.on('data', () => {});
      res.on('end', () => {});
    });

    req.on('error', (error) => {
      console.log(`   ⚠️  API test error: ${error.message}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('   ⚠️  API test timeout');
      resolve(false);
    });

    req.end();
  });
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('🔍 Render Backend Environment Checker');
  console.log('='.repeat(60));
  console.log('');
  
  if (BACKEND_URL.includes('your-backend-name')) {
    console.log('❌ Error: Please set RENDER_BACKEND_URL environment variable');
    console.log('');
    console.log('Usage:');
    console.log('  RENDER_BACKEND_URL=https://your-backend.onrender.com node check-render-env.js');
    console.log('');
    console.log('Or edit this file and set BACKEND_URL directly');
    process.exit(1);
  }

  const healthOk = await testHealthCheck();
  const corsOk = await testCORS();
  const apiOk = await testAPIEndpoint();

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('='.repeat(60));
  console.log(`   Health Check: ${healthOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   CORS Config:  ${corsOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   API Access:   ${apiOk ? '✅ PASS' : '⚠️  WARN'}`);
  console.log('');

  if (corsOk) {
    console.log('✅ SUCCESS: APP_URL is correctly configured in Render!');
    console.log(`   Frontend (${FRONTEND_URL}) can connect to backend`);
  } else {
    console.log('❌ FAILURE: APP_URL might not be set correctly');
    console.log('');
    console.log('💡 To fix:');
    console.log('   1. Go to Render Dashboard: https://dashboard.render.com');
    console.log('   2. Select your backend service');
    console.log('   3. Go to Environment tab');
    console.log(`   4. Add: APP_URL=${FRONTEND_URL}`);
    console.log('   5. Save and wait for service to restart');
  }
  
  console.log('');
}

main().catch(console.error);

