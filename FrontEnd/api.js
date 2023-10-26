const apiUrl = "http://localhost:5678/api"

async function getWorks () {
    const response = await fetch (apiUrl + "/works");
    const works = await response.json();
    return works;
}

async function getCategories () {
    const response = await fetch (apiUrl + "/categories");
    const categories = await response.json();
    return categories;
}


async function logIn (email, password) {

    try {
    const response = await fetch(apiUrl + "/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({"email": email, "password": password})
                });

    const logInRequest = await response.json();
    console.log("Réussite :", logInRequest);
    return logInRequest;
    
  } catch (erreur) {
    console.error("Erreur :", erreur);
  }
}

