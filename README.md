# `exportgen`

Generate an `index.js` file for each directory in a module containing `.js` files (with optional exclude-lists).

## Installation

```sh
npm i -D exportgen
```

## Usage

### `package.json`

```json
{
    "name": "example",
    "version": "1.0.0",
    "scripts": {
        "exportgen": "exportgen . bin"
    },
    "devDependencies": {
        "exportgen": "0.0.0"
    }
}
```

### Command

```sh
npm run exportgen
```
