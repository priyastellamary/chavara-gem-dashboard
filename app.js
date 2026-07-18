/*==========================================================
 CHAVARA GEM ANALYTICS STUDIO
 app.js
 Version 2.0
==========================================================*/

// Global Variables

let originalData = [];
let filteredData = [];

/*==========================================================
LOAD CSV
==========================================================*/

Papa.parse("chavara_gem_final_output_no_phd.csv", {

    download: true,

    header: true,

    dynamicTyping: true,

    skipEmptyLines: true,

    complete: function(results) {

        originalData = results.data;

        filteredData = [...originalData];

        initializeDashboard();

    },

    error: function(err) {

        console.error("CSV Loading Error:", err);

    }

});

/*==========================================================
INITIALIZE DASHBOARD
==========================================================*/

function initializeDashboard() {

    populateFilters();

    updateKPIs(filteredData);

    createCharts(filteredData);

    populateTable(filteredData);

    generateInsights(filteredData);

}

/*==========================================================
UPDATE KPI CARDS
==========================================================*/

function updateKPIs(data) {

    const totalStudents = data.reduce(
        (sum, row) => sum + Number(row.tot_students || 0), 0);

    const totalMale = data.reduce(
        (sum, row) => sum + Number(row.tot_male || 0), 0);

    const totalFemale = data.reduce(
        (sum, row) => sum + Number(row.tot_female || 0), 0);

    const femalePercent =
        totalStudents > 0
        ? (totalFemale / totalStudents) * 100
        : 0;

    const programmes =
        new Set(data.map(r => r.program_clean)).size;

    const academicYears =
        new Set(data.map(r => r.academic_year)).size;

    const balanced =
        data.filter(r =>
            r.equity_status === "Balanced").length;

    const highlyImbalanced =
        data.filter(r =>
            r.equity_status === "Highly Imbalanced").length;

    setValue("kpiStudents", totalStudents.toLocaleString());

    setValue("kpiMale", totalMale.toLocaleString());

    setValue("kpiFemale", totalFemale.toLocaleString());

    setValue("kpiFemalePercent",
        femalePercent.toFixed(2) + "%");

    setValue("kpiProgrammes", programmes);

    setValue("kpiYears", academicYears);

    setValue("kpiBalanced", balanced);

    setValue("kpiHighly", highlyImbalanced);

}

/*==========================================================
SET HTML VALUE
==========================================================*/

function setValue(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }
}
    /*==========================================================
POPULATE FILTERS
==========================================================*/

function populateFilters() {

    populateSelect(
        "yearFilter",
        [...new Set(originalData.map(r => r.academic_year))]
            .sort()
    );

    populateSelect(
        "programmeFilter",
        [...new Set(originalData.map(r => r.program_clean))]
            .sort()
    );

    populateSelect(
        "levelFilter",
        [...new Set(originalData.map(r => r.level))]
            .sort()
    );

    populateSelect(
        "equityFilter",
        [...new Set(originalData.map(r => r.equity_status))]
            .sort()
    );

}

/*==========================================================
POPULATE DROPDOWN
==========================================================*/

function populateSelect(id, values) {

    const select = document.getElementById(id);

    if (!select) return;

    select.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "All";
    defaultOption.textContent = "All";
    select.appendChild(defaultOption);

    values.forEach(value => {

        if (value === null || value === undefined || value === "")
            return;

        const option = document.createElement("option");

        option.value = value;

        option.textContent = value;

        select.appendChild(option);

    });

}

/*==========================================================
APPLY FILTERS
==========================================================*/

function applyFilters() {

    const year =
        document.getElementById("yearFilter").value;

    const programme =
        document.getElementById("programmeFilter").value;

    const level =
        document.getElementById("levelFilter").value;

    const equity =
        document.getElementById("equityFilter").value;

    filteredData = originalData.filter(row => {

        return (

            (year === "All" ||
                row.academic_year == year)

            &&

            (programme === "All" ||
                row.program_clean === programme)

            &&

            (level === "All" ||
                row.level === level)

            &&

            (equity === "All" ||
                row.equity_status === equity)

        );

    });

    updateDashboard();

}

/*==========================================================
UPDATE ENTIRE DASHBOARD
==========================================================*/

function updateDashboard() {

    updateKPIs(filteredData);

    createCharts(filteredData);

    populateTable(filteredData);

    generateInsights(filteredData);

}

/*==========================================================
RESET FILTERS
==========================================================*/

function resetFilters() {

    document.getElementById("yearFilter").value = "All";

    document.getElementById("programmeFilter").value = "All";

    document.getElementById("levelFilter").value = "All";

    document.getElementById("equityFilter").value = "All";

    filteredData = [...originalData];

    updateDashboard();

}

/*==========================================================
REFRESH DATA
==========================================================*/

function refreshDashboard() {

    filteredData = [...originalData];

    updateDashboard();

}
/*==========================================================
POPULATE DATA TABLE
==========================================================*/

