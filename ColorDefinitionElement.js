import { form, inputColor, container, btnExport } from './domAssets.js'
import { handleDelete } from './appFunctions.js'

class ColorDefinitionElement {
  htmlElement = undefined

  constructor(color, label, index) {
    // Save color
    this.color = color

    // Create child div showing the color saved
    const colorDefinitionDiv = document.createElement('div')
    colorDefinitionDiv.classList.add('colorViewer')
    colorDefinitionDiv.style.backgroundColor = color
    colorDefinitionDiv.title = color

    // Create child text to show the color title
    const colorDefinitionLabel = document.createElement('span')
    colorDefinitionLabel.classList.add('colorText')
    colorDefinitionLabel.textContent = label ? label : `color ${index}`
    colorDefinitionLabel.addEventListener('click', this.handleColorLabelClick)

    // Add delete button
    const colorDefinitionDelete = document.createElement('button')
    colorDefinitionDelete.addEventListener('click', handleDelete)
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

}

export default ColorDefinitionElement

