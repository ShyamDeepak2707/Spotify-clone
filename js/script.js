
let currentSong = new Audio();

let songs;
let currentFolder;
let title;

function secondsToMinutesSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(remainingSeconds).padStart(2, '0');

    return `${minutesStr}:${secondsStr}`;
}




async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            title = element.href.split(`/${folder}/`)[1].replaceAll("%20", " ").split(".mp3")[0];
            songs.push(title);
            // console.log(title);
        }


    }

    // Show all the songs in the playlist
    let songsUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songsUL.innerHTML = ""

    for (let song of songs) {

        songsUL.innerHTML = songsUL.innerHTML + `
                <li>
                    <img class="invert" src="img/music.svg" alt="music">
                    <div class="info">
                        <div class="hide">${song}</div>
                        <div>${song = song.length > 15 ? song.slice(0, 15) + "..." : song}</div>
                        <div>Song Artist</div>
                    </div>
                    <div class="playnow">
                        <span>Play now</span>
                        <img class="invert" src="img/play.svg" alt="">
                    </div>
                </li>`;
    }

    // Attach an eventListener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    return songs

}




const playMusic = (track, pause = false) => {
    currentSong.src = `/${currentFolder}/` + track + ".mp3";


    if (!pause) {
        currentSong.play();

        play.src = "img/pause.svg";
    }



    document.querySelector(".song-info").innerHTML = track.length < 13 ? track : track.slice(0, 5) + "....mp3";
    document.querySelector(".song-time").innerHTML = "00:00/00:00";



}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];



        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];

            // Get metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            let cardContainer = document.querySelector('.card-container')
            // console.log(response);


            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0"
                        viewBox="0 0 30 30" xml:space="preserve">
                        <style></style>
                        <path
                        d="M7 28a.999.999 0 0 1-1-1V5a1 1 0 0 1 1.521-.854l18 11a1.001 1.001 0 0 1 0 1.708l-18 11A1 1 0 0 1 7 28z"
                        fill="black" />
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="Image">
                <h2>${response.title = response.title.length > 15 ? response.title.slice(0, 15) + "..." : response.title}</h2>
                <p>${response.description}</p>
            </div>
            `;
        }
    }

    // Load the library whenever card is clicked



    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })
    })

}



async function main() {


    // Get the list of all songs 
    await getSongs("songs/cs");

    playMusic(songs[0], true)

    // Display all albums in the page
    displayAlbums();



    // Attach an eventlistener to previous, play, next buttons

    const playSong = document.getElementById('play');

    playSong.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playSong.src = 'img/pause.svg';
        }
        else {
            currentSong.pause();
            playSong.src = 'img/play.svg';
        }
    })




    // Listen for time update event

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 99 + "%";
    })

    // Adding eventlistener to seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration) * percent / 100;
    })


    // Adding an eventlistener to hamburger

    let left = document.querySelector('.left');
    document.querySelector('.hamburger').addEventListener("click", () => {
        left.classList.add('open');
    })

    document.querySelector(".logo img:nth-child(2)").addEventListener("click", () => {
        left.classList.remove('open');
    })

    // Add an eventlistener to previous and next

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20", " ").split(".mp3")[0]);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        // currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20", " ").split(".mp3")[0]);


        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an eventlistener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        console.log("Setting Volume to ", e.target.value + "% / 100%");

        currentSong.volume = parseInt(e.target.value) / 100;

    })

    // Adding eventlistener to mute the volume
    let muted = false;
    document.querySelector(".volume img").addEventListener("click", () => {
        muted = !muted

        if (muted) {
            currentSong.volume = 0;
            document.querySelector(".volume img").src = "img/mute.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }

        else {
            currentSong.volume = 1;
            document.querySelector(".volume img").src = "img/volume.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value = 100;
        }

    })

    // Adding auto play when song get finishes

    currentSong.addEventListener("ended", async () => {
        let currentIndex = 0;
        if (currentIndex < songs.length -1) {
            currentIndex++;
            let nextsong = songs[currentIndex];
            playMusic(nextsong);
        }

        else {
            currentIndex = 0;
            
            let nextsong = songs[currentIndex];
            playMusic(nextsong);

        }
    })


}


main();