var modalViewerObj = (function () {

    function showModal(showModalBtn) {
        let modalBackground = document.querySelector(".modal-background");
        let modal = document.querySelector(showModalBtn.dataset.modalTarget);
        modalBackground.addEventListener("click", () => {
            showModalBtn.classList.remove("modal-active")
            modalBackground.style.display = "none";
            modal.style.display = "none";
        })
        if (showModalBtn.classList.contains("modal-active")) {
            showModalBtn.classList.remove("modal-active")
            modalBackground.style.display = "none";
            modal.style.display = "none";
        } else {
            showModalBtn.classList.add("modal-active")
            modalBackground.style.display = "block";
            modal.style.display = "block";
        }
    }

    return {
        func1: function start() {
            setTimeout(() => {
                let showModalBtns = document.querySelectorAll(".modal-button");
                showModalBtns.forEach(showModalBtn => {
                    showModalBtn.addEventListener("click", () => {
                        showModal(showModalBtn);
                    });
                });
            },400);
        }
    }

})(modalViewerObj || {});