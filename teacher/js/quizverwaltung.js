import * as Utils from "../../../includes/utils.js";
import { editQuizdata, getThemaFromUser } from "./quizverwaltung.inc.js";

class Quizverwaltung {
  constructor(container) {
    this.container = container;
    this.searchBtn = null;
    this.chooseFilterTypeSelect = null;
    this.filterContainer = null;
    this.selectionFiltersContainer = null;
    this.limiter = null;

    //Filters
    this.showQuizAuswahlSelectContainer = null;
    this.visibilitySelectContainer = null;
    this.klassenstufeSelectContainer = null;
    this.fachSelectContainer = null;
    this.themaSelectContainer = null;
    this.nameSelectContainer = null;
    this.descriptionSelectContainer = null;
    this.questionsSelectContainer = null;
    this.quizIdSelectContainer = null;
    this.idSelectContainer = null;
    this.requireKlassenstufeSelectContainer = null;
    this.requireFachSelectContainer = null;
    this.requireThemaSelectContainer = null;
    this.requireNameSelectContainer = null;
    this.numberOfQuizCardsSelectContainer = null;
    this.createdSelectContainer = null;
    this.createdBySelectContainer = null;
    this.createdByString = false;
    this.changedSelectContainer = null;
    this.changedBySelectContainer = null;
    this.changedBySelectArray = new Array();
    this.limiter = null;

    //others
    this.searchWhileTyping = false;
    this.editBtn = null;

    // this.groupsSearchArray = new Array();
    // this.permissionsSearchArray = new Object();
    // this.klassenstufenSearchArray = new Array();
    this.choosenArray = new Array();
    this.oldCheckedArray = new Array();

    this.resultTable = null;
    // this.chooseAllBtn = null;
    this.editTable = null;
    this.editContainer = null;
    this.editTableBody = null;
    this.resultDescriptionContainer = null;
    // this.resultsDescription = null;
    // this.resultsFound = null;

    this.searchReloadBtn = null;
    this.editReloadBtn = null;
  }

  prepareEdit() {
    if (!this.editContainer) return "no edit container";
    this.editContainer.classList.add("hidden");

    let reloadBtn = this.editContainer.querySelector("#reload");
    if (!reloadBtn) return "no reload button";
    reloadBtn.addEventListener("click", () => {
      this.edit(this.choosenArray);
    });

    //Edit Btn
    this.editReloadBtn = reloadBtn;

    this.clear(this.editTableBody);
    //Change All
    let thead = this.editTable.querySelector("thead");

    //Change all

    let changeNameAll = thead.querySelector("#name #changeAll");
    changeNameAll.addEventListener("click", async () => {
      if (!(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))) {
        return false;
      }
      let userInput = await Utils.getUserInput(
        "Eingabefeld",
        `Wie sollen die Quizze heißen? In aufsteigender Rehenfolge bspw: <b>Name</b>, <b>Name 2</b>, <b>Name 3</b>`,
        false,
        "text",
        false,
        false,
        true
      );
      if (userInput === false) {
        Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
        return false;
      }

      let counter = 1;
      for (const current of this.choosenArray) {
        let name = userInput;
        if (counter > 1 && userInput !== false) {
          name = `${name} ${counter}`;
        }
        let res = await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=changeValue&type=name&uniqueID=" +
              current +
              "&input=" +
              name,
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true,
            false
          )
        );
        if (res["status"] === "success") {
          counter++;
        }
      }

