document.addEventListener('DOMContentLoaded', () => {
  const createItemForm = document.getElementById('create-item-form');

  createItemForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();

    // Access the access token stored in local storage
    const accessToken = localStorage.getItem('access_token'); // Match the key name you use in login.js

    // Validate form inputs
    if (!title || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('/seller/create_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` // Include the Bearer token
        },
        body: JSON.stringify({ title, description })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create item!');
      }

      const data = await response.json();
      console.log('Item created successfully:', data);

      // Optional: Display success message or redirect
      alert('Item created successfully!');

      // Clear the form
      createItemForm.reset();

    } catch (error) {
      console.error('Error during item creation:', error);
      alert(error.message);
    }
  });
});
