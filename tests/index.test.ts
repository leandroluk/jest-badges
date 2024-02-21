import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import {rimraf} from 'rimraf';
import rawJestConfig from '../jest.config';
import packageJson from '../package.json';

const jestConfig = JSON.parse(JSON.stringify(rawJestConfig));
const cliPath = path.resolve(process.cwd(), packageJson.bin);
const jestCoveragePath = path.resolve(jestConfig.coverageDirectory);
const customPath = path.resolve(process.cwd(), '.tmp', 'badges');
const coverageSummary = {
  total: {
    lines: {pct: 100},
    statements: {pct: 95},
    functions: {pct: 85},
    branches: {pct: 75},
  },
};
const spawnSyncOpts: any = {
  stdio: 'inherit',
  env: {...process.env, DEBUG: packageJson.name},
};

const createCoverageSummaryFile = async (badgePath = jestCoveragePath): Promise<[string, string]> => {
  await rimraf(badgePath);
  const coverageSummaryPath = path.resolve(badgePath, 'coverage-summary.json');
  fs.mkdirSync(badgePath, {recursive: true});
  fs.writeFileSync(coverageSummaryPath, JSON.stringify(coverageSummary));
  return [badgePath, coverageSummaryPath];
};

describe('validate badge generation', () => {
  it("should render inner coverage directory when don't pass any config", async () => {
    // arrange
    const [badgePath] = await createCoverageSummaryFile();
    const args = [cliPath];
    // act
    const result = childProcess.spawnSync('node', args, spawnSyncOpts);
    const files = await fs.promises.readdir(badgePath);
    // assert
    const expected = {
      'badge-branches.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:branches: 75%"><title>jest:branches: 75%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="#e05d44"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:branches</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:branches</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">75%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="250">75%</text></g></svg>',
      'badge-functions.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:functions: 85%"><title>jest:functions: 85%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="#dfb317"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:functions</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:functions</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">85%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="250">85%</text></g></svg>',
      'badge-lines.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="104" height="20" role="img" aria-label="jest:lines: 100%"><title>jest:lines: 100%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="104" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="61" height="20" fill="#555"/><rect x="61" width="43" height="20" fill="#4c1"/><rect width="104" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="315" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">jest:lines</text><text x="315" y="140" transform="scale(.1)" fill="#fff" textLength="510">jest:lines</text><text aria-hidden="true" x="815" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="330">100%</text><text x="815" y="140" transform="scale(.1)" fill="#fff" textLength="330">100%</text></g></svg>',
      'badge-statements.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="20" role="img" aria-label="jest:statements: 95%"><title>jest:statements: 95%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="132" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="97" height="20" fill="#555"/><rect x="97" width="35" height="20" fill="#4c1"/><rect width="132" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="495" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="870">jest:statements</text><text x="495" y="140" transform="scale(.1)" fill="#fff" textLength="870">jest:statements</text><text aria-hidden="true" x="1135" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">95%</text><text x="1135" y="140" transform="scale(.1)" fill="#fff" textLength="250">95%</text></g></svg>',
    };
    expect(result.status).toBe(0);
    for (const [name, content] of Object.entries(expected)) {
      expect(files.includes(name)).toBeTruthy();
      expect(fs.readFileSync(path.resolve(jestCoveragePath, name), 'utf8')).toBe(content);
    }
  });

  it.each`
    argIn     | argOut
    ${'--in'} | ${'--out'}
    ${'-I'}   | ${'-O'}
  `("should render with prop '$argIn' as input and '$argOut' as output", async ({argIn, argOut}) => {
    // arrange
    const [badgePath, coverageSummaryPath] = await createCoverageSummaryFile(customPath);
    const args = [cliPath, argIn, coverageSummaryPath, argOut, badgePath];
    // act
    const result = childProcess.spawnSync('node', args, spawnSyncOpts);
    const files = await fs.promises.readdir(badgePath);
    // assert
    const expected = {
      'badge-branches.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:branches: 75%"><title>jest:branches: 75%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="#e05d44"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:branches</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:branches</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">75%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="250">75%</text></g></svg>',
      'badge-functions.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:functions: 85%"><title>jest:functions: 85%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="#dfb317"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:functions</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:functions</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">85%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="250">85%</text></g></svg>',
      'badge-lines.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="104" height="20" role="img" aria-label="jest:lines: 100%"><title>jest:lines: 100%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="104" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="61" height="20" fill="#555"/><rect x="61" width="43" height="20" fill="#4c1"/><rect width="104" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="315" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">jest:lines</text><text x="315" y="140" transform="scale(.1)" fill="#fff" textLength="510">jest:lines</text><text aria-hidden="true" x="815" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="330">100%</text><text x="815" y="140" transform="scale(.1)" fill="#fff" textLength="330">100%</text></g></svg>',
      'badge-statements.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="20" role="img" aria-label="jest:statements: 95%"><title>jest:statements: 95%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="132" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="97" height="20" fill="#555"/><rect x="97" width="35" height="20" fill="#4c1"/><rect width="132" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="495" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="870">jest:statements</text><text x="495" y="140" transform="scale(.1)" fill="#fff" textLength="870">jest:statements</text><text aria-hidden="true" x="1135" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">95%</text><text x="1135" y="140" transform="scale(.1)" fill="#fff" textLength="250">95%</text></g></svg>',
    };
    expect(result.status).toBe(0);
    for (const [name, content] of Object.entries(expected)) {
      expect(files.includes(name)).toBeTruthy();
      expect(fs.readFileSync(path.resolve(badgePath, name), 'utf8')).toBe(content);
    }
  });

  it.each`
    argPrefix
    ${'--prefix'}
    ${'-P'}
  `("should render with prop '$argPrefix' as 'custom:' prefix", async ({argPrefix}) => {
    // arrange
    const [badgePath] = await createCoverageSummaryFile();
    const args = [cliPath, argPrefix, 'custom:'];
    // act
    const result = childProcess.spawnSync('node', args, spawnSyncOpts);
    const files = await fs.promises.readdir(badgePath);
    // assert
    const expected = {
      'badge-branches.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="140" height="20" role="img" aria-label="custom:branches: 75%"><title>custom:branches: 75%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="140" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="105" height="20" fill="#555"/><rect x="105" width="35" height="20" fill="#e05d44"/><rect width="140" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="535" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="950">custom:branches</text><text x="535" y="140" transform="scale(.1)" fill="#fff" textLength="950">custom:branches</text><text aria-hidden="true" x="1215" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">75%</text><text x="1215" y="140" transform="scale(.1)" fill="#fff" textLength="250">75%</text></g></svg>',
      'badge-functions.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="140" height="20" role="img" aria-label="custom:functions: 85%"><title>custom:functions: 85%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="140" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="105" height="20" fill="#555"/><rect x="105" width="35" height="20" fill="#dfb317"/><rect width="140" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="535" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="950">custom:functions</text><text x="535" y="140" transform="scale(.1)" fill="#fff" textLength="950">custom:functions</text><text aria-hidden="true" x="1215" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">85%</text><text x="1215" y="140" transform="scale(.1)" fill="#fff" textLength="250">85%</text></g></svg>',
      'badge-lines.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="124" height="20" role="img" aria-label="custom:lines: 100%"><title>custom:lines: 100%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="124" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="81" height="20" fill="#555"/><rect x="81" width="43" height="20" fill="#4c1"/><rect width="124" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="415" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="710">custom:lines</text><text x="415" y="140" transform="scale(.1)" fill="#fff" textLength="710">custom:lines</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="330">100%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="330">100%</text></g></svg>',
      'badge-statements.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="152" height="20" role="img" aria-label="custom:statements: 95%"><title>custom:statements: 95%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="152" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="117" height="20" fill="#555"/><rect x="117" width="35" height="20" fill="#4c1"/><rect width="152" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="595" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="1070">custom:statements</text><text x="595" y="140" transform="scale(.1)" fill="#fff" textLength="1070">custom:statements</text><text aria-hidden="true" x="1335" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">95%</text><text x="1335" y="140" transform="scale(.1)" fill="#fff" textLength="250">95%</text></g></svg>',
    };
    expect(result.status).toBe(0);
    for (const [name, content] of Object.entries(expected)) {
      expect(files.includes(name)).toBeTruthy();
      expect(fs.readFileSync(path.resolve(badgePath, name), 'utf8')).toBe(content);
    }
  });

  it.each`
    argStyle
    ${'--style'}
    ${'-S'}
  `("should render with prop '$argStyle' as 'plastic' style", async ({argStyle}) => {
    // arrange
    const [badgePath] = await createCoverageSummaryFile();
    const args = [cliPath, argStyle, 'plastic'];
    // act
    const result = childProcess.spawnSync('node', args, spawnSyncOpts);
    const files = await fs.promises.readdir(badgePath);
    // assert
    const expected = {
      'badge-branches.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:branches: 75%"><title>jest:branches: 75%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="#e05d44"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:branches</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:branches</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">75%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="250">75%</text></g></svg>',
      'badge-functions.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:functions: 85%"><title>jest:functions: 85%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="#dfb317"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:functions</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:functions</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">85%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="250">85%</text></g></svg>',
      'badge-lines.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="104" height="20" role="img" aria-label="jest:lines: 100%"><title>jest:lines: 100%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="104" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="61" height="20" fill="#555"/><rect x="61" width="43" height="20" fill="#4c1"/><rect width="104" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="315" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">jest:lines</text><text x="315" y="140" transform="scale(.1)" fill="#fff" textLength="510">jest:lines</text><text aria-hidden="true" x="815" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="330">100%</text><text x="815" y="140" transform="scale(.1)" fill="#fff" textLength="330">100%</text></g></svg>',
      'badge-statements.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="20" role="img" aria-label="jest:statements: 95%"><title>jest:statements: 95%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="132" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="97" height="20" fill="#555"/><rect x="97" width="35" height="20" fill="#4c1"/><rect width="132" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="495" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="870">jest:statements</text><text x="495" y="140" transform="scale(.1)" fill="#fff" textLength="870">jest:statements</text><text aria-hidden="true" x="1135" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">95%</text><text x="1135" y="140" transform="scale(.1)" fill="#fff" textLength="250">95%</text></g></svg>',
    };
    expect(result.status).toBe(0);
    for (const [name, content] of Object.entries(expected)) {
      expect(files.includes(name)).toBeTruthy();
      expect(fs.readFileSync(path.resolve(badgePath, name), 'utf8')).toBe(content);
    }
  });

  it.each`
    danger              | warn              | ok
    ${'--color-danger'} | ${'--color-warn'} | ${'--color-ok'}
    ${'--colorDanger'}  | ${'--colorWarn'}  | ${'--colorOk'}
    ${'-CD'}            | ${'-CW'}          | ${'-CO'}
  `("should render with props '$danger', '$warn', '$ok' as 'pink'", async ({danger, warn, ok}) => {
    // arrange
    const [badgePath] = await createCoverageSummaryFile();
    const color = 'pink';
    const args = [cliPath, danger, color, warn, color, ok, color];
    // act
    const result = childProcess.spawnSync('node', args, spawnSyncOpts);
    const files = await fs.promises.readdir(badgePath);
    // assert
    const expected = {
      'badge-branches.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:branches: 75%"><title>jest:branches: 75%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="pink"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:branches</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:branches</text><text aria-hidden="true" x="1015" y="150" fill="#ccc" fill-opacity=".3" transform="scale(.1)" textLength="250">75%</text><text x="1015" y="140" transform="scale(.1)" fill="#333" textLength="250">75%</text></g></svg>',
      'badge-functions.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:functions: 85%"><title>jest:functions: 85%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="pink"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:functions</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:functions</text><text aria-hidden="true" x="1015" y="150" fill="#ccc" fill-opacity=".3" transform="scale(.1)" textLength="250">85%</text><text x="1015" y="140" transform="scale(.1)" fill="#333" textLength="250">85%</text></g></svg>',
      'badge-lines.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="104" height="20" role="img" aria-label="jest:lines: 100%"><title>jest:lines: 100%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="104" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="61" height="20" fill="#555"/><rect x="61" width="43" height="20" fill="pink"/><rect width="104" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="315" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">jest:lines</text><text x="315" y="140" transform="scale(.1)" fill="#fff" textLength="510">jest:lines</text><text aria-hidden="true" x="815" y="150" fill="#ccc" fill-opacity=".3" transform="scale(.1)" textLength="330">100%</text><text x="815" y="140" transform="scale(.1)" fill="#333" textLength="330">100%</text></g></svg>',
      'badge-statements.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="20" role="img" aria-label="jest:statements: 95%"><title>jest:statements: 95%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="132" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="97" height="20" fill="#555"/><rect x="97" width="35" height="20" fill="pink"/><rect width="132" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="495" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="870">jest:statements</text><text x="495" y="140" transform="scale(.1)" fill="#fff" textLength="870">jest:statements</text><text aria-hidden="true" x="1135" y="150" fill="#ccc" fill-opacity=".3" transform="scale(.1)" textLength="250">95%</text><text x="1135" y="140" transform="scale(.1)" fill="#333" textLength="250">95%</text></g></svg>',
    };
    expect(result.status).toBe(0);
    for (const [name, content] of Object.entries(expected)) {
      expect(files.includes(name)).toBeTruthy();
      expect(fs.readFileSync(path.resolve(badgePath, name), 'utf8')).toBe(content);
    }
  });

  it.each`
    danger                  | warn
    ${'--threshold-danger'} | ${'--threshold-warn'}
    ${'--thresholdDanger'}  | ${'--thresholdWarn'}
    ${'-TD'}                | ${'-TW'}
  `("should render with props '$danger', '$warn' as 86 and 96", async ({danger, warn}) => {
    // arrange
    const [badgePath] = await createCoverageSummaryFile();
    const args = [cliPath, danger, 86, warn, 96];
    // act
    const result = childProcess.spawnSync('node', args, spawnSyncOpts);
    const files = await fs.promises.readdir(badgePath);
    // assert
    const expected = {
      'badge-branches.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:branches: 75%"><title>jest:branches: 75%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="#e05d44"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:branches</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:branches</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">75%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="250">75%</text></g></svg>',
      'badge-functions.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" height="20" role="img" aria-label="jest:functions: 85%"><title>jest:functions: 85%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="120" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="20" fill="#555"/><rect x="85" width="35" height="20" fill="#e05d44"/><rect width="120" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest:functions</text><text x="435" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest:functions</text><text aria-hidden="true" x="1015" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">85%</text><text x="1015" y="140" transform="scale(.1)" fill="#fff" textLength="250">85%</text></g></svg>',
      'badge-lines.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="104" height="20" role="img" aria-label="jest:lines: 100%"><title>jest:lines: 100%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="104" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="61" height="20" fill="#555"/><rect x="61" width="43" height="20" fill="#4c1"/><rect width="104" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="315" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">jest:lines</text><text x="315" y="140" transform="scale(.1)" fill="#fff" textLength="510">jest:lines</text><text aria-hidden="true" x="815" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="330">100%</text><text x="815" y="140" transform="scale(.1)" fill="#fff" textLength="330">100%</text></g></svg>',
      'badge-statements.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="132" height="20" role="img" aria-label="jest:statements: 95%"><title>jest:statements: 95%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="132" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="97" height="20" fill="#555"/><rect x="97" width="35" height="20" fill="#dfb317"/><rect width="132" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="495" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="870">jest:statements</text><text x="495" y="140" transform="scale(.1)" fill="#fff" textLength="870">jest:statements</text><text aria-hidden="true" x="1135" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">95%</text><text x="1135" y="140" transform="scale(.1)" fill="#fff" textLength="250">95%</text></g></svg>',
    };
    expect(result.status).toBe(0);
    for (const [name, content] of Object.entries(expected)) {
      expect(files.includes(name)).toBeTruthy();
      expect(fs.readFileSync(path.resolve(badgePath, name), 'utf8')).toBe(content);
    }
  });
});
