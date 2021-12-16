const jewelryWrapper = document.getElementById("jewelry-wrapper");


fetch("/api/jewelry")
.then(response => response.json())
.then(jewelryList => jewelryList.forEach(jewelry => createJewelryView(jewelry)));
/*
    console.log(response);
    if(response.status === 200) {
        //Ja, I know den er grim puhaaa
        alert("Projektet blev oprettet");

        // og så redirect til anden side
        window.location.replace("/dashboard");
        
    } else {
        console.log("Error creatinh project:", response.status);
        alert("Der skete en fejl med at oprette projektet");
    }
})
*/


function createJewelryView(jewelry){

    


}