      this.edit(this.choosenArray);
    });

    let changeAllKlassenstufe = thead.querySelector("#klassenstufe #changeAll");
    changeAllKlassenstufe.addEventListener("click", async () => {
      if (!(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))) {
        return false;
      }
      let availableKlassenstufen = Utils.sortItems(
        await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=other&type=getAllKlassenstufen",
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true
          )
        )
      );
      let choosen = await Utils.chooseFromArrayWithSearch(
        availableKlassenstufen,
        true,
        "Klassenstufe auswählen",
        false
      );
      if (choosen && choosen.length > 0) {
        choosen = choosen[0];
      } else {
        choosen = false;
      }

      for (const current of this.choosenArray) {
        await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=changeValue&type=klassenstufe&uniqueID=" +
              current +
              "&input=" +
              choosen,
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true,
            false
          )
        );
      }
      this.edit(this.choosenArray);
    });

    let changeAllFach = thead.querySelector("#fach #changeAll");
    changeAllFach.addEventListener("click", async () => {
      if (!(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))) {
        return false;
      }
      let availableFaecher = Utils.sortItems(
        await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=other&type=getAllFaecher",
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            true,
            false,
            true
          )
        )
      );
      let choosen = await Utils.chooseFromArrayWithSearch(
        availableFaecher,
        true,
        "Fach auswählen",
        false
      );
      if (choosen && choosen.length > 0) {
        choosen = choosen[0];
      } else {
        choosen = false;
      }
      for (const current of this.choosenArray) {
        await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=changeValue&type=fach&uniqueID=" +
              current +
              "&input=" +
              choosen,
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true,
            false
          )
        );
      }
      this.edit(this.choosenArray);
    });

    let changeAllThema = thead.querySelector("#thema #changeAll");
    changeAllThema.addEventListener("click", async () => {
      if (!(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))) {
        return false;
      }
      let choosen = await getThemaFromUser();
      if (choosen && choosen.length > 0) {
        choosen = choosen[0];
      } else {
        choosen = false;
      }
      for (const current of this.choosenArray) {
        await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=changeValue&type=thema&uniqueID=" +
              current +
              "&input=" +
              choosen,
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true,
            false
          )
        );
      }

      this.edit(this.choosenArray);
    });

    let changeAllDescription = thead.querySelector("#description #changeAll");
    changeAllDescription.addEventListener("click", async () => {
      if (!(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))) {
        return false;
      }
      let userInput = await Utils.getUserInput(
        "Eingabefeld",
        `Beschreibung für das Quiz?`,
        false,
        "text",
        false,
        false,
        true
      );
      if (userInput === false) {
        Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
        return false;
      }
      for (const current of this.choosenArray) {
        await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=changeValue&type=description&uniqueID=" +
              current +
              "&input=" +
              userInput,
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true,
            false
          )
        );
      }

      this.edit(this.choosenArray);
    });

    let changeAllShowQuizAuswahl = thead.querySelector(
      "#showQuizAuswahl #changeAll"
    );
    changeAllShowQuizAuswahl.addEventListener("click", async () => {
      let state = await Utils.getUserInput(
        "Anzeigestatus für alle ändern",
        "Sollen alle ausgewählten Quiz bei der Quizauswahl angezeigt werden?",
        false,
        "select",
        false,
        false,
        true,
        { "Ja (anzgeigen)": "1", "Nein (nicht anzeigen)": "0" },
        true
      );
      if (state === false) {
        Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
        return false;
      }
      for (const current of this.choosenArray) {
        await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=changeValue&type=showQuizAuswahl&uniqueID=" +
              current +
              "&input=" +
              state,
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true,
            false
          )
        );
      }

      this.edit(this.choosenArray);
    });

    let changeAllVisibility = thead.querySelector("#visibility #changeAll");
    changeAllVisibility.addEventListener("click", async () => {
      let state = await Utils.getUserInput(
        "Verfügbarkeitsstatus für alle ändern",
        "Sollen alle ausgewählten Quiz verfügbar sein?",
        false,
        "select",
        false,
        false,
        true,
        { "Ja (verfügbar)": "1", "Nein (nicht verfügbar)": "0" },
        true
      );
      if (state === false) {
        Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
        return false;
      }
      for (const current of this.choosenArray) {
        await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=changeValue&type=visibility&uniqueID=" +
              current +
              "&input=" +
              state,
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true,
            false
          )
        );
      }

      this.edit(this.choosenArray);
    });

    let changeAllrequireKlassenstufe = thead.querySelector(
      "#requireKlassenstufe #changeAll"
    );
    changeAllrequireKlassenstufe.addEventListener("click", async () => {
      let state = await Utils.getUserInput(
        "Ändern",
        "Sollen alle ausgewählten Quiz über eine Klassenstufe verfügen?",
        false,
        "select",
        false,
        false,
        true,
        { Ja: 1, Nein: 0 },
        true
      );

      if (state == 0) {
        for (const current of this.choosenArray) {
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=requireKlassenstufe&uniqueID=" +
                current +
                "&state=" +
                state,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              false,
              false,
              true,
              false
            )
          );
        }
      } else {
        let availableKlassenstufen = Utils.sortItems(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=other&type=getAllKlassenstufen",
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        );
        let choosen = await Utils.chooseFromArrayWithSearch(
          availableKlassenstufen,
          true,
          "Klassenstufe auswählen",
          false
        );
        if (choosen && choosen.length > 0) {
          choosen = choosen[0];
        } else {
          await Utils.alertUser("Nachricht", "Keine Aktion unternommen.");
          return false;
        }
        for (const current of this.choosenArray) {
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=requireKlassenstufe&uniqueID=" +
                current +
                "&state=" +
                Number(state).toString() +
                "&klassenstufe=" +
                choosen,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              false,
              false,
              true,
              false
            )
          );
        }
      }
      this.edit(this.choosenArray);
    });

    let changeAllrequireFach = thead.querySelector("#requireFach #changeAll");
    changeAllrequireFach.addEventListener("click", async () => {
      let state = await Utils.getUserInput(
        "Ändern",
        "Sollen alle ausgewählten Quiz über ein Fach verfügen?",
        false,
        "select",
        false,
        false,
        true,
        { Ja: 1, Nein: 0 },
        true
      );

      if (state == 0) {
        for (const current of this.choosenArray) {
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=requireFach&uniqueID=" +
                current +
                "&state=" +
                Number(state).toString(),
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              false,
              false,
              true,
              false
            )
          );
        }
      } else {
        let availableFaecher = Utils.sortItems(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=other&type=getAllFaecher",
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        );
        let choosen = await Utils.chooseFromArrayWithSearch(
          availableFaecher,
          true,
          "Fach auswählen",
          false
        );
        if (choosen && choosen.length > 0) {
          choosen = choosen[0];
        } else {
          await Utils.alertUser("Nachricht", "Keine Aktion unternommen.");
          return false;
        }
        for (const current of this.choosenArray) {
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=requireFach&uniqueID=" +
                current +
                "&state=" +
                Number(state).toString() +
                "&fach=" +
                choosen,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              false,
              false,
              true,
              false
            )
          );
        }
      }
      this.edit(this.choosenArray);
    });

    let changeAllrequireThema = thead.querySelector("#requireThema #changeAll");
    changeAllrequireThema.addEventListener("click", async () => {
      let state = await Utils.getUserInput(
        "Ändern",
        "Sollen alle ausgewählten Quiz über ein Thema verfügen?",
        false,
        "select",
        false,
        false,
        true,
        { Ja: 1, Nein: 0 },
        true
      );

      if (state == 0) {
        for (const current of this.choosenArray) {
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=requireThema&uniqueID=" +
                current +
                "&state=" +
                Number(state).toString(),
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              false,
              false,
              true,
              false
            )
          );
        }
      } else {
        let choosen = await getThemaFromUser();
        if (choosen && choosen.length > 0) {
          choosen = choosen[0];
        } else {
          await Utils.alertUser("Nachricht", "Keine Aktion unternommen.");
          return false;
        }
        for (const current of this.choosenArray) {
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=requireThema&uniqueID=" +
                current +
                "&state=" +
                Number(state).toString() +
                "&thema=" +
                choosen,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              false,
              false,
              true,
              false
            )
          );
        }
      }
      this.edit(this.choosenArray);
    });

    let changeAllrequireName = thead.querySelector("#requireName");
    changeAllrequireName.addEventListener("click", async () => {
      let state = await Utils.getUserInput(
        "Ändern",
        "Sollen alle ausgewählten Quiz über ein Thema verfügen?",
        false,
        "select",
        false,
        false,
        true,
        { Ja: 1, Nein: 0 },
        true
      );

      if (state == 0) {
        for (const current of this.choosenArray) {
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=requireName&uniqueID=" +
                current +
                "&state=" +
                Number(state).toString(),
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              false,
              false,
              true,
              false
            )
          );
        }
      } else {
        let userInput = await Utils.getUserInput(
          "Eingabefeld",
          `Wie sollen die Quizze heißen? In aufsteigender Rehenfolge bspw: <b>Name</b>, <b>Name 2</b>, <b>Name 3</b>`,
          false,
          "text",
          false,
          false,
          true
        );
        if (userInput === false) {
          Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
          return false;
        }

        let counter = 1;

        for (const current of this.choosenArray) {
          let name = userInput;
          if (counter > 1 && userInput !== false) {
            name = `${name} ${counter}`;
          }
          if (
            (await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireName&uniqueID=" +
                  current +
                  "&state=" +
                  Number(state).toString() +
                  "&name=" +
                  name,
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                false,
                false,
                true,
                false
              )
            )["status"]) === "success"
          ) {
            counter++;
          }
        }
      }

      this.edit(this.choosenArray);
    });

    let deleteAllQuizBtn = thead.querySelector("#remove #changeAll");
    deleteAllQuizBtn.addEventListener("click", async () => {
      if (!(await Utils.userHasPermissions(["quizverwaltungADDandRemove"]))) {
        return false;
      }
      if (
        !(await Utils.askUser(
          "Nachricht",
          "Möchtest du dieses Quiz wirklich <b>löschen</b>?",
          false
        ))
      ) {
        return false;
      }
      for (const current of this.choosenArray) {
        let response = await Utils.makeJSON(
          await Utils.sendXhrREQUEST(
            "POST",
            "quizverwaltung&operation=deleteQuiz&uniqueID=" + current,
            "./includes/quizverwaltung.inc.php",
            "application/x-www-form-urlencoded",
            true,
            false,
            false,
            true,
            false
          )
        );
        if (response["status"] === "success") {
          this.choosenArray = Utils.removeFromArray(this.choosenArray, current);
        }
      }

      this.edit(this.choosenArray);
    });
  }

  async prepareSearch() {
    if (!this.container) return "No container";

    //StartBtn
    let searchBtn = this.container.querySelector(".filter #search");
    if (!searchBtn) return "No searchBtn";
    this.searchBtn = searchBtn;

    //Filter Container (init)
    let filterContainer = this.container.querySelector(".filter");
    if (!filterContainer) return "No filter container";
    this.filterContainer = filterContainer;

    //Filter Type Select (init)
    let chooseFilterTypeSelect = filterContainer.querySelector(
      "#chooseFilterTypeContainer #chooseFilter"
    );
    if (!chooseFilterTypeSelect) return "no chooseFilterTypeSelect";
    this.chooseFilterTypeSelect = chooseFilterTypeSelect;

    //Toggle Search (init)
    let toggleSearchBtn = this.container.querySelector("#filterToggle");
    //if (!toggleSearchBtn) return false;
    toggleSearchBtn.addEventListener("click", () => {
      filterContainer.classList.toggle("hidden");
    });

    //Selection Filters (init) - Enable or disable filter
    console.log(this.filterContainer);
    let selectionFiltersContainer =
      this.filterContainer.querySelector(".selectionFilters");
    if (!selectionFiltersContainer) return "no selection filters container";
    this.selectionFiltersContainer = selectionFiltersContainer;

    //Initialize filters
    let showQuizAuswahlSelectContainer =
      filterContainer.querySelector("#showQuizAuswahl");
    let visibilitySelectContainer =
      filterContainer.querySelector("#visibility");
    let klassenstufeSelectContainer =
      filterContainer.querySelector("#klassenstufe");
    let fachSelectContainer = filterContainer.querySelector("#fach");
    let themaSelectContainer = filterContainer.querySelector("#thema");
    let nameSelectContainer = filterContainer.querySelector("#name");
    let descriptionSelectContainer =
      filterContainer.querySelector("#description");
    let questionsSelectContainer = filterContainer.querySelector("#questions");
    let quizIdSelectContainer = filterContainer.querySelector("#quizId");
    let idSelectContainer = filterContainer.querySelector("#id");
    let requireKlassenstufeSelectContainer = filterContainer.querySelector(
      "#requireKlassenstufe"
    );
    let requireFachSelectContainer =
      filterContainer.querySelector("#requireFach");
    let requireThemaSelectContainer =
      filterContainer.querySelector("#requireThema");
    let requireNameSelectContainer =
      filterContainer.querySelector("#requireName");
    let numberOfQuizCardsSelectContainer =
      filterContainer.querySelector("#numberOfQuizCards");
    let createdSelectContainer = filterContainer.querySelector("#created");
    let createdBySelectContainer = filterContainer.querySelector("#createdBy");
    let changedSelectContainer = filterContainer.querySelector("#changed");
    let changedBySelectContainer = filterContainer.querySelector("#changedBy");
    if (
      !showQuizAuswahlSelectContainer ||
      !visibilitySelectContainer ||
      !klassenstufeSelectContainer ||
      !fachSelectContainer ||
      !themaSelectContainer ||
      !nameSelectContainer ||
      !descriptionSelectContainer ||
      !questionsSelectContainer ||
      !quizIdSelectContainer ||
      !idSelectContainer ||
      !requireKlassenstufeSelectContainer ||
      !requireFachSelectContainer ||
      !requireThemaSelectContainer ||
      !requireNameSelectContainer ||
      !numberOfQuizCardsSelectContainer ||
      !createdSelectContainer ||
      !createdBySelectContainer ||
      !changedSelectContainer ||
      !changedBySelectContainer
    )
      return "Error in initializing Filters";
    this.showQuizAuswahlSelectContainer = showQuizAuswahlSelectContainer;
    this.visibilitySelectContainer = visibilitySelectContainer;
    this.klassenstufeSelectContainer = klassenstufeSelectContainer;
    this.fachSelectContainer = fachSelectContainer;
    this.themaSelectContainer = themaSelectContainer;
    this.nameSelectContainer = nameSelectContainer;
    this.descriptionSelectContainer = descriptionSelectContainer;
    this.questionsSelectContainer = questionsSelectContainer;
    this.quizIdSelectContainer = quizIdSelectContainer;
    this.idSelectContainer = idSelectContainer;
    this.requireKlassenstufeSelectContainer =
      requireKlassenstufeSelectContainer;
    this.requireFachSelectContainer = requireFachSelectContainer;
    this.requireThemaSelectContainer = requireThemaSelectContainer;
    this.requireNameSelectContainer = requireNameSelectContainer;
    this.numberOfQuizCardsSelectContainer = numberOfQuizCardsSelectContainer;
    this.createdSelectContainer = createdSelectContainer;
    this.createdBySelectContainer = createdBySelectContainer;
    this.changedSelectContainer = changedSelectContainer;
    this.changedBySelectContainer = changedBySelectContainer;
    //hide all
    this.showQuizAuswahlSelectContainer.classList.add("hidden");
    this.visibilitySelectContainer.classList.add("hidden");
    this.klassenstufeSelectContainer.classList.add("hidden");
    this.klassenstufeSelected = String();
    this.fachSelectContainer.classList.add("hidden");
    this.fachSelected = String();
    this.themaSelectContainer.classList.add("hidden");
    this.themaSelect = String();
    this.nameSelectContainer.classList.add("hidden");
    this.descriptionSelectContainer.classList.add("hidden");
    this.questionsSelectContainer.classList.add("hidden");
    this.questionsSelectArray = new Array();
    this.quizIdSelectContainer.classList.add("hidden");
    this.idSelectContainer.classList.add("hidden");
    this.requireKlassenstufeSelectContainer.classList.add("hidden");
    this.requireFachSelectContainer.classList.add("hidden");
    this.requireThemaSelectContainer.classList.add("hidden");
    this.requireNameSelectContainer.classList.add("hidden");
    this.numberOfQuizCardsSelectContainer.classList.add("hidden");
    this.createdSelectContainer.classList.add("hidden");
    this.createdBySelectContainer.classList.add("hidden");
    this.createdBySelected = false;
    this.changedSelectContainer.classList.add("hidden");
    this.changedBySelectContainer.classList.add("hidden");
    this.changedBySelectArray = new Array();
    //Init limiter
    let limiter = selectionFiltersContainer.querySelector(
      "#limitResults #numberInput"
    );
    if (!limiter) return "no limiter";
    this.limiter = limiter;
    this.filterType = "all";
    this.limiter.value = 20;

    //Search While Typing
    let searchWhileTypingContainer = selectionFiltersContainer.querySelector(
      "#other #searchWhileTyping"
    );
    if (!searchWhileTypingContainer) return "no search while typin container";
    let searchWhileTypingCheckbox = searchWhileTypingContainer.querySelector(
      "#allowSearchWhileTyping"
    );
    if (!searchWhileTypingCheckbox) return "no search while typin checkbox";
    searchWhileTypingCheckbox.checked = false;
    this.searchWhileTyping = false;
    searchWhileTypingCheckbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        console.log("searchWhileTyping on");
        this.searchWhileTyping = true;
      } else {
        console.log("searchWhileTyping off");
        this.searchWhileTyping = false;
      }
    });

    let reloadBtn = this.container.querySelector("#reload");
    if (!reloadBtn) return "no reload button";
    reloadBtn.addEventListener("click", () => {
      this.search();
    });
    this.searchReloadBtn = reloadBtn;
    this.searchReloadBtn.disabled = true;
    //Result Table
    let resultTable = this.container.querySelector("#resultTable");
    if (!resultTable) {
      return "No result Table found.";
    }
    this.resultTable = resultTable;
    this.resultTable.classList.add("hidden");

    let tableBody = resultTable.querySelector("tbody");
    if (!tableBody) {
      return "no table body";
    }
    this.tableBody = tableBody;
    this.clear(this.tableBody);

    //ChooseAllBtn
    this.chooseAllBtn = this.resultTable.querySelector("thead #chooseall");
    if (!this.chooseAllBtn) return "No choose all btn";
    //Make Choose All -------

    this.chooseAllBtn.addEventListener("change", (event) => {
      if (event.target.checked) {
        console.log("checked");
        this.oldCheckedArray = Utils.copyArray(this.choosenArray);
        let allCheckBtns = this.resultTable.querySelectorAll(".result #select");

        allCheckBtns.forEach((element) => {
          let dataValue = element.closest(".result").getAttribute("data-value");
          element.checked = true;
          this.choosenArray = Utils.addToArray(
            this.choosenArray,
            dataValue,
            false
          );
        });
      } else {
        console.log("unchecked");
        let allCheckBtns = this.resultTable.querySelectorAll(".result #select");

        allCheckBtns.forEach((element) => {
          let dataValue = element.closest(".result").getAttribute("data-value");

          if (this.oldCheckedArray.includes(dataValue)) {
            element.checked = true;
            this.choosenArray = Utils.addToArray(
              this.choosenArray,
              dataValue,
              false
            );
          } else {
            element.checked = false;
            this.choosenArray = Utils.removeFromArray(
              this.choosenArray,
              dataValue
            );
          }
        });
      }
      this.updateEditBtn();
    });

    let editBtn = this.container.querySelector("#edit");
    if (!editBtn) return "no editBtn";
    this.editBtn = editBtn;
    this.updateEditBtn();
    editBtn.addEventListener("click", () => {
      this.edit(this.choosenArray);
    });

    //Result Desription
    let resultDescriptionContainer =
      this.container.querySelector(".resultDesciption");
    if (!resultDescriptionContainer) {
      return "no discription container";
    }
    this.resultDescriptionContainer = resultDescriptionContainer;

    searchBtn.addEventListener("click", () => {
      this.search(this.arraySearch);
    });

    //Add that user can select type of filter and set normally to username
    this.chooseFilterTypeSelect.addEventListener("change", () => {
      let value =
        this.chooseFilterTypeSelect[
          chooseFilterTypeSelect.selectedIndex
        ].getAttribute("data-value");
      console.log(value);
      this.setFilterMode(value);
    });

    //Edit Container
    let editContainer = this.container.querySelector("#editContainer");
    if (!editContainer) return "no edit container";
    this.editContainer = editContainer;
    let editTable = editContainer.querySelector("#editTable");
    if (!editTable) return "no editTable";
    this.editTable = editTable;
    let editTableBody = editTable.querySelector("tbody");
    if (!editTableBody) return "no editTableBody";
    this.editTableBody = editTableBody;

    let addBtn = this.container.querySelector("#addBtn");
    if (!addBtn) return "no addBtn";
    addBtn.addEventListener("click", async () => {
      if (!(await Utils.userHasPermissions(["quizverwaltungADDandRemove"]))) {
        return false;
      }
      if (
        !(await Utils.askUser(
          "Nachricht",
          "Möchtest du ein Quiz erstellen?",
          false
        ))
      ) {
        return false;
      }
      let response = await Utils.makeJSON(
        await Utils.sendXhrREQUEST(
          "POST",
          "quizverwaltung&operation=createQuiz",
          "./includes/quizverwaltung.inc.php",
          "application/x-www-form-urlencoded",
          true,
          true,
          false,
          true,
          false
        )
      );
      if (response["status"] == "success") {
        let uniqueID = response["data"]["uniqueID"];
        if (uniqueID) {
          this.choosenArray = Utils.addToArray(
            this.choosenArray,
            uniqueID,
            false
          );
        }
      }
      this.edit(this.choosenArray);
    });
  }

  setFilterMode(value) {
    this.searchBtn.classList.remove("loading");
    //hide all
    this.showQuizAuswahlSelectContainer.classList.add("hidden");
    this.visibilitySelectContainer.classList.add("hidden");
    this.klassenstufeSelectContainer.classList.add("hidden");
    this.fachSelectContainer.classList.add("hidden");
    this.themaSelectContainer.classList.add("hidden");
    this.nameSelectContainer.classList.add("hidden");
    this.descriptionSelectContainer.classList.add("hidden");
    this.questionsSelectContainer.classList.add("hidden");
    this.quizIdSelectContainer.classList.add("hidden");
    this.idSelectContainer.classList.add("hidden");
    this.requireKlassenstufeSelectContainer.classList.add("hidden");
    this.requireFachSelectContainer.classList.add("hidden");
    this.requireThemaSelectContainer.classList.add("hidden");
    this.requireNameSelectContainer.classList.add("hidden");
    this.numberOfQuizCardsSelectContainer.classList.add("hidden");
    this.createdSelectContainer.classList.add("hidden");
    this.createdBySelectContainer.classList.add("hidden");
    this.changedSelectContainer.classList.add("hidden");
    this.changedBySelectContainer.classList.add("hidden");
    if (!value) return false;
    this.filterType = value;

    if (value === "showQuizAuswahl") {
      this.enableFilter(this.showQuizAuswahlSelectContainer);
    } else if (value === "visibility") {
      this.enableFilter(this.visibilitySelectContainer);
    } else if (value === "klassenstufe") {
      this.enableFilter(this.klassenstufeSelectContainer);
    } else if (value === "fach") {
      this.enableFilter(this.fachSelectContainer);
    } else if (value === "thema") {
      this.enableFilter(this.themaSelectContainer);
    } else if (value === "name") {
      this.enableFilter(this.nameSelectContainer);
    } else if (value === "description") {
      this.enableFilter(this.descriptionSelectContainer);
    } else if (value === "quizId") {
      this.enableFilter(this.quizIdSelectContainer);
    } else if (value === "id") {
      this.enableFilter(this.idSelectContainer);
    } else if (value === "requireKlassenstufe") {
      this.enableFilter(this.requireKlassenstufeSelectContainer);
    } else if (value === "requireFach") {
      this.enableFilter(this.requireFachSelectContainer);
    } else if (value === "requireThema") {
      this.enableFilter(this.requireThemaSelectContainer);
    } else if (value === "requireName") {
      this.enableFilter(this.requireNameSelectContainer);
    } else if (value === "questions") {
      this.enableFilter(this.questionsSelectContainer);
    } else if (value === "numberOfQuizCards") {
      this.enableFilter(this.numberOfQuizCardsSelectContainer);
    } else if (value === "created") {
      this.enableFilter(this.createdSelectContainer);
    } else if (value === "createdBy") {
      this.enableFilter(this.createdBySelectContainer);
    } else if (value === "changed") {
      this.enableFilter(this.changedSelectContainer);
    } else if (value === "changedBy") {
      this.enableFilter(this.changedBySelectContainer);
    } else if (value === "multiple") {
      this.enableFilter(this.showQuizAuswahlSelectContainer);
      this.enableFilter(this.visibilitySelectContainer);
      this.enableFilter(this.klassenstufeSelectContainer);
      this.enableFilter(this.fachSelectContainer);
      this.enableFilter(this.themaSelectContainer);
      this.enableFilter(this.nameSelectContainer);
      this.enableFilter(this.descriptionSelectContainer);
      this.enableFilter(this.quizIdSelectContainer);
      this.enableFilter(this.idSelectContainer);
      this.enableFilter(this.requireKlassenstufeSelectContainer);
      this.enableFilter(this.requireFachSelectContainer);
      this.enableFilter(this.requireThemaSelectContainer);
      this.enableFilter(this.requireNameSelectContainer);
      this.enableFilter(this.questionsSelectContainer);
      this.enableFilter(this.numberOfQuizCardsSelectContainer);
      this.enableFilter(this.createdSelectContainer);
      this.enableFilter(this.createdBySelectContainer);
      this.enableFilter(this.changedSelectContainer);
      this.enableFilter(this.changedBySelectContainer);
    } else if (value == "all") {
      //Nothing to show
    } else {
      console.log("no filter");
    }
  }

  async enableFilter(filter) {
    if (!filter) return false;

    if (filter === this.showQuizAuswahlSelectContainer) {
      //list
      let select =
        this.showQuizAuswahlSelectContainer.querySelector("#selectInput");
      Utils.listenToChanges(select, "change", 650, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.showQuizAuswahlSelectContainer.classList.remove("hidden");
    } else if (filter === this.visibilitySelectContainer) {
      //list
      let select = this.visibilitySelectContainer.querySelector("#selectInput");
      Utils.listenToChanges(select, "change", 650, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.visibilitySelectContainer.classList.remove("hidden");
    } else if (filter === this.klassenstufeSelectContainer) {
      this.klassenstufeSelected = false;
      let addBtn = this.klassenstufeSelectContainer.querySelector("#addBtn");
      addBtn = Utils.removeAllEventlisteners(addBtn);
      addBtn.addEventListener("click", async () => {
        let availableKlassenstufen = Utils.sortItems(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=other&type=getAllKlassenstufen",
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        );

        let remove = () => {
          this.klassenstufeSelected = false;
          this.klassenstufeSelectContainer.querySelector(
            "#choosen"
          ).innerHTML = ``;
        };

        let choosen = await Utils.chooseFromArrayWithSearch(
          availableKlassenstufen,
          true,
          "Klassenstufe auswählen",
          false
        );
        if (choosen) {
          this.klassenstufeSelected = choosen[0];
          this.klassenstufeSelectContainer.querySelector(
            "#choosen"
          ).innerHTML = `Ausgewählt: <b>${this.klassenstufeSelected}</b> <button type="button" id="remove">X</button>`;

          let removeBtn =
            this.klassenstufeSelectContainer.querySelector("#choosen #remove");
          removeBtn.addEventListener("click", (event) => {
            remove();
          });
        } else {
          remove();
        }
      });

      this.klassenstufeSelectContainer.classList.remove("hidden");
    } else if (filter === this.fachSelectContainer) {
      this.fachSelected = false;
      let addBtn = this.fachSelectContainer.querySelector("#addBtn");
      addBtn = Utils.removeAllEventlisteners(addBtn);
      addBtn.addEventListener("click", async () => {
        let availableFaecher = Utils.sortItems(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=other&type=getAllFaecher",
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        );

        let remove = () => {
          this.fachSelected = false;
          this.fachSelectContainer.querySelector("#choosen").innerHTML = ``;
        };

        let choosen = await Utils.chooseFromArrayWithSearch(
          availableFaecher,
          true,
          "Fach auswählen",
          false
        );
        if (choosen) {
          this.fachSelected = choosen[0];
          this.fachSelectContainer.querySelector(
            "#choosen"
          ).innerHTML = `Ausgewählt: <b>${this.fachSelected}}</b> <button type="button" id="remove">X</button>`;

          let removeBtn =
            this.fachSelectContainer.querySelector("#choosen #remove");
          removeBtn.addEventListener("click", (event) => {
            remove();
          });
        } else {
          remove();
        }
      });

      this.fachSelectContainer.classList.remove("hidden");
    } else if (filter === this.themaSelectContainer) {
      this.themaSelect = false;
      let addBtn = this.themaSelectContainer.querySelector("#addBtn");
      addBtn = Utils.removeAllEventlisteners(addBtn);
      addBtn.addEventListener("click", async () => {
        let remove = () => {
          this.themaSelect = false;
          this.themaSelectContainer.querySelector("#choosen").innerHTML = ``;
        };

        let choosen = await Utils.chooseFromArrayWithSearch(
          [],
          true,
          "Thema auswählen",
          false,
          false,
          true,
          "quizverwaltung&operation=other&type=searchThema&input=",
          "./includes/quizverwaltung.inc.php"
        );
        if (choosen) {
          this.themaSelect = choosen[0];
          this.themaSelectContainer.querySelector(
            "#choosen"
          ).innerHTML = `Ausgewählt: <b>${this.themaSelect}</b> <button type="button" id="remove">X</button>`;
          let removeBtn =
            this.themaSelectContainer.querySelector("#choosen #remove");
          removeBtn.addEventListener("click", (event) => {
            remove();
          });
        } else {
          remove();
        }
      });

      this.themaSelectContainer.classList.remove("hidden");
    } else if (filter === this.nameSelectContainer) {
      let input = this.nameSelectContainer.querySelector("#textInput");
      Utils.listenToChanges(input, "input", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.nameSelectContainer.classList.remove("hidden");
    } else if (filter === this.descriptionSelectContainer) {
      let input = this.descriptionSelectContainer.querySelector("#textInput");
      Utils.listenToChanges(input, "input", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.descriptionSelectContainer.classList.remove("hidden");
    } else if (filter === this.quizIdSelectContainer) {
      let input = this.quizIdSelectContainer.querySelector("#textInput");
      Utils.listenToChanges(input, "input", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.quizIdSelectContainer.classList.remove("hidden");
    } else if (filter === this.idSelectContainer) {
      let numberInput = this.idSelectContainer.querySelector("#numberInput");
      Utils.listenToChanges(numberInput, "input", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.idSelectContainer.classList.remove("hidden");
    } else if (filter === this.requireKlassenstufeSelectContainer) {
      let select =
        this.requireKlassenstufeSelectContainer.querySelector("#selectInput");
      Utils.listenToChanges(select, "change", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.requireKlassenstufeSelectContainer.classList.remove("hidden");
    } else if (filter === this.requireFachSelectContainer) {
      let select =
        this.requireFachSelectContainer.querySelector("#selectInput");
      Utils.listenToChanges(select, "change", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.requireFachSelectContainer.classList.remove("hidden");
    } else if (filter === this.requireThemaSelectContainer) {
      let select =
        this.requireThemaSelectContainer.querySelector("#selectInput");
      Utils.listenToChanges(select, "change", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.requireThemaSelectContainer.classList.remove("hidden");
    } else if (filter === this.requireNameSelectContainer) {
      let select =
        this.requireNameSelectContainer.querySelector("#selectInput");
      Utils.listenToChanges(select, "change", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.requireNameSelectContainer.classList.remove("hidden");
    } else if (filter === this.questionsSelectContainer) {
      this.questionsSelectArray = new Array();
      //Questions
      let choosenContainer =
        this.questionsSelectContainer.querySelector("#choosen");

      let addBtn = this.questionsSelectContainer.querySelector("#addBtn");
      addBtn = Utils.removeAllEventlisteners(addBtn);
      addBtn.addEventListener("click", async () => {
        let newQuestions = await Utils.chooseFromArrayWithSearch(
          this.questionsSelectArray,
          true,
          "Frage auswählen",
          false,
          false,
          true,
          "quizverwaltung&operation=other&type=getQuestions&searchFor=",
          "../teacher/includes/quizverwaltung.inc.php"
        );
        if (newQuestions && newQuestions.length > 0) {
          newQuestions.forEach((element) => {
            this.questionsSelectArray = Utils.addToArray(
              this.questionsSelectArray,
              element,
              false
            );
          });
        }
        update();
      });

      let update = () => {
        //Update Choosen
        choosenContainer.innerHTML = "";
        if (this.questionsSelectArray && this.questionsSelectArray.length > 0) {
          this.questionsSelectArray.forEach((element) => {
            let listItem = document.createElement("li");

            listItem.setAttribute("id", element);
            listItem.innerHTML = `<span>${element}</span><button type="button" id="remove">X</button>`;
            choosenContainer.appendChild(listItem);

            let removeBtn = listItem.querySelector("#remove");
            removeBtn.addEventListener("click", (event) => {
              this.questionsSelectArray = Utils.removeFromArray(
                this.questionsSelectArray,
                element
              );
              update();
              console.log("After", this.questionsSelectArray);
            });
          });
        } else {
          this.questionsSelectArray = new Array();
        }
      };

      this.questionsSelectContainer.classList.remove("hidden");
    } else if (filter === this.numberOfQuizCardsSelectContainer) {
      let numberInput =
        this.numberOfQuizCardsSelectContainer.querySelector("#numberInput");
      Utils.listenToChanges(numberInput, "input", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.numberOfQuizCardsSelectContainer.classList.remove("hidden");
    } else if (filter === this.createdSelectContainer) {
      let input = this.createdSelectContainer.querySelector("#textInput");
      Utils.listenToChanges(input, "input", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.createdSelectContainer.classList.remove("hidden");
    } else if (filter === this.createdBySelectContainer) {
      let choosen = this.createdBySelectContainer.querySelector("#choosen");
      //AddBtn
      let addBtn = this.createdBySelectContainer.querySelector("#addBtn");
      addBtn = Utils.removeAllEventlisteners(addBtn);
      addBtn.addEventListener("click", async () => {
        let choosenUser = await Utils.pickUsers();
        if (choosenUser && choosenUser.length > 0) {
          choosenUser = choosenUser[0];
          this.createdByString = choosenUser;
          choosen.innerHTML = `Nutzer mit der userID: <b>${choosenUser}</b>`;
        } else {
          this.createdByString = false;
          choosen.innerText = "";
        }
      });
      //Remove
      let removeBtn = this.createdBySelectContainer.querySelector("#removeBtn");
      removeBtn.addEventListener("click", async () => {
        this.createdByString = false;
        choosen.innerText = "";
      });

      this.createdBySelectContainer.classList.remove("hidden");
    } else if (filter === this.changedSelectContainer) {
      let input = this.changedSelectContainer.querySelector("#textInput");
      Utils.listenToChanges(input, "input", 450, () => {
        if (this.searchWhileTyping) {
          this.search();
        }
      });
      this.changedSelectContainer.classList.remove("hidden");
    } else if (filter === this.changedBySelectContainer) {
      let choosen = this.changedBySelectContainer.querySelector("#choosen");

      let update = async () => {
        choosen.innerHTML = "";
        if (this.changedBySelectArray && this.changedBySelectArray.length > 0) {
          let ul = document.createElement("ul");
          choosen.appendChild(ul);
          for (const current of this.changedBySelectArray) {
            let li = document.createElement("li");
            li.innerHTML = `Benutzer | userID: <b>${current}</b> <button type="button" id="remove">X</button>`;
            ul.appendChild(li);

            let removeBtn = li.querySelector("#remove");
            removeBtn.addEventListener("click", async () => {
              this.changedBySelectArray = Utils.removeFromArray(
                this.changedBySelectArray,
                current
              );
              update();
            });
          }
        }
      };

      //AddBtn
      let addBtn = this.changedBySelectContainer.querySelector("#addBtn");
      addBtn = Utils.removeAllEventlisteners(addBtn);
      addBtn.addEventListener("click", async () => {
        let choosenUsers = await Utils.pickUsers();
        if (choosenUsers && choosenUsers.length > 0) {
          for (const current of choosenUsers) {
            this.changedBySelectArray = Utils.addToArray(
              this.changedBySelectArray,
              current,
              false
            );
          }
          update();
        } else {
          this.changedBySelectArray = new Array();
          choosen.innerHTML = "";
        }
      });
      //Remove
      let removeBtn = this.changedBySelectContainer.querySelector("#removeBtn");
      removeBtn.addEventListener("click", async () => {
        this.changedBySelectArray = new Array();
        choosen.innerHTML = "";
      });

      this.changedBySelectContainer.classList.remove("hidden");
    } else if (this.filterType === "all") {
      //Nothing to activate
    }
  }

  clear(element) {
    element.innerHTML = "";
  }

  async search() {
    console.log("Search...");
    this.searchReloadBtn.disabled = true;
    //Utils.toggleLodingAnimation(this.container)
    this.searchBtn.classList.add("loading");
    this.choosenArray = new Array();
    this.editContainer.classList.add("hidden");
    this.clear(this.editTableBody);

    if (this.filterType === "showQuizAuswahl") {
      let select =
        this.showQuizAuswahlSelectContainer.querySelector("#selectInput");
      let input = select[select.selectedIndex].getAttribute("data-value");

      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=showQuizAuswahl&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "visibility") {
      let select = this.visibilitySelectContainer.querySelector("#selectInput");
      let input = select[select.selectedIndex].getAttribute("data-value");

      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=visibility&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "klassenstufe") {
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=klassenstufe&input=" +
                this.klassenstufeSelected +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "fach") {
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=fach&input=" +
                this.fachSelected +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "thema") {
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=thema&input=" +
                this.themaSelect +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "name") {
      let input = this.nameSelectContainer.querySelector("#textInput").value;
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=name&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "description") {
      let input =
        this.descriptionSelectContainer.querySelector("#textInput").value;
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=description&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "quizId") {
      let input = this.quizIdSelectContainer.querySelector("#textInput").value;
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=quizId&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "id") {
      let input = this.idSelectContainer.querySelector("#numberInput").value;
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=id&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "requireKlassenstufe") {
      let select =
        this.requireKlassenstufeSelectContainer.querySelector("#selectInput");
      let input = select[select.selectedIndex].getAttribute("data-value");

      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=requireKlassenstufe&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "requireFach") {
      let select =
        this.requireFachSelectContainer.querySelector("#selectInput");
      let input = select[select.selectedIndex].getAttribute("data-value");

      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=requireFach&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "requireThema") {
      let select =
        this.requireThemaSelectContainer.querySelector("#selectInput");
      let input = select[select.selectedIndex].getAttribute("data-value");

      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=requireThema&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "requireName") {
      let select =
        this.requireNameSelectContainer.querySelector("#selectInput");
      let input = select[select.selectedIndex].getAttribute("data-value");

      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=requireName&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "questions") {
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=questions&input=" +
                JSON.stringify(this.questionsSelectArray) +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "numberOfQuizCards") {
      let input =
        this.numberOfQuizCardsSelectContainer.querySelector(
          "#numberInput"
        ).value;
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=numberOfQuizCards&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "created") {
      let input =
        this.createdBySelectContainer.querySelector("#textInput").value;
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=created&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "createdBy") {
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=createdBy&input=" +
                this.createdByString +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "changed") {
      let input = this.changedSelectContainer.querySelector("#textInput").value;
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=changed&input=" +
                input +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "changedBy") {
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=changedBy&input=" +
                JSON.stringify(this.changedBySelectArray) +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "multiple") {
      let showQuizauswahlSelect =
        this.showQuizAuswahlSelectContainer.querySelector("#selectInput");
      let showQuizauswahl =
        showQuizauswahlSelect[showQuizauswahlSelect.selectedIndex].getAttribute(
          "data-value"
        );
      if (Utils.isEmptyInput(showQuizauswahl, true)) {
        showQuizauswahl = false;
      }
      let visibilitySelect =
        this.visibilitySelectContainer.querySelector("#selectInput");
      let visibility =
        visibilitySelect[visibilitySelect.selectedIndex].getAttribute(
          "data-value"
        );
      if (Utils.isEmptyInput(visibility, true)) {
        visibility = false;
      }

      let klassenstufe = this.klassenstufeSelected;
      if (Utils.isEmptyInput(klassenstufe)) {
        klassenstufe = false;
      }

      let fach = this.fachSelected;
      if (Utils.isEmptyInput(fach)) {
        fach = false;
      }

      let thema = this.themaSelect;
      if (Utils.isEmptyInput(thema)) {
        thema = false;
      }

      let requireKlassenstufeSelect =
        this.requireKlassenstufeSelectContainer.querySelector("#selectInput");
      let requireKlassenstufe =
        requireKlassenstufeSelect[
          requireKlassenstufeSelect.selectedIndex
        ].getAttribute("data-value");
      if (Utils.isEmptyInput(requireKlassenstufe, true)) {
        requireKlassenstufe = false;
      }

      let requireFachSelect =
        this.requireFachSelectContainer.querySelector("#selectInput");
      let requireFach =
        requireFachSelect[requireFachSelect.selectedIndex].getAttribute(
          "data-value"
        );
      if (requireFach === "") {
        requireFach = false;
      }

      let requireThemaSelect =
        this.requireThemaSelectContainer.querySelector("#selectInput");
      let requireThema =
        requireThemaSelect[requireThemaSelect.selectedIndex].getAttribute(
          "data-value"
        );
      if (requireThema === "") {
        requireThema = false;
      }

      let requireNameSelect =
        this.requireNameSelectContainer.querySelector("#selectInput");
      let requireName =
        requireNameSelect[requireNameSelect.selectedIndex].getAttribute(
          "data-value"
        );
      if (requireName === "") {
        requireName = false;
      }

      let description =
        this.descriptionSelectContainer.querySelector("#textInput").value;
      if (Utils.isEmptyInput(description)) {
        description = false;
      }

      let name = this.nameSelectContainer.querySelector("#textInput").value;
      if (Utils.isEmptyInput(name)) {
        name = false;
      }

      let quizId = this.quizIdSelectContainer.querySelector("#textInput").value;
      if (Utils.isEmptyInput(quizId)) {
        quizId = false;
      }

      let id = this.idSelectContainer.querySelector("#numberInput").value;
      if (Utils.isEmptyInput(id)) {
        id = false;
      }

      let questions = this.questionsSelectArray;
      if (!questions.length > 0) {
        questions = false;
      }

      let numberOfQuizCards =
        this.numberOfQuizCardsSelectContainer.querySelector(
          "#numberInput"
        ).value;
      if (Utils.isEmptyInput(numberOfQuizCards)) {
        numberOfQuizCards = false;
      }

      let created =
        this.createdSelectContainer.querySelector("#textInput").value;
      if (Utils.isEmptyInput(created)) {
        created = false;
      }

      let createdBy = this.createdBySelected;
      if (Utils.isEmptyInput(createdBy)) {
        createdBy = false;
      }

      let changed =
        this.changedSelectContainer.querySelector("#textInput").value;
      if (Utils.isEmptyInput(changed)) {
        changed = false;
      }

      let changedBy = this.changedBySelectArray;
      if (!changedBy.length > 0) {
        changedBy = false;
      }

      console.log(
        showQuizauswahl,
        visibility,
        klassenstufe,
        fach,
        thema,
        name,
        description,
        quizId,
        id,
        requireKlassenstufe,
        requireFach,
        requireThema,
        requireName,
        questions,
        numberOfQuizCards,
        created,
        createdBy,
        changed,
        changedBy
      );

      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=multiple&showQuizAuswahl=" +
                showQuizauswahl +
                "&visibility=" +
                visibility +
                "&klassenstufe=" +
                klassenstufe +
                "&fach=" +
                fach +
                "&thema=" +
                thema +
                "&name=" +
                name +
                "&description=" +
                description +
                "&quizId=" +
                quizId +
                "&uniqueID=" +
                id +
                "&requireKlassenstufe=" +
                requireKlassenstufe +
                "&requireFach=" +
                requireFach +
                "&requireThema=" +
                requireThema +
                "&requireName=" +
                requireName +
                "&questions=" +
                JSON.stringify(questions) +
                "&numberOfQuizCards=" +
                numberOfQuizCards +
                "&created=" +
                created +
                "&createdBy=" +
                createdBy +
                "&changed=" +
                changed +
                "&changedBy=" +
                JSON.stringify(changedBy) +
                "&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    } else if (this.filterType === "all") {
      this.showResults(
        Utils.makeJSON(
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=search&type=all&limitResults=" +
                this.limiter.value,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true
            )
          )
        )
      );
    }
  }

  async showResults(results) {
    this.searchBtn.classList.remove("loading");
    this.clear(this.tableBody);
    this.resultDescriptionContainer.classList.remove("hidden");
    if (!results) {
      this.resultTable.classList.add("hidden");
      this.resultDescriptionContainer.innerHTML = "Keine Ergebnisse...";
      return true;
    }
    results = Utils.makeJSON(results);

    if (!results.length > 0) {
      this.resultTable.classList.add("hidden");
      this.resultDescriptionContainer.innerHTML = "Keine Ergebnisse...";
      return false;
    }
    this.resultDescriptionContainer.innerHTML = `${results.length} Ergebnisse`;

    results = Utils.sortItems(results, "name"); //Just sort it to better overview

    for (const result of results) {
      //console.log(user);
      let tableRow = document.createElement("tr");
      tableRow.classList.add("result");
      tableRow.setAttribute("data-value", result["uniqueID"]);

      tableRow.innerHTML = `
      <td class="select"><input type="checkbox" id="select"><button id="chooseOnly"><img src="../../images/icons/stift.svg" alt="Auswahl"></button></td>
      <td id="name" style="min-width: 400px;"><a href="/quiz.php?quizId=${result["quizId"]}">${result["name"]}</a></td>
      <td id="klassenstufe">${result["klassenstufe"]}</td>
      <td id="fach">${result["fach"]}</td>
      <td id="thema" style="min-width: 400px;">${result["thema"]}</td>
      <td id="description" style="min-width: 400px;">${
        result["description"]
      }</td>
      <td id="quizId">${result["quizId"]}</td>
      <td id="id">${result["uniqueID"]}</td>
      <td id="showQuizAuswahl" class="${Utils.boolToString(
        result["showQuizAuswahl"],
        { true: "angezeigt", false: "ausgeblendet" }
      )}">${Utils.boolToString(result["showQuizAuswahl"], {
        true: "angezeigt",
        false: "ausgeblendet",
      })}</td>
      <td id="visibility" class="${Utils.boolToString(result["visibility"], {
        true: "angezeigt",
        false: "ausgeblendet",
      })}">${Utils.boolToString(result["visibility"], {
        true: "angezeigt",
        false: "ausgeblendet",
      })}</td>
      <td id="requireKlassenstufe">${Utils.boolToString(
        result["requireKlassenstufe"],
        { true: "benötigt", false: "nicht benötigt" }
      )}</td>
      <td id="requireFach">${Utils.boolToString(result["requireFach"], {
        true: "benötigt",
        false: "nicht benötigt",
      })}</td>
      <td id="requireThema">${Utils.boolToString(result["requireThema"], {
        true: "benötigt",
        false: "nicht benötigt",
      })}</td>
      <td id="requireName">${Utils.boolToString(result["requireName"], {
        true: "benötigt",
        false: "nicht benötigt",
      })}</td>
      <td id="questions" style="min-width: 500px;"></td>
      <td id="lastUsed">${result["lastUsed"]}</td>
      <td id="created">${result["created"]}</td>
      <td id="createdBy">${result["createdBy"]}</td>
      <td id="changed">${result["changed"]}</td>
      <td id="changedBy"></td>
          `;
      this.tableBody.append(tableRow);

      let checkBox = tableRow.querySelector(".select #select");
      if (!checkBox) return false;
      checkBox.addEventListener("change", (event) => {
        if (event.target.checked) {
          this.choosenArray = Utils.addToArray(
            this.choosenArray,
            result["uniqueID"],
            false
          );
        } else {
          this.choosenArray = Utils.removeFromArray(
            this.choosenArray,
            result["uniqueID"]
          );
        }
        this.updateEditBtn();
      });

      let chooseThis = tableRow.querySelector(".select #chooseOnly");
      if (!chooseThis) return false;

      chooseThis.addEventListener("click", (event) => {
        this.choosenArray = Utils.addToArray(
          this.choosenArray,
          result["uniqueID"],
          false
        );
        this.edit(this.choosenArray);
      });

      let questionsContainer = tableRow.querySelector("#questions");
      Utils.listOfArrayToHTML(
        questionsContainer,
        result["questions"],
        "Keine Fragen vorhanden"
      );

      let changedByContainer = tableRow.querySelector("#changedBy");
      Utils.listOfArrayToHTML(
        changedByContainer,
        result["changedBy"],
        "Noch nicht geändert"
      );
    }
    this.searchReloadBtn.disabled = false;

    this.resultTable.classList.remove("hidden");
  }

  updateEditBtn() {
    if (this.choosenArray.length > 0) {
      this.editBtn.disabled = false;
    } else {
      this.editBtn.disabled = true;
    }
  }

  async edit(choosen, reloadOnlyOne = false) {
    if (!choosen || !choosen.length > 0) {
      this.editContainer.classList.add("hidden");
      this.clear(this.editTableBody);
      return false;
    }
    this.editReloadBtn.disabled = true;
    console.log("Edit:", choosen);

    if (!reloadOnlyOne) {
      this.resultTable.classList.add("hidden");
      this.clear(this.tableBody);
      this.editContainer.classList.add("hidden");
      this.clear(this.editTableBody);
    }

    for (const currentRaw of choosen) {
      //Get Data
      let current = await Utils.makeJSON(
        await Utils.sendXhrREQUEST(
          "POST",
          "quizverwaltung&operation=getFullInformation&id=" + currentRaw,
          "./includes/quizverwaltung.inc.php",
          "application/x-www-form-urlencoded",
          true,
          true,
          false,
          true
        )
      );
      if (!current) {
        console.log("No data for:", currentRaw);
        continue;
      }

      if (current["uniqueID"]) {
        let tableRow;
        if (!reloadOnlyOne) {
          tableRow = document.createElement("tr");
          this.editTableBody.appendChild(tableRow);
        } else {
          try {
            tableRow = this.editTable.querySelector(
              `tbody .result[data-value="${current["uniqueID"]}"]`
            );
            console.log(tableRow);
          } catch {
            tableRow = document.createElement("tr");
            this.editTableBody.appendChild(tableRow);
          }
        }
        tableRow.classList.add("result");
        tableRow.setAttribute("data-value", current["uniqueID"]);

        tableRow.innerHTML = `
        <td id="name" style="min-width: 400px;"><a href="/quiz.php?quizId=${current["quizId"]}">${current["name"]}</a><button class="changeBtn" id="change"><img src="../../images/icons/stift.svg" alt="ändern" class="changeIcon"></td>
        <td id="quizData"><span>Quiz bearbeiten</span><button class="changeBtn" id="change"><img src="../../images/icons/stift.svg" alt="ändern" class="changeIcon"></td>
        <td id="klassenstufe" style="min-width: 400px;"><span>${
          current["klassenstufe"]
        }</span><button class="changeBtn" id="change"><img src="../../images/icons/stift.svg" alt="ändern" class="changeIcon"></td>
        <td id="fach" style="min-width: 400px;"><span>${
          current["fach"]
        }</span><button class="changeBtn" id="change"><img src="../../images/icons/stift.svg" alt="ändern" class="changeIcon"></td>
        <td id="thema" style="min-width: 400px;"><span>${
          current["thema"]
        }</span><button class="changeBtn" id="change"><img src="../../images/icons/stift.svg" alt="ändern" class="changeIcon"></td>
        <td id="description" style="min-width: 400px;"><span>${
          current["description"]
        }</span><button class="changeBtn" id="change"><img src="../../images/icons/stift.svg" alt="ändern" class="changeIcon"></td>
        <td id="quizId"><span>${
          current["quizId"]
        }</span><button class="changeBtn" id="change"><img src="../../images/icons/stift.svg" alt="ändern" class="changeIcon"></button><button class="btn btn-sm btn-warning" style="margin: 5px;" id="generateRandomQuizId">Zufall</button></td>
        <td id="id">${current["uniqueID"]}</td>
        <td id="showQuizAuswahl" class="${Utils.boolToString(
          current["showQuizAuswahl"],
          { true: "angezeigt", false: "ausgeblendet" }
        )}"><span>${Utils.boolToString(current["showQuizAuswahl"], {
          true: "angezeigt",
          false: "ausgeblendet",
        })}</span>
        <label class="switch">
              <input type="checkbox" id="checkbox">
              <span class="slider round"></span>
        </label>
        </td>
        <td id="visibility" class="${Utils.boolToString(current["visibility"], {
          true: "angezeigt",
          false: "ausgeblendet",
        })}"><span>${Utils.boolToString(current["visibility"], {
          true: "angezeigt",
          false: "ausgeblendet",
        })}</span>
        <label class="switch">
              <input type="checkbox" id="checkbox">
              <span class="slider round"></span>
        </label>
        </td>
        <td id="requireKlassenstufe"><span>${Utils.boolToString(
          current["requireKlassenstufe"],
          { true: "benötigt", false: "nicht benötigt" }
        )}</span>
        <label class="switch">
              <input type="checkbox" id="checkbox">
              <span class="slider round"></span>
        </label>
        </td>
        <td id="requireFach"><span>${Utils.boolToString(
          current["requireFach"],
          { true: "benötigt", false: "nicht benötigt" }
        )}</span>
        <label class="switch">
              <input type="checkbox" id="checkbox">
              <span class="slider round"></span>
        </label>
        </td>
        <td id="requireThema"><span>${Utils.boolToString(
          current["requireThema"],
          { true: "benötigt", false: "nicht benötigt" }
        )}</span>
        <label class="switch">
              <input type="checkbox" id="checkbox">
              <span class="slider round"></span>
        </label>
        </td>
        <td id="requireName"><span>${Utils.boolToString(
          current["requireName"],
          { true: "benötigt", false: "nicht benötigt" }
        )}</span>
        <label class="switch">
              <input type="checkbox" id="checkbox">
              <span class="slider round"><true
        </label>
        </td>
        <td id="questions" style="min-width: 400px;">${JSON.stringify(
          current["questions"]
        )}</td>
        <td id="remove"><button class="delete-btn"><img src="../../images/icons/delete.svg" alt="Löschen"></button></td>
  `;

        let questionsContainer = tableRow.querySelector("#questions");
        Utils.listOfArrayToHTML(
          questionsContainer,
          current["questions"],
          "Keine Fragen vorhanden"
        );

        //Name
        let changeNameBtn = tableRow.querySelector("#name #change");
        changeNameBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))
          ) {
            return false;
          }
          let userInput = await Utils.getUserInput(
            "Eingabefeld",
            `Neuer Name für das Quiz?`,
            false,
            "text",
            current["name"],
            current["name"],
            true
          );
          if (userInput === false) {
            Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
            return false;
          }
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=name&uniqueID=" +
                current["uniqueID"] +
                "&input=" +
                userInput,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //Quizdata
        let changeQuizdataBtn = tableRow.querySelector("#quizData #change");
        changeQuizdataBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))
          ) {
            return false;
          }

          //Open Dialog where Teacher can edit quizdata
          await editQuizdata(current["uniqueID"]);

          this.edit([current["uniqueID"]], true);
        });

        //Klassenstfue
        let changeKlassenstufeBtn = tableRow.querySelector(
          "#klassenstufe #change"
        );
        changeKlassenstufeBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))
          ) {
            return false;
          }
          let availableKlassenstufen = Utils.sortItems(
            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=other&type=getAllKlassenstufen",
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true
              )
            )
          );
          let choosen = await Utils.chooseFromArrayWithSearch(
            availableKlassenstufen,
            true,
            "Klassenstufe auswählen",
            false
          );
          if (choosen && choosen.length > 0) {
            choosen = choosen[0];
          } else {
            choosen = false;
          }
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=klassenstufe&uniqueID=" +
                current["uniqueID"] +
                "&input=" +
                choosen,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //Fach
        let changeFachBtn = tableRow.querySelector("#fach #change");
        changeFachBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))
          ) {
            return false;
          }
          let availableFaecher = Utils.sortItems(
            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=other&type=getAllFaecher",
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true
              )
            )
          );
          let choosen = await Utils.chooseFromArrayWithSearch(
            availableFaecher,
            true,
            "Fach auswählen",
            false
          );
          if (choosen && choosen.length > 0) {
            choosen = choosen[0];
          } else {
            choosen = false;
          }
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=fach&uniqueID=" +
                current["uniqueID"] +
                "&input=" +
                choosen,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //Thema
        let changeThemaBtn = tableRow.querySelector("#thema #change");
        changeThemaBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))
          ) {
            return false;
          }
          let choosen = await getThemaFromUser();
          if (choosen && choosen.length > 0) {
            choosen = choosen[0];
          } else {
            choosen = false;
          }
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=thema&uniqueID=" +
                current["uniqueID"] +
                "&input=" +
                choosen,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //Description
        let changeDescriptionBtn = tableRow.querySelector(
          "#description #change"
        );
        changeDescriptionBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))
          ) {
            return false;
          }
          let userInput = await Utils.getUserInput(
            "Eingabefeld",
            `Beschreibung für das Quiz?`,
            false,
            "text",
            current["description"],
            current["description"],
            true
          );
          if (userInput === false) {
            Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
            return false;
          }
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=description&uniqueID=" +
                current["uniqueID"] +
                "&input=" +
                userInput,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //QuizID
        let changeQuizIdBtn = tableRow.querySelector("#quizId #change");
        changeQuizIdBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))
          ) {
            return false;
          }
          let userInput = await Utils.getUserInput(
            "Eingabefeld",
            `Neue quizId?`,
            false,
            "text",
            current["quizId"],
            current["quizId"],
            true
          );
          if (userInput === false) {
            Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
            return false;
          }
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=quizId&uniqueID=" +
                current["uniqueID"] +
                "&input=" +
                userInput,
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //random QuizID
        let changeQuizIdRandomBtn = tableRow.querySelector(
          "#quizId #generateRandomQuizId"
        );
        changeQuizIdRandomBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungEditQuizzes"]))
          ) {
            return false;
          }
          if (
            !(await Utils.askUser(
              "Nachricht",
              "Willst du wirklich eine zufällige 'quizId' generieren lassen?",
              false
            ))
          ) {
            Utils.alertUser("Nachricht", "Keine Aktion unternommen", false);
            this.edit([current["uniqueID"]], true);
            return false;
          }
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=randomQuizId&uniqueID=" +
                current["uniqueID"],
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //ShowQuizauswahl
        let showQuizAuswahlSwitch = tableRow.querySelector(
          "#showQuizAuswahl #checkbox"
        );
        showQuizAuswahlSwitch.checked = Utils.makeJSON(
          current["showQuizAuswahl"]
        );
        showQuizAuswahlSwitch.addEventListener("click", async () => {
          let state = showQuizAuswahlSwitch.checked;
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=showQuizAuswahl&uniqueID=" +
                current["uniqueID"] +
                "&input=" +
                Number(state).toString(),
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //visibility
        let visibilitySwitch = tableRow.querySelector("#visibility #checkbox");
        visibilitySwitch.checked = Utils.makeJSON(current["visibility"]);
        visibilitySwitch.addEventListener("click", async () => {
          let state = visibilitySwitch.checked;
          await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=changeValue&type=visibility&uniqueID=" +
                current["uniqueID"] +
                "&input=" +
                Number(state).toString(),
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          this.edit([current["uniqueID"]], true);
        });

        //requireKlassenstufe
        let requireKlassenstufeSwitch = tableRow.querySelector(
          "#requireKlassenstufe #checkbox"
        );
        requireKlassenstufeSwitch.checked = Utils.makeJSON(
          current["requireKlassenstufe"]
        );
        requireKlassenstufeSwitch.addEventListener("click", async () => {
          let state = requireKlassenstufeSwitch.checked;

          if (!state) {
            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireKlassenstufe&uniqueID=" +
                  current["uniqueID"] +
                  "&state=" +
                  Number(state).toString(),
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true,
                false
              )
            );
          } else {
            let availableKlassenstufen = Utils.sortItems(
              await Utils.makeJSON(
                await Utils.sendXhrREQUEST(
                  "POST",
                  "quizverwaltung&operation=other&type=getAllKlassenstufen",
                  "./includes/quizverwaltung.inc.php",
                  "application/x-www-form-urlencoded",
                  true,
                  true,
                  false,
                  true
                )
              )
            );
            let choosen = await Utils.chooseFromArrayWithSearch(
              availableKlassenstufen,
              true,
              "Klassenstufe auswählen",
              false
            );
            if (choosen && choosen.length > 0) {
              choosen = choosen[0];
            } else {
              await Utils.alertUser("Nachricht", "Keine Aktion unternommen.");
              this.edit([current["uniqueID"]], true);
              return false;
            }

            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireKlassenstufe&uniqueID=" +
                  current["uniqueID"] +
                  "&state=" +
                  Number(state).toString() +
                  "&klassenstufe=" +
                  choosen,
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true,
                false
              )
            );
          }

          this.edit([current["uniqueID"]], true);
        });

        //requireFach
        let requireFachSwitch = tableRow.querySelector(
          "#requireFach #checkbox"
        );
        requireFachSwitch.checked = Utils.makeJSON(current["requireFach"]);
        requireFachSwitch.addEventListener("click", async () => {
          let state = requireFachSwitch.checked;

          if (!state) {
            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireFach&uniqueID=" +
                  current["uniqueID"] +
                  "&state=" +
                  Number(state).toString(),
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true,
                false
              )
            );
          } else {
            let availableFaecher = Utils.sortItems(
              await Utils.makeJSON(
                await Utils.sendXhrREQUEST(
                  "POST",
                  "quizverwaltung&operation=other&type=getAllFaecher",
                  "./includes/quizverwaltung.inc.php",
                  "application/x-www-form-urlencoded",
                  true,
                  true,
                  false,
                  true
                )
              )
            );
            let choosen = await Utils.chooseFromArrayWithSearch(
              availableFaecher,
              true,
              "Fach auswählen",
              false
            );
            if (choosen && choosen.length > 0) {
              choosen = choosen[0];
            } else {
              await Utils.alertUser("Nachricht", "Keine Aktion unternommen.");
              this.edit([current["uniqueID"]], true);
              return false;
            }

            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireFach&uniqueID=" +
                  current["uniqueID"] +
                  "&state=" +
                  Number(state).toString() +
                  "&fach=" +
                  choosen,
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true,
                false
              )
            );
          }
          this.edit([current["uniqueID"]], true);
        });

        //requireThema
        let requireThemaSwitch = tableRow.querySelector(
          "#requireThema #checkbox"
        );
        requireThemaSwitch.checked = Utils.makeJSON(current["requireThema"]);
        requireThemaSwitch.addEventListener("click", async () => {
          let state = requireThemaSwitch.checked;

          if (!state) {
            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireThema&uniqueID=" +
                  current["uniqueID"] +
                  "&state=" +
                  Number(state).toString(),
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true,
                false
              )
            );
          } else {
            let choosen = await getThemaFromUser();
            if (choosen && choosen.length > 0) {
              choosen = choosen[0];
            } else {
              await Utils.alertUser("Nachricht", "Keine Aktion unternommen.");
              this.edit([current["uniqueID"]], true);
              return false;
            }

            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireThema&uniqueID=" +
                  current["uniqueID"] +
                  "&state=" +
                  Number(state).toString() +
                  "&thema=" +
                  choosen,
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true,
                false
              )
            );
          }

          this.edit([current["uniqueID"]], true);
        });

        //requireName
        let requireNameSwitch = tableRow.querySelector(
          "#requireName #checkbox"
        );
        requireNameSwitch.checked = Utils.makeJSON(current["requireName"]);
        requireNameSwitch.addEventListener("click", async () => {
          let state = requireNameSwitch.checked;

          if (!state) {
            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireName&uniqueID=" +
                  current["uniqueID"] +
                  "&state=" +
                  Number(state).toString(),
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true,
                false
              )
            );
          } else {
            let name = await Utils.getUserInput(
              "Name hinzufügen",
              "Gebe den Namen des Quiz ein.",
              false,
              "text"
            );
            if (Utils.isEmptyInput(name)) {
              await Utils.alertUser("Nachricht", "Keine Aktion unternommen");
              this.edit([current["uniqueID"]], true);
              return false;
            }

            await Utils.makeJSON(
              await Utils.sendXhrREQUEST(
                "POST",
                "quizverwaltung&operation=changeValue&type=requireName&uniqueID=" +
                  current["uniqueID"] +
                  "&state=" +
                  Number(state).toString() +
                  "&name=" +
                  name,
                "./includes/quizverwaltung.inc.php",
                "application/x-www-form-urlencoded",
                true,
                true,
                false,
                true,
                false
              )
            );
          }

          this.edit([current["uniqueID"]], true);
        });

        //Delete Quiz
        let deleteQuizBtn = tableRow.querySelector("#remove .delete-btn");
        deleteQuizBtn.addEventListener("click", async () => {
          if (
            !(await Utils.userHasPermissions(["quizverwaltungADDandRemove"]))
          ) {
            return false;
          }
          if (
            !(await Utils.askUser(
              "Nachricht",
              "Möchtest du dieses Quiz wirklich <b>löschen</b>?",
              false
            ))
          ) {
            return false;
          }
          let response = await Utils.makeJSON(
            await Utils.sendXhrREQUEST(
              "POST",
              "quizverwaltung&operation=deleteQuiz&uniqueID=" +
                current["uniqueID"],
              "./includes/quizverwaltung.inc.php",
              "application/x-www-form-urlencoded",
              true,
              true,
              false,
              true,
              false
            )
          );
          if (response["status"] == "success") {
            this.choosenArray = Utils.removeFromArray(
              this.choosenArray,
              current["uniqueID"]
            );
          }
          this.edit(this.choosenArray);
        });
        this.editContainer.classList.remove("hidden");
      }
    }
    this.editReloadBtn.disabled = false;
  }
}

