var cartData = [];
var subTotal = 0;

function updateCartData() {
  if ("cart-data" in localStorage) {
    let existingItems = JSON.parse(localStorage.getItem("cart-data"));
    if (!Array.isArray(existingItems)) {
      cartData = [existingItems];
    } else {
      cartData = existingItems;
    }
  }
}
function updateSubTotal() {
  subTotal = 0;
  cartData.forEach((prd) => {
    subTotal += prd.price * prd.quantity;
  });
  subTotal = Math.round(subTotal * 100) / 100;
  localStorage.setItem("cart-subtotal", subTotal);
  let totalLabel = document.getElementById("cart-subtotal");
  totalLabel ? (totalLabel.innerText = `$${subTotal}`) : null;
  document.getElementById("cart-total")
    ? (document.getElementById("cart-total").innerText = `$${subTotal}`)
    : null;
  let cartDetailsSubTotalLabel = document.getElementById(
    "cartDetails-subtotal"
  );
  cartDetailsSubTotalLabel
    ? (cartDetailsSubTotalLabel.innerText = `$${subTotal}`)
    : null;
  document.getElementById("cartDetails-total")
    ? (document.getElementById("cartDetails-total").innerText = `$${subTotal}`)
    : null;
}

function addToCart(id) {
  console.log("click add to cart");
  updateCartData();

  let product = productData.find((obj) => obj.id === id);
  if (!product) {
    alert("Product not found");
    return;
  }

  let itemExists = cartData.find((prd) => prd.id === id);
  if (!itemExists) {
    product.quantity = 1;
    cartData.push(product);
    localStorage.setItem("cart-data", JSON.stringify(cartData));
  } else {
    console.log("Already added");
  }
}

function removeFromCart(id) {
  let itemIndex = cartData.findIndex((prd) => prd.id === id);
  if (itemIndex === -1) {
    return;
  } else {
    cartData.splice(itemIndex, 1);
    localStorage.setItem("cart-data", JSON.stringify(cartData));
    let cartTable = document.getElementById("cart-table");
    cartTable.querySelector(`#product-id-${id}`).remove();

    updateSubTotal();
  }
}

function handleCartItems() {
  let cartTable = document.getElementById("cart-table");
  cartTable.innerHTML += cartData
    .map(({ id, name, image, price, shipping, href }) => {
      return `
      <tr id="product-id-${id}" class="data_row product">
      <td>
       <img src="${image}"
            class="img-fluid product-img" 
            id="image${id}"
            alt="${name}"
          />
      </td>
      <td><a href="${href}" class="product-title">${name}</p></td>
      <td id="price-${id}" class="priceCol">$${price}</td>
      <td>
      <input type="number" value="1" min="1" class="form-control product-qty" disabled=""></td>
      <td id="total-${id} class="priceCol">$${price}</td>

      <td class="product-removal">
        <a onclick="removeFromCart(${id})" class="product-remove-btn deleteCartBtn" id="close-${id}"><i class="bi bi-x-square"></i>
         </a>
      </td>
      
      </tr>
      `;
    })
    .join("");
}

function handleCartSumaryItems() {
  let cartTable = document.getElementById("cart-SumaryTable");
  cartTable.innerHTML += cartData
    .map(({ id, name, image, price, shipping }) => {
      return `
      <li class="checkout_info_box">
      <span class="check_pro_name"
        >${name}</span
      >
      <span class="check_pro_count"
        >&nbsp;&nbsp;&nbsp;x 1</span
      >
      <span class="check_pro_price">$${price}</span>
    </li>
      `;
    })
    .join("");
}

function handleQuantityInput(e, id) {
  if (e.value === "" || e.value < 1) {
    e.value = 1;
  }
  let productIndex = cartData.findIndex((prd) => prd.id === id);
  cartData[productIndex].quantity = e.value;
  localStorage.setItem("cart-data", JSON.stringify(cartData));

  updateSubTotal();
}

function removeAllItems() {
  cartData.forEach((prd) => {
    let product_El = document.getElementById(`product-id-${prd.id}`);
    product_El.remove();
  });
  cartData = [];
  localStorage.removeItem("cart-data");
  updateSubTotal();
}

updateCartData();
updateSubTotal();
handleCartItems();
handleCartSumaryItems();
