"use strict";

var settings = {
    //variable names that look LIKE_THIS are constants and generally only need to be set once
    firstRun: true, //this will display some instructions to get started on the page; set this to false to hide them.  TODO: make this actually do something
    //these settings control how this app communicates with Trello, via the Trello API
    TRELLO_DEVELOPER_KEY: "ENTER_TRELLO_DEVELOPER_KEY_HERE", //find yours at https://trello.com/1/appKey/generate
    TRELLO_TOKEN: "ENTER_GENERATED_TRELLO_TOKEN_HERE",
    TRELLO_APP_NAME: "Trello Homework Card Creator", //You can set this to whatever you want, ideally something you'll recognize in the future
    TRELLO_READWRITE_AUTH_LENGTH: "ENTER_VALUE_HERE", //This determines how long you'll give yourself (via this app) read/write access to your Trello account.  If you are just trying this out, you can do "1day"; if you want this to work for the next month, enter "30days"; if you want this to work forever, enter "never"
    TRELLO_BOARD_ID: "ENTER_TRELLO_BOARD_ID_HERE", //the 8-character string after 'b/' in the URL of the Trello board you want these cards to appear on

    //these settings control which list(s) your cards are added to on the board you specified
    TRELLO_LISTS: [{ LIST_NAME: "FRIENDLY_NAME", LIST_ID: "ENTER_LIST_ID_HERE" }, { LIST_NAME: "FRIENDLY_NAME_LIST2", LIST_ID: "ENTER_SECOND_LIST_ID_HERE" }], //an array of lists you want to add cards to.  Put a nickname for the list in LIST_NAME and the list's ID in LIST_ID.  A dropdown menu to select the list you want will appear at the top if more than one is here.  An error message will appear if no list is specified here.  Do not remove the brackets around the list ID, even if you only specify one list.
    listAddType: "one", //allowed values: "one" - only add the card to the selected list, "all" - add the card to all lists specified in TRELLO_LISTS

    //these settings control how the card is generated; all can be dynamic; the intent is to save you time from having to do repetitive things, like adding due dates (the whole reason this was created), or assigning users, adding labels, adding a description, etc.
    assignMyself: false, //allowed values: true - use TRELLO_USER_ID to assign yourself to the card you create; useful for showing cards in the Trello Android widget
    TRELLO_USER_ID: "ENTER_USERID_HERE", //if assign myself is true, enter your Trello user id here.  You can find it by looking at one of your cards JSON outputs
    dueDateTime: "0900", //the time when cards will be due, on the date you specify.  Use 24 hour time; 9AM = 0900, 9PM=2100
    descriptionType: "attribution", //allowed values (You can program your own, too.): "attribution" - will put an italicized note saying the card was created using Trello Homework Card Creator, with a link back to the GitHub repository.  You can change this if you don't like it.  "datetime" - will add an italicized date and time that the card was created.  "none" - will show nothing and won't prompt for a description in the form  "custom" - will show a small textarea in the form where you can enter your own description, if you are so inclined
    autoAddLabels: false, //allowed values: "true" - add the labels in LabelsToAdd to the card that is created; "false" (default) - don't auto-add labels
    labelsToAdd: [], //enter label names in this array to have them added to your card, if you wish.  Leave blank to add no labels.  Enclose label names in quotes ,(e.g., label named Important would be entered as "Important").

    //developer - don't change these values unless you know what you're doing
    debugMode: false, //log various things that are useful for debugging in the console
    demoMode: false, //simulate various end results of requests.  accepted values: "success" - pretend that the request succeeded; "ANY_ERROR_CODE" - enter an error code used by this app, and the app will pretend the request failed with that error code
    today: "" //DO NOT CHANGE, but either way, this gets overwritten on load with the current date and time.
};

