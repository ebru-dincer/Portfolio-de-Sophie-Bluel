
const gallery = document.querySelector(".gallery");
gallery.innerHTML = "";


/**
 * 
 * @param {Object} works 
 */
function generateGallery(works) {
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
/**
 * 
 * @param {Object} works 
 */
function generateButtonAll(works) {
    const filterButtons = document.querySelector(".filters");
    const buttonAll = document.createElement("button");
    buttonAll.innerHTML = "Tous";
    filterButtons.appendChild(buttonAll);
    buttonAll.classList.add("filter_btn");
    buttonAll.classList.add("filter_btn-selected");

    buttonAll.addEventListener("click", () => {
        gallery.innerHTML = "";
        generateGallery(works); 
    });

};

// Création des boutons Catégories
/**
 * 
 * @param {Object} categories 
 */
function generateButton(categories) {
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
    
        gallery.innerHTML = "";
        generateGallery(filterWorks);  
        });
    });

};


function editHomepage() {

    if (localStorage.getItem("token")) {

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
        
                deleteButtons.forEach(async (deleteButton) => {

                    deleteButton.addEventListener("click", async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
               
                    const deleteButtonId = e.target.dataset.id;
                    e.target.parentNode.remove()
                    
                    const responseDelete = await deleteWorks (deleteButtonId);

                    if (responseDelete.ok) {  // if HTTP-status is 200-299
                    const works = await getWorks();
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
        /**
         * 
         * @param {Object} works 
         */
        function generateModalGallery(works) {
            const modalGallery = document.querySelector(".modal-gallery");
            modalGallery.innerHTML = "";

            for (let i = 0; i < works.length; i++) {
                const figure = `<figure>
                <img class="delete-button" data-id="${works[i].id}" src="./assets/icons/trash-icon.png">
                <img class="modal-gallery-img" src="${works[i].imageUrl}">
                </figure>`;
                modalGallery.innerHTML += figure;
            };
        }


        //FORMULAIRE

        //Reinitialisation formulaire
        function reset() {
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

        //Envoi nouveau projet à l'API
        async function addNewWork(e) {
            e.preventDefault();

            const formElement = document.getElementById("form-element");
            const formData = new FormData(formElement);
            const selectedPicture = document.querySelector("input[type=file]").files[0];
            formData.append("image", selectedPicture);

            await sendWorks (formData);
            gallery.innerHTML = "";
            const works = await getWorks();
            generateGallery(works);
        };


        //Publication du nouveau projet dans la gallery
        function eventSubmit(e) {
            e.preventDefault();

            const selectedPicture = document.querySelector("input[type=file]").files[0];
            const title = document.getElementById("title").value;
            const category = document.getElementById("category-select");
            const categoryValue = category.options[category.selectedIndex].value;            

            // Message d'erreur si champs vides
            if ((selectedPicture === "") || (title === "") || (categoryValue === "")) {   
                alert("Veuillez remplir tous les champs.");
                return false;
                
            } else {
                addNewWork(e);
                reset();
            }
        }
        
        //Fonctions Formulaire
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

                
                if (selectedPicture && title.value !== "" && categoryValue !== "") { 
                    const btnPreview = document.querySelector("form input[type=submit]");
                    btnPreview.classList.remove("btn-disabled");
                    btnPreview.classList.add("btn-abled");
                    btnPreview.disabled = false;
                }  else {
                    const btnPreview = document.querySelector("form input[type=submit]");
                    btnPreview.classList.add("btn-disabled");
                    btnPreview.classList.remove("btn-abled");
                    btnPreview.disabled = true;
                }
            }
            
            const title = document.getElementById("title");
            const category = document.getElementById("category-select");
            
            title.addEventListener("change", activateButton); 
            category.addEventListener("change", () => {
                activateButton()
            })
                
            
            //Affichage des travaux dans Gallery
            const formElement = document.getElementById("form-element");
            formElement.addEventListener("submit", eventSubmit);

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
            const formElement = document.getElementById("form-element");
            formElement.removeEventListener("submit", eventSubmit);
        };

        //Retour du FORMULAIRE
        document.querySelector(".js-fmodal-return").addEventListener("click", async (e) => {
            const formModal = document.getElementById("form-modal");
            formModal.classList.add("display-none");
            formModal.classList.remove("form_modal");
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
