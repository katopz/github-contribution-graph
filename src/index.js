function component () {
  var element = document.createElement('div')
  element.innerHTML = 'Hi!!'

  return element
}

document.body.appendChild(component())
