# atom-calca package

Open-source symbolic calculator for your [Atom][atom] editor with
Markdown capabilities, inspired by [Calca][calca].

![atom-calca screencast demo gif][screencast]

## Install

Install `atom-calca` either in Atom's Preferences/Install Packages, or with
`apm` on the command-line:

```sh
apm install atom-calca
```

## Features

The calca parser works currently only on `.calca` files in Markdown code blocks.
It also uses `language-ghm` grammar to do Markdown syntax highlighting.

Check the [examples/test.calca](examples/test.calca) file for working examples.

## License

MIT. Read the [LICENSE.md](./LICENSE.md) for more info.

[atom]:       http://atom.io   "Atom Editor"
[calca]:      http://calca.io/ "Calca Symbolic Editor"
[screencast]: http://i.imgur.com/jXlaHwY.gif "atom-calca screencast demo gif"
