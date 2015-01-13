JSON-UI-Builder
===============

A small totally self contained Java Script class that generates HTML from JSON notation

All you need is a JSON array containing the descriptions of the lements you wish to be rendered on page.

###Dictionary
- **tg**: tag of the element (the default is 'div')
```js
  {tg: 'span'}
```
- **id**: id of the element
```js
  example: {id: 'foo'}
```
- **cl**: array of element classes
```js
  {cl: ['foo', 'bar']}
```
- **ar**: an object containing element attributes
```js
  {ar: {type: 'checkbox', checked: true}}
```
- **dt**: data attribute
```js
  {dt: 'foo'}
```
- **tx**: text inside the container
```js
  {tx: 'Some text'}
```
- **ac**: object containing element actions, such as onClick, etc
```js
  {ac: {onClick: function(e){return false;}}}
```
- **cn**: array of element children
```js
  {cn: [{tg:'input'}]}
```
