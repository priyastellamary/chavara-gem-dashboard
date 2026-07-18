/*==================================================
CHAVARA GEM ANALYTICS STUDIO
charts.js
==================================================*/

let chartObjects = {};

/*==================================================
DESTROY EXISTING CHARTS
==================================================*/

function destroyCharts() {

    Object.values(chartObjects).forEach(chart => {

        if (chart) {

            chart.destroy();

        }

    });

    chartObjects = {};

}

/*==================================================
MAIN CHART FUNCTION
==================================================*/

function createCharts(data) {

    destroyCharts();

    createGenderChart(data);

    createProgrammeChart(data);

    createAcademicYearChart(data);

    createTopProgrammeChart(data);

    createEquityChart(data);

    createFemaleTrendChart(data);

    createMaleFemaleChart(data);

    createCohortChart(data);

}

/*==================================================
GENDER DISTRIBUTION (PIE)
==================================================*/

function createGenderChart(data) {

    let female = 0;
    let male = 0;

    data.forEach(row => {

        female += Number(row.Female) || Number(row.Female_Count) || 0;

        male += Number(row.Male) || Number(row.Male_Count) || 0;

    });

    const ctx = document.getElementById("genderChart");

    if (!ctx) return;

    chartObjects.genderChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: ["Female", "Male"],

            datasets: [{

                data: [female, male],

                backgroundColor: [

                    "#ec4899",

                    "#3b82f6"

                ],

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

/*==================================================
PROGRAMME DISTRIBUTION (BAR)
==================================================*/

function createProgrammeChart(data) {

    const counts = {};

    data.forEach(row => {

        const programme = row.Programme || "Unknown";

        counts[programme] = (counts[programme] || 0) + 1;

    });

    const ctx = document.getElementById("programmeChart");

    if (!ctx) return;

    chartObjects.programmeChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: Object.keys(counts),

            datasets: [{

                label: "Programmes",

                data: Object.values(counts),

                backgroundColor: "#2563eb"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}
/*==================================================
ACADEMIC YEAR TREND (LINE CHART)
==================================================*/

function createAcademicYearChart(data) {

    const yearlyData = {};

    data.forEach(row => {

        const year = row.Academic_Year || "Unknown";

        const students =
            Number(row.Total_Students) ||
            Number(row.TotalStudents) ||
            Number(row.Total) ||
            0;

        yearlyData[year] = (yearlyData[year] || 0) + students;

    });

    const ctx = document.getElementById("yearChart");

    if (!ctx) return;

    chartObjects.yearChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: Object.keys(yearlyData),

            datasets: [{

                label: "Students",

                data: Object.values(yearlyData),

                borderColor: "#2563eb",

                backgroundColor: "rgba(37,99,235,0.15)",

                fill: true,

                tension: 0.4

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}

/*==================================================
TOP PROGRAMMES (HORIZONTAL BAR)
==================================================*/

function createTopProgrammeChart(data) {

    const programmeTotals = {};

    data.forEach(row => {

        const programme = row.Programme || "Unknown";

        const students =
            Number(row.Total_Students) ||
            Number(row.TotalStudents) ||
            Number(row.Total) ||
            0;

        programmeTotals[programme] =
            (programmeTotals[programme] || 0) + students;

    });

    const sorted = Object.entries(programmeTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const ctx = document.getElementById("topProgrammeChart");

    if (!ctx) return;

    chartObjects.topProgrammeChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: sorted.map(x => x[0]),

            datasets: [{

                data: sorted.map(x => x[1]),

                backgroundColor: "#0ea5e9"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            indexAxis: "y",

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}

/*==================================================
EQUITY STATUS (DOUGHNUT)
==================================================*/

function createEquityChart(data) {

    const equity = {};

    data.forEach(row => {

        const status = row.Equity_Status || "Unknown";

        equity[status] = (equity[status] || 0) + 1;

    });

    const ctx = document.getElementById("equityChart");

    if (!ctx) return;

    chartObjects.equityChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: Object.keys(equity),

            datasets: [{

                data: Object.values(equity),

                backgroundColor: [

                    "#2563eb",
                    "#16a34a",
                    "#f59e0b",
                    "#dc2626",
                    "#8b5cf6"

                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

/*==================================================
FEMALE PARTICIPATION (BAR)
==================================================*/

function createFemaleTrendChart(data) {

    const femaleData = {};

    data.forEach(row => {

        const programme = row.Programme || "Unknown";

        const female =
            Number(row.Female) ||
            Number(row.Female_Count) ||
            0;

        femaleData[programme] =
            (femaleData[programme] || 0) + female;

    });

    const ctx = document.getElementById("femaleTrendChart");

    if (!ctx) return;

    chartObjects.femaleTrendChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: Object.keys(femaleData),

            datasets: [{

                label: "Female Students",

                data: Object.values(femaleData),

                backgroundColor: "#ec4899"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}
/*==================================================
MALE vs FEMALE (STACKED BAR)
==================================================*/

function createMaleFemaleChart(data) {

    const labels = [];
    const female = [];
    const male = [];

    data.forEach(row => {

        labels.push(row.Programme || "Unknown");

        female.push(

            Number(row.Female) ||

            Number(row.Female_Count) ||

            0

        );

        male.push(

            Number(row.Male) ||

            Number(row.Male_Count) ||

            0

        );

    });

    const ctx = document.getElementById("maleFemaleChart");

    if (!ctx) return;

    chartObjects.maleFemaleChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Female",

                    data: female,

                    backgroundColor: "#ec4899"

                },

                {

                    label: "Male",

                    data: male,

                    backgroundColor: "#3b82f6"

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            },

            scales: {

                x: {

                    stacked: true

                },

                y: {

                    stacked: true,

                    beginAtZero: true

                }

            }

        }

    });

}

/*==================================================
ROLLING COHORT (LINE)
==================================================*/

function createCohortChart(data) {

    const cohort = {};

    data.forEach(row => {

        const year = row.Academic_Year || "Unknown";

        const total =

            Number(row.Total_Students) ||

            Number(row.TotalStudents) ||

            Number(row.Total) ||

            0;

        cohort[year] = (cohort[year] || 0) + total;

    });

    const labels = Object.keys(cohort).sort();

    const values = labels.map(y => cohort[y]);

    const ctx = document.getElementById("cohortChart");

    if (!ctx) return;

    chartObjects.cohortChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Students",

                    data: values,

                    borderColor: "#8b5cf6",

                    backgroundColor: "rgba(139,92,246,0.15)",

                    fill: true,

                    tension: 0.35

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}

/*==================================================
END OF charts.js
==================================================*/