async function load() {
  let quizverwaltungsContainer = document.querySelector(
    "#quizverwaltungsContainer"
  );
  if (!quizverwaltungsContainer) {
    console.log("no quizverwaltungsContainer");
  } else {
    //Berechtigungsverwaltung
    let quizverwaltung =
      quizverwaltungsContainer.querySelector("#quizverwaltung");
    quizverwaltung = new Quizverwaltung(quizverwaltung);
    console.log(quizverwaltung.prepareSearch());
    console.log(quizverwaltung.prepareEdit());

    //Check if there is a quizId in url and then search for it
    let urlParams = Utils.getUrlParams();
    if (urlParams.has("quizId")) {
      let quizId = urlParams.get("quizId");

      let uniqueID = await Utils.sendXhrREQUEST(
        "POST",
        "getAttribute&type=quizverwaltung&secondOperation=GET_uniqueID_FROM_quizId&quizId=" +
          quizId,
        "/includes/getAttributes.php",
        "application/x-www-form-urlencoded",
        true,
        true,
        false,
        true
      );

      quizverwaltung.setFilterMode("id");
      quizverwaltung.idSelectContainer.querySelector("#numberInput").value =
        uniqueID;
      quizverwaltung.search();
    } else if (urlParams.has("uniqueID")) {
      let id = urlParams.get("uniqueID");
      quizverwaltung.setFilterMode("id");
      quizverwaltung.idSelectContainer.querySelector("#numberInput").value = id;
      quizverwaltung.search();
    }
  }
}

load();
