/*==================================================
CHAVARA GEM ANALYTICS STUDIO
app.js
==================================================*/

let rawData = [];
let filteredData = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCSV();
});

/*==================================================
LOAD CSV
==================================================*/

function loadCSV() {

    Papa.parse("chavara_gem_final_output_no_phd.csv", {

        download: true,

        header: true,

        skipEmptyLines: true,

        complete: function (results) {

            rawData = results.data;
            filteredData = [...rawData];

            initializeDashboard();

        },

        error: function (err) {

            console.error(err);

            alert("Unable to load CSV file.");

        }

    });

}

/*==================================================
INITIALIZE
==================================================*/

function initializeDashboard() {

    populateFilters();

    updateKPIs();

    populateTable();

    generateInsights();

    if (typeof createCharts === "function") {
        createCharts(filteredData);
    }

}

/*==================================================
KPI CALCULATIONS
==================================================*/

function updateKPIs() {

    let totalStudents = 0;

    let femaleStudents = 0;

    const programmes = new Set();

    filteredData.forEach(row => {

        let total =
            Number(row.Total_Students) ||
            Number(row.TotalStudents) ||
            Number(row.Total) ||
            0;

        let female =
            Number(row.Female) ||
            Number(row.Female_Count) ||
            0;

        totalStudents += total;

        femaleStudents += female;

        if (row.Programme)
            programmes.add(row.Programme);

    });

    let femalePercent = 0;

    if (totalStudents > 0)
        femalePercent =
            (femaleStudents / totalStudents) * 100;

    document.getElementById("studentsCount").innerHTML =
        totalStudents.toLocaleString();

    document.getElementById("programmeCount").innerHTML =
        programmes.size;

    document.getElementById("femalePercent").innerHTML =
        femalePercent.toFixed(1) + "%";

    document.getElementById("equityScore").innerHTML =
        calculateEquity().toFixed(1);

}

/*==================================================
EQUITY SCORE
==================================================*/

function calculateEquity() {

    let female = 0;

    let total = 0;

    filteredData.forEach(r => {

        female +=
            Number(r.Female) ||
            Number(r.Female_Count) ||
            0;

        total +=
            Number(r.Total_Students) ||
            Number(r.TotalStudents) ||
            Number(r.Total) ||
            0;

    });

    if (total === 0)
        return 0;

    let percent =
        (female / total) * 100;

    return 100 - Math.abs(50 - percent) * 2;

}
/*==================================================
POPULATE FILTERS
==================================================*/

