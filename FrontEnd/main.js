console.log("exécution du fichier main.js");

const gallery = document.querySelector(".gallery");
gallery.innerHTML = "";

const works = getWorks();

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
const filterButtons = document.querySelector(".filters");
const buttonAll = document.createElement("button");
buttonAll.innerHTML = "Tous";
filterButtons.appendChild(buttonAll);
buttonAll.classList.add("filter_btn");
buttonAll.classList.add("filter_btn-selected");
buttonAll.addEventListener("click", () => {
    console.log("clic sur bouton Tous");
    generateGallery(works);
})

// Création des boutons Catégories
function generateButton(categories) {
    
    categories.forEach(category => {
        console.log(category);
        const works = getWorks();
        const buttonsCategory = document.createElement("button");
        buttonsCategory.innerHTML = category.name;
        filterButtons.appendChild(buttonsCategory);
        buttonsCategory.classList.add("filter_btn");

        
        buttonsCategory.addEventListener("click", () => {
        const categoryName = category.name;
        const filterWorks = works.filter(work => {  
            return work.category.name === categoryName 
        });
        console.log(filterWorks);
        gallery.innerHTML = "";
        generateGallery(filterWorks);  
    });
});
};





const init = async () => {
    const works = await getWorks();
    const categories = await getCategories ();
    console.log(works);
    generateGallery(works);
    generateButton(categories);
}

init();