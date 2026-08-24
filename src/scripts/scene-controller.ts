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
  const isActive = state === 'active'
  scene.dataset.sceneState = state
  scene.hidden = isInactive
  scene.inert = !isActive
  scene.setAttribute('aria-hidden', String(!isActive))
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
  const shell = scenes[0]?.closest<HTMLElement>('[data-dossier-shell]')
  const viewport = shell?.closest<HTMLElement>('.dossier-viewport')

  if (!shell || !viewport) {
    throw new Error('The scene controller requires a persistent dossier shell and viewport.')
  }

  if (initialActiveScenes.length !== 1) {
    throw new Error('The scene controller requires exactly one initial active scene.')
  }

  let activeIndex = scenes.indexOf(initialActiveScenes[0])
  let isTransitioning = false

  const getSceneContent = (scene: HTMLElement): HTMLElement => {
    const content = scene.querySelector<HTMLElement>(
      '.dossier-cover__content, .dossier-page__content',
    )

    if (!content) {
      throw new Error(`Scene content wrapper is missing for #${scene.id}.`)
    }

    return content
  }

  const measureSceneHeight = (scene: HTMLElement): number => {
    const wasHidden = scene.hidden
    const wasInert = scene.inert
    const wasAriaHidden = scene.getAttribute('aria-hidden')

    scene.hidden = false
    scene.inert = true
    scene.setAttribute('aria-hidden', 'true')
    scene.dataset.dossierMeasuring = ''

    const measuredHeight = getSceneContent(scene).offsetHeight + 2

    delete scene.dataset.dossierMeasuring
    scene.hidden = wasHidden
    scene.inert = wasInert
    scene.setAttribute('aria-hidden', wasAriaHidden ?? 'true')

    return Math.max(measuredHeight, 1)
  }

  const setShellHeight = (height: number): void => {
    shell.style.height = `${height}px`
  }

  const resizeObserver = new ResizeObserver(() => {
    if (!isTransitioning) {
      setShellHeight(measureSceneHeight(scenes[activeIndex]))
    }
  })

  const observeActiveScene = (): void => {
    resizeObserver.disconnect()
    resizeObserver.observe(getSceneContent(scenes[activeIndex]))
  }

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
    const currentHeight = Math.ceil(shell.getBoundingClientRect().height)
    const nextHeight = measureSceneHeight(next)

    // Immediate button response
    trigger.classList.add('button--pressed')

    // REDUCED MOTION: Instant accessible swap
    if (reducedMotion.matches) {
      trigger.classList.remove('button--pressed')
      setSceneState(current, 'inactive')
      setSceneState(next, 'active')
      viewport.scrollTop = 0
      setShellHeight(nextHeight)
      activeIndex += 1
      updateSceneContext()
      observeActiveScene()
      isTransitioning = false
      window.setTimeout(() => focusSceneHeading(next), 50)
      return
    }

    if (isIntro) {
      setSceneState(next, 'entering')
      viewport.scrollTop = 0
      setSceneState(current, 'leaving')

      await openDossier(current, next, {
        shell,
        coverHeight: currentHeight,
        openingHeight: nextHeight,
      })

      setSceneState(current, 'inactive')
      trigger.classList.remove('button--pressed')
      setSceneState(next, 'active')
      setShellHeight(nextHeight)
      activeIndex += 1
      updateSceneContext()
      observeActiveScene()

      focusSceneHeading(next)
      isTransitioning = false
    } else {
      if (nextHeight > currentHeight) {
        setShellHeight(nextHeight)
      }

      setSceneState(next, 'entering')
      viewport.scrollTop = 0
      setSceneState(current, 'leaving')

      await turnPage(current, next)

      setSceneState(current, 'inactive')
      trigger.classList.remove('button--pressed')
      setSceneState(next, 'active')
      setShellHeight(nextHeight)
      activeIndex += 1
      updateSceneContext()
      observeActiveScene()

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
  setShellHeight(measureSceneHeight(scenes[activeIndex]))
  observeActiveScene()
}
