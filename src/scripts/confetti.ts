const CONFETTI_COUNT = 48
const CONFETTI_DURATION_MS = 2600

export const setupConfetti = (
  button: HTMLButtonElement,
  container: HTMLElement,
  status: HTMLElement,
): void => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  button.addEventListener('click', () => {
    container.replaceChildren()
    status.textContent = 'Hẹn gặp ở tuổi 23.'

    if (reducedMotion.matches) {
      return
    }

    const fragment = document.createDocumentFragment()
    const viewportWidth = window.innerWidth || 800
    const viewportHeight = window.innerHeight || 600

    for (let index = 0; index < CONFETTI_COUNT; index += 1) {
      const piece = document.createElement('span')
      piece.className = 'confetti__piece'
      const xOffset = Math.round((Math.random() - 0.5) * viewportWidth * 0.9)
      const startY = Math.round(-viewportHeight * 0.3 - Math.random() * 120)
      const endY = Math.round(viewportHeight * 0.65 + Math.random() * 200)
      const rotate = Math.round((Math.random() - 0.5) * 1080)
      const delay = Math.round(Math.random() * 260)

      piece.style.setProperty('--confetti-x', `${xOffset}px`)
      piece.style.setProperty('--confetti-start-y', `${startY}px`)
      piece.style.setProperty('--confetti-end-y', `${endY}px`)
      piece.style.setProperty('--confetti-rotate', `${rotate}deg`)
      piece.style.setProperty('--confetti-delay', `${delay}ms`)
      fragment.append(piece)
    }

    container.append(fragment)

    window.setTimeout(() => {
      container.replaceChildren()
    }, CONFETTI_DURATION_MS)
  })
}
