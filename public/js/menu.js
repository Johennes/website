handleMenuUpdates()

function handleMenuUpdates() {
  let fullMenu = document.querySelector('ul.menu.full')
  if (!fullMenu) {
    console.error('Could not find full menu')
    return
  }

  let collapsedMenu = document.querySelector('ul.menu.collapsed')
  if (!collapsedMenu) {
    console.error('Could not find collapsed menu')
    return
  }

  let rowMenu = document.querySelector('ul.menu.row')
  if (!rowMenu) {
    console.error('Could not find row menu')
    return
  }

  let columnMenu = document.querySelector('ul.menu.column')
  if (!columnMenu) {
    console.error('Could not find column menu')
    return
  }

  let brackets = document.querySelectorAll('ul.menu.collapsed .bracket')
  if (!brackets || !brackets.length) {
    console.error('Could not find brackets in collapsed menu')
    return
  }

  fullMenu.classList.remove('installed')
  rowMenu.classList.add('installed')
  rowMenu.classList.remove('hidden')

  updateMenuVisibility()
  window.addEventListener('resize', updateMenuVisibility)

  collapsedMenu.addEventListener('click', toggleColumnMenu)

  function updateMenuVisibility() {
    if (rowMenu.scrollWidth > rowMenu.clientWidth) {
      collapsedMenu.classList.add('installed')
      rowMenu.classList.add('hidden')
    } else {
      collapsedMenu.classList.remove('installed')
      columnMenu.classList.remove('installed')
      brackets.forEach(bracket => {
        bracket.classList.remove('rotated')
      })
      rowMenu.classList.remove('hidden')
    }
  }

  function toggleColumnMenu() {
    columnMenu.classList.toggle('installed')
    brackets.forEach(bracket => {
      bracket.classList.toggle('rotated')
    })
  }
}
