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

export { handleExportToCss, downloadCssFile }
