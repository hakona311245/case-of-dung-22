import './styles/main.css'
import './styles/animations.css'
import './styles/responsive.css'
import { audioAsset } from './content.ts'
import { renderSite } from './render.ts'
import { setupAudio } from './scripts/audio.ts'
import { setupConfetti } from './scripts/confetti.ts'
import { setupLetterInteraction } from './scripts/letter.ts'
import { setupSceneController } from './scripts/scene-controller.ts'

const getRequiredElement = <ElementType extends Element>(
  selector: string,
): ElementType => {
  const element = document.querySelector<ElementType>(selector)

  if (!element) {
    throw new Error(`Required interface element is missing: ${selector}`)
  }

  return element
}

const app = getRequiredElement<HTMLDivElement>('#app')
app.innerHTML = renderSite()

const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
const caseControls = getRequiredElement<HTMLElement>('#case-controls')
const sceneProgress = getRequiredElement<HTMLElement>('#scene-progress')
const openButton = getRequiredElement<HTMLButtonElement>('#open-case')
const audioButton = getRequiredElement<HTMLButtonElement>('#audio-control')
const audioStatus = getRequiredElement<HTMLElement>('#audio-status')
const appealButton = getRequiredElement<HTMLButtonElement>('#appeal-button')
const confettiContainer = getRequiredElement<HTMLElement>('#confetti')
const celebrationStatus = getRequiredElement<HTMLElement>('#celebration-status')
const personalLetterScene = getRequiredElement<HTMLElement>('#personal-letter')

const audio = setupAudio(audioButton, audioStatus, { ...audioAsset })

openButton.addEventListener('click', () => {
  void audio.start()
})

setupSceneController(scenes, {
  progressElement: sceneProgress,
  onSceneChange: ({ index }) => {
    const caseIsOpen = index > 0
    caseControls.hidden = !caseIsOpen
    document.body.classList.toggle('case-is-open', caseIsOpen)
    document.body.dataset.sceneIndex = String(index)
  },
})

setupLetterInteraction(personalLetterScene)
setupConfetti(appealButton, confettiContainer, celebrationStatus)
