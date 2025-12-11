


let currentsong = new Audio();
let songs;


let move_the_songs;

let currfolder;
function formatTime(totalSeconds) {

    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00"
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60)

    // Add leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;


}



const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+track)

    currentsong.src = `/songs/${currfolder}/` + track


    if (!pause) {

        currentsong.play()
        play.src = "img/pause.svg"

    }

    document.querySelector(".songinfo").innerHTML = (decodeURI(track))
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}





async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`)

    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    songs = []

   


    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURI(element.href.split(`${folder}`)[1]).replaceAll(/\\/g, ""))
            
        }
    }
   
    

    //show all the songs in the playlist 

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    songul.innerHTML = ""
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${decodeURI(song).replaceAll(/\\/g, "")}</div>
                                <div>Ankan</div>
                            </div>

                                <div class="playnow">
                                    <span>play Now</span>
                                    <img  class="invert" src="img/play-button.svg" alt="">
                                </div>
                                
                            </li>`

    }




    //   Attach an event listner to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", () => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);

            playmusic(e.querySelector(".info").firstElementChild.innerHTML.replaceAll("amp;", "").trim())

        })

    });

    return songs

}


async function displayalbum() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)

    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response

    let anchors = div.getElementsByTagName("a")
    let cardcontanair = document.querySelector(".cardcontanair")

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("songs")) {
            let folder = e.href.split("/").slice(3)[0].replaceAll("%5Csongs%5C", "")
         

            // get the metadata of the folder



            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)

            let response = await a.json()
            

            cardcontanair.innerHTML = cardcontanair.innerHTML + `<div data-folder=${folder} class="card">
                        <div    class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">

                                <!-- Green fill inside the circle -->
                                <circle cx="12" cy="12" r="10" fill="#00FF00" />

                                <!-- Circle outline -->
                                <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="1.5" fill="none" />

                                <!-- Play icon -->
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="#000000"></path>

                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" >
                        <h2>${response.title}</h2>
                        <p>${response.descripsion} </p>
                    </div>`

        }
    }


    // Load the playlist  whenever card is clicked 
    

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getsongs(`${item.currentTarget.dataset.folder}`)
            
            playmusic(decodeURI(songs[0]).replaceAll(/\\/g, ""))
            
        })
    })


}

async function main() {


    // load first album in defult 

    await getsongs("arijit")
    playmusic(decodeURI(songs[0]).replaceAll(/\\/g, ""), true)

    // display all the the album on the page 

    displayalbum()



    //   Attach an event listner to play,next and previous

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })


    //  lisen for time update event 

    currentsong.addEventListener("timeupdate", () => {
  
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })



    //  Add an event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    //  add an event listner to hameburger

    document.querySelector(".hameburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    // add an event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })


    // Add an event listner to previous 

    previous.addEventListener("click", () => {

        currentsong.pause()
        console.log("prevuous clicked");

        let index = songs.indexOf(decodeURI(currentsong.src.split("/").slice(5)))

        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    // // Add an event listner to next 

    next.addEventListener("click", () => {

        currentsong.pause()
        console.log("next clicked");
                
        let index = songs.indexOf(decodeURI(currentsong.src.split("/").slice(5)))

        if ((index + 1) < songs.length) {
            playmusic((decodeURI(songs[index + 1])))
        }
    })


    // add an event to volume


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100");
        currentsong.volume = parseInt(e.target.value) / 100
    })

    // add eventlistner to mute the track

    document.querySelector(".volume >img").addEventListener("click", (e) => {
        

        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = "0"
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = "10"

        }

    })


}

main()