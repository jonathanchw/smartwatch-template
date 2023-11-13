// Order Form Validation //
$(document).ready(function() {

  $.validator.addMethod("month_check", function(value, element) {
    var dt = new Date();
    var cyr = dt.getFullYear();
    var mth = dt.getMonth()+1; 
    var month = $("#expiryMonth").val();

    return month >=mth;

  }, "Invalid Card Expiration.");

  $.validator.addMethod("year_check", function(value, element) {
    var dt = new Date();
    var cyr = dt.getFullYear();
    var mth = dt.getMonth()+1; 

    var creditcardexpyear = $("#expiryYear").val();
    return creditcardexpyear >= cyr;

  }, "Invalid Card Expiration.");
  
  $("#orderForm").validate({
    rules: {
      firstName: "required",
      lastName: "required",
      email: {
        required: true,
        email: true
      },
      /*phone: {
        required: true,
        number: true,
        minlength:10,
      },*/

      state: {
        required: true,
      },
      city: {
        required: true,
      },
      address: {
        required: true,
      },
      zipCode: {
        required: true,
      },
      country: {
        required: true,
      },
      state1: {
        required: true,
      },
      city1: {
        required: true,
      },
      address2: {
        required: true,
      },
      zip1: {
        required: true,
      },
      country1: {
        required: true,
      },
      cardtype: {
        required: true,
      },
      cardNumber: {
        required: true,
        //number: true,
        minlength:15,
        maxlength:20,
      },
      expiryYear: { 
        required: true,
        year_check :true,
      },
      expiryMonth: 
      {
        required: true,
      },
      CVV: {
        required: true,
        number: true,
        minlength:3,
        maxlength:4,
      },
      term: {
        required: true,
      },
    },
    messages: {
      fname: "Please enter your firstname",
      lname: "Please enter your lastname",
      email: {
        required: "Please enter your email address.",
        remote: jQuery.validator.format("Email \"{0}\" have been used.")
      },
      phone: {
        required: "Please enter phone number",
        number: "Phone Number in vaild format",
        minlength: "Phone Number in 10 digit format",
      },
      state: {
        required: "Please select your state",
      },
      city: {
        required: "Please enter your city",
      },
      address: {
        required: "Please enter your address",
      },
      zipCode: {
        required: "Please enter Post code",
      },
      country: {
        required: "Please select country",
      },
      state1: {
        required: "Please select your state",
      },
      city1: {
        required: "Please enter your city",
      },
      2: {
        required: "Please enter your address",
      },
      zip1: {
        required: "Please enter Post code",
      },
      country1: {
        required: "Please select country",
      },
      cardtype: {
        required: "Please select card type",
      },
      cardNumber: {
        required: "Please enter card number",
        number: "Please enter card number in valid format with in 15 to 16 digits.",
      },
      expiryYear: {
        required: "Please select card expire year",
      },
      expiryMonth: {
        required: "Please select card expire month",
      },
      CVV: {
        required: "Please enter card cvv number",
        number: "Please enter card cvv number in valid format with in 3 to 4 digits.",
      },
      term: {
        required:  "Please check terms & conditions policy.",
      },
    },
    errorElement: "em",
  });
});



// Add to Card 
/*$(document).on('click', ".addToCartbtn", function(e){

  var buttObj = $(this);
  var productId = $(this).attr('data_pid');
  var productPrice = $(this).attr('data_price');
  var shippingPrice = $(this).attr('data_shipping');
  var productQty = 1;
  var base_url = cartActionUrl; // cart action url

  if(productId != ''){
    $.ajax({
      url: base_url,
      type: 'post',
      data:{'action':'addToCart','productId':productId,'productPrice':productPrice,'pshippingprice':shippingPrice,'productQty':productQty},
      //dataType:'json',
      success: function(res) {
        $("#cartAction"+productId).load(location.href+" #cartAction"+productId,"");
        $("#cartActionCheck").load(location.href+" #cartActionCheck","");
        $("#cartActionMenu").load(location.href+" #cartActionMenu","");
        if($("#cartPageAction").length){ // cartpage
          location.reload();
        }
      }
    });
  }
});

// Delete Card
$(document).on('click', ".deleteCartBtn", function(e){
  e.preventDefault();
  var cartRowId = $(this).attr('data-rowid');
  var base_url = cartActionUrl; // cart action url
  if(cartRowId != ''){
    $.ajax({
      url: base_url,
      type: 'post',
      data:{'action':'removeToCart','cartRowId':cartRowId},
      //dataType:'json',
      success: function(res){
        $("#cart_tabel").load(location.href+" #cart_tabel > *","");
        $("#cartActionMenu").load(location.href+" #cartActionMenu","");
      }
    });
  }
});


/*$(document).on('click','.cart_tocheckout_submit',function(){
  var checkTotalValue = $('#check_fivethousand_less').val();
  checkTotalValue = parseFloat(checkTotalValue);
  if(checkTotalValue < 500){
    window.location='<?php echo WEBSITE_URL;?>order.html';
  }else{
    $('#order_error_message').modal('show');
  }
});

function show_message(message){
  $(".get_successmessage_data").html(message);
}

/*$('#coupon_code_from').on('submit',function(e){
  e.preventDefault();
  let coupon_value = $("#coupon_code_field").val();
  if(coupon_value == ''){
    $('#respons_message').modal('show');
    $('#res_message').html('Please enter coupon/promo code!');
  }else{
    $('#respons_message').modal('show');
    $('#res_message').html('Invalid coupon/promo code');
    $("#coupon_code_field").val('');
  }
});*/
