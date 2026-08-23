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

const parseTime = (value: string): number => {
  const time = Number.parseFloat(value)

  if (!Number.isFinite(time)) {
    return 0
  }

  return value.trim().endsWith('ms') ? time : time * 1000
}

const transitionTime = (element: HTMLElement): number => {
  const styles = window.getComputedStyle(element)
  const durations = styles.transitionDuration.split(',').map(parseTime)
  const delays = styles.transitionDelay.split(',').map(parseTime)

  return durations.reduce((longest, duration, index) => {
    const delay = delays[index % delays.length] ?? 0
    return Math.max(longest, duration + delay)
  }, 0)
}

const waitForTransition = (
  element: HTMLElement,
  reducedMotion: MediaQueryList,
): Promise<void> => {
  if (reducedMotion.matches) {
    return Promise.resolve()
  }

  const duration = transitionTime(element)

  if (duration === 0) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const fallback = window.setTimeout(finish, duration + 50)

    function finish(): void {
      window.clearTimeout(fallback)
      element.removeEventListener('transitionend', handleTransitionEnd)
      resolve()
    }

    function handleTransitionEnd(event: TransitionEvent): void {
      if (event.target === element) {
        finish()
      }
    }

    element.addEventListener('transitionend', handleTransitionEnd)
  })
}

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()))
  })

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

    setSceneState(current, 'leaving')
    await waitForTransition(current, reducedMotion)

    setSceneState(current, 'inactive')
    setSceneState(next, 'entering')
    next.scrollTop = 0
    activeIndex += 1
    updateSceneContext()

    await nextFrame()
    setSceneState(next, 'active')
    focusSceneHeading(next)
    await waitForTransition(next, reducedMotion)

    isTransitioning = false
  }

  scenes.forEach((scene) => {
    const nextButton = scene.querySelector<HTMLButtonElement>('[data-scene-next]')

    nextButton?.addEventListener('click', () => {
      void advance(nextButton)
    })
  })

  updateSceneContext()
}
