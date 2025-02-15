document.addEventListener('DOMContentLoaded', function() {
  // Get references to the relevant elements
  const menuItems = document.querySelectorAll('.list-group-item');
  const order = document.getElementById('order');
  const totalPrice = document.getElementById('totalPrice');
  const cashInput = document.getElementById('cash');

  // Create an object to store the order items by name
  const orderItems = new Map();

  // Add an event listener to each menu item
  menuItems.forEach((menuItem) => {
      const addToOrderButton = menuItem.querySelector('.add-to-order');
      addToOrderButton.addEventListener('click', function() {
          const name = menuItem.querySelector('.col-md-6').textContent;
          const price = parseFloat(menuItem.querySelector('.col-md-2').textContent.slice(0, -4));
          const quantity = menuItem.querySelector('input').value;
          addToOrder(name, price, quantity);
      });
  });

  // Add a function to add an item to the order
  function addToOrder(name, price, quantity) {
      // If the item is already in the order, update the quantity
      if (orderItems.has(name)) {
          const orderQuantity = orderItems.get(name);
          orderQuantity.quantity += parseInt(quantity);
          orderItems.set(name, orderQuantity);

          updateOrderListItem(name, orderQuantity.quantity, price * orderQuantity.quantity);
          calculateTotalPrice();
          return;
      }

      // Otherwise, add the item to the order
      orderItems.set(name, {
          quantity: parseInt(quantity),
          price: price * parseInt(quantity)
      });

      // Create a new list item with the order details
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.dataset.name = name; // Add a data attribute to easily identify the item
      listItem.innerHTML = `
          <div class="row align-items-center">
              <div class="col-md-6">${name}</div>
              <div class="col-md-2">${price} PHP</div>
              <div class="col-md-2">${quantity}</div>
              <div class="col-md-2">
                  ${price * parseInt(quantity)} PHP
                  <button class="btn btn-danger remove-from-order">Remove</button>
              </div>
          </div>
      `;

      // Add a function to remove the item from the order
      listItem.querySelector('.remove-from-order').addEventListener('click', function() {
          const orderEntry = orderItems.get(name);
          order.removeChild(listItem);
          orderEntry.quantity--;
          orderItems.set(name, orderEntry);

          if (orderEntry.quantity === 0) {
              orderItems.delete(name);
          }

          calculateTotalPrice();
      });

      // Add the list item to the order
      order.appendChild(listItem);

      // Update the total price
      calculateTotalPrice();
  }

  // Add a function to update the order list
  function updateOrderListItem(name, quantity, price) {
      const orderListItems = order.getElementsByTagName('li');
      for (let i = 0; i < orderListItems.length; i++) {
          if (orderListItems[i].dataset.name === name) {
              orderListItems[i].querySelector('.col-md-2').textContent = `${price} PHP`;
              orderListItems[i].querySelector('.col-md-2 + div').textContent = `${price} PHP`;
              orderListItems[i].querySelector('.col-md-2:nth-child(3)').textContent = `${quantity}`;
              break;
          }
      }
  }

  // Add a function to calculate the total price
  function calculateTotalPrice() {
      let totalPriceValue = 0;
      const orderItemsArray = Array.from(orderItems.values());
      orderItemsArray.forEach(item => {
          totalPriceValue += item.price;
      });
      totalPrice.textContent = `TOTAL: ${totalPriceValue.toFixed(2)} PHP`;
      cashInput.value = totalPriceValue.toFixed(2);
  }

  // Add a function to handle payment
  function pay() {
      const cash = parseFloat(cashInput.value);
      if (cash >= totalPriceValue) {
          alert('Payment successful!');
      } else {
          alert('Insufficient payment. Please add more.');
      }
  }


});