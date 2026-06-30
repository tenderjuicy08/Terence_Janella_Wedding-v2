document.addEventListener(
"DOMContentLoaded",
function(){

/* BACKGROUND MUSIC */

const music =
document.getElementById("music");

const musicButton =
document.getElementById("musicButton");

let musicPlaying = false;

if(music && musicButton){

musicButton.addEventListener(
"click",
async function(){

try{

if(musicPlaying){

music.pause();

musicButton.textContent =
"🎵 Play Music";

musicPlaying = false;

}else{

await music.play();

musicButton.textContent =
"⏸ Pause Music";

musicPlaying = true;

}

}catch(error){

alert(
"Your browser blocked the music. Tap the Play Music button again."
);

}

}
);

}

/* WEDDING COUNTDOWN */

const weddingDate =
new Date(
"2026-12-08T16:00:00"
).getTime();

const daysElement =
document.getElementById("days");

const hoursElement =
document.getElementById("hours");

const minutesElement =
document.getElementById("mins");

const secondsElement =
document.getElementById("secs");

function updateCountdown(){

if(
!daysElement ||
!hoursElement ||
!minutesElement ||
!secondsElement
){
return;
}

const currentDate =
new Date().getTime();

const difference =
weddingDate - currentDate;

if(difference <= 0){

daysElement.textContent = "0";
hoursElement.textContent = "00";
minutesElement.textContent = "00";
secondsElement.textContent = "00";

return;

}

const days =
Math.floor(
difference /
(1000 * 60 * 60 * 24)
);

const hours =
Math.floor(
(
difference %
(1000 * 60 * 60 * 24)
) /
(1000 * 60 * 60)
);

const minutes =
Math.floor(
(
difference %
(1000 * 60 * 60)
) /
(1000 * 60)
);

const seconds =
Math.floor(
(
difference %
(1000 * 60)
) /
1000
);

daysElement.textContent =
days;

hoursElement.textContent =
hours.toString().padStart(2, "0");

minutesElement.textContent =
minutes.toString().padStart(2, "0");

secondsElement.textContent =
seconds.toString().padStart(2, "0");

}

updateCountdown();

setInterval(
updateCountdown,
1000
);

/* PRENUP ALBUM CAROUSEL */

const albumTrack =
document.getElementById("albumTrack");

const albumCards =
Array.from(
document.querySelectorAll(".album-card")
);

const albumCounter =
document.getElementById("albumCounter");

const previousAlbumButton =
document.querySelector(".album-prev");

const nextAlbumButton =
document.querySelector(".album-next");

if(
albumTrack &&
albumCards.length > 0 &&
albumCounter &&
previousAlbumButton &&
nextAlbumButton
){

let currentAlbumIndex = 0;
let albumScrollTimer;
let isDragging = false;
let dragStartX = 0;
let startingScrollLeft = 0;
let activePointerId = null;

/* UPDATE ACTIVE PHOTO AND COUNTER */

function updateAlbumDisplay(){

albumCards.forEach(
function(card, index){

card.classList.toggle(
"active",
index === currentAlbumIndex
);

}
);

albumCounter.textContent =
(currentAlbumIndex + 1) +
" / " +
albumCards.length;

previousAlbumButton.disabled =
currentAlbumIndex === 0;

nextAlbumButton.disabled =
currentAlbumIndex ===
albumCards.length - 1;

}

/* MOVE TO A PHOTO */

function moveToAlbumPhoto(
index,
smooth = true
){

currentAlbumIndex =
Math.max(
0,
Math.min(
index,
albumCards.length - 1
)
);

const selectedCard =
albumCards[currentAlbumIndex];

const leftPosition =
selectedCard.offsetLeft -
(
albumTrack.clientWidth -
selectedCard.offsetWidth
) / 2;

albumTrack.scrollTo({

left:leftPosition,

behavior:
smooth
? "smooth"
: "auto"

});

updateAlbumDisplay();

}

/* FIND THE PHOTO CLOSEST TO THE CENTER */

function findNearestAlbumPhoto(){

const trackCenter =
albumTrack.scrollLeft +
albumTrack.clientWidth / 2;

let nearestIndex = 0;
let nearestDistance = Infinity;

albumCards.forEach(
function(card, index){

const cardCenter =
card.offsetLeft +
card.offsetWidth / 2;

const distance =
Math.abs(
trackCenter -
cardCenter
);

if(distance < nearestDistance){

nearestDistance =
distance;

nearestIndex =
index;

}

}
);

return nearestIndex;

}

/* PREVIOUS BUTTON */

previousAlbumButton.addEventListener(
"click",
function(){

moveToAlbumPhoto(
currentAlbumIndex - 1
);

}
);

/* NEXT BUTTON */

nextAlbumButton.addEventListener(
"click",
function(){

moveToAlbumPhoto(
currentAlbumIndex + 1
);

}
);

/* UPDATE COUNTER AFTER MANUAL SCROLLING */

albumTrack.addEventListener(
"scroll",
function(){

clearTimeout(
albumScrollTimer
);

albumScrollTimer =
setTimeout(
function(){

currentAlbumIndex =
findNearestAlbumPhoto();

updateAlbumDisplay();

},
100
);

}
);

/* LAPTOP AND DESKTOP CLICK-AND-DRAG */

albumTrack.addEventListener(
"pointerdown",
function(event){

if(event.pointerType !== "mouse"){
return;
}

isDragging = true;

activePointerId =
event.pointerId;

dragStartX =
event.clientX;

startingScrollLeft =
albumTrack.scrollLeft;

albumTrack.classList.add(
"dragging"
);

albumTrack.setPointerCapture(
event.pointerId
);

}
);

albumTrack.addEventListener(
"pointermove",
function(event){

if(
!isDragging ||
event.pointerId !== activePointerId
){
return;
}

event.preventDefault();

const movement =
event.clientX -
dragStartX;

albumTrack.scrollLeft =
startingScrollLeft -
movement;

}
);

function stopAlbumDragging(event){

if(!isDragging){
return;
}

isDragging = false;

albumTrack.classList.remove(
"dragging"
);

if(
activePointerId !== null &&
albumTrack.hasPointerCapture(
activePointerId
)
){

albumTrack.releasePointerCapture(
activePointerId
);

}

activePointerId = null;

const nearestIndex =
findNearestAlbumPhoto();

moveToAlbumPhoto(
nearestIndex,
true
);

}

albumTrack.addEventListener(
"pointerup",
stopAlbumDragging
);

albumTrack.addEventListener(
"pointercancel",
stopAlbumDragging
);

albumTrack.addEventListener(
"lostpointercapture",
function(){

if(isDragging){

isDragging = false;

albumTrack.classList.remove(
"dragging"
);

const nearestIndex =
findNearestAlbumPhoto();

moveToAlbumPhoto(
nearestIndex,
true
);

}

}
);

/* PREVENT DEFAULT IMAGE DRAGGING */

albumTrack.addEventListener(
"dragstart",
function(event){

event.preventDefault();

}
);

/* KEYBOARD CONTROLS */

albumTrack.addEventListener(
"keydown",
function(event){

if(event.key === "ArrowLeft"){

event.preventDefault();

moveToAlbumPhoto(
currentAlbumIndex - 1
);

}

if(event.key === "ArrowRight"){

event.preventDefault();

moveToAlbumPhoto(
currentAlbumIndex + 1
);

}

}
);

/* SHIFT + MOUSE WHEEL */

albumTrack.addEventListener(
"wheel",
function(event){

if(!event.shiftKey){
return;
}

event.preventDefault();

albumTrack.scrollBy({

left:event.deltaY,
behavior:"auto"

});

},
{
passive:false
}
);

/* KEEP ACTIVE PHOTO CENTERED */

window.addEventListener(
"resize",
function(){

moveToAlbumPhoto(
currentAlbumIndex,
false
);

}
);

/* INITIAL ALBUM POSITION */

window.addEventListener(
"load",
function(){

moveToAlbumPhoto(
0,
false
);

}
);

updateAlbumDisplay();

}

/* RSVP FORM */

const rsvpForm =
document.getElementById("rsvpForm");

if(rsvpForm){

rsvpForm.addEventListener(
"submit",
function(event){

event.preventDefault();

alert(
"Thank you! Your RSVP response has been received."
);

rsvpForm.reset();

}
);

}

}
);
