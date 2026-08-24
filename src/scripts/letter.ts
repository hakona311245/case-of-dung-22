import { gsap } from 'gsap'

type LetterState = 'closed' | 'opening' | 'open'

const getRequiredElement = <ElementType extends HTMLElement>(
  root: HTMLElement,
  selector: string,
): ElementType => {
  const element = root.querySelector<ElementType>(selector)

  if (!element) {
    throw new Error(`Personal letter element is missing: ${selector}`)
  }

  return element
}

export const setupLetterInteraction = (scene: HTMLElement): void => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const note = getRequiredElement<HTMLElement>(scene, '[data-letter-note]')
  const paper = getRequiredElement<HTMLElement>(scene, '[data-letter-paper]')
  const closedFace = getRequiredElement<HTMLElement>(scene, '[data-letter-closed]')
  const flap = getRequiredElement<HTMLElement>(scene, '[data-letter-flap]')
  const message = getRequiredElement<HTMLElement>(scene, '[data-letter-message]')
  const openButton = getRequiredElement<HTMLButtonElement>(scene, '[data-letter-open]')
  const continueActions = getRequiredElement<HTMLElement>(scene, '[data-letter-actions]')
  const continueButton = getRequiredElement<HTMLButtonElement>(scene, '[data-letter-continue]')
  let state: LetterState = 'closed'

  const finishOpening = (): void => {
    state = 'open'
    scene.dataset.letterState = state
    closedFace.hidden = true
    flap.hidden = true
    message.inert = false
    message.setAttribute('aria-hidden', 'false')
    openButton.setAttribute('aria-expanded', 'true')
    continueActions.hidden = false
    continueButton.disabled = false
    window.setTimeout(() => message.focus({ preventScroll: true }), 50)
  }

  openButton.addEventListener('click', () => {
    if (state !== 'closed') {
      return
    }

    state = 'opening'
    scene.dataset.letterState = state
    openButton.disabled = true
    message.hidden = false
    continueActions.hidden = false

    if (reducedMotion.matches) {
      gsap.set([message, continueActions], { clearProps: 'all' })
      finishOpening()
      return
    }

    scene.dataset.letterMeasuring = ''
    const openPaperHeight = Math.ceil(paper.offsetHeight)
    delete scene.dataset.letterMeasuring

    gsap
      .timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
          finishOpening()
          gsap.set([paper, message, continueActions], {
            clearProps: 'transform,opacity,visibility,clip-path,height',
          })
        },
      })
      .set(message, { autoAlpha: 0, clipPath: 'inset(46% 2% 46% 2%)', y: 8 }, 0)
      .set(continueActions, { autoAlpha: 0, y: 5 }, 0)
      .to(flap, { rotationX: -164, y: -5, duration: 0.34, ease: 'power2.inOut' }, 0)
      .to(closedFace, { opacity: 0, scaleY: 0.12, duration: 0.28, ease: 'power2.in' }, 0.18)
      .to(paper, { y: -3, rotationX: -1.5, duration: 0.24, ease: 'power1.out' }, 0.2)
      .to(note, { height: openPaperHeight, duration: 0.68, ease: 'power3.inOut' }, 0.26)
      .to(
        message,
        {
          autoAlpha: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 0.54,
          ease: 'power3.out',
        },
        0.52,
      )
      .to(continueActions, { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' }, 0.94)
      .to(paper, { y: 0, rotationX: 0, duration: 0.2, ease: 'power2.out' }, 0.94)
  })
}