function initialize() {
    if (settings.descriptionType === "custom") {
        document.getElementById('description-group').insertAdjacentHTML('afterbegin', '<label for="description" class="item-title">Description:</label><br /><input id="description" type="text" /><br /><br />');
    }

    if (settings.TRELLO_LISTS.length > 1) {

        var listsToAdd = "";
        for (var _i = 0; _i < settings.TRELLO_LISTS.length; _i++) {
            listsToAdd += '<input type="radio" id="list' + _i + '" value="' + settings.TRELLO_LISTS[_i].LIST_ID + '" name="lists" /><label for="list' + _i + '">' + settings.TRELLO_LISTS[_i].LIST_NAME + '</label><br/>';
        }

        document.getElementById('list-options').insertAdjacentHTML('beforeend', listsToAdd + '<br />');
    } else {
        document.getElementById('list-options').className = "hidden";
    }
    //configure due date picker
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    settings.today = moment();
    var todayDayName = settings.today.day();
    var relativeDays = []; //the days array translated so that today is the first element
    for (var _i2 = todayDayName; _i2 <= todayDayName + 6; _i2++) {
        //todayDayName + 6 can end the loop because Saturday (todayDayName = 6) is when the value of i will be the highest.  The loop continues to 6 more days (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday) before it needs to end.  Thus, if Saturday = 6, and we add 6, we get 6+6 = 12; the last day is Friday (5), and 12-7 = 5; when we reach Friday i will be 12, and the loop will end.
        if (_i2 > 6) {
            //if i is greater than 6, subtract 7 (say, if today is Friday, and i starts at 5, then Sunday will be i = 7, so 7-7 = 0, which is correct)
            relativeDays.push(days[_i2 - 7]);
        } else {
            relativeDays.push(days[_i2]);
        }
    }

    var toAdd = "";
    var dayNames = relativeDays;
    dayNames[0] = "Next " + dayNames[0];
    if (settings.debugMode) {
        console.log(dayNames);
    }
    var dayToAdd;
    for (i = 2; i <= relativeDays.length; i++) {
        //start at the day after tomorrow
        if (i > 6) {
            j = i - 7;
            dayToAdd = dayNames[j];
        } else {
            dayToAdd = dayNames[i];
        }
        toAdd += '<input type="radio" id="due-date-plus' + i + '" value="' + i + '" name="due-date"> <label for="due-date-plus' + i + '">' + dayToAdd + '</label><br />'; //this can apply to any value of i because only the day of the week is part of the array and needs to be corrected when i >= 7.  the id's for the radio buttons use plus_, and the Next [today] value is 7 days from now, so it should have 7 subtracted from it
    }

    document.getElementById('due-date-days').insertAdjacentHTML('beforeend', toAdd);

    if (settings.debugMode) {
        console.warn("Debug mode is enabled.  Disable before committing to GitHub");
        console.log(relativeDays);
    }

    document.getElementById('loading').className = "hidden";
    document.getElementById('app').className = "";
}

//trelloRequest callbacks
function success(evt) {
    alert("Success!  Card created.");

    document.getElementById('card-info').reset(); //clear the form
}

function error(evt) {
    alert("Eek!  There was a problem that prevented your card from being creator.  Check your internet connection and make sure there are no accents or other special characters in the card name, then try again.");
    if (settings.debugMode) {
        console.error("The request failed.");
        console.error(evt);
    }
}

