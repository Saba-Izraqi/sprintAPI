const axios = require('axios');

const API_BASE = 'http://localhost:4000';

async function testProjectDeletion() {
  try {
    // First, register a user and get token
    console.log('1. Registering user...');
    const registerResponse = await axios.post(`${API_BASE}/user/register`, {
      fullName: "Test User",
      email: "test@example.com",
      password: "Test123!"
    });
    
    const token = registerResponse.data.token;
    console.log('User registered successfully');

    // Create a project
    console.log('2. Creating project...');
    const projectResponse = await axios.post(`${API_BASE}/project`, {
      name: "Test Project To Delete",
      keyPrefix: "TPD"
      // createdBy will be set automatically from token
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const projectId = projectResponse.data.project.id;
    console.log(`Project created: ${projectId}`);

    // Try to delete the project
    console.log('3. Attempting to delete project...');
    await axios.delete(`${API_BASE}/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Project deleted successfully!');
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Request failed:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      
      // If it's a server error, the issue is likely in the database
      if (error.response.status === 500) {
        console.error('\n🔍 This appears to be a database constraint error during project deletion.');
      }
    } else {
      console.error('❌ Network error:', error.message);
    }
  }
}

testProjectDeletion();
