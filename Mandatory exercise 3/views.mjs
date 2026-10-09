// skal kun ha ansvar for å vise informasjon og registrere brukerens handlinger

// Importerer CSS-filen
   import css from "./views.css" with { type: "css" };

// CATEGORY VIEW -----------------------------------------------------------------------

    class CategoryView extends HTMLElement { //Lager et costom element og en klasse som arver fra HTMLElement

        constructor() { //når du vil gjøre noe automatisk når et objekt opprettes, for eksempel opprette Shadow DOM

             super(); //Kaller konstruktøren til HTMLElement, slik at arven blir riktig initialisert. Må brukes når klassen bruker extends og constructor

             this.attachShadow({ mode: "open" }); // Oppretter Shadow DOM

             this.shadowRoot.adoptedStyleSheets = [css];  // Kobler CSS til Shadow DOM
        }

        // Viser kategoriene. 
        showCategories(categories) {

            this.shadowRoot.innerHTML = `
                <header>
                    <span>Helseflora</span>
                </header>

                <h1>Kategorier</h1>
                <ul id="categoryList"></ul>
            `; //lager HTML strukturern m overskrift og tom liste. (this. betyr dette objektet)
            
            const list = this.shadowRoot.getElementById("categoryList");// Henter listen fra Shadow DOM ved hjelp av ID

            categories.forEach(category => { // Går gjennom alle kategoriene fra serveren
                const item = document.createElement("li"); //nytt liste-element for hver kategori
                item.textContent = category.kategori; // Setter kategorinavnet som tekst

                 item.addEventListener("click", () => { // Registrerer klikk på kategorien
                    this.dispatchEvent(new CustomEvent("categorySelected", {
                        detail: { category }, // Sender med den valgte kategorien
                        bubbles: true,
                        composed: true
                        //må ha disse, hvis ikke blir ikke hendelsen sendt til main.mjs. Dyttes frem.
                    }));
                });

                list.appendChild(item); // Legger kategorien til i listen
            });

        }
        
    }

    customElements.define("category-view", CategoryView); // Registrerer Custom Element

    // END OF CATEGORY VIEW ------------------------------------------------------------

// PLANT LIST VIEW ---------------------------------------------------------------------

class PlantListView extends HTMLElement { // Lager et Custom Element som arver fra HTMLElement

    constructor() { // Kjøres automatisk når elementet opprettes
        super(); // Kaller konstruktøren til HTMLElement
        this.attachShadow({ mode: "open" }); // Oppretter Shadow DOM
        this.shadowRoot.adoptedStyleSheets = [css];  // Kobler CSS til Shadow DOM
    }

    showPlants(plants) { // mottar og viser plantene

        this.shadowRoot.innerHTML = `
            <button id="backButton">←</button>
            <h1>Planter</h1>
            <div id="plantList"></div>
        `; // Lager HTML-strukturen med overskrift og en tom beholder

        const backButton = this.shadowRoot.getElementById("backButton");
        backButton.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("goBack", {
                bubbles: true,
                composed: true
            }));
        });

        const list = this.shadowRoot.getElementById("plantList"); // Henter beholderen fra Shadow DOM

        plants.forEach(plant => { // Går gjennom alle plantene fra serveren

        const article = document.createElement("article"); // Lager et eget element for hver plante
        article.addEventListener("click", () => { // Registrerer klikk på planten
            this.dispatchEvent(new CustomEvent("plantSelected", { // Sender egendefinert hendelse
                detail: { id: plant.id }, // Sender plante-ID
                bubbles: true, // Lar hendelsen boble oppover
                composed: true // Lar hendelsen gå ut av Shadow DOM
            }));
        });

        const name = document.createElement("h2"); // overskrift
        name.textContent = plant.navn; //plantenavnet som tekst

        const description = document.createElement("p"); // Lager et avsnitt for beskrivelsen
        description.textContent = plant.beskrivelse; // Setter plantebeskrivelsen som tekst

        const price = document.createElement("p"); // Lager et avsnitt for prisen
        price.textContent = "kr " + plant.pris + ",-"; // Viser prisen med kr foran og ,- bak

        const image = document.createElement("img"); // Lager et bildeelement
        image.src = "https://sukkergris.no/plantimages/small/" + plant.bildefil; // Henter bildet fra serveren
        image.alt = plant.navn; // Setter plantenavnet som alternativ bildetekst

        article.appendChild(image);
        article.appendChild(name);
        article.appendChild(description);
        article.appendChild(price);
        list.appendChild(article);

        });
    }
}

customElements.define("plant-list-view", PlantListView); // Registrerer Custom Element

    // END OF PLANT LIST VIEW ----------------------------------------------------------

// PLANT DETAIL VIEW ---------------------------------------------------------------------
class PlantDetailView extends HTMLElement { // Plantedetaljer

    constructor() { // Konstruktør
        super(); // Arver fra HTMLElement
        this.attachShadow({ mode: "open" }); // Lager Shadow DOM
        this.shadowRoot.adoptedStyleSheets = [css];  // Kobler CSS til Shadow DOM
    }

    showPlant(plant) { // Viser planten
        this.shadowRoot.innerHTML = `
            <button id="backButton">←</button>
            <h1 id="plantName"></h1>
            <img id="plantImage">
            <div id="plantDetails"></div>
        `; // Lager HTML-struktur

        const backButton = this.shadowRoot.getElementById("backButton");
        backButton.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("goBack", {
                bubbles: true,
                composed: true
            }));
        });

        const name = this.shadowRoot.getElementById("plantName"); // Henter overskrift
        name.textContent = plant.navn; // Setter navn

        const image = this.shadowRoot.getElementById("plantImage"); // Henter bildeelement
        image.src = "https://sukkergris.no/plantimages/large/" +
                    plant.bildefil.replace(/\.png$/i, ".jpg"); // Henter stort JPG-bilde
        image.alt = plant.navn; // Bildetekst

        const details = this.shadowRoot.getElementById("plantDetails"); // Henter detaljer

        const category = document.createElement("p"); // Lager avsnitt
        category.textContent = "Kategori: " + plant.kategori; 

        const description = document.createElement("p");
        description.textContent = plant.beskrivelse;

        const height = document.createElement("p");
        height.textContent = "Normal høyde: " + plant.hoyde + " cm";

        const growthZone = document.createElement("p");
        growthZone.textContent = "Vekstsone: " + plant.vekstsone;

        const fertilizer = document.createElement("p");

        fertilizer.textContent =
            "Anbefalt gjødselmix: " +
            plant.nitrogen + "% nitrogen, " +
            plant.kalium + "% kalium og " +
            plant.fosfor + "% fosfor.";

            const advice = document.createElement("p");

        advice.textContent =
            "Bør ikke plantes hvis temperaturen om dagen er under " +
            plant.min_temp_dag +
            " grader, eller temperaturen om natten er under " +
            plant.min_temp_natt + " grader.";

        const price = document.createElement("p"); 
        price.textContent = "kr " + plant.pris + ",-";

        details.appendChild(category);
        details.appendChild(description);
        details.appendChild(height);
        details.appendChild(growthZone);
        details.appendChild(fertilizer);
        details.appendChild(advice);
        details.appendChild(price);
        }
}

customElements.define("plant-detail-view", PlantDetailView); // Registrerer element
    // END OF PLANT DETAIL VIEW ----------------------------------------------------------