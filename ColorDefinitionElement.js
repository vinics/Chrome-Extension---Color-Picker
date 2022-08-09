
class ColorDefinitionElement {
  htmlElement = undefined

  constructor({ color, index, label, handleColorLabelChange, handleColorDelete}) {
    // Save color
    this.color = color

    // Save handlers
    this.handleColorLabelChange = handleColorLabelChange ?? (() => {})
    this.handleColorDelete = handleColorDelete ?? (() => {})

    // Create child div showing the color saved
    const colorDefinitionDiv = document.createElement('div')
    colorDefinitionDiv.classList.add('colorViewer')
    colorDefinitionDiv.style.backgroundColor = color
    colorDefinitionDiv.title = color

    // Create child text to show the color title
    const colorDefinitionLabel = document.createElement('span')
    colorDefinitionLabel.classList.add('colorText')
    colorDefinitionLabel.textContent = label ? label : `color ${index}`
    colorDefinitionLabel.addEventListener('click', this.handleColorLabelChange)

    // Add delete button
    const colorDefinitionDelete = document.createElement('button')
    colorDefinitionDelete.addEventListener('click', this.handleColorDelete)
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
}

export default ColorDefinitionElement

