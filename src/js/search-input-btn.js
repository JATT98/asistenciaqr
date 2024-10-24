var searchInputObj = (function () {
    return {
        func1: function start() {
            setTimeout(() => {
                let search = document.getElementById("typeahead-prevent-manual-entry");

                if(search !== undefined && search !== null){
                    search
                    .addEventListener("keyup", function (event) {
                        event.preventDefault();
                        let code;
                        if (event.key !== undefined) {
                            code = event.key;
                        } else if (event.keyIdentifier !== undefined) {
                            code = event.keyIdentifier;
                        } else if (event.keyCode !== undefined) {
                            code = event.keyCode;
                        }
                        if (code !== undefined && (code === 13 || code === 'Enter')) {
                            document.getElementById("typeahead-prevent-manual-entry-btn").click();
                        }
                    });
                }
            },400);
        }
    }
})(searchInputObj || {});