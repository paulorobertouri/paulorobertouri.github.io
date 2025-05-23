const defaultSystem = `Primeiro, forneça a solução de forma concisa. Segundo, explique a solução passo a passo. Por fim, forneça um resumo da solução. Retorne somente texto sem formatação.`;

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

  // Helper: Collapse Panel
  function collapsePanel(panel) {
    const collapse = new bootstrap.Collapse(panel, { toggle: false });
    collapse.hide();
  }

  // Helper: Validate API Key
  function isValidApiKey(key) {
    return typeof key === "string" && key.startsWith("sk-");
  }

  // Helper: Set textarea height autosize
  function autosizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  // Load config
  openAiKey.value = config.key || "";
  model.value = config.model || "";
  temperature.value = config.temperature || "";
  maxTokens.value = config.maxTokens || "";
  openAiKey.setAttribute("autocomplete", "off"); // Prevent browser from storing API key

  if (config.key) {
    collapsePanel(panelConfigBody);
  }

  // Save config
  btnSave.addEventListener("click", () => {
    if (!isValidApiKey(openAiKey.value)) {
      openAiKey.classList.add("is-invalid");
      openAiKey.focus();
      return;
    }
    openAiKey.classList.remove("is-invalid");
    saveConfig(
      openAiKey.value,
      model.value,
      temperature.value,
      maxTokens.value
    );
    collapsePanel(panelConfigBody);
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
  const btnSelfie = document.getElementById("btnSelfie");
  const btnPhoto = document.getElementById("btnPhoto");
  const processingModal = document.getElementById("processingModal");
  let cameraStream = null;

  requestSystem.value = defaultSystem;
  autosizeTextarea(requestSystem);

  // Helper: Show Modal with Message
  function showProcessingModal(message) {
    const modal = new bootstrap.Modal(processingModal);
    modal.show();
    resultText.innerHTML = `<span class="text-secondary">${message}</span>`;
  }

  // Helper: Hide Modal
  function hideProcessingModal() {
    const modalInstance = bootstrap.Modal.getInstance(processingModal);
    if (modalInstance) modalInstance.hide();
  }

  // Helper: Extract Text from Image
  async function handleExtractTextFromImage(base64, successMsg, errorMsg) {
    showProcessingModal("Extracting text from image...");
    try {
      const text = await extractTextFromImage(
        openAiKey.value,
        base64,
        model.value
      );
      requestUser.value = text;
      autosizeTextarea(requestUser);
      requestImage.value = "";
      resultText.innerHTML = `<span class="text-success">${successMsg}</span>`;
    } catch (err) {
      resultText.innerHTML = `<span class="text-danger">${
        errorMsg || err.message
      }</span>`;
    } finally {
      hideProcessingModal();
    }
  }

  // Extract text from image
  requestImage.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function (evt) {
      const base64 = evt.target.result;
      await handleExtractTextFromImage(base64, "Text extracted to User field.");
    };
    reader.readAsDataURL(file);
  });

  // Camera button opens modal and starts video
  btnCamera.addEventListener("click", async () => {
    const modal = new bootstrap.Modal(cameraModal);
    modal.show();
    let facingMode = "environment";

    // Start video with selected facing mode
    const startCamera = async () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      let constraints = { video: { facingMode: facingMode } };
      try {
        try {
          cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch {
          constraints = { video: true };
          cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        }
        cameraVideo.srcObject = cameraStream;
        cameraVideo.play();
      } catch (err) {
        resultText.innerHTML =
          '<span class="text-danger">Camera error: ' + err.message + "</span>";
      }
    };

    btnSelfie.onclick = () => {
      facingMode = "user";
      btnSelfie.classList.add("active");
      btnPhoto.classList.remove("active");
      startCamera();
    };
    btnPhoto.onclick = () => {
      facingMode = "environment";
      btnPhoto.classList.add("active");
      btnSelfie.classList.remove("active");
      startCamera();
    };
    btnPhoto.classList.add("active");
    btnSelfie.classList.remove("active");
    startCamera();
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
    if (modal) modal.hide();
    // Process as if uploaded
    handleExtractTextFromImage(
      base64,
      "Text extracted to User field.",
      "Failed to extract text from camera image."
    );
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
    if (!isValidApiKey(openAiKey.value)) {
      openAiKey.classList.add("is-invalid");
      openAiKey.focus();
      resultText.innerHTML =
        '<span class="text-danger">Chave de API inválida.</span>';
      return;
    }
    openAiKey.classList.remove("is-invalid");
    if (!requestUser.value.trim()) {
      requestUser.classList.add("is-invalid");
      requestUser.focus();
      resultText.innerHTML =
        '<span class="text-danger">Prompt do usuário não pode ser vazio.</span>';
      return;
    }
    requestUser.classList.remove("is-invalid");
    showProcessingModal("Processing...");
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
    } finally {
      hideProcessingModal();
    }
  });

  // Clean up button
  btnCleanUp.addEventListener("click", () => {
    requestSystem.value = defaultSystem;
    requestUser.value = "";
    requestImage.value = "";
    resultText.innerHTML = "";
    autosizeTextarea(requestSystem);
    autosizeTextarea(requestUser);
  });

  // Autosize textareas
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      autosizeTextarea(textarea);
    });
    autosizeTextarea(textarea);
  });
});
