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

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Object}
 */
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

/**
 * 
 * @param {number} id 
 * @returns 
 */
async function deleteWorks (id) {
  
  let token = localStorage.getItem("token");

  try { 
    const response = await fetch(apiUrl + "/works/" + id, {
                  method: "DELETE",
                  headers: {"Authorization": `Bearer ${token}`},
              });
   
   return response;
  
  } catch (erreur) {
    console.error("Erreur :", erreur);
  }
}

/**
 * 
 * @param {Object} formData 
 * @returns {Object}
 */
async function sendWorks (formData) {

  let token = localStorage.getItem("token");

  try {
  const response = await fetch(apiUrl + "/works", {
                  method: "POST",
                  headers: {"Authorization": `Bearer ${token}`},
                  body: formData,
                });
  
  const sendRequest = await response.json();
  console.log("Réussite :", sendRequest);
  return sendRequest;
  
} catch (erreur) {
  console.error("Erreur :", erreur);
}
}

