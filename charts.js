/*==========================================================
CHAVARA GEM ANALYTICS STUDIO
charts.js
Version 3.0
==========================================================*/

let chartObjects = {};

/*==========================================================
DESTROY EXISTING CHARTS
==========================================================*/

function destroyCharts() {

    Object.keys(chartObjects).forEach(key => {

        if (chartObjects[key]) {

            chartObjects[key].destroy();

        }

    });

    chartObjects = {};

}

/*==========================================================
CREATE ALL CHARTS
==========================================================*/

function createCharts(data) {

    destroyCharts();

    createGenderChart(data);

    createProgrammeChart(data);

    createAcademicYearChart(data);

    createTopProgrammeChart(data);

    createEquityChart(data);

    createFemaleTrendChart(data);

    createMaleFemaleChart(data);

    createRollingCohortChart(data);

    createLevelChart(data);

}

/*==========================================================
GENDER DISTRIBUTION
==========================================================*/

function createGenderChart(data) {

    const male = data.reduce(
        (sum, row) => sum + Number(row.tot_male || 0),
        0
    );

    const female = data.reduce(
        (sum, row) => sum + Number(row.tot_female || 0),
        0
    );

    const canvas = document.getElementById("genderChart");

    if (!canvas) return;

    chartObjects.genderChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [

                "Male",

                "Female"

            ],

            datasets: [

                {

                    data: [

                        male,

                        female

                    ],

                    backgroundColor: [

                        "#2563eb",

                        "#ec4899"

                    ],

                    borderWidth: 2

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

            }

        }

    });

}

/*==========================================================
PROGRAMME DISTRIBUTION
==========================================================*/

function createProgrammeChart(data) {

    const totals = {};

    data.forEach(row => {

        const programme = row.program_clean;

        totals[programme] =

            (totals[programme] || 0)

            + Number(row.tot_students || 0);

    });

    const labels = Object.keys(totals);

    const values = Object.values(totals);

    const canvas = document.getElementById("programmeChart");

    if (!canvas) return;

    chartObjects.programmeChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Students",

                    data: values,

                    backgroundColor: "#0ea5e9"

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

/*==========================================================
ACADEMIC YEAR TREND
==========================================================*/
/*==========================================================
ACADEMIC YEAR TREND
==========================================================*/

function createAcademicYearChart(data) {

    const totals = {};

    data.forEach(row => {

        const year = String(row.academic_year);

        totals[year] =

            (totals[year] || 0)

            + Number(row.tot_students || 0);

    });

    const labels = Object.keys(totals).sort();

    const values = labels.map(label => totals[label]);

    const canvas = document.getElementById("yearChart");

    if (!canvas) return;

    chartObjects.yearChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Students",

                    data: values,

                    borderColor: "#2563eb",

                    backgroundColor: "rgba(37,99,235,0.2)",

                    tension: 0.35,

                    fill: true

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

/*==========================================================
TOP 10 PROGRAMMES
==========================================================*/

function createTopProgrammeChart(data) {

    const totals = {};

    data.forEach(row => {

        const programme = row.program_clean;

        totals[programme] =

            (totals[programme] || 0)

            + Number(row.tot_students || 0);

    });

    const sorted = Object.entries(totals)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 10);

    const labels = sorted.map(item => item[0]);

    const values = sorted.map(item => item[1]);

    const canvas = document.getElementById("topProgrammeChart");

    if (!canvas) return;

    chartObjects.topProgrammeChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Students",

                    data: values,

                    backgroundColor: "#14b8a6"

                }

            ]

        },

        options: {

            indexAxis: "y",

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                x: {

                    beginAtZero: true

                }

            }

        }

    });

}

/*==========================================================
EQUITY STATUS
==========================================================*/

function createEquityChart(data) {

    const counts = {};

    data.forEach(row => {

        const status = row.equity_status || "Unknown";

        counts[status] =

            (counts[status] || 0) + 1;

    });

    const labels = Object.keys(counts);

    const values = Object.values(counts);

    const canvas = document.getElementById("equityChart");

    if (!canvas) return;

    chartObjects.equityChart = new Chart(canvas, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [

                {

                    data: values,

                    backgroundColor: [

                        "#2563eb",

                        "#22c55e",

                        "#f59e0b",

                        "#ef4444",

                        "#8b5cf6"

                    ]

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

            }

        }

    });

}

