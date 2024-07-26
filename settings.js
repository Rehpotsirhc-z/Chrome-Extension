function openTab(evt, tabName) {
    var tabContent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    var tabLinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


document.addEventListener('DOMContentLoaded', function() {  
    // console.log(localStorage.getItem('authenticated'));
    if (localStorage.getItem('authenticated') === null || localStorage.getItem('authenticated') === "false" || localStorage.getItem('authenticated') === false) {
        window.location.href = "barrier.html";
    }

    document.querySelector('.tablink').click();
});