/*==================================================
CHAVARA GEM ANALYTICS STUDIO
filters.js
==================================================*/

/*
This file coordinates all filter interactions.
The actual filtering is performed in app.js.
*/

document.addEventListener("DOMContentLoaded", () => {

    initializeFilterEvents();

});

/*==================================================
INITIALIZE EVENTS
==================================================*/

function initializeFilterEvents(){

    attach("yearFilter");

    attach("programmeFilter");

    attach("levelFilter");

    attach("equityFilter");

    attachSearch();

    attachReset();

}

/*==================================================
ATTACH DROPDOWN
==================================================*/

function attach(id){

    const element=document.getElementById(id);

    if(!element) return;

    element.addEventListener("change",()=>{

        if(typeof applyFilters==="function"){

            applyFilters();

        }

    });

}

/*==================================================
SEARCH
==================================================*/

function attachSearch(){

    const box=document.getElementById("searchBox");

    if(!box) return;

    box.addEventListener("keyup",()=>{

        if(typeof searchTable==="function"){

            searchTable();

        }

    });

}

/*==================================================
RESET
==================================================*/

function attachReset(){

    const btn=document.getElementById("resetFilters");

    if(!btn) return;

    btn.addEventListener("click",()=>{

        if(typeof resetFilters==="function"){

            resetFilters();

        }

    });

}

/*==================================================
GET CURRENT FILTERS
==================================================*/

function currentFilters(){

    return{

        year:

        document.getElementById("yearFilter")?.value ||

        "All",

        programme:

        document.getElementById("programmeFilter")?.value ||

        "All",

        level:

        document.getElementById("levelFilter")?.value ||

        "All",

        equity:

        document.getElementById("equityFilter")?.value ||

        "All"

    };

}

/*==================================================
CLEAR SEARCH
==================================================*/

function clearSearch(){

    const box=document.getElementById("searchBox");

    if(box){

        box.value="";

    }

}

/*==================================================
CLEAR FILTERS
==================================================*/

function clearFilterSelections(){

    [

        "yearFilter",

        "programmeFilter",

        "levelFilter",

        "equityFilter"

    ].forEach(id=>{

        const element=document.getElementById(id);

        if(element){

            element.value="All";

        }

    });

}

/*==================================================
REFRESH DASHBOARD
==================================================*/

function refreshDashboard(){

    if(typeof updateDashboard==="function"){

        updateDashboard();

    }

}

/*==================================================
FILTER SUMMARY
==================================================*/

function selectedFilterSummary(){

    const filters=currentFilters();

    return`

Year : ${filters.year}

Programme : ${filters.programme}

Level : ${filters.level}

Equity : ${filters.equity}

`;

}

/*==================================================
EXPORT FILTERS
==================================================*/

window.dashboardFilters={

    currentFilters,

    clearSearch,

    clearFilterSelections,

    refreshDashboard,

    selectedFilterSummary

};

/*==================================================
END OF filters.js
==================================================*/
