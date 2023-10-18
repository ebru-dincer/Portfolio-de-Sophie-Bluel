const apiUrl = "http://localhost:5678/api"

async function getWorks () {
    const response = await fetch (apiUrl + "/works");
    const works = await response.json();
    return works
}

async function getCategories () {
    const response = await fetch (apiUrl + "/categories");
    const categories = await response.json();
    return categories
}