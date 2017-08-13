const GCTooltip = bubbleWidth => {
  const element = document.createElement('span')
  element.id = 'tooltiptext'
  element.className = 'tooltiptext'
  element.innerHTML = '...'
  element.style.visibility = 'hidden'

  element.show = (id, position, data) => {
    element.style.visibility = 'visible'
    element.firstChild.data = data
    element.style.left = `${position.x - bubbleWidth / 2}px`
    element.style.top = `${position.y}px`
    element.target = id
  }

  element.hide = () => {
    element.style.visibility = 'hidden'
    element.target = null
  }

  element.toggle = (id, position, data) => {
    if (element.style.visibility === 'hidden' || element.target !== id) {
      element.show(id, position, data)
    } else {
      element.hide()
    }
  }

  addStyle(bubbleWidth)

  return element
}

const addStyle = bubbleWidth => {
  const css = `
.tooltiptext {
    visibility: hidden;
    font-family:'Helvetica';
    font-size: 0.8em;
    width: ${bubbleWidth}px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 4px;
    border-radius: 6px;
 
    position: absolute;
    z-index: 1;
    pointer-events: none;
}

.tooltiptext::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
}
`
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')

  style.type = 'text/css'
  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }

  head.appendChild(style)
}
export { GCTooltip }
