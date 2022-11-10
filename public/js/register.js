let apiRegister = "http://localhost:3000/users/register";
function signup() {
    handleCreateForm();
  }
  function createUser(data) {
    fetch(apiRegister, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(function (res) {
      return res.json();
    });
    if (data) {
        console.log(data);
      alert("dang ky thanh cong" );
    }
  }
  function handleCreateForm() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let name = document.getElementById("name");
    let age = document.getElementById("age");
    let phoneNumber = document.getElementById("phoneNumber");
    let address = document.getElementById("address");
    let user = {
      email : email.value,
      password: password.value,
      name: name.value,
      age:  parseInt(age.value),
      phoneNumber: phoneNumber.value,
      address: address.value,
    };
    console.log(user);
    createUser(user);
  }