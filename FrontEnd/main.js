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
    console.log(categories)
    categories.forEach(category => {
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

        // Mode Edition
        const editBanner = document.querySelector(".edit-banner");
        editBanner.classList.add("display-flex");
        editBanner.classList.remove("display-none");

        const logInLink = document.querySelector(".nav-login")
        logInLink.innerHTML = "logout";
        logInLink.addEventListener("click", async () => {
            localStorage.clear();
            location.reload();
        });

        const editProject = document.querySelector(".edit-project");
        editProject.classList.add("display-flex");
        editProject.classList.remove("display-none");

        const filterButtons = document.querySelectorAll("button");        
        filterButtons.forEach((button) => {
            button.classList.add("display-none");
            button.classList.remove("filter_btn");
        });


        // MODALE
        const openModal = async function (e) {
            e.preventDefault();
            const modal = document.getElementById("modal1");
            modal.classList.remove("display-none");
            modal.classList.add("modal");
            modal.removeAttribute("aria-hidden");
            modal.addEventListener("click", closeModal);
            modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
            modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

            const works = await getWorks();
            generateModalGallery(works);


            //Suppression des Travaux
            async function deleteEvent() { 
                const deleteButtons = document.querySelectorAll(".delete-button");
                console.log(deleteButtons);
        
                deleteButtons.forEach(async (deleteButton) => {

                    deleteButton.addEventListener("click", async (e) => {
                    console.log("clic sur le bouton delete")
                    e.preventDefault();
                    e.stopPropagation();
               
                    // console.log(e.target.dataset.id)
                    const deleteButtonId = e.target.dataset.id;
                    e.target.parentNode.remove()
                    
                    const responseDelete = await deleteWorks (deleteButtonId);
                    console.log(responseDelete);

                    if (responseDelete.ok) {  // if HTTP-status is 200-299
                    // deleteEvent();
                    const works = await getWorks();
                    // generateModalGallery(works);
                    gallery.innerHTML = "";
                    generateGallery(works);

                    } else {
                    alert("Echec de suppression"); 
                    }

                    });
                });
            };
        
            deleteEvent();

            
        }

        const closeModal = function (e) {
            e.preventDefault();
            const modal = document.getElementById("modal1");
            modal.classList.add("display-none");
            modal.classList.remove("modal");
            modal.setAttribute("aria-hidden", "true");
            modal.removeEventListener("click", closeModal);
            modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
            modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

        }

        const stopPropagation = function (e) {
            e.stopPropagation()
        }

        document.querySelectorAll(".js-modal").forEach(a => {
            a.addEventListener("click", openModal)
        })


        // TRAVAUX MODALE
        function generateModalGallery(works) {
            const modalGallery = document.querySelector(".modal-gallery");
            modalGallery.innerHTML = "";

            for (let i = 0; i < works.length; i++) {
                // const worksElement = document.createElement("figure");
                // const imageElement = document.createElement("img");
                // const trashElement = document.createElement("div")
                
                // trashElement.classList.add("delete-button");
                // trashElement.dataset.id = works[i].id;
                // trashElement.innerHTML = `<img src="" `;
                
                // imageElement.src = works[i].imageUrl;
        
                // worksElement.appendChild(trashElement);
                // worksElement.appendChild(imageElement);
                // modalGallery.appendChild(worksElement);

                const figure = `<figure>
                <img class="delete-button" data-id="${works[i].id}" src="./assets/icons/trash-icon.png">
                <img class="modal-gallery-img" src="${works[i].imageUrl}">
                </figure>`;
                modalGallery.innerHTML += figure;

            };

            
        }


        //FORMULAIRE 
        const openFormModal = async function (e) {
            e.preventDefault();
            closeModal(e);
            const formModal = document.getElementById("form-modal");
            formModal.classList.remove("display-none");
            formModal.classList.add("form_modal");
            formModal.removeAttribute("aria-hidden");
            formModal.addEventListener("click", closeFormModal);
            formModal.querySelector(".js-fmodal-close").addEventListener("click", closeFormModal);
            formModal.querySelector(".js-fmodal-stop").addEventListener("click", stopPropagation);
            
            // Aperçu Image 
            const fileInput = document.getElementById("file-upload");

            fileInput.addEventListener("change", async () => {
                const selectedPicture = document.querySelector("input[type=file]").files[0];
                console.log(selectedPicture);
                

                const preview = document.querySelector(".preview-field");
                const reader = new FileReader();

                reader.addEventListener("load", () => {
                    // convert image file to base64 string
                    preview.src = reader.result;
                    },
                  false,
                );
              
                if (selectedPicture) {
                  reader.readAsDataURL(selectedPicture);
                  const labelInput = document.querySelector(".form-preview label");
                  labelInput.classList.add("display-none");
                  labelInput.classList.remove("custom-file-upload");

                  const imageIcon = document.querySelector(".form-preview div");
                  imageIcon.classList.add("display-none");
                  imageIcon.classList.remove("image-icon");

                  const previewInfo = document.querySelector(".form-preview p");
                  previewInfo.classList.add("display-none");
                  previewInfo.classList.remove("preview-info");

                  const imgPreview = document.querySelector(".preview-field");
                  imgPreview.classList.remove("display-none");

                //   const btnPreview = document.querySelector("form input[type=submit]");
                //   btnPreview.classList.remove("btn-disabled");
                //   btnPreview.classList.add("btn-abled");
                //   btnPreview.disabled = false;

                activateButton();
                }

              }
            );
            

            //Activation bouton 
            function activateButton() {
                const selectedPicture = document.querySelector("input[type=file]").files[0];
                const title = document.getElementById("title");
                const category = document.getElementById("category-select");
                const categoryValue = category.options[category.selectedIndex].value;  


                console.log("tentative activation bouton");
                console.log(selectedPicture)
                console.log(title.value)
                console.log(categoryValue)

                
                if (selectedPicture && title.value !== "" && categoryValue !== "") { 
                    console.log("bouton activé")
                    const btnPreview = document.querySelector("form input[type=submit]");
                    btnPreview.classList.remove("btn-disabled");
                    btnPreview.classList.add("btn-abled");
                    btnPreview.disabled = false;
                }
            }
            
            const title = document.getElementById("title");
            const category = document.getElementById("category-select");
            const categoryValue = category.options[category.selectedIndex].value;  
            
            title.addEventListener("change", activateButton); 
            category.addEventListener("change", () => {
                console.log(categoryValue)
                activateButton()
            })
                
            


            //Affichage des travaux dans Gallery
            const formElement = document.getElementById("form-element");

            formElement.addEventListener("submit", (e) => {
                e.preventDefault();
                console.log("clic sur valider")

                const selectedPicture = document.querySelector("input[type=file]").files[0];
                const title = document.getElementById("title").value;
                const category = document.getElementById("category-select");
                const categoryValue = category.options[category.selectedIndex].value;            

                // Message d'erreur si champs vides
                console.log(selectedPicture)
                console.log(title)
                console.log(categoryValue)


                if ((selectedPicture === "") || (title === "") || (categoryValue === "")) {   
                    alert("Veuillez remplir tous les champs.");
                    return false;
                    
                } else {
                    console.log("l'image est publiée");
                    addNewWork(e);
                    reset();
                    // closeFormModal(e);
                }
            });

            function reset() {
                // const previewImage = document.querySelector(".preview-field");
                // let previewInput = document.querySelector("input[type=file]");
                // let title = document.getElementById("title");
                // let category = document.getElementById("category-select");
                // const files = document.querySelector("input[type=file]").files;

                
                // previewInput.value = "";  
                // previewImage.src = "";
                // title.value = "";
                // category.selectedIndex = 0;
                
                // selectedPicture.value = ""; 
                // selectedPicture.splice(0, 1);   // TypeError: selectedPicture.splice is not a function
            

                const formElementPreview = document.getElementById("form-element-preview");
                formElementPreview.reset();

                const formElement = document.getElementById("form-element");
                formElement.reset();
                

                const labelInput = document.querySelector(".form-preview label");
                labelInput.classList.add("custom-file-upload");
                labelInput.classList.remove("display-none");
                
                const imageIcon = document.querySelector(".form-preview div");
                imageIcon.classList.add("image-icon");
                imageIcon.classList.remove("display-none");
                
                const previewInfo = document.querySelector(".form-preview p");
                previewInfo.classList.add("preview-info");
                previewInfo.classList.remove("display-none");
                
                const imgPreview = document.querySelector(".preview-field");
                imgPreview.classList.add("display-none");

                const btnPreview = document.querySelector("form input[type=submit]");
                btnPreview.classList.remove("btn-abled");
                btnPreview.classList.add("btn-disabled");
                btnPreview.disabled = true;
            }


           
            async function addNewWork(e) {
                e.preventDefault();

                const formData = new FormData(formElement);
                const selectedPicture = document.querySelector("input[type=file]").files[0];
                formData.append("image", selectedPicture);

                for (item of formData) {
                    console.log(item[0], item[1]);
                }

                const responseSendWorks = await sendWorks (formData);
                console.log(responseSendWorks);

                // closeFormModal(e);
                gallery.innerHTML = "";
                // console.log(gallery);
                const works = await getWorks();
                // console.log(works);
                generateGallery(works);

            };

        };


        //Ouverture du FORMULAIRE 
        document.querySelector(".modal-btn").addEventListener("click", openFormModal)

        //Fermeture du FORMULAIRE
        const closeFormModal = function (e) {
            e.preventDefault();
            const formModal = document.getElementById("form-modal");
            formModal.classList.add("display-none");
            formModal.classList.remove("form_modal");
            formModal.setAttribute("aria-hidden", "true");
            formModal.removeEventListener("click", closeFormModal);
            formModal.querySelector(".js-fmodal-close").removeEventListener("click", closeFormModal);
            formModal.querySelector(".js-fmodal-stop").removeEventListener("click", stopPropagation);

        };

        //Retour du FORMULAIRE
        document.querySelector(".js-fmodal-return").addEventListener("click", async (e) => {
            const formModal = document.getElementById("form-modal");
            formModal.classList.add("display-none");
            formModal.classList.remove("form_modal");
            console.log("cloture");
            openModal(e)
        });
        
    };
};
          



  


const init = async () => {
    const works = await getWorks();
    const categories = await getCategories ();
    generateGallery(works);
    generateButtonAll(works);
    generateButton(categories);
    editHomepage();
};

init();