function checkSettings() {
    var problems = [];
    //check for default values
    if (settings.TRELLO_DEVELOPER_KEY === "ENTER_TRELLO_DEVELOPER_KEY_HERE") {
        problems.push("The Trello developer key is set to the default value.  Change it to your developer key.  You can find it at https://trello.com/1/appKey/generate.");
    }
    if (settings.TRELLO_TOKEN === "ENTER_GENERATED_TRELLO_TOKEN_HERE") {
        problems.push("The Trello user token is set to the default value.  You'll need to set settings.firstRun to true to see how to solve this.");
    }
    if (settings.TRELLO_BOARD_ID === "ENTER_TRELLO_BOARD_ID_HERE") {
        problems.push("The Trello board ID is set to the default value.  The board ID is the 8-character string after b/ in the URL of the Trello board you want to send cards to.");
    }
    if (settings.TRELLO_LISTS[0] === "ENTER_LIST_IDS" || settings.TRELLO_LISTS[0] === "LIST_ID2" || settings.TRELLO_LISTS[1] === "ENTER_LIST_IDS" || settings.TRELLO_LISTS[1] === "LIST_ID2") {
        problems.push("The Trello list ID array contains one or more default values.  Replace them with your list IDs.  Set settings.firstRun to true and follow the instructions to resolve this issue.");
    }
    if (settings.assignMyself && settings.TRELLO_USER_ID === "ENTER_USERID_HERE") {
        problems.push("The Trello user ID is not set but assignMyself is set to true.  To resolve, either set settings.assignMyself to false or set settings.firstRun to true and follow the instructions.");
    }
    try {
        //make sure due date selected
        document.querySelector('input[name="due-date"]:checked').value; //see if a due date was selected
    } catch (e) {
        problems.push("No due date was selected.  You must select a due date to create the card.  If you know what you are doing, you can also change the value of the due date that is sent in the request to Trello to null and comment out this try-catch statement.");
    }
    if (settings.TRELLO_LISTS.length > 1) {
        try {
            //make sure due date selected
            document.querySelector('input[name="lists"]:checked').value; //see if a due date was selected
        } catch (e) {
            problems.push("No list selected.  Please select a list and try again.");
        }
    }

    //make sure an assignment name was specified
    if (document.querySelector('input[id="card-name"]').value === "") {
        problems.push("You didn't specify an assignment name.");
    }
    if (problems.length > 0) {
        //failed
        plural = "s";
        if (problems.length === 1) {
            plural = "";
        }
        console.error("Settings check failed.");
        for (i = 0; i < problems.length; i++) {
            console.error(problems[i]);
        }
        alert(problems.length + " error" + plural + " occurred.  See the console for more information.  You must resolve the errors to create cards.");
    } else {
        return true; //passed
    }
}

function createCard() {
    if (!checkSettings()) {
        console.error("Card creation cannot continue because the settings check failed.");
        return false;
    }
    settings.today = moment(); //make sure we're starting with the current date

    var listSelected = void 0;
    if (settings.TRELLO_LISTS.length > 1) {
        listSelected = document.querySelector('input[name="lists"]:checked').value;
    } else {
        listSelected = settings.TRELLO_LISTS[0].LIST_ID;
    }

    var dueDateSelected = document.querySelector('input[name="due-date"]:checked').value; //We can assume this has a value because that was verified in the checkSettings() function that ran before this.  If no due date was selected, checkSettings should catch it and prevent card creation from continuing.
    var dueDate = settings.today.add(dueDateSelected, 'd'); //Find dueDate by adding number of days necessary to the date recorded when the page was loaded (should generally be pretty close to when the card is created [in theory]).  Today adds 0, tomorrow adds 1, etc.  The values of the due date question radio buttons are the number of days to get to them (it takes 0 days to get to today, 1 to get to tomorrow, etc.)
    //TODO: if it's now the next day, confirm the actual date the user wants for the due date
    var dueHour = settings.dueDateTime.substring(0, 2); //get the hour for the due date from settings
    var dueMin = settings.dueDateTime.substring(2, 4); //get the minute for the due date from settings
    if (settings.debugMode) {
        console.log("dueDate: " + dueDate);
        console.log("dueHour: " + dueHour);
        console.log("dueMin: " + dueMin);
    }
    //finish setting up the due date
    dueDate.hour(dueHour);
    dueDate.minutes(dueMin);
    dueDate.seconds(0); //set seconds and milliseconds to 0 so that the due date is for exactly the hour and minute specified
    dueDate.milliseconds(0);

    var assignmentName = document.querySelector('input[id="card-name"]').value; //get the assignment name

    //actually send the card to Trello
    var trelloRequest = new XMLHttpRequest();
    var url = "https://trello.com/1/cards?key=" + settings.TRELLO_DEVELOPER_KEY + "&name=" + assignmentName + "&pos=bottom&due=" + dueDate + "&token=" + settings.TRELLO_TOKEN + "&idList=" + listSelected + "&idMembers=" + settings.TRELLO_USER_ID;
    //TO DO: add ability to select desired list in advance
    if (settings.debugMode) {
        console.log(url);
    }
    trelloRequest.addEventListener("load", success, false); //keep track of status
    trelloRequest.addEventListener("error", error, false);
    //TODO: Add better error handling.  Currently, requests that return "401 (Unauthorized)" are marked successful
    trelloRequest.open("POST", url);
    trelloRequest.send();
}

//# sourceMappingURL=script-compiled.js.map