const defaultSystem =
  "Please solve the problem below and explain the solution. Return only the solution and explanation.";

document.addEventListener("DOMContentLoaded", () => {
  ////////////////////////////////////////////////////////////////
  //  Config Panel
  ////////////////////////////////////////////////////////////////
  const config = loadConfig();
  const openAiKey = document.getElementById("openAiKey");
  const model = document.getElementById("model");
  const temperature = document.getElementById("temperature");
  const maxTokens = document.getElementById("maxTokens");
  const btnSave = document.getElementById("btnSave");
  const panelConfigBody = document.getElementById("panelConfigBody");

  // Load config
  openAiKey.value = config.key;
  model.value = config.model;
  temperature.value = config.temperature;
  maxTokens.value = config.maxTokens;

  if (config.key) {
    const collapse = new bootstrap.Collapse(panelConfigBody, {
      toggle: false,
    });
    collapse.hide();
  }

  // Save config
  btnSave.addEventListener("click", () => {
    saveConfig(
      openAiKey.value,
      model.value,
      temperature.value,
      maxTokens.value
    );
    panelConfigBody.style.display = "none";
  });

  ////////////////////////////////////////////////////////////////
  // Solve Panel
  ////////////////////////////////////////////////////////////////
  const requestSystem = document.getElementById("requestSystem");
  const requestUser = document.getElementById("requestUser");
  const requestImage = document.getElementById("requestImage");
  const btnSolve = document.getElementById("btnSolve");
  const btnCleanUp = document.getElementById("btnCleanUp");
  const resultText = document.getElementById("resultText");
  const btnCamera = document.getElementById("btnCamera");
  const cameraModal = document.getElementById("cameraModal");
  const cameraVideo = document.getElementById("cameraVideo");
  const cameraCanvas = document.getElementById("cameraCanvas");
  const btnCapture = document.getElementById("btnCapture");
  let cameraStream = null;

  requestSystem.value = defaultSystem;

  // Extract text from image
  requestImage.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function (evt) {
      const base64 = evt.target.result;
      resultText.innerHTML =
        '<span class="text-secondary">Extracting text from image...</span>';
      try {
        const text = await extractTextFromImage(
          openAiKey.value,
          base64,
          model.value
        );
        requestUser.value = text;
        requestUser.style.height = "auto";
        requestUser.style.height = requestUser.scrollHeight + "px";
        requestImage.value = "";
        resultText.innerHTML =
          '<span class="text-success">Text extracted to User field.</span>';
      } catch (err) {
        resultText.innerHTML =
          '<span class="text-danger">' + err.message + "</span>";
      }
    };
    reader.readAsDataURL(file);
  });

  // Camera button opens modal and starts video
  btnCamera.addEventListener("click", async () => {
    const modal = new bootstrap.Modal(cameraModal);
    modal.show();
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraVideo.srcObject = cameraStream;
      cameraVideo.play();
    } catch (err) {
      resultText.innerHTML =
        '<span class="text-danger">Camera error: ' + err.message + "</span>";
    }
  });

  // Capture button takes photo and processes it as image upload
  btnCapture.addEventListener("click", () => {
    if (!cameraStream) return;
    const video = cameraVideo;
    const canvas = cameraCanvas;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/png");
    // Stop camera
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    // Hide modal
    const modal = bootstrap.Modal.getInstance(cameraModal);
    modal.hide();
    // Process as if uploaded
    resultText.innerHTML =
      '<span class="text-secondary">Extracting text from camera image...</span>';
    extractTextFromImage(openAiKey.value, base64, model.value)
      .then((text) => {
        requestUser.value = text;
        requestUser.style.height = "auto";
        requestUser.style.height = requestUser.scrollHeight + "px";
        resultText.innerHTML =
          '<span class="text-success">Text extracted to User field.</span>';
      })
      .catch((err) => {
        resultText.innerHTML =
          '<span class="text-danger">' + err.message + "</span>";
      });
  });

  // Stop camera when modal closes
  cameraModal.addEventListener("hidden.bs.modal", () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }
    cameraVideo.srcObject = null;
  });

  // Solve button
  btnSolve.addEventListener("click", async () => {
    resultText.innerHTML = '<span class="text-secondary">Processing...</span>';
    try {
      const text = await solveOpenAi(
        openAiKey.value,
        model.value,
        requestSystem.value,
        requestUser.value,
        parseFloat(temperature.value),
        parseInt(maxTokens.value, 10)
      );
      resultText.innerText = text;
    } catch (err) {
      resultText.innerHTML =
        '<span class="text-danger">' + err.message + "</span>";
    }
  });

  // Clean up button
  btnCleanUp.addEventListener("click", () => {
    requestSystem.value = "";
    requestUser.value = "";
    requestImage.value = "";
    resultText.innerHTML = "";
  });

  // Autosize textareas
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    });
  });
});
