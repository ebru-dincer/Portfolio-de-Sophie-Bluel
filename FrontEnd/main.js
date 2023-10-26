console.log("exécution du fichier main.js");

const gallery = document.querySelector(".gallery");
gallery.innerHTML = "";


function generateGallery(works) {
    console.log(works);
    for (let i = 0; i < works.length; i++) {
        const worksElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const captionElement = document.createElement("figcaption");

        imageElement.src = works[i].imageUrl;
        captionElement.innerHTML = works[i].title;

        worksElement.appendChild(imageElement);
        worksElement.appendChild(captionElement);
        gallery.appendChild(worksElement);
    };
};


// Création du bouton Tous
function generateButtonAll(works) {
    const filterButtons = document.querySelector(".filters");
    const buttonAll = document.createElement("button");
    buttonAll.innerHTML = "Tous";
    filterButtons.appendChild(buttonAll);
    buttonAll.classList.add("filter_btn");
    buttonAll.classList.add("filter_btn-selected");

    buttonAll.addEventListener("click", () => {
        console.log("clic sur bouton Tous");
        gallery.innerHTML = "";
        generateGallery(works); 
    });

};

// Création des boutons Catégories
function generateButton(categories) {
    
    categories.forEach(category => {
        console.log(category);
        const buttonsCategory = document.createElement("button");
        buttonsCategory.innerHTML = category.name;
        const filterButtons = document.querySelector(".filters");
        filterButtons.appendChild(buttonsCategory);
        buttonsCategory.classList.add("filter_btn");

        buttonsCategory.addEventListener("click", async () => {
        const categoryName = category.name;
        const works = await getWorks();
        const filterWorks = works.filter(work =>  
            work.category.name === categoryName 
        );
        console.log(filterWorks);
        gallery.innerHTML = "";
        generateGallery(filterWorks);  
        });
    });

};


function editHomepage() {

    if (localStorage.getItem("token")) {
        console.log("token récupéré");
        const editBanner = document.querySelector(".edit-banner");
        editBanner.classList.add("display-flex");
        editBanner.classList.remove("display-none");

        const editProject = document.querySelector(".edit-project");
        editProject.classList.add("display-flex");
        editProject.classList.remove("display-none");

        const filterButtons = document.querySelectorAll("button");        
        filterButtons.forEach((button) => {
            button.classList.add("display-none");
            button.classList.remove("filter_btn");
        });

        const logInLink = document.querySelector(".nav-login")
        logInLink.innerHTML = "logout";
        logInLink.addEventListener("click", async () => {
            localStorage.clear();
            location.reload();
        });

      }
          
}


const init = async () => {
    const works = await getWorks();
    const categories = await getCategories ();
    console.log(works);
    generateGallery(works);
    generateButtonAll(works);
    generateButton(categories);
    editHomepage();
}

init();