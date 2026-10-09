const url = "https://sukkergris.no/choco/jsonlist/";

loadData ();

async function loadData() {
    
    try {

        const response = await fetch (url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error ("code:" + response.status + ", msg:" + ok);
        } //Denne bør være med.

        console.log(data); //display data

    } catch (error) {
        console.log(error); //display error msg

    }
}