JSON-UI-Builder
===============

A small totally self contained Java Script class that generates HTML from JSON notation

All you need is a JSON array containing the descriptions of the lements you wish to be rendered on page.

===Dictionary
- *tg*: tag of the element (the default is 'div')
  example: {tg: 'span'}
- *id*: id of the element
  example: {id: 'foo'}
- *cl*: array of element classes
  example: {cl: ['foo', 'bar']}
- *ar*: an object containing element attributes
  example: {ar: {type: 'checkbox', checked: true}}
- *dt*: data attribute
  example: {dt: 'foo'}
- *tx*: text inside the container
  example: {tx: 'Some text'}
- *ac*: object containing element actions, such as onClick, etc
  example: {ac: {onClick: function(e){return false;}}}
- *cn*: array of element children
  example: {cn: [{tg:'input'}]}

===Examples

