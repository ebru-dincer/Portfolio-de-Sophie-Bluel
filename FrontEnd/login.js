
const email = document.getElementById("email");
const password = document.getElementById("password");
const formLogIn = document.querySelector(".form-log-in");
const error = document.querySelector(".error");


async function sendLogIn() {
    
  formLogIn.addEventListener("submit", async function (event) {
    
    event.preventDefault();  

    const emailValue = email.value;
    const passwordValue = password.value;
    
    const responseLogIn = await logIn(emailValue, passwordValue)

    if (responseLogIn.token) {
      localStorage.setItem("token", responseLogIn.token)
      window.location.href = "index.html";
      
    } else {
      console.error("token non trouvé");
      error.innerHTML= "Erreur dans l’identifiant ou le mot de passe";
    }

  }); 
}


const init = async () => {
  await sendLogIn(); 
}

init();
