import { gsap } from 'gsap'

const requiredElement = <ElementType extends Element>(
  root: ParentNode,
  selector: string,
): ElementType => {
  const element = root.querySelector<ElementType>(selector)

  if (!element) {
    throw new Error(`Dossier motion element is missing: ${selector}`)
  }

  return element
}

export const openDossier = (
  coverScene: HTMLElement,
  openingScene: HTMLElement,
): Promise<void> => {
  const cover = requiredElement<HTMLElement>(coverScene, '.dossier-folder')
  const seal = requiredElement<HTMLElement>(coverScene, '.unseal-ribbon')
  const peeledSeal = requiredElement<HTMLElement>(coverScene, '.unseal-ribbon__slice--peeled')
  const tearFront = requiredElement<SVGElement>(coverScene, '.unseal-ribbon__tear-front')
  const openingSheet = requiredElement<HTMLElement>(openingScene, '.scene__inner')
  const portrait = requiredElement<HTMLElement>(openingScene, '.photo-slot')
  const tearState = { progress: 0 }

  const applyTearProgress = (): void => {
    const tearAmount = Math.min(tearState.progress, 1)
    const release = Math.max(tearState.progress - 1, 0)
    const tearX = 102 - tearAmount * 104
    const lift = Math.sqrt(tearAmount)
    const releaseOpacity = release <= 0.65 ? 1 : Math.max(0, 1 - (release - 0.65) / 0.35)

    seal.style.setProperty('--tear-x', `${tearX}%`)
    tearFront.style.opacity = String(
      tearAmount === 0 ? 0 : Math.max(0, Math.min(1, tearAmount * 18) * (1 - release * 2.5)),
    )

    gsap.set(peeledSeal, {
      x: tearAmount * 3 + release * 52,
      y: lift * -8 - release * 42,
      z: tearAmount * 12 + release * 24,
      rotationX: lift * -9 - release * 6,
      rotationY: tearAmount * -4 - release * 8,
      rotationZ: tearAmount * 1.8 + release * 7,
      scaleX: 1 + (tearAmount > 0 ? (1 - tearAmount) * 0.004 : 0),
      opacity: releaseOpacity,
      filter: `drop-shadow(${tearAmount * -4}px ${2 + tearAmount * 6}px ${2 + tearAmount * 8}px rgba(17, 27, 43, ${0.04 + tearAmount * 0.14}))`,
      transformOrigin: 'right center',
    })
  }

  applyTearProgress()

  return new Promise((resolve) => {
    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        gsap.set([openingSheet, portrait], { clearProps: 'opacity,transform,filter' })
        resolve()
      },
    })

    timeline
      .set(openingSheet, { opacity: 0.82, y: 10, scale: 0.985 }, 0)
      .set(portrait, { opacity: 0, y: -20, rotation: 2.2, scale: 1.035 }, 0)
      .to(
        tearState,
        { progress: 0.025, duration: 0.1, ease: 'power1.inOut', onUpdate: applyTearProgress },
        0,
      )
      .to(
        tearState,
        { progress: 0.08, duration: 0.08, ease: 'power1.in', onUpdate: applyTearProgress },
        0.1,
      )
      .to(
        tearState,
        { progress: 0.86, duration: 0.37, ease: 'power1.inOut', onUpdate: applyTearProgress },
        0.18,
      )
      .to(
        tearState,
        { progress: 1, duration: 0.1, ease: 'power3.in', onUpdate: applyTearProgress },
        0.55,
      )
      .to(
        tearState,
        { progress: 2, duration: 0.2, ease: 'power3.out', onUpdate: applyTearProgress },
        0.65,
      )
      .fromTo(
        cover,
        {
          rotationY: 0,
          rotationZ: 0,
          x: 0,
          y: 0,
          z: 0,
          opacity: 1,
          boxShadow: '0 14px 36px -6px rgba(17, 27, 43, 0.1)',
        },
        {
          rotationY: -82,
          rotationZ: -4,
          x: -140,
          y: -22,
          z: 18,
          opacity: 0,
          boxShadow: '-32px 34px 58px -10px rgba(17, 27, 43, 0.22)',
          duration: 1.08,
          ease: 'power3.inOut',
        },
        0.95,
      )
      .to(
        openingSheet,
        { opacity: 1, y: 0, scale: 1, duration: 0.64, ease: 'power3.out' },
        0.98,
      )
      .to(
        portrait,
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          filter: 'drop-shadow(0 4px 10px rgba(17, 27, 43, 0.08))',
          duration: 0.62,
          ease: 'power3.out',
        },
        1.38,
      )
  })
}

export const turnPage = (
  leavingScene: HTMLElement,
  enteringScene: HTMLElement,
): Promise<void> => {
  const leavingSheet = requiredElement<HTMLElement>(leavingScene, '.scene__inner')
  const enteringSheet = requiredElement<HTMLElement>(enteringScene, '.scene__inner')

  return new Promise((resolve) => {
    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        gsap.set(enteringSheet, { clearProps: 'opacity,transform' })
        resolve()
      },
    })

    timeline
      .set(leavingSheet, { '--page-turn-shading-opacity': 0 }, 0)
      .set(enteringSheet, { opacity: 0.88, y: 6, scale: 0.982 }, 0)
      .fromTo(
        leavingSheet,
        {
          rotationY: 0,
          rotationZ: 0,
          x: 0,
          y: 0,
          z: 0,
          opacity: 1,
          boxShadow: '0 10px 28px -4px rgba(17, 27, 43, 0.07)',
        },
        {
          rotationY: -82,
          rotationZ: -4.5,
          x: -96,
          y: -20,
          z: 18,
          opacity: 0,
          boxShadow: '-28px 28px 52px -10px rgba(17, 27, 43, 0.2)',
          duration: 0.68,
          ease: 'power3.inOut',
        },
        0,
      )
      .to(
        leavingSheet,
        { '--page-turn-shading-opacity': 1, duration: 0.24, ease: 'power2.out' },
        0.06,
      )
      .to(
        leavingSheet,
        { '--page-turn-shading-opacity': 0.42, duration: 0.34, ease: 'power1.inOut' },
        0.3,
      )
      .to(
        enteringSheet,
        { opacity: 1, y: 0, scale: 1, duration: 0.58, ease: 'power3.out' },
        0.08,
      )
  })
}
