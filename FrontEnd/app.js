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
    const elementBefore = document.querySelector("#portfolio h2")

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