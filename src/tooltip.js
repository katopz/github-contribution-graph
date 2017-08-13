const CGTooltip = () => {
  const element = document.createElement('span')
  element.id = 'tooltiptext'
  element.className = 'tooltiptext'
  element.innerHTML = 'Hi@!'

  element.show = (e, data) => {
    element.style.visibility = 'visible'
    element.firstChild.data = data
    element.style.left = `${e.clientX - 64}px`
    element.style.top = `${e.clientY - 48}px`
  }

  element.hide = e => {
    element.style.visibility = 'hidden'
  }

  return element
}

const css = `
.tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
}

.tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
 
    position: absolute;
    z-index: 1;
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
export { CGTooltip }
