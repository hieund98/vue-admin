// import { Buffer } from 'buffer';
let apiLogin = "http://localhost:3000/auth/login";
function login() {
    hanldeLogin();
}

function loginAPI(data) {
  fetch(apiLogin, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(response => response.json()
    // function (res) {
    // console.log(res.access_token);
    // document.cookie = res.access_token;

    // return res.json();
//   }
  )
  .then(data => {setCookie("token", data.access_token,30)
 console.log()
  if (typeof(data.access_token)=="undefined" ) {
    alert("Login Failed. Please try again.");
  }else{
    location='shop.html'
    alert("Login Successful, redirect to home page.");
  }
   }
  )
}
function hanldeLogin() {
  let email1 = document.getElementById("email1");
  let password1 = document.getElementById("password1");

  let loginobj = {
    email: email1.value,
    password: password1.value,
  };
  loginAPI(loginobj);
  // data.forEach((data) => {
  //   if (data.email1 == username && data.password1 == password) {
  //     alert("dang nhap thanh cong");
  //   }
  // });
}
function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  // function decodeJwt(token) {
  //   var base64Payload = token.split(".")[1];
  //   var payloadBuffer = Buffer.from(base64Payload, "base64");
  //   return JSON.parse(payloadBuffer.toString());
  // }
