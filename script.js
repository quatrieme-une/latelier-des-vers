document.addEventListener("DOMContentLoaded", () => {
    const generateRandomBtn = document.getElementById("generate-random");
    const generateManualBtn = document.getElementById("generate-manual");
    const part1Select = document.getElementById("part1-select");
    const part2Select = document.getElementById("part2-select");

    let poemsDatabase = { part1: [], part2: [] };

    // Charger la liste des fichiers depuis le JSON
    fetch("poems.json")
        .then(response => response.json())
        .then(data => {
            poemsDatabase = data;
            populateDropdowns();
        })
        .catch(error => console.error("Erreur lors du chargement des fichiers :", error));

    function populateDropdowns() {
        poemsDatabase.part1.forEach(file => {
            const option = document.createElement("option");
            option.value = file;
            option.textContent = file.split("/").pop().replace("_enfance.txt", "");
            part1Select.appendChild(option);
        });

        poemsDatabase.part2.forEach(file => {
            const option = document.createElement("option");
            option.value = file;
            option.textContent = file.split("/").pop().replace("_adolescence.txt", "");
            part2Select.appendChild(option);
        });
    }

    function readFileContent(filePath) {
        return fetch(filePath)
            .then(response => response.text())
            .catch(error => {
                console.error("Erreur de lecture :", error);
                return "Erreur de lecture du fichier.";
            });
    }

    generateRandomBtn.addEventListener("click", async () => {
        const randomPart1 = poemsDatabase.part1[Math.floor(Math.random() * poemsDatabase.part1.length)];
        const randomPart2 = poemsDatabase.part2[Math.floor(Math.random() * poemsDatabase.part2.length)];

        const content1 = await readFileContent(randomPart1);
        const content2 = await readFileContent(randomPart2);

        generatePDF(`${content1}\n\n${content2}`);
    });

    generateManualBtn.addEventListener("click", async () => {
        const selectedPart1 = part1Select.value;
        const selectedPart2 = part2Select.value;

        if (!selectedPart1 || !selectedPart2) {
            alert("Veuillez sélectionner les deux parties du poème.");
            return;
        }

        const content1 = await readFileContent(selectedPart1);
        const content2 = await readFileContent(selectedPart2);

        generatePDF(`${content1}\n\n${content2}`);
    });

    function generatePDF(content) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(content, 20, 30);
        doc.save("poeme.pdf");
    }
});
