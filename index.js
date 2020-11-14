'use strict';
// toggle open and close state of header when hamburger is clicked
let hamburgerButton = document.querySelector('.header__hamburger');
let headerLinkSection = document.querySelector('.header__bottom');
hamburgerButton.addEventListener('click', function() {
    if(headerLinkSection.classList.contains('hidden')){
        headerLinkSection.classList.remove('hidden')
    }else {
        headerLinkSection.classList.add('hidden')
    }
});
