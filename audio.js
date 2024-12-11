const starRecordingButton = document.getElementById('start-Recording');
const stopRecordingButton = document.getElementById('stop-Recording');
const audioList = document.getElementById('audio-List');
const audioPlayer = document.getElementById('audio-Player');

let mediaRecorder;
let audioChunks = [];

//check for browser support
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({audio:true})
    .then(function(stream){
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function(event){
            if(event.data.size > 0){
                audioChunks.push(event.data);

            }
        }

        mediaRecorder.onstop = function()
        {
            const audioBlob = new Blob(audioChunks,{'type': 'audio/wav'});
            const audioUrl = URL.createObjectURL(audioBlob);
            const listItem = document.createElement('li');
            const audioLink = document.createElement('a');
            audioLink.href = audioUrl
            audioLink.download = 'audio.wav';
            audioLink.textContent = 'Download Audio';
            listItem.appendChild(audioLink);
            audioList.appendChild(listItem);
            audioPlayer.src = audioUrl;
            audioChunks = [];
        };

    })

    .catch(function(error){
        console.log("Error accessing the microphone "+ error);
    });
}else{
        console.log("Browser does not support audio recording")
    }
    
    //button disable on click

    starRecordingButton.addEventListener('click',function(){
        audioChunks = [];
        mediaRecorder.start();
        starRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    });

    stopRecordingButton.addEventListener('click',function(){
        mediaRecorder.stop();
        starRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
    });