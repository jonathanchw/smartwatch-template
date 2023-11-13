var cartData = [];
var subTotal = 0;

/*Handle Order Summary*/
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
  if ("cart-subtotal" in localStorage) {
    subTotal = localStorage.getItem("cart-subtotal");
    const totalLabel = document.getElementById("cart-subtotal");
    totalLabel.innerText = `$${subTotal}`;
  }
}

function showOrderSummary() {
  let orderSummary_El = document.getElementById("order-table");
  orderSummary_El.innerHTML += cartData
    .map(({ name, price, quantity, image, pageRef }) => {
      return `
      <tr>
      <th>
            <img
              src="${image}"
              class="img-fluid"
              alt="${name}"
            />
        </th>
        <th class="top_heading">${name} × ${quantity}</th>
        <td>:</td>
        <td class="top_content">$${price}</td>
      </th>
      </tr>`;
    })
    .join("");
}

updateCartData();
updateSubTotal();
showOrderSummary();
/*********/

/*Handle user-data form*/
var userData = {
  firstName: { value: "", isValid: false },
  lastName: { value: "", isValid: false },
  phone: { value: "", isValid: false },
  email: { value: "", isValid: false },
  address: { value: "", isValid: false },
  address2: { value: "", isValid: true },
  city: { value: "", isValid: false },
  state: { value: "", isValid: false },
  zipCode: { value: "", isValid: false },
};
var showFormErrors = false;

var paymentData = {
  cardNumber: { value: "", isValid: false },
  expiryMonth: { value: "", isValid: false },
  expiryYear: { value: "", isValid: false },
  CVV: { value: "", isValid: false },
  cardType: "",
};
var showPaymentFormErrors = false;

/*DELIVERY FORM*/
/*Phone input masking*/
var cleave = new Cleave("input[name='phone']", {
  phone: true,
  phoneRegionCode: "US",
});

/*VALIDATE USER-DATA*/
function validateEmail(email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
}
function validatePhoneNumber(phone) {
  return /^(\+?1\s*[-.\s]?)?\(?(\d{3})\)?\s*[-.\s]?(\d{3})\s*[-.\s]?(\d{4})$/.test(
    phone
  );
}
function validateZipCode(zip) {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
}

function validateUserData(name) {
  if (name === "email") {
    userData.email.isValid = validateEmail(userData.email.value);
  } else if (name === "phone") {
    userData.phone.isValid = validatePhoneNumber(userData.phone.value);
  } else if (name === "zipCode") {
    userData.zipCode.isValid = validateZipCode(userData.zipCode.value);
  } else {
    userData[name].isValid = userData[name].value.length >= 2;
  }
}

function checkFormValidity() {
  let isFormValid = true;
  Object.entries(userData).forEach((obj) => {
    if (!obj[1].isValid) {
      isFormValid = false;
    }
  });
  console.log("function checkFormValidity is " + isFormValid);
  return isFormValid;
}

function handleFormErrors() {
  if (!showFormErrors) return;
//Handle form errors for user Data//
  Object.entries(userData).forEach(([key, property]) => {
    if (key === "address2") return;

    if (key === "state") {
      const selectEl = document.getElementById("state-select");
      if (!property.isValid) selectEl.classList.add("error");
      else selectEl.classList.remove("error");
          } else {
      const inputEl = document.querySelector(`input[name="${key}"]`);
      if (!property.isValid) {
        inputEl.classList.add("error");
      } else inputEl.classList.remove("error");
          }
  });
}

/*Add options to state select dropdowns*/
const stateSelect = document.getElementById("state-select");
statesData.forEach((state) => {
  const option = document.createElement("option");
  option.value = state.abbreviation;
  option.textContent = `${state.abbreviation}`;

  stateSelect.appendChild(option);
});

stateSelect.addEventListener("change", (e) => {
  userData.state.value = e.target.value;
  stateSelect.style.color = "gray";
  validateUserData("state");
  handleFormErrors();
});

/******PAYMENT FORM******/

/*PAYMENT INPUT MASKING*/
var creditCardInput = document.querySelector("input[name='cardNumber']");
var cardnumberCleave = new Cleave(creditCardInput, {
  creditCard: true,
  delimiter: " ",
  blocks: [4, 4, 4, 4],
  onCreditCardTypeChanged: function (type) {
    //This function sets maxLength of cvv input, 4 if card-type is AMEX, 3 otherwise
    //By default, maxLength is set to 3
    if (type === "amex") {
      document.querySelector("input[name='CVV']").maxLength = 4;
    } else {
      document.querySelector("input[name='CVV']").maxLength = 3;
    }
    paymentData.cardType = type;
  },
});

