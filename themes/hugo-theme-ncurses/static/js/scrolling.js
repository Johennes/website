document.addEventListener("DOMContentLoaded", (event) => {
  handleScollIndicatorUpdates()
})

function handleScollIndicatorUpdates() {
  let containers = document.querySelectorAll('.scrollable-sticky')
  if (!containers || containers.length !== 2) {
    console.error('Could not find scroll indicator containers')
    return
  }

  let scrollUpIndicator = document.querySelector('.scroll-indicator.up')
  if (!scrollUpIndicator) {
    console.error('Could not find scroll-up indicator')
    return
  }

  let scrollDownIndicator = document.querySelector('.scroll-indicator.down')
  if (!scrollDownIndicator) {
    console.error('Could not find scroll-down indicator')
    return
  }

  containers.forEach(container => {
    container.classList.add('sticky')
  })

  let scrollUpIndicatorVisible = false
  let scrollDownIndicatorVisible = false

  updateScrollIndicatorVisibility()
  window.addEventListener('scroll', updateScrollIndicatorVisibility)
  window.addEventListener('resize', updateScrollIndicatorVisibility)

  function updateScrollIndicatorVisibility() {
    if (scrollDownIndicator.getBoundingClientRect().bottom === document.documentElement.clientHeight) {
      if (!scrollDownIndicatorVisible) {
        scrollDownIndicator.classList.remove('hidden')
        scrollDownIndicatorVisible = true
      }
    } else if (scrollDownIndicatorVisible) {
      scrollDownIndicator.classList.add('hidden')
      scrollDownIndicatorVisible = false
    }

    if (scrollUpIndicator.getBoundingClientRect().top === 0) {
      if (!scrollUpIndicatorVisible) {
        scrollUpIndicator.classList.remove('hidden')
        scrollUpIndicatorVisible = true
      }
    } else if (scrollUpIndicatorVisible) {
      scrollUpIndicator.classList.add('hidden')
      scrollUpIndicatorVisible = false
    }
  }
}
