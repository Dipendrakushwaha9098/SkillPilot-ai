const userStore = require('./utils/userStore');
const assert = require('assert');

async function testUserStore() {
  console.log("=== Testing userStore Functions ===");

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  // 1. Test createUser
  console.log("1. Testing createUser...");
  const user = await userStore.createUser({
    name: 'Unit Test User',
    email: testEmail,
    password: testPassword,
    skillLevel: 'Intermediate',
    interests: ['Node.js', 'React']
  });

  assert.ok(user, 'User creation failed');
  assert.ok(user._id, 'User ID missing');
  assert.strictEqual(user.email, testEmail, 'Email mismatch');
  console.log("✅ createUser passed.");

  // 2. Test findOne
  console.log("2. Testing findOne...");
  const foundUser = await userStore.findOne({ email: testEmail });
  assert.ok(foundUser, 'User findOne failed');
  assert.strictEqual(foundUser.name, 'Unit Test User', 'Name mismatch');
  console.log("✅ findOne passed.");

  // 3. Test findById
  console.log("3. Testing findById...");
  const foundById = await userStore.findById(user._id);
  assert.ok(foundById, 'User findById failed');
  assert.strictEqual(foundById.email, testEmail, 'Email mismatch');
  console.log("✅ findById passed.");

  // 4. Test comparePassword
  console.log("4. Testing comparePassword...");
  const isMatch = await foundUser.comparePassword(testPassword);
  assert.strictEqual(isMatch, true, 'Password comparison failed for correct password');
  const isWrongMatch = await foundUser.comparePassword('WrongPass');
  assert.strictEqual(isWrongMatch, false, 'Password comparison failed for wrong password');
  console.log("✅ comparePassword passed.");

  console.log("🎉 ALL userStore TESTS PASSED SUCCESSFULLY!");
}

testUserStore().catch(err => {
  console.error("❌ userStore Test Failed:", err);
  process.exit(1);
});
