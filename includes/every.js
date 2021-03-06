import * as Utils from "./utils.js";
window.sessionStorage.setItem("popupOpen", false);

document.addEventListener("click", (event) => {
  let target = event.target;
  //console.log(target);
  //Image fullscreen
  if (
    target.closest(".fullscreenToggle") ||
    target.classList.contains("fullscreenToggle")
  ) {
    let closest = target.closest("#fullscreenContainer");
    //console.log(closest)
    closest.classList.toggle("fullscreen");
    document.body.classList.toggle('noscroll');
    return true;
  }
  if (target.getAttribute("id") == "fullscreenContainer") {
    target.classList.toggle("fullscreen");
    document.body.classList.toggle('noscroll');
    return true;
  }
  //Show and hide Password
  if (target.getAttribute("id") == "showPassword") {
    let passwordField = getPreviousSibling(target, ".showPasswordField");
    if (passwordField) {
      let state = passwordField.getAttribute("type");
      if (state == "password" && target.checked == true) {
        passwordField.setAttribute("type", "text");
        passwordField.classList.add("noselect");
      } else {
        passwordField.setAttribute("type", "password");
        passwordField.classList.remove("noselect");
      }
      return true;
    }
  }
});

(Element.prototype.appendBefore = function (element) {
  element.parentNode.insertBefore(this, element);
}),
  false;

(Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}),
  false;

var getNextSibling = function (elem, selector) {
  // Get the next sibling element
  var sibling = elem.nextElementSibling;

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }
};

var getPreviousSibling = function (elem, selector) {
  // Get the next sibling element
  var sibling = elem.previousElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }
};




soundManager.setup({
  flashVersion: 9,
  preferFlash: false, // prefer 100% HTML5 mode, where both supported
  onready: function() {
    console.log('SM2 ready!');
    
    //Quiz
    soundManager.createSound({
      url: '/audio/userCorrect.mp3',
      id: "userCorrect"
    });

    soundManager.createSound({
      url: '/audio/userWrong.mp3',
      id: "userWrong"
    });

    //Leherpanel
   
  },
  ontimeout: function() {
    console.log('SM2 init failed!');
  },
  defaultOptions: {
    // set global default volume for all sound objects
    volume: 33
  }
});


var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map( function(tooltipTriggerEl) {
return new bootstrap.Tooltip(tooltipTriggerEl, {
trigger : 'hover'
});
});
