/* =====================================================
   VICTORIOUS VISUALS PRELOADER
===================================================== */

(function () {

    const preloader = document.getElementById("vv-preloader");
    const progressBar = document.getElementById("vv-progress");

    if (!preloader || !progressBar) return;

    let progress = 0;
    let loadingTimer;


    /* -------------------------------------------------
       Simulated loading progress
    ------------------------------------------------- */

    function simulateProgress() {

        loadingTimer = setInterval(function () {

            /*
             * Slow down as we approach 90%.
             * This prevents the bar from reaching the end
             * before the website is actually ready.
             */

            if (progress < 35) {

                progress += Math.random() * 5 + 2;

            } else if (progress < 65) {

                progress += Math.random() * 3 + 1;

            } else if (progress < 85) {

                progress += Math.random() * 1.5 + 0.5;

            } else if (progress < 92) {

                progress += Math.random() * 0.4;

            }

            if (progress > 92) {
                progress = 92;
            }

            progressBar.style.width = progress + "%";

        }, 180);
    }


    /* -------------------------------------------------
       Finish loading
    ------------------------------------------------- */

    function finishPreloader() {

        clearInterval(loadingTimer);

        progress = 100;

        progressBar.style.width = "100%";


        /*
         * Allow the bar to visibly reach 100%
         * before the interface fades away.
         */

        setTimeout(function () {

            preloader.classList.add("vv-finished");

            /*
             * Remove the preloader after
             * the fade animation.
             */

            setTimeout(function () {

                if (preloader) {
                    preloader.remove();
                }

            }, 800);

        }, 400);
    }


    /* -------------------------------------------------
       Start
    ------------------------------------------------- */

    simulateProgress();


    /* -------------------------------------------------
       Wait until everything is loaded
    ------------------------------------------------- */

    if (document.readyState === "complete") {

        finishPreloader();

    } else {

        window.addEventListener(
            "load",
            finishPreloader,
            { once: true }
        );

    }


})();
