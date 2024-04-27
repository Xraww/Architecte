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

document.querySelector(".title-and-edit button").addEventListener("click", () => {
    getWorksImages();
    document.querySelector(".modal-container").style.display = "flex";
    document.getElementById("gallery-view").style.display = "block";
    document.getElementById("add-photo-view").style.display = "none";
    document.getElementById("add-photo-form").reset();
})

const modalCloseTriggers = document.querySelectorAll(".modal-trigger");

modalCloseTriggers.forEach(function(trigger) { 
    trigger.addEventListener("click", () => { 
        document.querySelector(".modal-container").style.display = "none";
    })
})

const getWorksImages = function() {
    let images =  [];

    fetch("http://localhost:5678/api/works").then(works => works.json()).then(data => {
        data.forEach(function(work) {
            images.push(work.imageUrl);
        })

        modalWorksImages(images);
    })
}

const modalWorksImages = function(imagesList) {
    document.querySelector(".modal-container").style.display = "flex";
    const photosContainer = document.querySelector(".photo-list");
    photosContainer.innerHTML = "";

    imagesList.forEach(function(img) {
        let card = document.createElement("div");
        let photo = document.createElement("img");
        let iconContainer = document.createElement("div");
        let trashIcon = document.createElement("i");

        card.classList.add("photo-card");
        photo.src = img;
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        iconContainer.classList.add("icon-container");

        card.appendChild(photo);
        card.appendChild(iconContainer);
        iconContainer.appendChild(trashIcon);
        photosContainer.appendChild(card);
    })
}

document.getElementById("add-img-button").addEventListener("click", () => {
    document.getElementById("gallery-view").style.display = "none";
    document.getElementById("add-photo-view").style.display = "block";
    document.getElementById("add-photo-form").reset();
})

document.getElementById("goto-former-modal").addEventListener("click", () => {
    document.getElementById("gallery-view").style.display = "block";
    document.getElementById("add-photo-view").style.display = "none";
})

const checkFileSize = function(input) {

    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    if (input.files && input.files[0]) {
        const fileSize = input.files[0].size;
        const maxSize = 4 * 1024 * 1024; 

        console.log(fileSize, maxSize);

        if (fileSize > maxSize) {
            alert("La taille du fichier est trop grande. Veuillez sélectionner un fichier de taille inférieure à 4 Mo.");
            // Réinitialiser la valeur de l'input file pour effacer le fichier sélectionné
            input.value = '';
        }
    }
}