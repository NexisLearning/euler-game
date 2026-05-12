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

export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0)
  document.removeEventListener("keydown", onKeyDown)
  document.addEventListener("keydown", onKeyDown)
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png"
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
  if (!isJumping) {
    onJump()
  }
}

function spawnPoopExplosion() {
  const dinoRect = dinoElem.getBoundingClientRect()
  const count = 12

  for (let i = 0; i < count; i++) {
    const poop = document.createElement("div")
    poop.textContent = "💩"
    poop.style.cssText = `
      position: fixed;
      font-size: ${Math.random() * 20 + 14}px;
      left: ${dinoRect.left + dinoRect.width / 2}px;
      top: ${dinoRect.top + dinoRect.height / 2}px;
      pointer-events: none;
      z-index: 9999;
      transition: none;
    `
    document.body.appendChild(poop)

    const angle = (i / count) * 2 * Math.PI
    const speed = Math.random() * 80 + 40
    const dx = Math.cos(angle) * speed
    const dy = Math.sin(angle) * speed

    let startTime = null
    const duration = 600

    function animate(time) {
      if (!startTime) startTime = time
      const elapsed = time - startTime
      const progress = elapsed / duration

      poop.style.transform = `translate(${dx * progress}px, ${dy * progress}px) rotate(${progress * 360}deg)`
      poop.style.opacity = 1 - progress

      if (elapsed < duration) {
        requestAnimationFrame(animate)
      } else {
        poop.remove()
      }
    }

    requestAnimationFrame(animate)
  }
}

function onJump() {
  yVelocity = JUMP_SPEED
  isJumping = true
  spawnPoopExplosion()
}
