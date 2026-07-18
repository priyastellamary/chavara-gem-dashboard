/*==========================================================
CHAVARA GEM ANALYTICS STUDIO
charts.js Version 2
==========================================================*/

let chartObjects = {};

/*==========================================================
DESTROY EXISTING CHARTS
==========================================================*/

function destroyCharts() {

    Object.values(chartObjects).forEach(chart => {

        if (chart) {

            chart.destroy();

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

    const totalMale = data.reduce(
        (sum, row) => sum + Number(row.tot_male || 0), 0);

    const totalFemale = data.reduce(
        (sum, row) => sum + Number(row.tot_female || 0), 0);

    const ctx = document.getElementById("genderChart");

    if (!ctx) return;

    chartObjects.genderChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Male",

                "Female"

            ],

            datasets: [

                {

                    data: [

                        totalMale,

                        totalFemale

                    ],

                    backgroundColor: [

                        "#2563eb",

                        "#ec4899"

                    ],

                    borderWidth: 1

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

        totals[row.program_clean] =
            (totals[row.program_clean] || 0)
            + Number(row.tot_students);

    });

    const labels = Object.keys(totals);

    const values = Object.values(totals);

    const ctx = document.getElementById("programmeChart");

    if (!ctx) return;

    chartObjects.programmeChart = new Chart(ctx, {

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
    /*==========================================================
ACADEMIC YEAR TREND
==========================================================*/

function createAcademicYearChart(data) {

    const yearTotals = {};

    data.forEach(row => {

        const year = row.academic_year;

        yearTotals[year] =
            (yearTotals[year] || 0) +
            Number(row.tot_students);

    });

    const labels = Object.keys(yearTotals).sort();

    const values = labels.map(y => yearTotals[y]);

    const ctx = document.getElementById("yearChart");

    if (!ctx) return;

    chartObjects.yearChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Students",

                data: values,

                borderColor: "#2563eb",

                backgroundColor: "rgba(37,99,235,0.15)",

                fill: true,

                tension: 0.35,

                pointRadius: 5

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

/*==========================================================
TOP 10 PROGRAMMES
==========================================================*/

function createTopProgrammeChart(data) {

    const totals = {};

    data.forEach(row => {

        totals[row.program_clean] =
            (totals[row.program_clean] || 0)
            + Number(row.tot_students);

    });

    const sorted = Object.entries(totals)

        .sort((a,b)=>b[1]-a[1])

        .slice(0,10);

    const labels = sorted.map(x=>x[0]);

    const values = sorted.map(x=>x[1]);

    const ctx =
        document.getElementById("topProgrammeChart");

    if(!ctx) return;

    chartObjects.topProgrammeChart =
        new Chart(ctx,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Students",

                data:values,

                backgroundColor:"#14b8a6"

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            indexAxis:"y",

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}

/*==========================================================
EQUITY STATUS
==========================================================*/

function createEquityChart(data){

    const equity={};

    data.forEach(row=>{

        equity[row.equity_status]=

            (equity[row.equity_status]||0)+1;

    });

    const ctx=document.getElementById("equityChart");

    if(!ctx) return;

    chartObjects.equityChart=

    new Chart(ctx,{

        type:"pie",

        data:{

            labels:Object.keys(equity),

            datasets:[{

                data:Object.values(equity),

                backgroundColor:[

                    "#22c55e",

                    "#f59e0b",

                    "#ef4444"

                ]

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

/*==========================================================
FEMALE PERCENTAGE TREND
==========================================================*/

function createFemaleTrendChart(data){

    const yearly={};

    data.forEach(row=>{

        if(!yearly[row.academic_year]){

            yearly[row.academic_year]=[];

        }

        yearly[row.academic_year]

            .push(Number(row.female_pct));

    });

    const labels=Object.keys(yearly).sort();

    const values=labels.map(year=>{

        const arr=yearly[year];

        return arr.reduce((a,b)=>a+b,0)/arr.length;

    });

    const ctx=

    document.getElementById("femaleTrendChart");

    if(!ctx) return;

    chartObjects.femaleTrendChart=

    new Chart(ctx,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"Average Female %",

                data:values,

                borderColor:"#ec4899",

                backgroundColor:"rgba(236,72,153,0.15)",

                fill:true,

                tension:0.4,

                pointRadius:5

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            scales:{

                y:{

                    beginAtZero:true,

                    max:100

                }

            }

        }

    });

}
/*==========================================================
MALE vs FEMALE COMPARISON
==========================================================*/

function createMaleFemaleChart(data) {

    const labels = data.map(row => row.program_clean);

    const male = data.map(row => Number(row.tot_male));

    const female = data.map(row => Number(row.tot_female));

    const ctx = document.getElementById("maleFemaleChart");

    if (!ctx) return;

    chartObjects.maleFemaleChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Male",

                    data: male,

                    backgroundColor: "#2563eb"

                },

                {

                    label: "Female",

                    data: female,

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

/*==========================================================
ROLLING COHORT TREND
==========================================================*/

function createRollingCohortChart(data) {

    const cohortTotals = {};

    data.forEach(row => {

        cohortTotals[row.academic_year] =

            (cohortTotals[row.academic_year] || 0)

            + Number(row.rolling_cohort);

    });

    const labels = Object.keys(cohortTotals).sort();

    const values = labels.map(year => cohortTotals[year]);

    const ctx = document.getElementById("cohortChart");

    if (!ctx) return;

    chartObjects.cohortChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Rolling Cohort",

                    data: values,

                    borderColor: "#8b5cf6",

                    backgroundColor: "rgba(139,92,246,0.15)",

                    fill: true,

                    tension: 0.35,

                    pointRadius: 5

                }

            ]

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

/*==========================================================
LEVEL DISTRIBUTION (UG vs PG)
==========================================================*/

function createLevelChart(data) {

    const levelTotals = {};

    data.forEach(row => {

        levelTotals[row.level] =

            (levelTotals[row.level] || 0)

            + Number(row.tot_students);

    });

    const ctx = document.getElementById("levelChart");

    if (!ctx) return;

    chartObjects.levelChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: Object.keys(levelTotals),

            datasets: [

                {

                    data: Object.values(levelTotals),

                    backgroundColor: [

                        "#10b981",

                        "#f59e0b"

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
CHART COLOR PALETTE
==========================================================*/

const chartColors = {

    blue: "#2563eb",

    pink: "#ec4899",

    green: "#10b981",

    orange: "#f59e0b",

    purple: "#8b5cf6",

    teal: "#14b8a6",

    red: "#ef4444"

};

/*==========================================================
OPTIONAL HELPER
==========================================================*/

function aggregateByField(data, groupField, valueField) {

    const result = {};

    data.forEach(row => {

        const key = row[groupField];

        result[key] =

            (result[key] || 0)

            + Number(row[valueField] || 0);

    });

    return result;

}

/*==========================================================
END OF charts.js
==========================================================*/


