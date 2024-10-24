'use strict'
let passRevealBtn = document.querySelector("#show-pass-btn");
let passwordInput = document.querySelector("#input-password");

if(passRevealBtn !== null){
    passRevealBtn.addEventListener('click',revealPass);
}

function revealPass(){
    if(passwordInput.type == "password"){
        passwordInput.type = "text";
        passRevealBtn.textContent = "visibility_off";
    }else{
        passwordInput.type = "password";
        passRevealBtn.textContent = "visibility";
    }
}