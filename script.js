const form = document.querySelector('form')
const inputColor = document.querySelector('#inputColor')
const container = document.querySelector('.container')
const btnExport = document.querySelector('.btnExport')

function handleExportToCss() {
  let colorCollection = []

  // Read color collection from storage
    chrome.storage.local.get([`chromeExtensionColorPicker`], (result) => {

      // Guard against no data saved on storage
      if (result.chromeExtensionColorPicker) {
        colorCollection = JSON.parse(result.chromeExtensionColorPicker)
      }

      // Transpile to css variables
      const cssRootHeader = '\:root {\n'

      let cssRootVariables = ''
      colorCollection.forEach(colorEntry => {
        cssRootVariables += `\t--${colorEntry.label.replace(' ', '-')}: ${colorEntry.color};\n`
      })

      const cssRootFooter = '\n\}'

      const cssFileContent = cssRootHeader + cssRootVariables + cssRootFooter

      // Download a file
      downloadCssFile(cssFileContent)
    })
}

function downloadCssFile(fileContent) {
  let url = 'colors.css'

  const downloadAnchorTag = document.createElement('a')
  downloadAnchorTag.href = 'data:text/plain;charset=UTF-8,' + '' + fileContent

  downloadAnchorTag.download = url.substr(url.lastIndexOf('/') + 1)
  document.body.appendChild(downloadAnchorTag)
  downloadAnchorTag.click()
  document.body.removeChild(downloadAnchorTag)
}

btnExport.addEventListener('click', handleExportToCss)

let counter = 1

class ColorDefinitionElement {
  htmlElement = undefined

  constructor(color, label, index) {
    // Save color
    this.color = color

    // Create child div showing the color saved
    const colorDefinitionDiv = document.createElement('div')
    colorDefinitionDiv.classList.add('colorViewer')
    colorDefinitionDiv.style.backgroundColor = color

    // Create child text to show the color title
    const colorDefinitionLabel = document.createElement('span')
    colorDefinitionLabel.classList.add('colorText')
    colorDefinitionLabel.textContent = label ? label : `color ${index}`
    colorDefinitionLabel.addEventListener('click', this.handleColorLabelClick)

    // Add delete button
    const colorDefinitionDelete = document.createElement('button')
    colorDefinitionDelete.addEventListener('click', this.handleDelete)
    colorDefinitionDelete.classList.add('material-symbols-outlined')
    colorDefinitionDelete.classList.add('btnDelete')
    colorDefinitionDelete.innerHTML = 'delete'
    colorDefinitionDelete.dataset.label = label ? label : `color ${index}`

    // Create parent element and append all child elements
    const colorDefinitionContainer = document.createElement('div')
    colorDefinitionContainer.classList.add('colorContainer')
    colorDefinitionContainer.appendChild(colorDefinitionDiv)
    colorDefinitionContainer.appendChild(colorDefinitionLabel)
    colorDefinitionContainer.appendChild(colorDefinitionDelete)

    this.htmlElement = colorDefinitionContainer
  }

  getDataObj() {
    return {
      color: this.htmlElement.children[0].style.backgroundColor,
      label: this.htmlElement.children[1].textContent
    }
  }

  handleDelete(clickEvent) {
    // Get color label
    const colorLabel = clickEvent.target.parentElement.children[1].textContent

    // Remove element from storage
    let colorCollection = []
    chrome.storage.local.get([`chromeExtensionColorPicker`], (result) => {

      if (result.chromeExtensionColorPicker) {
        colorCollection = JSON.parse(result.chromeExtensionColorPicker)
      }

      const updatedCollection = colorCollection.filter(colorEntry => colorEntry.label !== colorLabel)

      chrome.storage.local.set({ chromeExtensionColorPicker: JSON.stringify(updatedCollection) })
    })

    // Remove item from UI
    for (const element of container.children) {
      if (element.children[1].textContent == colorLabel) {
        container.removeChild(element)
      }
    }

    if (container.children.length === 0 && !btnExport.classList.contains('btnDisabled')) {
      btnExport.classList.add('btnDisabled')
    }
  }

  handleColorLabelClick(clickEvent) {
    // Get new label text
    const newLabel = window.prompt('Label name: ')

    // Check if the name is unique
    let colorCollection = []
    chrome.storage.local.get([`chromeExtensionColorPicker`], (result) => {

      if (result.chromeExtensionColorPicker) {
        colorCollection = JSON.parse(result.chromeExtensionColorPicker)
      }

      if (colorCollection.some(colorEntry => colorEntry.label == newLabel)) {
        alert('Label already in use')
        console.error(`Unable to set label ${newLabel}. Already in use.`)
        return
      }

      // Find and replace color entry on color collection
      const colorEntryTarget = colorCollection.find(colorEntry => colorEntry.label == clickEvent.target.innerText)
      colorEntryTarget.label = newLabel

      // Change color label
      clickEvent.target.innerText = newLabel

      // Update color collection on storage
      chrome.storage.local.set({ chromeExtensionColorPicker: JSON.stringify(colorCollection) })
    })
  }

}

// Load saved colors
function extensionLoad() {
  // Clear current content of container element
  container.innerHTML = ''

  // Load all colors saved so far on the current work
  chrome.storage.local.get([`chromeExtensionColorPicker`], (result) => {

    if (!result.chromeExtensionColorPicker) {
      if (!btnExport.classList.contains('btnDisabled')) {
        btnExport.classList.add('btnDisabled')
      }
      return
    }


    if (btnExport.classList.contains('btnDisabled')) {
      btnExport.classList.remove('btnDisabled')
    }

    const colorCollection = JSON.parse(result.chromeExtensionColorPicker)

    if (colorCollection.length === 0) {
      if (!btnExport.classList.contains('btnDisabled')) {
        btnExport.classList.add('btnDisabled')
      }
    }

    colorCollection.forEach(colorEntry => {
      const element = new ColorDefinitionElement(colorEntry.color, colorEntry.label)
      container.appendChild(element.htmlElement)
    })

  })
}

// Execute the load function
extensionLoad()


// Save a new color
form.addEventListener('submit', (event) => {
  // Avoid submit event from Form element default behavior
  event.preventDefault()

  chrome.storage.local.get([`chromeExtensionColorPicker`], (result) => {
    // Create new color definition element
    const colorEntry = new ColorDefinitionElement(inputColor.value, undefined, counter)
    counter++

    // Check if the element was empty and enables the Export button
    if (btnExport.classList.contains('btnDisabled')) {
      btnExport.classList.remove('btnDisabled')
    }

    // Append new element on popup view (index.html)
    container.appendChild(colorEntry.htmlElement)

    // Read current color collection on storage
    let colorCollectionString = result.chromeExtensionColorPicker

    // Guard in case there is no previous color stored
    if (!colorCollectionString) colorCollectionString = '[]'

    // Save new color entry on storage
    const colorCollection = JSON.parse(colorCollectionString)
    colorCollection.push(colorEntry.getDataObj())
    chrome.storage.local.set({ chromeExtensionColorPicker: JSON.stringify(colorCollection) })
  })
})
