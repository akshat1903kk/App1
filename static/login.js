document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Client-side validation
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token securely (e.g., localStorage or sessionStorage)
        localStorage.setItem('access_token', data.access_token);

        // Redirect to a protected page (e.g., dashboard)
        window.location.href = '/dashboard'; // Replace with your target URL
      } else if (response.status === 401) {
        alert('Invalid credentials. Please try again.');
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while processing your request. Please try again later.');
    }
  });
});