function populateTable(data) {

    const tableBody = document.getElementById("tableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    data.forEach(row => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${row.program_clean}</td>

            <td>${row.academic_year}</td>

            <td>${row.level}</td>

            <td>${Number(row.tot_students).toLocaleString()}</td>

            <td>${Number(row.tot_male).toLocaleString()}</td>

            <td>${Number(row.tot_female).toLocaleString()}</td>

            <td>${Number(row.female_pct).toFixed(2)}%</td>

            <td>${row.equity_status}</td>

        `;

        tableBody.appendChild(tr);

    });

}

/*==========================================================
SEARCH TABLE
==========================================================*/

function searchTable() {

    const searchBox = document.getElementById("searchBox");

    if (!searchBox) return;

    const keyword = searchBox.value
        .toLowerCase()
        .trim();

    if (keyword === "") {

        populateTable(filteredData);

        return;

    }

    const results = filteredData.filter(row => {

        return (

            String(row.program_clean)
                .toLowerCase()
                .includes(keyword)

            ||

            String(row.academic_year)
                .toLowerCase()
                .includes(keyword)

            ||

            String(row.level)
                .toLowerCase()
                .includes(keyword)

            ||

            String(row.equity_status)
                .toLowerCase()
                .includes(keyword)

        );

    });

    populateTable(results);

}

/*==========================================================
SORT TABLE
==========================================================*/

function sortTable(column) {

    filteredData.sort((a, b) => {

        const x = a[column];
        const y = b[column];

        if (typeof x === "number" &&
            typeof y === "number") {

            return x - y;

        }

        return String(x)
            .localeCompare(String(y));

    });

    populateTable(filteredData);

}

/*==========================================================
GET TOTALS
==========================================================*/

function calculateTotals(data) {

    return {

        students:

            data.reduce(
                (sum, r) =>
                sum + Number(r.tot_students || 0), 0),

        male:

            data.reduce(
                (sum, r) =>
                sum + Number(r.tot_male || 0), 0),

        female:

            data.reduce(
                (sum, r) =>
                sum + Number(r.tot_female || 0), 0)

    };

}

/*==========================================================
FORMAT NUMBER
==========================================================*/

function formatNumber(value) {

    return Number(value || 0).toLocaleString();

}

/*==========================================================
FORMAT PERCENTAGE
==========================================================*/

function formatPercent(value) {

    return Number(value || 0).toFixed(2) + "%";

}
/*==========================================================
AI INSIGHTS
==========================================================*/

function generateInsights(data) {

    const container = document.getElementById("aiInsights");

    if (!container) return;

    if (data.length === 0) {

        container.innerHTML = `
            <div class="alert alert-warning">
                No data available for the selected filters.
            </div>
        `;

        return;
    }

    const totals = calculateTotals(data);

    const overallFemale =
        totals.students > 0
            ? ((totals.female / totals.students) * 100)
            : 0;

    const overallMale =
        totals.students > 0
            ? ((totals.male / totals.students) * 100)
            : 0;

    /*-----------------------------------------
      Highest Student Strength
    ------------------------------------------*/

    const highestStudents = [...data].sort(
        (a, b) => b.tot_students - a.tot_students
    )[0];

    /*-----------------------------------------
      Highest Female %
    ------------------------------------------*/

    const highestFemale = [...data].sort(
        (a, b) => b.female_pct - a.female_pct
    )[0];

    /*-----------------------------------------
      Highest Male %
    ------------------------------------------*/

    const highestMale = [...data].sort(
        (a, b) => b.male_pct - a.male_pct
    )[0];

    /*-----------------------------------------
      Equity Summary
    ------------------------------------------*/

    const balanced =
        data.filter(r =>
            r.equity_status === "Balanced"
        ).length;

    const moderate =
        data.filter(r =>
            r.equity_status === "Moderately Imbalanced"
        ).length;

    const highly =
        data.filter(r =>
            r.equity_status === "Highly Imbalanced"
        ).length;

    /*-----------------------------------------
      Academic Years
    ------------------------------------------*/

    const years =
        [...new Set(
            data.map(r => r.academic_year)
        )].sort();

    /*-----------------------------------------
      HTML
    ------------------------------------------*/

    container.innerHTML = `

    <div class="row g-3">

        <div class="col-md-6">

            <div class="card shadow-sm h-100">

                <div class="card-body">

                    <h5>📊 Overall Gender Ratio</h5>

                    <p>
                        Female :
                        <strong>${overallFemale.toFixed(2)}%</strong>
                    </p>

                    <p>
                        Male :
                        <strong>${overallMale.toFixed(2)}%</strong>
                    </p>

                </div>

            </div>

        </div>

        <div class="col-md-6">

            <div class="card shadow-sm h-100">

                <div class="card-body">

                    <h5>🏆 Largest Programme</h5>

                    <p>

                        <strong>

                        ${highestStudents.program_clean}

                        </strong>

                    </p>

                    <p>

                        Students :
                        ${formatNumber(
                            highestStudents.tot_students
                        )}

                    </p>

                </div>

            </div>

        </div>

        <div class="col-md-6">

            <div class="card shadow-sm h-100">

                <div class="card-body">

                    <h5>👩 Highest Female Participation</h5>

                    <p>

                        <strong>

                        ${highestFemale.program_clean}

                        </strong>

                    </p>

                    <p>

                        ${formatPercent(
                            highestFemale.female_pct
                        )}

                    </p>

                </div>

            </div>

        </div>

        <div class="col-md-6">

            <div class="card shadow-sm h-100">

                <div class="card-body">

                    <h5>👨 Highest Male Participation</h5>

                    <p>

                        <strong>

                        ${highestMale.program_clean}

                        </strong>

                    </p>

                    <p>

                        ${formatPercent(
                            highestMale.male_pct
                        )}

                    </p>

                </div>

            </div>

        </div>

        <div class="col-md-6">

            <div class="card shadow-sm h-100">

                <div class="card-body">

                    <h5>⚖ Equity Summary</h5>

                    <ul>

                        <li>Balanced : ${balanced}</li>

                        <li>Moderately Imbalanced : ${moderate}</li>

                        <li>Highly Imbalanced : ${highly}</li>

                    </ul>

                </div>

            </div>

        </div>

        <div class="col-md-6">

            <div class="card shadow-sm h-100">

                <div class="card-body">

                    <h5>📅 Academic Years</h5>

                    <p>

                        ${years.join(", ")}

                    </p>

                    <p>

                        Total Years :
                        ${years.length}

                    </p>

                </div>

            </div>

        </div>

    </div>

    `;

}
/*==========================================================
EXPORT TABLE TO CSV
==========================================================*/

function exportTableCSV(filename = "Chavara_GEM_Report.csv") {

    if (!filteredData.length) {
        alert("No data available to export.");
        return;
    }

    const headers = [
        "Programme",
        "Academic Year",
        "Level",
        "Total Students",
        "Male",
        "Female",
        "Female %",
        "Male %",
        "Equity Status"
    ];

    const rows = filteredData.map(row => [

        row.program_clean,

        row.academic_year,

        row.level,

        row.tot_students,

        row.tot_male,

        row.tot_female,

        Number(row.female_pct).toFixed(2),

        Number(row.male_pct).toFixed(2),

        row.equity_status

    ]);

    const csvContent = [

        headers,

        ...rows

    ]
    .map(e => e.join(","))

    .join("\n");

    const blob = new Blob([csvContent], {

        type: "text/csv;charset=utf-8;"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}

/*==========================================================
DOWNLOAD DASHBOARD REPORT
==========================================================*/

function downloadReport() {

    window.print();

}

/*==========================================================
SHOW LOADING SCREEN
==========================================================*/

function showLoader() {

    const loader = document.getElementById("loadingScreen");

    if (loader) {

        loader.style.display = "flex";

    }

}

/*==========================================================
HIDE LOADING SCREEN
==========================================================*/

function hideLoader() {

    const loader = document.getElementById("loadingScreen");

    if (loader) {

        loader.style.display = "none";

    }

}

/*==========================================================
SCROLL TO TOP
==========================================================*/

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/*==========================================================
WINDOW RESIZE
==========================================================*/

window.addEventListener("resize", () => {

    if (typeof createCharts === "function") {

        createCharts(filteredData);

    }

});

/*==========================================================
BUTTON EVENTS
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const exportBtn = document.getElementById("exportCSV");

    if (exportBtn) {

        exportBtn.addEventListener("click", () => {

            exportTableCSV();

        });

    }

    const reportBtn = document.getElementById("downloadReport");

    if (reportBtn) {

        reportBtn.addEventListener("click", () => {

            downloadReport();

        });

    }

    const topBtn = document.getElementById("scrollTop");

    if (topBtn) {

        topBtn.addEventListener("click", () => {

            scrollToTop();

        });

    }

});

/*==========================================================
HELPER FUNCTIONS
==========================================================*/

function safeNumber(value) {

    return Number(value || 0);

}

function percentage(part, total) {

    if (total === 0) return 0;

    return ((part / total) * 100);

}

function uniqueValues(data, field) {

    return [...new Set(data.map(item => item[field]))];

}

function sumField(data, field) {

    return data.reduce((sum, row) => {

        return sum + Number(row[field] || 0);

    }, 0);

}

/*==========================================================
CONSOLE MESSAGE
==========================================================*/

console.log(
    "%cChavara GEM Analytics Studio v2 Loaded Successfully",
    "color:green;font-size:16px;font-weight:bold;"
);

/*==========================================================
END OF app.js
==========================================================*/
    

}
