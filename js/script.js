const modal = document.querySelector(".modal");
const form = document.querySelectorAll("form[data-form]");
const fields = document.querySelectorAll(".field");
const video = document.querySelectorAll(".video-link");
let data = {};

document.addEventListener("DOMContentLoaded", function () {
  const showModal = () => {
    modal.classList.remove("visually-hidden");
    document.querySelector("body").style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.add("visually-hidden");
    document.querySelector("body").style.overflow = "auto";
  };

  document
    .querySelector("#modal-btn-open")
    .addEventListener("click", showModal);

  document
    .querySelector("#modal-btn-close")
    .addEventListener("click", closeModal);

  document.addEventListener("click", (event) => {
    if (event.target == modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  const setAttributes = (elem, attr) => {
    for (const key in attr) {
      elem.setAttribute(key, attr[key]);
    }
  };

  const playVideo = (event) => {
    let item = event.currentTarget;
    item.classList.add("visually-hidden");
    let iframe = document.createElement("iframe");
    iframe.classList.add("video");
    let data = item.getAttribute("data-video");
    switch (data) {
      case "dentalika":
        setAttributes(iframe, {
          src: "https://www.youtube.com/embed/EtLGaofWuwM?autoplay=1&modestbranding=1",
          allow: "autoplay",
        });
        break;
      case "doctora":
        setAttributes(iframe, {
          src: "https://www.youtube.com/embed/Cwcxdez_dhQ?autoplay=1&modestbranding=1",
          allow: "autoplay",
        });
        break;
      case "tekhservice":
        setAttributes(iframe, {
          src: "https://www.youtube.com/embed/uEOjRVP50FY?autoplay=1&modestbranding=1",
          allow: "autoplay",
        });
        break;
      case "review":
        setAttributes(iframe, {
          src: "https://www.youtube.com/embed/D-6NXZpAECc?autoplay=1&modestbranding=1",
          allow: "autoplay",
        });
        break;
      default:
        break;
    }
    item.parentElement.appendChild(iframe);
  };

  video.forEach((elem) => {
    elem.addEventListener("click", playVideo);
  });

  const getFormvalue = (elem) => {
    data = {};

    let name = elem.querySelector("input[name='name']").value;
    let tel = elem.querySelector("input[name='tel']").value;
    let comment = elem.querySelector("textarea[name='comment']").value;

    data = {
      name: name,
      tel: tel,
      comment: comment,
    };
    return data;
  };

  const dataGetparam = (data) => {
    let str = "";
    for (const key in data) {
      str += `${key}=${data[key]}&`;
    }
    return str;
  };

  async function sendFrom() {
    const response = await fetch("form.php", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: dataGetparam(data),
    });
    response.text().then((text) => {
      if (text === "Ошибка! Пустые поля!") {
        popup("Заполните пустые поля!");
      } else if (text === "Ошибка! Запрос не определен!") {
        popup("Ошибка при отправке заявки! Повторите отправку позже");
      } else {
        popup("Ваша заявка отправлена!");
      }
    });
  }

  const popup = (message) => {
    let popup = document.createElement("p");
    popup.classList.add("popup");
    popup.innerHTML = message;
    createPopup(popup);
    setTimeout(function () {
      popupDelete(popup);
    }, 1000);
  };

  const popupDelete = (popup) => {
    popup.remove("popup");
    let popups = document.querySelectorAll(".popup-wrap .popup");
    if (popups.length == 0) document.querySelector(".popup-wrap").remove();
  };

  const createPopup = (popup) => {
    let popupWrap = document.querySelector(".popup-wrap");
    if (popupWrap) {
      popupWrap.appendChild(popup);
    } else {
      let popupWrap = document.createElement("div");
      popupWrap.classList.add("popup-wrap");
      document.querySelector("body").appendChild(popupWrap);
      popupWrap.appendChild(popup);
    }
  };

  const fieldsEmpty = (elem) => {
    for (let i = 0; i < elem.length; i++) {
      if (elem[i].value === "") {
        elem[i].style.borderColor = "#914848";
        setTimeout(function () {
          elem[i].style.borderColor = "#dfdfdf";
        }, 1000);
      }
    }
  };

  const fieldsValidate = (elem) => {
    for (let i = 0; i < elem.length; i++) {
      setTimeout(function () {
        elem[i].style.borderColor = "#dfdfdf";
        elem[i].value = "";
      }, 1000);
    }
  };

  const validateFields = (event) => {
    let item = event.target;
    if (item.value === "") {
      item.style.borderColor = "#914848";
      popup("Поле обязательно к заполнению!");
      setTimeout(function () {
        item.style.borderColor = "#dfdfdf";
      }, 1000);
    } else if (item.value !== "") {
      item.style.borderColor = "#3A743A";
    }
  };

  const validateSpacenameValue = (elem) => {
    return elem.value.replace(/\s+/g, "").trim();
  };

  const validateSpaceCommentValue = (elem) => {
    return elem.value.replace(/\s+/g, " ").trim();
  };

  const validateNamevalue = (event) => {
    let item = event.target;
    let itemValue = validateSpacenameValue(item);
    let regexValue = /[а-яёА-ЯЁ]/;
    if (!regexValue.test(itemValue)) {
      item.value = "";
      item.style.borderColor = "#914848";
      popup("Только кирилические символы!");
      setTimeout(function () {
        item.style.borderColor = "#dfdfdf";
      }, 1000);
    }
  };

  const deleteFirstsymbol = (event) => {
    let item = event.target;
    if (event.keyCode == 8 && item.value.length == 1) {
      item.value = "";
    }
  };

  const validateTelvalue = (elem) => {
    return elem.value.replace(/\D/g, "");
  };

  const createTelnum = (event) => {
    let item = event.target;
    let itemValue = validateTelvalue(item);
    let telNum = "";

    if (!itemValue) {
      return (item.value = "");
    }

    if (["7", "8", "9"].indexOf(itemValue[0]) > -1) {
      if (itemValue[0] == "9") {
        itemValue = "7" + itemValue;
      }
      let firstSymbolnum = itemValue[0] == "8" ? "8" : "+7";
      telNum = firstSymbolnum + " ";
      if (itemValue.length > 1) {
        telNum += "(" + itemValue.substring(1, 4);
      }
      if (itemValue.length >= 5) {
        telNum += ") " + itemValue.substring(4, 7);
      }
      if (itemValue.length >= 8) {
        telNum += "-" + itemValue.substring(7, 9);
      }
      if (itemValue.length >= 10) {
        telNum += "-" + itemValue.substring(9, 11);
      }
    } else {
      telNum = itemValue.substring(0, 6);
    }
    item.value = telNum;
  };

  const deleteFirstsymbolNum = (event) => {
    if (event.keyCode == 8 && validateTelvalue(event.target).length == 1) {
      event.target.value = "";
    }
  };

  const validateCommentvalue = (event) => {
    let item = event.target;
    let itemValue = validateSpaceCommentValue(item);
    let regexValue = /[!?.,а-яёА-ЯЁ0-9\s]/;
    if (!regexValue.test(itemValue)) {
      item.value = "";
      item.style.borderColor = "#914848";
      popup("Только кирилические символы и цифры!");
      setTimeout(function () {
        item.style.borderColor = "#dfdfdf";
      }, 1000);
    }
  };

  fields.forEach((elem) => {
    elem.addEventListener("blur", validateFields);
    if (elem.name === "name") {
      elem.addEventListener("input", validateNamevalue);
      elem.addEventListener("keydown", deleteFirstsymbol);
    }
    if (elem.name === "tel") {
      elem.addEventListener("input", createTelnum);
      elem.addEventListener("keydown", deleteFirstsymbolNum);
    }
    if (elem.name === "comment") {
      elem.addEventListener("input", validateCommentvalue);
      elem.addEventListener("keydown", deleteFirstsymbol);
    }
  });

  form.forEach((elem) => {
    elem.addEventListener("submit", (event) => {
      event.preventDefault();
      let item = event.currentTarget;
      let fields = item.querySelectorAll(".field");
      getFormvalue(item);
      fieldsEmpty(fields);
      sendFrom();
      fieldsValidate(fields);
    });
  });
});
