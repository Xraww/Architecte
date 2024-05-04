async function displayWorks() {
    const works = await fetch("http://localhost:5678/api/works").then(works => works.json());
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = "";
    
    for (let i = 0; i < works.length; i++) {
        let figureElement = document.createElement("figure");
        let img = document.createElement("img");
        let caption = document.createElement("figcaption");

        figureElement.classList.add("work");
        figureElement.setAttribute("data-category", works[i].category.name);
        img.src = works[i].imageUrl;
        caption.innerText = works[i].title;

        gallery.appendChild(figureElement);
        figureElement.appendChild(img);
        figureElement.appendChild(caption);
    }
}

async function worksFilters() {
    // Récupération des catégories
    let categories = ["Tous"];

    await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
        for (i = 0; i < data.length; i++) {
            categories.push(data[i].name)
        }
    }); 

    // Création du container des bouttons
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("filters-buttons")
    const elementBefore = document.querySelector("#portfolio .title-and-edit")

    // Ajout de ma division juste après le h2
    if (elementBefore) {
        elementBefore.parentNode.insertBefore(buttonsDiv, elementBefore.nextSibling);
    }

    // Création des boutton et event click
    for (i = 0; i < categories.length; i++) {
        let button = document.createElement("button");
        button.classList.add("filters-button");
        button.setAttribute("data-category", categories[i]);
        button.innerHTML = categories[i];

        if (i === 0) button.classList.add("active-button");
        buttonsDiv.appendChild(button);
    }

    buttonEventClick()
}

function buttonEventClick() {
    const allButtons = document.querySelectorAll(".filters-button");

    allButtons.forEach(function(button) {
        button.addEventListener("click", function () {
            allButtons.forEach(function(b) {
                b.classList.remove("active-button");
            })

            button.classList.add("active-button");

            // Affichage des travaux selon la catégorie
            showWorkByCategory(button.getAttribute("data-category"));
        });
    });
}

function showWorkByCategory(category) {
    const allWorks = document.querySelectorAll(".work")
    
    allWorks.forEach(function(element) {
        if (category === "Tous" || element.getAttribute("data-category") === category) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    })
}

displayWorks();
worksFilters();

////// MODALE //////
const modalCloseTriggers = document.querySelectorAll(".modal-trigger");

modalCloseTriggers.forEach(function(trigger) { 
    trigger.addEventListener("click", () => { 
        modaleDisplay(false);
    })
})

const getWorksImages = function() {
    let images = [];

    fetch("http://localhost:5678/api/works").then(works => works.json()).then(data => {
        data.forEach(function(work) {
            images.push({id: work.id, image: work.imageUrl});
        })

        modalWorksImages(images);
    })
}

const modalWorksImages = function(work) {
    modaleDisplay(true, true);
    const photosContainer = document.querySelector(".photo-list");
    photosContainer.innerHTML = "";

    for (i = 0; i < work.length; i++) {
        let card = document.createElement("div");
        let photo = document.createElement("img");
        let iconContainer = document.createElement("div");
        let trashIcon = document.createElement("i");

        card.classList.add("photo-card");
        card.id = `work-${work[i].id}`;
        photo.src = work[i].image;
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        iconContainer.classList.add("icon-container");

        card.appendChild(photo);
        card.appendChild(iconContainer);
        iconContainer.appendChild(trashIcon);
        photosContainer.appendChild(card);
    }

    const token = sessionStorage.getItem("token");
    const deleteIcons = document.querySelectorAll(".photo-card .icon-container");
    deleteIcons.forEach(function(btn) {
        btn.addEventListener("click", function(event) {
            // event.preventDefault();
            const parent = this.parentNode;
            const workId = parent.id.split('-')[1];

            fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            });
        })
    })
}

document.querySelector(".title-and-edit button").addEventListener("click", () => {
    getWorksImages();
    modaleDisplay(true, true)
})

document.getElementById("add-img-button").addEventListener("click", () => {
    modaleDisplay(true, false);
    document.getElementById("add-photo-form").reset();
})

document.getElementById("goto-former-modal").addEventListener("click", () => {
    modaleDisplay(true, true);
})

const modaleDisplay = (displayModale, displayGallery, image) => {
    const modal = document.querySelector(".modal-container");
    const childs = document.querySelector(".upload-photo").children;
    const galleryView = document.getElementById("gallery-view");
    const addPhotoView = document.getElementById("add-photo-view");
    const imagePreview = document.getElementById("previewImage");

    if (displayModale) {
        modal.style.display = "flex";

        if (displayGallery) {
            galleryView.style.display = "block";
            addPhotoView.style.display = "none";
        } else {
            galleryView.style.display = "none";
            addPhotoView.style.display = "block";

            if (typeof image === "undefined") {
                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].tagName !== "INPUT") childs[i].style.display = "block";
                }

                imagePreview.style.display = "none";
                imagePreview.src = "";
            } else {
                for (let i = 0; i < childs.length; i++) {
                    childs[i].style.display = "none";
                }

                imagePreview.style.display = "block";
                imagePreview.src = image;
            }
        }
    } else {
        modal.style.display = "none";
        document.getElementById("add-photo-form").reset();
        imagePreview.style.display = "none";
        imagePreview.src = "";
    }
}

const checkFileSize = function(input) {
    if (input.files && input.files[0]) {
        const fileSize = input.files[0].size;
        const maxSize = 4 * 1024 * 1024; 

        if (fileSize > maxSize) {
            alert("La taille du fichier est trop grande. Veuillez sélectionner un fichier de taille inférieure à 4 Mo.");
            input.value = "";
        }
    }
}

document.getElementById("photo-file").addEventListener("change", function() {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {

            const childs = document.querySelector(".upload-photo").children;
            for (let i = 0; i < childs.length; i++) {
                childs[i].style.display = "none";
            }

            modaleDisplay(true, false, event.target.result)
        };
        reader.readAsDataURL(file);
    }
});