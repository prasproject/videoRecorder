const videoElement = document.getElementById('video-element');
const recordButton = document.getElementById('record-button');
const playButton = document.getElementById('play-button');

let mediaRecorder;
let recordedChunks = [];

recordButton.addEventListener('click', () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support recording video.');
        return;
    }

    const constraints = {
        video: true,
        audio: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            videoElement.srcObject = stream;

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                recordedChunks.push(event.data);
            };

            recordButton.textContent = 'Stop Recording';
            playButton.disabled = true;
            mediaRecorder.start();
        })
        .catch(error => {
            console.error('Error accessing media devices:', error);
            alert('There was an error accessing your media devices.');
        });
});

playButton.addEventListener('click', () => {
    if (recordedChunks.length === 0) {
        alert('No recorded video available.');
        return;
    }

    const videoBlob = new Blob(recordedChunks, { type: 'video/mp4' });
    const videoURL = URL.createObjectURL(videoBlob);

    videoElement.src = videoURL;
    recordedChunks = [];

    playButton.disabled = true;
    recordButton.textContent = 'Record';
});

videoElement.addEventListener('ended', () => {
    playButton.disabled = false;
});

// Fallback untuk Safari (tampilkan video H.264)
if (navigator.userAgent.toLowerCase().indexOf('safari') > -1) {
    const constraints = {
        video: true,
        audio: true,
        videoConstraints: {
            mandatory: {
                width: { min: 640, max: 1280 },
                height: { min: 360, max: 720 },
            }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            videoElement.srcObject = stream;
            recordButton.disabled = false;
        })
        .catch(error => {
            console.error('Error accessing media devices:', error);
            alert('There was an error accessing your media devices.');
        });
} else {
    recordButton.disabled = false;
}
