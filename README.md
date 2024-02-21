# jest-badges
An evolution of library jest-coverage-badges, adding lots of options and improvements

Create a group of coverage badge

[![License][license-image]][license-url]
[![npm](https://img.shields.io/npm/dw/jest-badges.svg)](https://www.npmjs.com/package/jest-badges)

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/jest-coverage-badges.svg

Creates a group of code coverage badges like the following:

![Coverage badge gree][coverage-badge-green] ![Coverage badge gree][coverage-badge-yellow] ![Coverage badge gree][coverage-badge-red]

[coverage-badge-green]: https://img.shields.io/badge/Coverage-100%25-brightgreen.svg
[coverage-badge-yellow]: https://img.shields.io/badge/Coverage-100%25-yellow.svg
[coverage-badge-red]: https://img.shields.io/badge/Coverage-100%25-red.svg

Currently just reads from Istanbul's JSON summary reporter and downloads a badge from https://shields.io/ for each jest coverage type (`statement`, `branch`, `functions`, `lines`). Like this:

![Coverage lines](https://img.shields.io/badge/jest:lines-100-green.svg)
![Coverage functions](https://img.shields.io/badge/jest:functions-100-green.svg)
![Coverage branches](https://img.shields.io/badge/jest:branches-100-green.svg)
![Coverage statements](https://img.shields.io/badge/jest:statements-100-green.svg)


*This package is an extension of [jest-coverage-badges], but this one creates all the types of coverage and able to use new variations based on [shields.io](https://shields.io)

[jest-coverage-badges]:https://www.npmjs.com/package/jest-coverage-badges


## Usage

1. Install `jest-badges` in your project or global

      *Project* (in your project folder):

      ```npm install --save jest-badges```

      *Global*:

      ```npm install --global jest-badges```


2. Configure Jest (in `package.json`):

      _(optional: "text" and "lcov")_

    ```json
    "jest": {
      "coverageReporters": [
        "json-summary", 
        "text",
        "lcov"
      ]
    }
    ```

    If you installed in your project, you can create a script to run it, for example:


    ```json
    "scripts": {
      "test:coverage": "npm test -- --coverage",
      "test:badges": "npm run test:coverage  && jest-badges"
    }
    ```


2. Run `npm test -- --coverage`

3. Run `jest-badges` (or just run: `npm run test:badges`)

    Resulting in badges:
    - `./coverage/badge-statements.svg`
    - `./coverage/badge-lines.svg`
    - `./coverage/badge-functions.svg`
    - `./coverage/badge-branches.svg`

#### CLI Options

| Arg | Alias | Default Value | Info |
| --- | --- | --- | --- |
| `--in` | `-I` | `<rootDir>/coverage/coverage-summary.json` | Refer to `coverage-summary.json` file, defined as default in jest config file. Example: <br/> <br/> `$ npx jest-badges --in "./cov"`|
| `--out` | `-O` | `<rootDir>/coverage` | Refer to coverage directory, defined in jest config file. Example <br/> <br/> `$ npx jest-badges --out "./badges"` |
| `--prefix` | `-P` | `jest:` | Refers to prefix before the badge key value. Example <br/> <br/> `$ npm jest-badges --prefix "example:"` |
| `--style` | `-S` | `flat` | Refers to available styles in [shields.io](https://shields.io/badges).<br/> <br/> Available options: <br/>&nbsp;&nbsp;• `flat`<br/>&nbsp;&nbsp;• `flat-square`<br/>&nbsp;&nbsp;• `plastic`<br/>&nbsp;&nbsp;• `social` <br/><br/>  Examples:<br/> <br/> `$ npx jest-badges --style "flat"` |
| `--color-danger` | `--colorDanger` <br/> `-CD` | ![](https://img.shields.io/badge/red-red?style=flat-square) | Refers to the color when the coverage is in danger. Example <br/> <br/> `$ npm jest-badges --color-danger "pink"` |
| `--color-warn` | `--colorWarn` <br/> `-CW` | ![](https://img.shields.io/badge/yellow-yellow?style=flat-square) | Refers to the color when the coverage is in warning. Example <br/> <br/> `$ npm jest-badges --color-warn "pink"` |
| `--color-ok` | `--colorOk` <br/> `-CO` | ![](https://img.shields.io/badge/brightgreen-brightgreen?style=flat-square) | Refers to the color when the coverage are ok. Example <br/> <br/> `$ npm jest-badges --color-ok "pink"` | 
| `--threshold-danger` | `--thresholdDanger` <br/> `-TD` | `80` | The value of threshold as danger of coverage. Example <br/> <br/> `$ npm jest-badges --threshold-danger 50` |
| `--threshold-warn` | `--thresholdWarn` <br/> `-TW` | `90` | The value of threshold as warning of coverage. Example <br/> <br/> `$ npm jest-badges --threshold-warn 50` |

**Example**:    
  ```$ jest-coverage-badges --input "./cov" --output "./badges"```     


After this you can add into Github readme (for example) :smiley:

## Why use this package?

We have great companies like coveralls and codecov, but it's paid for private repositories. If this package we can add badges in our readme by creating the badges (this can be run at your build, upload to a store and consume in the readme or the website).


## Author of adaptation of (jest-coverage-badges)

© 2023 **[Fork and maintainer]** Michael Rodov (rodov.michael@gmail.com)

© 2018 **[Main Author of Adaptations]** Pamela Peixinho <git@pamepeixinho.com> (https://pamepeixinho.github.io)