function populateFilters() {

    populateSelect("yearFilter", "Academic_Year");
    populateSelect("programmeFilter", "Programme");
    populateSelect("levelFilter", "Level");
    populateSelect("equityFilter", "Equity_Status");

    document
        .getElementById("yearFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("programmeFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("levelFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("equityFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("resetFilters")
        .addEventListener("click", resetFilters);

    const searchBox = document.getElementById("searchBox");

    if(searchBox){

        searchBox.addEventListener("keyup", searchTable);

    }

}

/*==================================================
POPULATE A DROPDOWN
==================================================*/

function populateSelect(id, field){

    const select = document.getElementById(id);

    if(!select) return;

    const values = [...new Set(

        rawData
            .map(r => r[field])
            .filter(v => v && v.trim() !== "")

    )].sort();

    values.forEach(v=>{

        const option=document.createElement("option");

        option.value=v;

        option.textContent=v;

        select.appendChild(option);

    });

}

/*==================================================
FILTER DATA
==================================================*/

function applyFilters(){

    const year =
        document.getElementById("yearFilter").value;

    const programme =
        document.getElementById("programmeFilter").value;

    const level =
        document.getElementById("levelFilter").value;

    const equity =
        document.getElementById("equityFilter").value;

    filteredData = rawData.filter(r=>{

        const yearMatch =
            year==="All" ||
            r.Academic_Year===year;

        const programmeMatch =
            programme==="All" ||
            r.Programme===programme;

        const levelMatch =
            level==="All" ||
            r.Level===level;

        const equityMatch =
            equity==="All" ||
            r.Equity_Status===equity;

        return yearMatch &&
               programmeMatch &&
               levelMatch &&
               equityMatch;

    });

    updateDashboard();

}

/*==================================================
UPDATE DASHBOARD
==================================================*/

function updateDashboard(){

    updateKPIs();

    populateTable();

    generateInsights();

    if(typeof createCharts==="function"){

        createCharts(filteredData);

    }

}
/*==================================================
RESET FILTERS
==================================================*/

function resetFilters(){

    document.getElementById("yearFilter").value="All";

    document.getElementById("programmeFilter").value="All";

    document.getElementById("levelFilter").value="All";

    document.getElementById("equityFilter").value="All";

    const search=document.getElementById("searchBox");

    if(search){

        search.value="";

    }

    filteredData=[...rawData];

    updateDashboard();

}

/*==================================================
POPULATE DATA TABLE
==================================================*/

function populateTable(){

    const tbody=document.querySelector("#dataTable tbody");

    if(!tbody) return;

    tbody.innerHTML="";

    filteredData.forEach(row=>{

        const tr=document.createElement("tr");

        const total=
            Number(row.Total_Students)||
            Number(row.TotalStudents)||
            Number(row.Total)||
            0;

        const female=
            Number(row.Female)||
            Number(row.Female_Count)||
            0;

        const male=
            Number(row.Male)||
            Number(row.Male_Count)||
            (total-female);

        const femalePercent=
            total>0 ?
            ((female/total)*100).toFixed(1) :
            "0.0";

        const malePercent=
            total>0 ?
            ((male/total)*100).toFixed(1) :
            "0.0";

        tr.innerHTML=`

        <td>${row.Programme||"-"}</td>

        <td>${row.Academic_Year||"-"}</td>

        <td>${row.Level||"-"}</td>

        <td>${total}</td>

        <td>${femalePercent}%</td>

        <td>${malePercent}%</td>

        <td>${row.Equity_Status||"-"}</td>

        `;

        tbody.appendChild(tr);

    });

}

/*==================================================
SEARCH TABLE
==================================================*/

function searchTable(){

    const keyword=
    document
    .getElementById("searchBox")
    .value
    .toLowerCase();

    const rows=
    document.querySelectorAll("#dataTable tbody tr");

    rows.forEach(row=>{

        if(row.innerText.toLowerCase().includes(keyword))

            row.style.display="";

        else

            row.style.display="none";

    });

}
/*==================================================
AI INSIGHTS
==================================================*/

function generateInsights(){

    const container =
        document.getElementById("aiRecommendations");

    if(!container) return;

    let totalStudents = 0;
    let femaleStudents = 0;

    filteredData.forEach(r=>{

        totalStudents +=
            Number(r.Total_Students) ||
            Number(r.TotalStudents) ||
            Number(r.Total) ||
            0;

        femaleStudents +=
            Number(r.Female) ||
            Number(r.Female_Count) ||
            0;

    });

    let femalePercent = 0;

    if(totalStudents>0){

        femalePercent =
            (femaleStudents/totalStudents)*100;

    }

    let equityScore = calculateEquity();

    let html = "";

    if(femalePercent >= 45 && femalePercent <= 55){

        html += `
        <div class="alert alert-success">
            <strong>Excellent Gender Balance</strong><br>
            Female participation is well balanced across the selected programmes.
        </div>`;

    }
    else if(femalePercent < 45){

        html += `
        <div class="alert alert-warning">
            <strong>Improve Female Participation</strong><br>
            Female representation is below the desired benchmark.
        </div>`;

    }
    else{

        html += `
        <div class="alert alert-primary">
            <strong>Higher Female Participation</strong><br>
            Female enrolment exceeds the balance threshold.
        </div>`;

    }

    html += `
    <div class="alert alert-primary">
        <strong>Total Students:</strong> ${totalStudents.toLocaleString()}<br>
        <strong>Female Percentage:</strong> ${femalePercent.toFixed(1)}%<br>
        <strong>Equity Score:</strong> ${equityScore.toFixed(1)}
    </div>`;

    container.innerHTML = html;

}

/*==================================================
SUMMARY STATISTICS
==================================================*/

function getSummary(){

    return{

        records:filteredData.length,

        students:filteredData.reduce((sum,r)=>

            sum+
            (
                Number(r.Total_Students)||
                Number(r.TotalStudents)||
                Number(r.Total)||
                0
            )

        ,0)

    };

}

/*==================================================
HELPER FUNCTION
==================================================*/

function number(value){

    return Number(value)||0;

}

/*==================================================
AUTO REFRESH
==================================================*/

window.addEventListener("resize",()=>{

    if(typeof createCharts==="function"){

        createCharts(filteredData);

    }

});
/*==================================================
EXPORT TABLE AS CSV
==================================================*/

function exportTableCSV(filename = "dashboard_data.csv") {

    const table = document.getElementById("dataTable");

    if (!table) return;

    let csv = [];

    for (let i = 0; i < table.rows.length; i++) {

        let row = [];
        let cols = table.rows[i].querySelectorAll("td,th");

        cols.forEach(col => {

            row.push('"' + col.innerText.replace(/"/g, '""') + '"');

        });

        csv.push(row.join(","));

    }

    downloadCSV(csv.join("\n"), filename);

}

/*==================================================
DOWNLOAD CSV
==================================================*/

function downloadCSV(csv, filename){

    const blob = new Blob([csv], {type:"text/csv"});

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

/*==================================================
NUMBER FORMATTER
==================================================*/

function formatNumber(value){

    return Number(value || 0).toLocaleString();

}

/*==================================================
PERCENTAGE FORMATTER
==================================================*/

function formatPercent(value){

    return Number(value || 0).toFixed(1) + "%";

}

/*==================================================
SAFE VALUE
==================================================*/

function safeValue(value){

    if(value===undefined || value===null || value==="")

        return "-";

    return value;

}

/*==================================================
LOGGING
==================================================*/

console.log("===================================");

console.log("Chavara GEM Analytics Studio");

console.log("Application Loaded Successfully");

console.log("===================================");

/*==================================================
END OF app.js
==================================================*/
