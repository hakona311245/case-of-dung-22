import { openDossier, turnPage } from '../animations/dossier-motion.ts'

export type SceneState = 'inactive' | 'entering' | 'active' | 'leaving'

type SceneChange = {
  index: number
  scene: HTMLElement
  total: number
}

type SceneControllerOptions = {
  progressElement?: HTMLElement
  onSceneChange?: (change: SceneChange) => void
}

const setSceneState = (scene: HTMLElement, state: SceneState): void => {
  const isInactive = state === 'inactive'
  scene.dataset.sceneState = state
  scene.hidden = isInactive
  scene.setAttribute('aria-hidden', String(isInactive))
}

const focusSceneHeading = (scene: HTMLElement): void => {
  const heading = scene.querySelector<HTMLElement>('[data-scene-heading]')
  heading?.focus({ preventScroll: true })
}

export const setupSceneController = (
  scenes: HTMLElement[],
  options: SceneControllerOptions = {},
): void => {
  if (scenes.length === 0) {
    throw new Error('The scene controller requires at least one scene.')
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const initialActiveScenes = scenes.filter((scene) => scene.dataset.sceneState === 'active')

  if (initialActiveScenes.length !== 1) {
    throw new Error('The scene controller requires exactly one initial active scene.')
  }

  let activeIndex = scenes.indexOf(initialActiveScenes[0])
  let isTransitioning = false

  scenes.forEach((scene, index) => {
    setSceneState(scene, index === activeIndex ? 'active' : 'inactive')
  })

  const updateSceneContext = (): void => {
    const current = scenes[activeIndex]
    const progress = `${String(activeIndex + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`

    if (options.progressElement) {
      options.progressElement.textContent = progress
      options.progressElement.setAttribute(
        'aria-label',
        `Phần ${activeIndex + 1} trên ${scenes.length}`,
      )
    }

    options.onSceneChange?.({ index: activeIndex, scene: current, total: scenes.length })
  }

  const advance = async (trigger: HTMLButtonElement): Promise<void> => {
    if (isTransitioning || activeIndex >= scenes.length - 1) {
      return
    }

    isTransitioning = true
    trigger.disabled = true

    const current = scenes[activeIndex]
    const next = scenes[activeIndex + 1]
    const isIntro = activeIndex === 0

    // Immediate button response
    trigger.classList.add('button--pressed')

    // REDUCED MOTION: Instant accessible swap
    if (reducedMotion.matches) {
      trigger.classList.remove('button--pressed')
      setSceneState(current, 'inactive')
      setSceneState(next, 'active')
      next.scrollTop = 0
      activeIndex += 1
      updateSceneContext()
      focusSceneHeading(next)
      isTransitioning = false
      return
    }

    if (isIntro) {
      setSceneState(next, 'entering')
      next.scrollTop = 0
      setSceneState(current, 'leaving')

      await openDossier(current, next)

      setSceneState(current, 'inactive')
      trigger.classList.remove('button--pressed')
      setSceneState(next, 'active')
      activeIndex += 1
      updateSceneContext()

      focusSceneHeading(next)
      isTransitioning = false
    } else {
      setSceneState(next, 'entering')
      next.scrollTop = 0
      setSceneState(current, 'leaving')

      await turnPage(current, next)

      setSceneState(current, 'inactive')
      trigger.classList.remove('button--pressed')
      setSceneState(next, 'active')
      activeIndex += 1
      updateSceneContext()

      focusSceneHeading(next)
      isTransitioning = false
    }
  }

  scenes.forEach((scene) => {
    const nextButton = scene.querySelector<HTMLButtonElement>('[data-scene-next]')

    nextButton?.addEventListener('click', () => {
      void advance(nextButton)
    })
  })

  updateSceneContext()
}
