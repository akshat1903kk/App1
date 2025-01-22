document.addEventListener('DOMContentLoaded', () => {
  const itemsTable = document.getElementById('items-table');

  async function getItems() {
    try {
      const response = await fetch('/buyer/items');

      if (!response.ok) {
        throw new Error('Failed to fetch items!');
      }

      const items = await response.json();

      // Clear existing table rows
      itemsTable.querySelector('tbody').innerHTML = '';

      // Add table rows for each item
      items.forEach(item => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
          <td>${item.title}</td>
          <td>${item.description}</td>
          <td>
            <button data-item-id="${item.id}">Buy</button>
          </td>
        `;

        // Add click event listener to buy button
        tableRow.querySelector('button').addEventListener('click', async () => {
          const itemId = item.id;
          await buyItem(itemId);
        });

        itemsTable.querySelector('tbody').appendChild(tableRow);
      });

    } catch (error) {
      console.error('Error fetching items:', error);
      alert(error.message);
    }
  }

  async function buyItem(itemId) {
    const accessToken = localStorage.getItem('access_token'); // Replace with your storage mechanism

    try {
      const response = await fetch(`/buyer/buy_item/${itemId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}` // Include access token in the header
        }
      });

      if (!response.ok) {
        throw new Error('Failed to buy item!');
      }

      const data = await response.json();
      console.log('Item purchased successfully:', data);

      // Update UI or display success message
      alert('Item purchased successfully!');
      getItems(); // Refresh the list of items

    } catch (error) {
      console.error('Error buying item:', error);
      alert(error.message);
    }
  }

  getItems(); // Fetch and display items on page load
});