/*VALIDATE PAYMENT-FORM */
function validateCardNumber(cardNumber) {
  return payform.validateCardNumber(cardNumber);
}
function validateExpiry(month, year) {
  console.log("test", payform.validateCardExpiry("01", "23"));
  return payform.validateCardExpiry(month, year);
}
function validateCVV(cvv) {
  //This function uses npm package 'payform'
  //Checks cvv => isValid, if length = 3 for othercards, && length = 4 for amex
  //cardnumberCleave.properties.creditCardType returns card-type as string, defined in the code above.
  return payform.validateCardCVC(
    cvv,
    cardnumberCleave.properties.creditCardType
  );
}

function validatePaymentData() {
  paymentData.cardNumber.isValid = validateCardNumber(
    paymentData.cardNumber.value
  );
  paymentData.CVV.isValid = validateCVV(paymentData.CVV.value);
  paymentData.expiryYear.isValid = validateExpiry(
    paymentData.expiryMonth.value,
    paymentData.expiryYear.value
  );

  let month = paymentData.expiryMonth.value;
  if (month > 0 && month <= 12) paymentData.expiryMonth.isValid = true;
  else paymentData.expiryMonth.isValid = false;
}

function handlePaymentFormErrors() {
  if (!showPaymentFormErrors) return;
  const errorFields = {
    cardNumber: "input[name='cardNumber']",
    expiryMonth: "#month-select",
    expiryYear: "#year-select",
    CVV: "input[name='CVV']",
  };

  Object.entries(paymentData).forEach(([key, property]) => {
    const element = document.querySelector(errorFields[key]);

    if (element) {
      if (!property.isValid) {
        element.classList.add("error");
      } else {
        element.classList.remove("error");
      }
    }
  });
}

function checkPaymentFormValidity() {
  let isFormValid = true;
  Object.entries(paymentData).forEach(([key, property]) => {
    if (key === "cardType") return;
    if (!property.isValid) {
      isFormValid = false;
    }
  });
  return isFormValid;
}

/*Add options to month and year select*/
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthSelect = document.getElementById("month-select");
months.forEach((month, index) => {
  const monthOption = document.createElement("option");
  monthOption.value = ("0" + (index + 1)).slice(-2);
  monthOption.textContent = `${monthOption.value}`;

  monthSelect.appendChild(monthOption);
});

const yearSelect = document.getElementById("year-select");
const currentYear = new Date().getFullYear();
for (let year = currentYear; year <= 2038; year++) {
  const yearOption = document.createElement("option");
  yearOption.value = ("" + year).slice(-2);
  yearOption.textContent = year;

  yearSelect.appendChild(yearOption);
}

monthSelect.addEventListener("change", (e) => {
  paymentData.expiryMonth.value = e.target.value;
  validatePaymentData();
  handlePaymentFormErrors();
});
yearSelect.addEventListener("change", (e) => {
  paymentData.expiryYear.value = e.target.value;
  validatePaymentData();
  handlePaymentFormErrors();
});

/*HANDLE FORM INPUT*/
var userDataForm = document.querySelectorAll("input[type='text']");
userDataForm.forEach((inputElement) => {
  inputElement.addEventListener("input", (e) => {
    console.log("changing");
    if (e.target.name === "cardNumber" || e.target.name === "CVV") {
      paymentData[e.target.name].value = e.target.value;
      validatePaymentData();
      handlePaymentFormErrors();
      console.log(paymentData);
    } else {
      userData[e.target.name].value = e.target.value;
      console.log(userData);
      validateUserData(e.target.name);
      handleFormErrors();
    }
  });
});

/*HANDLE FORM BUTTON CLICK*/
const formButton = document.getElementById("orderFormBtn");
formButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (!checkFormValidity() || !checkPaymentFormValidity() || !isTermsAgreed) {
    showFormErrors = true;
    showPaymentFormErrors = true;
    handleFormErrors();
    handlePaymentFormErrors();
    console.log(isTermsAgreed);
    console.log(userData);
    console.log("not avalible to save lo localStorage yet");
  } else {
    //Save to localStorage
    localStorage.setItem("user-data", JSON.stringify(userData));
    localStorage.setItem("card-data", JSON.stringify(paymentData));
    document.getElementById("orderForm").reset();
    window.location.href = "thankyou.html";
    console.log("all good, Data saved in locastorage");
  }
});

/*Add event listener to terms agreement*/
var isTermsAgreed = false;
formButton.disabled = !isTermsAgreed;

const termsInput = document.querySelector('input[name="term"]');
termsInput.addEventListener("change", (e) => {
  isTermsAgreed = e.target.checked;
  formButton.disabled = !isTermsAgreed;
});
