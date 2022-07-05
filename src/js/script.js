@@include("common.js");

window.onload = () => {
  document.addEventListener("click", documentClickActions);

  function documentClickActions(e) {
    const targetElement = e.target;

    if (window.innerWidth > 768 && isMobile.any()){
      if(targetElement.classList.contains("menu__arrow")){
        targetElement.closest(".menu__item").classList.toggle("_hover");
      } else if(!targetElement.closest(".menu__item") && document.querySelectorAll(".menu__item._hover").length > 0) {
        document.querySelectorAll(".menu__item._hover").forEach(el => {
          el.classList.remove("_hover")
        })
      }
    }

    if(window.innerWidth <= 768) {
      if(targetElement.classList.contains("spoiler-action")){
        targetElement.parentNode.querySelector(".spoiler-menu").classList.toggle("_active");
        targetElement.classList.toggle("_active");
      }

      if(targetElement.closest(".icon-menu")){
        targetElement.closest(".icon-menu").classList.toggle("_active");
        if(document.querySelector(".menu__body")){
          document.querySelector(".menu__body").classList.toggle("_active");
        }
      }
    }

    if(targetElement.classList.contains("search-form__icon")){
      document.querySelector(".search-form").classList.toggle("_active");
    } else if(!targetElement.closest(".search-form") && document.querySelector(".search-form._active")){
      document.querySelector(".search-form").classList.remove("_active");
    }
  }
}