/*==========================================================
FEMALE PERCENTAGE TREND
==========================================================*/
/*==========================================================
FEMALE PERCENTAGE TREND
==========================================================*/

function createFemaleTrendChart(data) {

    const yearly = {};

    data.forEach(row => {

        const year = String(row.academic_year);

        if (!yearly[year]) {

            yearly[year] = {
                female: 0,
                total: 0
            };

        }

        yearly[year].female += Number(row.tot_female || 0);

        yearly[year].total += Number(row.tot_students || 0);

    });

    const labels = Object.keys(yearly).sort();

    const values = labels.map(year => {

        const item = yearly[year];

        return item.total === 0
            ? 0
            : ((item.female / item.total) * 100).toFixed(2);

    });

    const canvas = document.getElementById("femaleTrendChart");

    if (!canvas) return;

    chartObjects.femaleTrendChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Female %",

                    data: values,

                    borderColor: "#ec4899",

                    backgroundColor: "rgba(236,72,153,0.20)",

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

                    beginAtZero: true,

                    max: 100

                }

            }

        }

    });

}

/*==========================================================
MALE VS FEMALE
==========================================================*/

function createMaleFemaleChart(data) {

    let male = 0;

    let female = 0;

    data.forEach(row => {

        male += Number(row.tot_male || 0);

        female += Number(row.tot_female || 0);

    });

    const canvas = document.getElementById("maleFemaleChart");

    if (!canvas) return;

    chartObjects.maleFemaleChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: [

                "Gender"

            ],

            datasets: [

                {

                    label: "Male",

                    data: [

                        male

                    ],

                    backgroundColor: "#2563eb"

                },

                {

                    label: "Female",

                    data: [

                        female

                    ],

                    backgroundColor: "#ec4899"

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

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}

/*==========================================================
ROLLING COHORT TREND
==========================================================*/

function createRollingCohortChart(data) {

    const totals = {};

    data.forEach(row => {

        const cohort = row.rolling_cohort || "Unknown";

        totals[cohort] =

            (totals[cohort] || 0)

            + Number(row.tot_students || 0);

    });

    const labels = Object.keys(totals);

    const values = Object.values(totals);

    const canvas = document.getElementById("cohortChart");

    if (!canvas) return;

    chartObjects.cohortChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Students",

                    data: values,

                    borderColor: "#14b8a6",

                    backgroundColor: "rgba(20,184,166,0.20)",

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

/*==========================================================
LEVEL DISTRIBUTION
==========================================================*/
/*==========================================================
LEVEL DISTRIBUTION
==========================================================*/

function createLevelChart(data) {

    const totals = {};

    data.forEach(row => {

        const level = row.level || "Unknown";

        totals[level] =

            (totals[level] || 0)

            + Number(row.tot_students || 0);

    });

    const labels = Object.keys(totals);

    const values = Object.values(totals);

    const canvas = document.getElementById("levelChart");

    if (!canvas) return;

    chartObjects.levelChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [

                {

                    data: values,

                    backgroundColor: [

                        "#10b981",

                        "#f59e0b",

                        "#6366f1",

                        "#ef4444",

                        "#06b6d4"

                    ],

                    borderWidth: 2

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

            }

        }

    });

}

/*==========================================================
COMMON COLOR PALETTE
==========================================================*/

const chartColors = {

    blue: "#2563eb",

    pink: "#ec4899",

    green: "#10b981",

    orange: "#f59e0b",

    purple: "#8b5cf6",

    teal: "#14b8a6",

    red: "#ef4444",

    cyan: "#06b6d4",

    indigo: "#6366f1"

};

/*==========================================================
HELPER FUNCTION
==========================================================*/

function aggregateByField(data, groupField, valueField) {

    const result = {};

    data.forEach(row => {

        const key = row[groupField] || "Unknown";

        result[key] =

            (result[key] || 0)

            + Number(row[valueField] || 0);

    });

    return result;

}

/*==========================================================
END OF charts.js
==========================================================*/
