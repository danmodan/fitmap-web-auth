var hasClass = function (el, className) {

  if (el.classList) {
    return el.classList.contains(className);
  }

  return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

var addClass = function (el, className) {

  if (el.classList) {

    el.classList.add(className);
  } else if (!hasClass(el, className)) {

    el.className += " " + className;
  }
}

var removeClass = function (el, className) {

  if (el.classList) {

    el.classList.remove(className);
  } else if (hasClass(el, className)) {

    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className = el.className.replace(reg, ' ');
  }
}

var handleResetPassword = function (auth, actionCode, continueUrl) {

  auth.verifyPasswordResetCode(actionCode).then((email) => {

    var accountEmail = email;

    addClass(document.getElementById("spinner-loading"), "visually-hidden");
    removeClass(document.getElementById("reset-pwd-form-container"), "visually-hidden");

    document.getElementById("user-email").innerHTML = accountEmail;

    var form = document.getElementById("reset-pwd-form");
    form.addEventListener('submit', (event) => {

      event.preventDefault();

      removeClass(document.getElementById("spinner-loading"), "visually-hidden");

      var newPassword = document.getElementById("pwd-input").value;

      auth.confirmPasswordReset(actionCode, newPassword).then((resp) => {

        addClass(document.getElementById("spinner-loading"), "visually-hidden");
        addClass(document.getElementById("reset-pwd-form-container"), "visually-hidden");
        removeClass(document.getElementById("sucess-message"), "visually-hidden");

      }).catch((error) => {

        addClass(document.getElementById("spinner-loading"), "visually-hidden");
        removeClass(document.getElementById("pwd-input-error-msg"), "visually-hidden");
        console.error(error);

      });

    });

  }).catch((error) => {

    addClass(document.getElementById("spinner-loading"), "visually-hidden");
    removeClass(document.getElementById("error-message"), "visually-hidden");

  });
}

var handleVerifyEmail = function (auth, actionCode, continueUrl) {

  auth.applyActionCode(actionCode).then((resp) => {

    addClass(document.getElementById("spinner-loading"), "visually-hidden");
    removeClass(document.getElementById("sucess-message"), "visually-hidden");

  }).catch((error) => {

    addClass(document.getElementById("spinner-loading"), "visually-hidden");
    removeClass(document.getElementById("error-message"), "visually-hidden");

  });

}

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

document.addEventListener('DOMContentLoaded', () => {

  var mode = urlParams.get('mode');
  var actionCode = urlParams.get('oobCode');
  var continueUrl = urlParams.get('continueUrl');

  var auth = firebase.auth();

  switch (mode) {
    case 'resetPassword':
      removeClass(document.getElementById("reset-pwd-header"), "visually-hidden");
      handleResetPassword(auth, actionCode, continueUrl);
      break;
    case 'verifyEmail':
      removeClass(document.getElementById("registration-confirmation-header"), "visually-hidden");
      handleVerifyEmail(auth, actionCode, continueUrl);
      break;
    default:
      addClass(document.getElementById("spinner-loading"), "visually-hidden");
      removeClass(document.getElementById("error-message"), "visually-hidden");
      break;
  }

}, false);
