document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Client-side validation
    if (!username || !email || !password || !role) {
      alert('All fields are required. Please fill out the form completely.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Disable the submit button temporarily to prevent multiple requests
    const submitButton = registerForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const response = await fetch('/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      if (response.ok) {
        alert('Registration successful! You can now log in.');
        window.location.href = '/auth/login'; // Redirect to the login page
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      // Re-enable the submit button
      submitButton.disabled = false;
    }
  });
});
