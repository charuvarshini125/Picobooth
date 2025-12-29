const video = document.getElementById("video");
const canvases = document.querySelectorAll("canvas");
let currentShot = 0;

// Access camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(err => alert("Camera access denied 😭"));

// Capture photos
document.getElementById("captureBtn").addEventListener("click", () => {
  currentShot = 0;
  takePhoto();
});

function takePhoto() {
  if (currentShot >= 4) return;

  let countdown = 5;

  const countdownInterval = setInterval(() => {
    document.getElementById("captureBtn").innerText =
      `Clicking in ${countdown}...`;

    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);

      const ctx = canvases[currentShot].getContext("2d");
      ctx.drawImage(
        video,
        0,
        0,
        canvases[currentShot].width,
        canvases[currentShot].height
      );

      currentShot++;
      document.getElementById("captureBtn").innerText = "Click 4 Photos";

      setTimeout(takePhoto, 500);
    }
  }, 1000);
}

// Layout switch
function setLayout(type) {
  const strip = document.getElementById("strip");
  strip.className = `strip ${type}`;
}

// ADD STICKER TO STRIP
function addSticker(src) {
  const strip = document.getElementById("strip");

  const sticker = document.createElement("img");
  sticker.src = src;
  sticker.classList.add("sticker");

  sticker.style.top = "40px";
  sticker.style.left = "40px";

  strip.appendChild(sticker);

  dragSticker(sticker);
}

// DRAG STICKER
function dragSticker(el) {
  let offsetX = 0, offsetY = 0;

  el.onmousedown = (e) => {
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;

    document.onmousemove = move;
    document.onmouseup = stop;
  };

  function move(e) {
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
  }

  function stop() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

// FRAME SWITCH
function setFrame(frameClass) {
  const strip = document.getElementById("strip");

  // remove old frame classes
  strip.classList.remove(
    "frame1","frame2","frame3","frame4","frame5",
    "frame6","frame7","frame8","frame9","frame10"
  );

  // add selected frame
  strip.classList.add(frameClass);
}
// Splash Screen Logic
const splash = document.getElementById("splash");

if (splash) {
  splash.addEventListener("click", () => {
    splash.classList.add("hide");
    setTimeout(() => {
      splash.remove();
    }, 600);
  });
}
// DOWNLOAD FULL PHOTO STRIP WITH FRAMES + STICKERS AS JPEG
function downloadStripJPEG() {
  const strip = document.getElementById("strip");

  html2canvas(strip, {
    backgroundColor: "#ffffff",
    scale: 2
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "picobooth.jpeg";
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  });
}

