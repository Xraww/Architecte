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