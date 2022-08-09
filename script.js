import ColorDefinitionElement from "./ColorDefinitionElement.js"
import extensionLoad from "./extensionLoad.js"
import { form, inputColor, container, btnExport } from './domAssets.js'
import { handleExportToCss } from './appFunctions.js'


btnExport.addEventListener('click', handleExportToCss)

let counter = 1

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
