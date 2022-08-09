import ColorDefinitionElement from "./ColorDefinitionElement.js"
import { inputColor, container, btnExport } from './domAssets.js'

// Global variable to provide a sequencial (unique) numbering to new color entries
let counter = 1

function downloadCssFile(fileContent) {
  let url = 'colors.css'

  const downloadAnchorTag = document.createElement('a')
  downloadAnchorTag.href = 'data:text/plain;charset=UTF-8,' + '' + fileContent

  downloadAnchorTag.download = url.substr(url.lastIndexOf('/') + 1)
  document.body.appendChild(downloadAnchorTag)
  downloadAnchorTag.click()
  document.body.removeChild(downloadAnchorTag)
}

function handleColorLabelChange(clickEvent) {
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
      console.log(`Unable to set label ${newLabel}. Already in use.`)
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

function handleColorDelete(clickEvent) {
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

function handleNewColorEntry(event) {
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
}

export { handleColorLabelChange, handleColorDelete, handleExportToCss, handleNewColorEntry }
