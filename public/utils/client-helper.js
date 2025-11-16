export function setStatusMessage(message) {
  const statusEl = document.getElementById("statusMessage");
  if (statusEl) statusEl.textContent = message;
}

export function setLoading(isLoading) {
  const loadingEl = document.getElementById("loadingIndicator");
  if (loadingEl) loadingEl.style.display = isLoading ? "block" : "none";
}

export function updateChoicesUI(playerChoice, opponentChoice) {
  const playerEl = document.getElementById("playerChoice");
  const opponentEl = document.getElementById("opponentChoice");
  if (playerEl) playerEl.textContent = playerChoice || "-";
  if (opponentEl) opponentEl.textContent = opponentChoice || "-";
}

export function resetGameUI() {
  updateChoicesUI(null, null);
  setStatusMessage("Chọn kéo, búa hoặc bao để bắt đầu!");
}
