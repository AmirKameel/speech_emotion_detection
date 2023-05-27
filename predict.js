// get the audio context
const audioContext = new AudioContext();

// get the audio stream from the user's microphone
navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    // create a new media stream source and connect it to the audio context
    const source = audioContext.createMediaStreamSource(stream);
    const recorder = new Recorder(source);

    // handle the record button click event
    document.getElementById('recordButton').addEventListener('click', () => {
      recorder.record();
    });

    // handle the pause button click event
    document.getElementById('pauseButton').addEventListener('click', () => {
      recorder.pause();
    });

    // handle the stop button click event
    document.getElementById('stopButton').addEventListener('click', () => {
      recorder.stop();
      recorder.exportWAV((blob) => {
        // create a new FormData object to send the recording to the server
        const formData = new FormData();
        formData.append('audio', blob);

        // send the recording to the server and get the predicted emotion
        fetch('/predict', {
          method: 'POST',
          body: formData
        })
          .then((response) => response.json())
          .then((data) => {
            // update the emotion text with the predicted emotion
            const emotionText = document.getElementById('emotion');
            emotionText.textContent = data.emotion;
          });
      });
    });

    // automatically send the recording to the server when it's finished
    recorder.onStop = (blob) => {
      // create a new FormData object to send the recording to the server
      const formData = new FormData();
      formData.append('audio', blob);

      // send the recording to the server and get the predicted emotion
      fetch('/predict', {
        method: 'POST',
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          // update the emotion text with the predicted emotion
          const emotionText = document.getElementById('emotion');
          emotionText.textContent = data.emotion;
        });
    };
  })
  .catch((err) => {
    console.error(err);
  });