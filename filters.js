/*==========================================================
CHAVARA GEM ANALYTICS STUDIO
filters.js
Version 2.0
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeFilters();

});

/*==========================================================
INITIALIZE FILTER EVENTS
==========================================================*/

function initializeFilters() {

    attachFilter("yearFilter");

    attachFilter("programmeFilter");

    attachFilter("levelFilter");

    attachFilter("equityFilter");

    initializeSearch();

    initializeReset();

}

/*==========================================================
ATTACH FILTER
==========================================================*/

function attachFilter(id) {

    const element = document.getElementById(id);

    if (!element) return;

    element.addEventListener("change", () => {

        applyFilters();

    });

}

/*==========================================================
SEARCH BOX
==========================================================*/

function initializeSearch() {

    const search = document.getElementById("searchBox");

    if (!search) return;

    search.addEventListener("keyup", () => {

        searchTable();

    });

}

/*==========================================================
RESET BUTTON
==========================================================*/

function initializeReset() {

    const button = document.getElementById("resetFilters");

    if (!button) return;

    button.addEventListener("click", () => {

        resetFilters();

    });

}

/*==========================================================
FILTER SUMMARY
==========================================================*/

function getFilterSummary() {

    return {

        year:
            document.getElementById("yearFilter")?.value || "All",

        programme:
            document.getElementById("programmeFilter")?.value || "All",

        level:
            document.getElementById("levelFilter")?.value || "All",

        equity:
            document.getElementById("equityFilter")?.value || "All"

    };

}

/*==========================================================
DISPLAY ACTIVE FILTERS
==========================================================*/

function updateFilterBadge() {

    const badge = document.getElementById("activeFilters");

    if (!badge) return;

    const filters = getFilterSummary();

    badge.innerHTML = `

        <strong>Year:</strong> ${filters.year}

        |

        <strong>Programme:</strong> ${filters.programme}

        |

        <strong>Level:</strong> ${filters.level}

        |

        <strong>Equity:</strong> ${filters.equity}

    `;

}

/*==========================================================
REFRESH AFTER FILTER CHANGE
==========================================================*/

function refreshDashboardView() {

    updateFilterBadge();

    updateDashboard();

}

/*==========================================================
CLEAR SEARCH
==========================================================*/

function clearSearchBox() {

    const search = document.getElementById("searchBox");

    if (search) {

        search.value = "";

    }

}

/*==========================================================
CLEAR ALL FILTERS
==========================================================*/

function clearAllFilters() {

    [

        "yearFilter",

        "programmeFilter",

        "levelFilter",

        "equityFilter"

    ].forEach(id => {

        const element = document.getElementById(id);

        if (element) {

            element.value = "All";

        }

    });

}

/*==========================================================
EXPORT FILTER OBJECT
==========================================================*/

window.dashboardFilters = {

    getFilterSummary,

    updateFilterBadge,

    refreshDashboardView,

    clearSearchBox,

    clearAllFilters

};

/*==========================================================
END OF filters.js
==========================================================*/
