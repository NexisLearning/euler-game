import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const dinoElem = document.querySelector("[data-dino]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
let isJumpPending = false // NEW: The memory for your jump

export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  isJumpPending = false
  setCustomProperty(dinoElem, "--bottom", 0)
  document.removeEventListener("keydown", onKeyDown)
  document.addEventListener("keydown", onKeyDown)
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)

  // BUFFER LOGIC: If we just landed and a jump was waiting, jump!
  if (!isJumping && isJumpPending) {
    onJump()
    isJumpPending = false
  }
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png"
}

// NEW: Allows script.js to tell the dino to jump later
export function setJumpPending(value) {
  isJumpPending = value
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary.png`
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
    currentFrameTime -= FRAME_TIME
  }
  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

function onKeyDown(e) {
  if (e.code !== "Space") return
  if (isJumping) {
    isJumpPending = true  // buffer: will jump on landing
  } else {
    onJump()
  }
}
function onJump() {
  yVelocity = JUMP_SPEED
  isJumping = true
}
