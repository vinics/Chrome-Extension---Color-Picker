import ColorDefinitionElement from "./ColorDefinitionElement.js"

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
