window.addEventListener("load", () => {

    const preloader = document.getElementById("preloader");

    // Keep the branding visible briefly
    setTimeout(() => {

        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";

        setTimeout(() => {

            preloader.remove();

        },700);

    },900);

});