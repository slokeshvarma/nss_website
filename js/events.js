/* objects */
function EventCard(eventID, eventDate, eventAcademicYear, eventUnit, eventDescription, eventPosterLink, eventDescriptionLink, eventStatus) {
    
    
}

/* function */
function eventIdGenerator(eventDate, eventName, eventUnit) {
    const dates = {
         1: "A",  2: "B",  3: "C",  4: "4",  5: "D",  6: "E",  7: "F",  8: "G",  9: "H", 10: "1",
        11: "I", 12: "J", 13: "K", 14: "L", 15: "5", 16: "M", 17: "N", 18: "O", 19: "P", 20: "2",
        21: "Q", 22: "R", 23: "S", 24: "T", 25: "U", 26: "V", 27: "W", 28: "X", 29: "Y", 30: "3",
        31: "Z"
    }
    const months = {
        0: "J", 1: "F", 2: "M", 3: "A", 4: "Y", 5: "U", 6: "L", 7: "G", 8: "S", 9: "O", 10: " N", 11: "D"
    }

    const [day, month, year] = eventDate.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    let yearSuffix = `${date.getFullYear()}`.slice(3, 5);
    if (yearSuffix.length === 1) {
        yearSuffix = `0${yearSuffix}`;
    }

    const EventIdUniqueChar = Math.random().toString(36).substring(2, 3).toUpperCase();
    const eventId = `${dates[date.getDate()]}${months[date.getMonth()]}${yearSuffix}${eventName.slice(0, 1)}${eventUnit}${EventIdUniqueChar}`;

    return eventId;
}

function GetQueryParam(param_name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param_name)?.replace(/["']/g, "");
};

function ChronolizeEvents(dict) {
    var ChronolizeEvents = [];
    var rectifiedData = [];
    dict.forEach(row => {row.extraDate = "0";});

    dict.forEach(row => {
        if (row.date.includes("_")) {
            row.extraDate = row.date.split("_")[0];
            row.date = row.date.split("_")[1];
        };
        row.date = `20${row.date.split("-").reverse().join("-")}`;
        rectifiedData.push(row);
    });
    rectifiedData.sort((a, b) => {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateB - dateA;
    });

    rectifiedData.forEach(row => {
        row.date = row.date.slice(2, row.date.length);
        row.date = row.date.split("-").reverse().join("-");
        if (row.extraDate !== "0") {
            row.date = `${row.extraDate}_${row.date}`;
        }
        ChronolizeEvents.push(row);
    });

    ChronolizeEvents.forEach(row => {
        delete row.extraDate;
    })
    return ChronolizeEvents;
};

var EventIdUniqueChar = 1;
let DOMContentLoaded = false;
document.addEventListener("DOMContentLoaded", () => {    
    DOMContentLoaded = true;
    const eventsMain = document.getElementsByTagName("main")[0];
    const eventsSection = document.getElementById("events");
    const nav = document.querySelector("nav");
    const navHeight = nav.clientHeight;
    
    eventsMain.style.marginTop = `${navHeight}px`;

    let academicYear;
    if (!GetQueryParam('academic-year')) {
        academicYear = academicYearCalculator();
    } else {
        academicYear = GetQueryParam('academic-year');
    }
    eventsSection.innerHTML = `${academicYear} got from query`;
    
    eventsData = [];
    upcomingEventsData =[];
    loadCSV("dataTables/eventsData.csv").then(data => {    
        data.forEach(row => {
            if (row.eventAcademicYear === academicYear) {
                if (row.eventStatus === "1") {
                    eventsData.push(row);
                } else {
                    upcomingEventsData.push(row);
                }
            }
        });
        console.log(eventsData);
        console.log(upcomingEventsData);
    });
});

