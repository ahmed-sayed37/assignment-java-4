const registerContainer = document.getElementById("registerContainer");
const loginContainer = document.getElementById("loginContainer");
const homeContainer = document.getElementById("homeContainer");

const showLoginFormLink = document.getElementById("showLoginForm");
const showRegisterFormLink = document.getElementById("showRegisterForm");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const regUsername = document.getElementById("regUsername");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");

const regUsernameError = document.getElementById("regUsernameError");
const regEmailError = document.getElementById("regEmailError");
const regPasswordError = document.getElementById("regPasswordError");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError");

const usernameSpan = document.getElementById("usernameSpan");
const logoutBtn = document.getElementById("logoutBtn");

function getUsers(){
  const users = JSON.parse(localStorage.getItem("users"));
  return users ? users : [];
}

function saveUsers(users){
  localStorage.setItem("users", JSON.stringify(users));
}

function showRegisterContainer(){
  registerContainer.style.display = "block";
  loginContainer.style.display = "none";
  homeContainer.style.display = "none";
}

function showLoginContainer(){
  registerContainer.style.display = "none";
  loginContainer.style.display = "block";
  homeContainer.style.display = "none";
  loginContainer.classList.add("animate-in");

}

function showHomeContainer(username){
  registerContainer.style.display = "none";
  loginContainer.style.display = "none";
  homeContainer.style.display = "block";
  usernameSpan.textContent = username; 
}

showLoginFormLink.addEventListener("click", showLoginContainer);
showRegisterFormLink.addEventListener("click", showRegisterContainer);

const currentUser = localStorage.getItem("currentUser");
if (currentUser){
  showHomeContainer(currentUser);
} else {
  showLoginContainer();
}

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  regUsernameError.textContent = "";
  regEmailError.textContent = "";
  regPasswordError.textContent = "";

  const usernameValue = regUsername.value.trim();
  const emailValue = regEmail.value.trim();
  const passwordValue = regPassword.value.trim();

  if (!usernameValue){
    regUsernameError.textContent = "Please enter your username";
  
    return;
  }
  if (!emailValue){
    regEmailError.textContent = "Please enter your email";
    return;
  }

  
  if (!emailValue.includes("@")){
    regEmailError.textContent = "Invalid email format";
    return;
  }
  if (!passwordValue){
    regPasswordError.textContent = "Please enter your password";
    return;
  }

  const users = getUsers();

  const isEmailExist = users.some((user) => user.email === emailValue);
  if (isEmailExist){
    regEmailError.textContent = "Email already exists";
    return;
  }

  users.push({
    username: usernameValue,
    email: emailValue,
    password: passwordValue
  });
  saveUsers(users);

  alert("Registration successful! You can now log in.");
  showLoginContainer();
  registerForm.reset();
});

loginForm.addEventListener("submit", (e) =>{
  e.preventDefault();

  loginEmailError.textContent = "";
  loginPasswordError.textContent = "";

  const emailValue = loginEmail.value.trim();
  const passwordValue = loginPassword.value.trim();

  if (!emailValue){
    loginEmailError.textContent = "Please enter your email";
    
    return;
  }
  if (!emailValue.includes("@")){
    loginEmailError.textContent = "Invalid email format";

    return;
  }
  if (!passwordValue){
    loginPasswordError.textContent = "Please enter your password";
    return;
  }

  const users = getUsers();
  const foundUser = users.find(
    (user) => user.email === emailValue && user.password === passwordValue
  );

  if (!foundUser){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Invalid email or password. Please try again.",
      footer: '<a href="javascript:void(0)" style="text-decoration: none;" onclick="showRegisterContainer(); Swal.close();">Go to Sign Up?</a>',
      confirmButtonColor: "#24353F",
      background: "#24353F", 
      color: "#fff",
      confirmButtonWidth: "200px",
    });
     return;
  }

  localStorage.setItem("currentUser", foundUser.username);
  showHomeContainer(foundUser.username);


  loginForm.reset();
});

logoutBtn.addEventListener("click", () =>{
  localStorage.removeItem("currentUser");
  showLoginContainer();
});