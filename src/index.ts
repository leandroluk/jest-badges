#!/usr/bin/env node

import childProcess from 'child_process';
import fs from 'fs';
import https from 'https';
import Joi from 'joi';
import {mkdirp} from 'mkdirp';
import path from 'path';
import packageJson from '../package.json';

/**
 * Will lookup the argument in the cli arguments list and will return a
 * value passed as CLI arg (if found)
 * Otherwise will return default value passed
 */
export const arg = (...names: string[]): string | void => {
  for (const name of names) {
    const index = process.argv.findIndex(argument => argument.match(name));
    if (index >= 0) {
      try {
        return process.argv[index + 1] as string;
      } catch (e) {
        throw new TypeError(`Invalid argument ${name}. ${e}`);
      }
    }
  }
};

/**
 * resolve color based on thresholds
 */
const getColor = (coverage: number): string => {
  if (coverage < args.thresholdDanger) return args.colorDanger;
  if (coverage < args.thresholdWarn) return args.colorWarn;
  return args.colorOk;
};

/**
 * using report value, generate the badge in shields.io
 */
const generateBadgeUrl = (report: Jest.Report, key: keyof Jest.Report['total']) => {
  if (!(report && report.total && report.total[key])) throw new Error('Malformed coverage report');
  const coverage = typeof report.total[key]?.pct === 'number' ? report.total[key].pct : 0;
  const color = getColor(coverage);
  const url = `https://img.shields.io/badge/${args.prefix}${key}-${coverage}%-${color}.svg?style=${args.style}`;
  return encodeURI(url);
};

/**
 * download badge form url
 */
const downloadBadge = (url: string, cb: (err: Error | null, file?: string) => void) => {
  https
    .get(url, res => {
      let file = '';
      res.on('data', chunk => (file += chunk));
      res.on('end', () => cb(null, file));
    })
    .on('error', err => cb(err));
};

const writeBadgeInFolder = (key: string, file: string) => {
  const filePath = `${args.out}/badge-${key}.svg`;
  fs.writeFile(filePath, file, 'utf8', writeError => {
    if (writeError) throw writeError;
  });
};

const getBadgeByKey = (report: Jest.Report) => (key: keyof Jest.Report['total']) => {
  const url = generateBadgeUrl(report, key);
  downloadBadge(url, async (err, file) => {
    if (err) throw err;
    try {
      await mkdirp(args.out);
    } catch (error) {
      console.error(`Could not create output directory "${args.out}"`);
      throw error;
    }
    writeBadgeInFolder(key, file!);
  });
};

/**
 * extract coverage path from jest
 */
const jestShowConfigStr = childProcess.execSync('npx jest --showConfig').toString('utf8');
const jestShowConfigObj: Jest.ShowConfigResult = JSON.parse(jestShowConfigStr);
const coveragePath = jestShowConfigObj.configs.reduce((str, config) => config.coverageDirectory ?? str, '');

/**
 * all the available arguments of the solution
 */
const args: Args = Joi.object<Args>({
  in: Joi.string().default(path.resolve(coveragePath, 'coverage-summary.json')),
  out: Joi.string().default(coveragePath),
  prefix: Joi.string().default('jest:'),
  style: Joi.string().default('flat'),
  colorDanger: Joi.string().default('red'),
  colorWarn: Joi.string().default('yellow'),
  colorOk: Joi.string().default('brightgreen'),
  thresholdDanger: Joi.number().positive().max(99.9).default(80),
  thresholdWarn: Joi.number().positive().max(99.9).default(90),
}).validate({
  in: arg('--in', '-I'),
  out: arg('--out', '-O'),
  prefix: arg('--prefix', '-P'),
  style: arg('--style', '-S'),
  colorDanger: arg('--color-danger', '--colorDanger', '-CD'),
  colorWarn: arg('--color-warn', '--colorWarn', '-CW'),
  colorOk: arg('--color-ok', '--colorOk', '-CO'),
  thresholdDanger: arg('--threshold-danger', '--thresholdDanger', '-TD'),
  thresholdWarn: arg('--threshold-warn', '--thresholdWarn', '-TW'),
}).value;

/**
 * the available keys in reports
 */
const reportKeys: Array<string & keyof Jest.Report['total']> = ['lines', 'statements', 'functions', 'branches'];

/**
 * print args when DEBUG contains the package name
 */
if ((process.env.DEBUG ?? '').includes(packageJson.name)) {
  console.log({argv: process.argv, args});
}

fs.readFile(`${args.in}`, 'utf8', (err, res) => {
  if (err) throw err;
  const report = JSON.parse(res);
  reportKeys.forEach(getBadgeByKey(report));
});
