import React, { useEffect } from 'react';
import {  useOrderForm } from 'vtex.order-manager/OrderForm'
// import { useProduct } from 'vtex.product-context';
// import "./styles/expressCheckout.css"
// import {
//   // OrderShippingProvider,
//   useOrderShipping,
// } from 'vtex.order-shipping/OrderShipping'


declare global {
  interface Window {
      kueskipay: any;
      kpayAddressData:any;
      vtex:any;
  }
}

function render(kueskipay:any, items:Array<any>, order:any, redirectURL:string){
  console.log("HERE I AM");

  if(kueskipay){
    const cost:number = order.value / 100;
    const notSuccessURL = redirectURL +"/checkout/#/payment";
    console.log("COST ", cost);
    console.log("ITEMS ", items);


    console.log("NOT SUCCESS URL ", notSuccessURL);

    kueskipay.render({
      config: {
        size: 'small',
        label: 'pay',
        mode: 'modal|redirect'
      },
      payment: {
        "description": "Express Checkout",
        "order_id": order.id,
        "callbacks": {
          "on_success":  redirectURL + "/checkout/orderPlaced/?og="+order.id,
          "on_reject":   notSuccessURL,
          "on_canceled": notSuccessURL,
          "on_failed":   notSuccessURL
        },
        "utms": {
          "utm_source": "newsletter",
          "utm_medium": "ppc",
          "utm_campaign": "awesome-campaign",
          "utm_content": "image-1",
          "utm_term": "keyword",
          "utm_custom": "other"
        },
        "amount": {
          "total": cost,
          "currency": "MXN",
          "details": {
            "subtotal": cost,
            "shipping": 0,
            "handling_fee": 0,
            "tax": 0,
          },
        },
        "shipping":{
          "name":{
            "name":"Uriel",
            "last":"Mendoza Ramirez"
          },
          "address":{
            "address":"20 de Noviembre",
            "interior": "404",
            "neighborhood":"Zona Centro",
            "city":"Irapuato",
            "state": "Guanajuato",
            "zipcode":"36500",
            "country":"MX" // two-character ISO 3166-1 code
          },
          "phone_number": "555-555-5555",
          "email": "uriel.mendoza@bar.com",
          "type": "HOME"
        },
        "billing":{
          "business":{
            "name":"Uriel Mendoza Ramirez",
            "rfc":"HEHJ881210C18"
          },
          "address":{
            "address":"20 de Noviembre",
            "interior": "404",
            "neighborhood":"Zona Centro",
            "city":"Irapuato",
            "state": "Guanajuato",
            "zipcode":"36500",
            "country":"MX" // two-character ISO 3166-1 code
          },
          "phone_number": "555-555-5555",
          "email": "uriel.mendoza@bar.com"
        },
        "items": items,
      },
      onError: function() {},
      onSuccess: function() {}
    }, 'kueski_pay-id-button');
  }

}

function getItems(items:Array<any>):Array<any>{
  let newItems:Array<any> = [];
  items.forEach(item => {
      let itemData = {
        name: item.name,
        description: item.name,
        quantity: item.quantity,
        price: Number(item.price / 100),
        tax: item.taxValue || 0,
        sku: item.id,
        currency: "MXN"
      }

      newItems.push(itemData);
  });
  return newItems;

}

// function hideExpressCheckout(hide:boolean){
//   useEffect(() => {
//     const bannerHeader:any = document.getElementsByClassName("kpay__text-size--medium") || [];
//     const btnCheckout:any = document.getElementsByClassName("kpay__btn-status--done") || [];
//     if(btnCheckout.length){
//       if(hide){
//       btnCheckout[0].style.display = 'none';
//       }
//       else{
//         btnCheckout[0].style.display = 'block';
//       }
//     }

//     for(let i = 0; i < bannerHeader.length; i++){
//       if(hide){
//         bannerHeader[i].style.display = 'none';
//       }
//       else{
//         bannerHeader[i].style.display = 'block';
//       }

//   }
//   })
// }

const ExpressCheckout = () => {
  const { orderForm } = useOrderForm();
  console.log("ORDER INFORMATION: ", orderForm);

  // let addressData = {
  //   name: "Uriel",
  //   lastName: "Mendoza Ramirez",
  //   address: "20 de Noviembre",
  //   exterior: "404",
  //   interior: "",
  //   neighborhood: "Zona Centro",
  //   city: "Irapuato",
  //   state: "Guanajuato",
  //   zipcode: "36500",
  //   country: "MX",
  //   phoneNumber: "3325104175",
  //   email: "uriel.mendoza@kueski.com"
  // }
  // window.kpayAddressData = addressData;

  // const fullAddress = {
  //   "shipping": {
  //     "name":{
  //       "name": addressData.name,
  //       "last": addressData.lastName
  //     },
  //     "address":{
  //       "address": addressData.address,
  //       "interior": addressData.interior,
  //       "neighborhood":addressData.neighborhood,
  //       "city": addressData.city,
  //       "state": addressData.state,
  //       "zipcode":addressData.zipcode,
  //       "country": addressData.country // two-character ISO 3166-1 code
  //     },
  //     "phone_number": addressData.phoneNumber,
  //     "email": addressData.email,
  //     "type": "HOME"
  //   },
  //   "billing":{
  //     "business":{
  //       "name": addressData.name + " " + addressData.lastName,
  //       "rfc":""
  //     },
  //     "address":{
  //       "address": addressData.address,
  //       "interior": addressData.interior,
  //       "neighborhood":addressData.neighborhood,
  //       "city": addressData.city,
  //       "state": addressData.state,
  //       "zipcode":addressData.zipcode,
  //       "country": addressData.country // two-character ISO 3166-1 code
  //     },
  //     "phone_number": addressData.phoneNumber,
  //     "email": addressData.email,
  //   }
  // }



  const items = orderForm.items || [];
  let kueskipay = window.kueskipay || null;

  useEffect(() => {
    kueskipay = window.kueskipay || null;
    if(items.length > 0 && kueskipay){
      const newItems = getItems(items);
      render(kueskipay, newItems, orderForm, window.location.toString());
    }
  });

  if(items.length > 0){
    // hideExpressCheckout(false);
    return (
      <div id="kueski_pay-id-button">UMR</div>
    )
  }
  else{
    // hideExpressCheckout(true);
    if(items.length > 0){
      return (
       <div>OK</div>
      )
    }
    return "";
  }
}

export default ExpressCheckout
