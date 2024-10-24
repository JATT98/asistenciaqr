var scrollChatObj = (function () {

    return {
        func1: function start() {
            setTimeout(() => {
                // Chat messages container
                var messageBody = document.querySelector('#chat-messages-container');

                // Go to bottom button creation
                let chatContainer = document.getElementById('chat-container');
                let goToBottomButton = document.createElement("div");
                goToBottomButton.innerHTML = "<span class='material-icons-round'>keyboard_double_arrow_down</span>"
                goToBottomButton.classList.add("go-to-bottom-button")
                goToBottomButton.classList.add("subtitle-2")
                chatContainer.appendChild(goToBottomButton)

                // scroll validation to show "go to button action"
                messageBody.addEventListener("scroll", function () {
                    if (messageBody.scrollTop < (messageBody.scrollHeight - messageBody.clientHeight - 100)) {
                        goToBottomButton.style.display = "block"
                    } else {
                        goToBottomButton.style.display = "none"
                    }
                })

                // go to bottom button action
                goToBottomButton.addEventListener("click", function () {
                    goToBottom()
                })

                // function scroll to bottom
                function goToBottom() {
                    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight
                }

                // create a new instance of `MutationObserver` named `observer`,
                // passing it a callback function
                const observer = new MutationObserver(function () {
                    if (goToBottomButton.style.display == "none") {
                        goToBottom()
                    }
                });

                // call `observe()` on that MutationObserver instance,
                // passing it the element to observe, and the options object
                observer.observe(messageBody, { subtree: true, childList: true });
            }, 400);
        }
    }
})(scrollChatObj || {});