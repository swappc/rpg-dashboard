$(function () {
    $("#libraryTracksDiv, #playlistTracks").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();
});

function initSamplerPage() {

    $.get("/library", "", (tracks) => {

        var searchElem = document.getElementById('searchInput');
        var listElem = document.getElementById('filteredTracksList');
        searchElem.oninput = function () {
            while (listElem.firstChild) {
                listElem.removeChild(listElem.firstChild);
            }
            var searchValue = searchElem.value;
            var filtered = tracks.filter((track) => track.name.includes(searchValue)).slice(0, 15).map((track) => {
                var listItemElement = document.createElement('li');
                listItemElement.classList.add('list-group-item');
                listItemElement.innerText = track.name;
                listItemElement.ondragstart = dragtest;
                listItemElement.draggable = true;
                listItemElement.src = track.file;
                listElem.appendChild(listItemElement);
            })


        };

    });

    function dragtest(ev) {
        ev.dataTransfer.setData("text", ev.target.innerText);
        ev.dataTransfer.setData("src", ev.target.src);
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function dropTrack(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.innerText = data;
        ev.target.src = ev.dataTransfer.getData("src");
    }

    var samplerContainer = document.getElementById('samplerTargets');

    for (row = 0; row < 8; row++) {
        var rowElement = document.createElement('DIV');
        rowElement.classList.add('row');
        for (col = 0; col < 4; col++) {
            var colElement = document.createElement('DIV');
            colElement.classList.add('col');

            var button = document.createElement('BUTTON');
            button.classList.add('btn');
            button.classList.add('btn-default');
            button.innerText = '___';
            button.ondrop = dropTrack;
            button.ondragover = allowDrop;
            button.onclick = function () {
                if (this.src) {
                    var audio = new Audio();
                    audio.src = this.src;
                    audio.play();
                }
            }
            colElement.appendChild(button);
            rowElement.appendChild(colElement);
        }
        samplerContainer.appendChild(rowElement);
    }

}
initSamplerPage();

NLM.init();


var player = new PlaylistPlayer();
player.progressUpdate = function (percentage) {
    var progressElement = document.getElementById('playingProgress');
    progressElement.value = percentage * 100;
}
var midiPlayKey = PlayKey(() => {
    player.togglePlay();
});

NLM.setupBtn(0, 0, 8, CallbackKey('hi_green', 'lo_amber', () => player.previous()));
NLM.setupBtn(0, 1, 8, midiPlayKey);
NLM.setupBtn(0, 2, 8, CallbackKey('hi_green', 'lo_amber', () => player.next()));


player.onPlay = function () {
    var element = document.getElementById("playPauseButton");
    element.innerHTML = '<i class="fas fa-pause"></i>';
    element.disabled = false;
    midiPlayKey.playing = true;
    midiPlayKey.setled();
    document.getElementById('prevTrackButton').disabled = false;
    document.getElementById('nextTrackButton').disabled = false;
}

player.onPause = function () {
    var element = document.getElementById("playPauseButton");
    element.innerHTML = '<i class="fas fa-play"></i>';
    element.disabled = false;

    midiPlayKey.playing = false;
    midiPlayKey.setled();
}

var volumeSlider = document.getElementById("volumeSlider");
volumeSlider.oninput = function () {
    player.setVolume(this.value / 100);
}
document.getElementById("playingProgress").oninput = function () {
    player.setPosition(this.value / 100);
}



var playlistKeys = new Array();
var labelElems = new Array();
function processPlaylists(playlists) {
    playlists.forEach((element, index) => {
        function loadPlaylist(listnum) {
            document.getElementById('currentPlaylistLabel').textContent = playlists[listnum].name;
            player.setPlaylist(playlists[listnum]);
            playlistKeys.forEach((e) => {
                e.setValue(listnum);
            });
            labelElems.forEach((e) => {
                if (e.playlistId === listnum) {
                    e.classList.add("active");
                } else {
                    e.classList.remove("active");
                }
            })

        }

        var label = document.createElement("LABEL");
        label.classList.add("btn");
        label.classList.add("btn-secondary");
        label.playlistId = index;
        label.innerHTML = element.name;
        var btn = document.createElement("INPUT");       // Create a <button> element
        btn.type = "radio";
        btn.name = "playlists";
        label.onclick = () => loadPlaylist(index);

        labelElems.push(label);
        label.appendChild(btn);

        var tempKey = GroupKey("playlists", index);
        tempKey.onPushCallback = function (index) {
            if (this.pos == index && this.active) {
                player.togglePlay();
            } else {
                loadPlaylist(index)
            }
        }.bind(tempKey);
        NLM.setupBtn(0, 0, index, tempKey);
        playlistKeys.push(tempKey);

        document.getElementById('playlistsDiv').appendChild(label);

    });

}

function processLibrary(libraryTracks) {
    libraryTracks.forEach((element, index) => {
        var name = document.createElement('li');
        name.classList.add("ui-state-default");
        name.innerHTML = element.name;
        document.getElementById('libraryTracksDiv').appendChild(name);
    });
}



$.get("http://127.0.0.1:3000/playlists", "", processPlaylists);

$.get("http://127.0.0.1:3000/library", "", processLibrary);

var volumeKeys = new Array();
// Volume Control
for (i = 0; i < 8; i++) {
    var tempKey = SliderKey(0, i);
    tempKey.onPushCallback = function (value) {
        player.setVolume(value);
    };
    NLM.setupBtn(0, 3, 7 - i, tempKey);
    volumeKeys.push(tempKey);
}

player.onVolumeChange = function (targetVolume) {
    volumeSlider.value = targetVolume * 100;
    volumeKeys.forEach((e) => {
        e.setValue(targetVolume);
    })
}

player.setVolume(1);

function midiInit(midi) {
    var inputs = midi.inputs.values();
    for (var input = inputs.next();
        input && !input.done;
        input = inputs.next()) {
        if (input.value.name.startsWith('Launchpad Mini')) {
            // each time there is a midi message call the onMIDIMessage function
            input.value.onmidimessage = NLM.incomingData;
            break;
        }
    }

    var outputs = midi.outputs.values();
    for (var output = outputs.next();
        output && !output.done;
        output = outputs.next()) {
        if (output.value.name.startsWith('Launchpad Mini')) {
            // each time there is a midi message call the onMIDIMessage function
            console.log('Found output midi');
            NLM.sendToDevice = function (data) {
                output.value.send(data);
            }
            NLM.drawPage();
            break;
        }
    }

}
function midiFailure() {
    console.log('Error initializing MIDI');
}

if (navigator.requestMIDIAccess) {
    console.log('Browser supports MIDI!');
    navigator.requestMIDIAccess().then(
        midiInit, midiFailure
    );
}