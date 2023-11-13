const productsSection = document.getElementById("productData");
productsSection.innerHTML += productData
  .map((product) => {
    return `
    <div class="col-lg-4">
    <div class="product">
      <div class="productmg">
        <a href="${product.href}">
          <img src="${product.image}" class="img-fluid" alt="Smartwatch" />
          <h5>$${product.price}</h5>
        </a>
      </div>
      <div class="productdelt">
        <h3>
          <a href="${product.href}">${product.name}</a>
        </h3>
        <div class="cartActionBox" id="${product.id}">
          <a href="${product.href} " onclick="javascript:void(0);">
            <button
              type="button"
              class="btn btn-primary addtocart_btn addToCartbtn"
            >
              Add to Cart
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
    `;
  })
  .join("");

