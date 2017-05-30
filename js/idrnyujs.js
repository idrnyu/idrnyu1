var help = document.getElementsByClassName("helps");
var hbox = document.getElementById("helpsbox");
var post = document.getElementById("post_m");

function my_on() {
    post.style.display = "none";
    hbox.style.display = "block";
}

function my_off() {
    post.style.display = "block";
    hbox.style.display = "none";
}