document.addEventListener("DOMContentLoaded", function() {
    const routeForm = document.getElementById("routeForm");
    const routeTableBody = document.querySelector("#routeTable tbody");
    const gradeButtons = document.querySelectorAll(".grade-btn");
    let selectedGrade = "";

    const barChartYes = createChart('barChartYes', 'Completed Climbs (Yes)', 'green', 'darkgreen');
    const barChartNo = createChart('barChartNo', 'Completed Climbs (No)', 'red', 'darkred');

    gradeButtons.forEach(button => {
        button.addEventListener("click", function() {
            gradeButtons.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
            selectedGrade = this.dataset.grade;
        });
    });

    routeForm.addEventListener("submit", function(event) {
        event.preventDefault();
        handleFormSubmit();
    });

    function createChart(elementId, label, backgroundColor, borderColor) {
        const ctx = document.getElementById(elementId).getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9'],
                datasets: [{
                    label: label,
                    data: Array(10).fill(0),
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            stepSize: 1,
                            max: 20
                        }
                    }
                }
            }
        });
    }

    function updateChart(sent, grade) {
        const gradeIndex = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9'].indexOf(grade);
        if (gradeIndex === -1) return;

        if (sent === "Yes") {
            barChartYes.data.datasets[0].data[gradeIndex] += 1;
            barChartYes.update();
        } else if (sent === "No") {
            barChartNo.data.datasets[0].data[gradeIndex] += 1;
            barChartNo.update();
        }
    }

    function handleFormSubmit() {
        const gym = document.getElementById("gym").value;
        const attempts = document.getElementById("attempts").value;
        const sent = document.getElementById("sent").value;
        const notes = document.getElementById("notes").value;
        const imageInput = document.getElementById("image");
        let imageUrl = "";
    
        gradeButtons.forEach(btn => btn.classList.remove("selected"));
    
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageUrl = e.target.result;
                addRouteToTable(gym, selectedGrade, attempts, sent, notes, imageUrl);
                updateChart(sent, selectedGrade);
                saveRouteToDatabase(gym, selectedGrade, attempts, sent, notes, imageUrl);
                routeForm.reset();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            addRouteToTable(gym, selectedGrade, attempts, sent, notes, imageUrl);
            updateChart(sent, selectedGrade);
            saveRouteToDatabase(gym, selectedGrade, attempts, sent, notes, imageUrl);
            routeForm.reset();
        }
    }

    function addRouteToTable(gym, grade, attempts, sent, notes, imageUrl) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${gym}</td>
            <td>${grade}</td>
            <td>${attempts}</td>
            <td>${sent}</td>
            <td>${notes}</td>
            <td>${imageUrl ? `<img src="images/icon.jpg" alt="Image Icon" style="width: 30px; height: auto; cursor: pointer;" onclick="openImage('${imageUrl}')">` : ''}</td>
        `;
        routeTableBody.appendChild(newRow);
    }

    

    function saveRouteToDatabase(gym, grade, attempts, sent, notes, imageUrl) {
        fetch('http://localhost:3000/api/routes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gym, grade, attempts, sent, notes, imageUrl })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
});

function openImage(imageUrl) {
    const newTab = window.open();
    newTab.document.body.innerHTML = `<img src="${imageUrl}" alt="Climb Image">`;
}