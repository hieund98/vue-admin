let apiForgot = "http://localhost:3000/users/forgot-password";
function Forgot() {
    hanldeForgot();
}

function forgotAPI(body,data) {
  fetch(apiForgot, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data : data,
    body: JSON.stringify(body),
  }).then(function (res) {
    return res.json();
  });
}
function hanldeForgot() {
  let email1 = document.getElementById("email1");
  let loginobj = {
    email: email1.value,
  };
  console.log(loginobj);

  forgotAPI(loginobj,"id");

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