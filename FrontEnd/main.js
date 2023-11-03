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
            const deleteButtons = document.querySelectorAll(".delete-button");
            console.log(deleteButtons);
        
            deleteButtons.forEach(deleteButton => {
                deleteButton.addEventListener("click", async (e) => {
                    console.log("clic sur le bouton delete")
                e.preventDefault();
                e.stopPropagation();
               
                const deleteButtonId = e.target.parentNode.dataset.id;
                    
                const responseDelete = await deleteWorks (deleteButtonId);
                console.log(responseDelete);
    
    
                if (responseDelete.ok) {  // if HTTP-status is 200-299

                    const works = await getWorks();
                    generateModalGallery(works);
                    gallery.innerHTML = "";
                    generateGallery(works)

                } else {
                    alert("Echec de suppression"); 
                }
                });

            });

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
                const worksElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                const trashElement = document.createElement("div")
                
                trashElement.classList.add("delete-button");
                trashElement.dataset.id = works[i].id;  //chercher info sur dataset
                trashElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none">
                <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/></svg>`;
                
                imageElement.src = works[i].imageUrl;
        
                worksElement.appendChild(trashElement);
                worksElement.appendChild(imageElement);
                modalGallery.appendChild(worksElement);
            };
        }


        //FORMULAIRE 
        const openFormModal = async function (e) {
            e.preventDefault();
            const formModal = document.getElementById("form-modal");
            formModal.classList.remove("display-none");
            formModal.classList.add("form_modal");
            formModal.removeAttribute("aria-hidden");
            formModal.addEventListener("click", closeFormModal);
            formModal.querySelector(".js-fmodal-close").addEventListener("click", closeFormModal);
            formModal.querySelector(".js-fmodal-stop").addEventListener("click", stopPropagation);

            
            // Aperçu Image 
            const fileInput = document.getElementById("file-upload")

            fileInput.addEventListener("change", async () => {
                const selectedPicture = document.querySelector("input[type=file]").files[0];
                console.log(selectedPicture);

                const preview = document.querySelector(".preview-field")
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
                  const imgPreview = document.querySelector(".preview-field");
                  imgPreview.classList.remove("preview-img-disabled");
                  const btnPreview = document.querySelector("form input[type=submit]");
                  btnPreview.classList.remove("btn-disabled");
                  btnPreview.classList.add("btn-abled");
                  btnPreview.disabled = false;
                }
              }
            );
            
            const formElement = document.getElementById("form-element");
            formElement.addEventListener("submit", addNewWork)
           
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

                if (responseSendWorks.ok) {
                    works.push(responseSendWorks);
                    generateGallery(works);
                };

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