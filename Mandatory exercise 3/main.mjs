// skal hente informasjon fra serveren og håndtere navigasjonen.

import "./views.mjs"; // Importerer så vi kan bruke Custom Elements



const app = document.getElementById("app"); // Henter HTML-elementet med id="app" fra index.html

async function loadCategories() { // Asynkron funksjon som henter kategoriene fra serveren

    const response = await fetch(
        "https://sukkergris.no/plantcategories/"
    ); // forespørsel til serveren for å hente kategoriene

    if (!response.ok) { // vellykket?
        throw new Error("Could not load categories"); // feilmelding hvis forespørselen mislykkes
    }

    const categories = await response.json(); // venter på respons

    console.log(categories); 

    const view = document.createElement("category-view"); // Lager i wiev

    app.replaceChildren(view); // Erstatter innholdet i app, kun en vises av gangen

    view.showCategories(categories); // Sender kategoriene til showCategories() i views.mjs
}


async function loadPlants(category) { // Henter fra valgt kategori
    const response = await fetch(
        "https://sukkergris.no/plants/?category=" +
        encodeURIComponent(category) // Gjør kategorien trygg for URL
    );

    if (!response.ok) { // Sjekker om forespørselen lykkes
        throw new Error("Could not load plants"); // Gir feilmelding
    }

    const plants = await response.json(); // Gjør JSON om til JavaScript-data

    const view = document.createElement("plant-list-view"); // Oppretter plantevisning

    app.replaceChildren(view); // Viser plantevisning
    view.showPlants(plants); // Sender plantene til visningen
}

document.addEventListener("categorySelected", (evt) => { // Lytter
    navigate("plants", evt.detail.category.kategori); // Bruker navigate til å huske hvilken vi trykket på
});

async function loadPlantDetails(id) { // Henter plantedetaljer
    const response = await fetch(
        "https://sukkergris.no/plant/?id=" +
        encodeURIComponent(id) // Koder ID for URL
    );

    if (!response.ok) { // Sjekker respons
        throw new Error("Could not load plant details"); // Feilmelding
    }

    const plant = await response.json(); // Leser JSON-data

    console.log(plant); // Viser data i konsollen

    const view = document.createElement("plant-detail-view"); // Lager detaljvisning

    app.replaceChildren(view); // Viser detaljvisningen
    view.showPlant(plant); // Sender plantedata
}

document.addEventListener("plantSelected", (evt) => { // Lytter
    navigate("detail", evt.detail.id); // Bruker navigate til å huske hvilken vi trykket på
});

document.addEventListener("goBack", () => {
        history.back();
    });

function navigate(view, value = null) { // Hvilken visning? ingen verdi
    const state = { view, value }; //lagrer info

    const url = "?view=" + view +
        (value !== null
            ? "&value=" + encodeURIComponent(value) // Legger til verdi i URL
            : "");

    history.pushState(state, "", url); // Oppdaterer nettleserhistorikken

    showView(state); // Viser riktig visning
}

async function showView(state) { // Viser riktig visning

    if (state.view === "categories") { 
        await loadCategories(); // Henter kategorier
    }

    else if (state.view === "plants") { 
        await loadPlants(state.value); 
    }

    else if (state.view === "detail") { 
        await loadPlantDetails(state.value);
    }
}

window.addEventListener("popstate", (evt) => { //popstate hendelse når vi navigerer rundt
    if (evt.state) { // Sjekker om historikk finnes
        showView(evt.state); // Viser lagret visning
    } else {
        showView({ view: "categories" }); // Viser riktig side
    }
});

history.replaceState( //vi må kunne gå tilbake til startsiden kategori
    { view: "categories", value: null },
    "",
    window.location.href
);

loadCategories();