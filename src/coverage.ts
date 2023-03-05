import * as core from '@actions/core';

function ab2str(buf: any): string {
  return String.fromCharCode.apply(null, buf);
}

function ExtractCoverage(lines: string[]): number | null {
  const header = '| Total   |';
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith(header)) {
      return extractCoverageFromLine(line);
    }
    i++;
  }
  return null;
}

function extractCoverageFromLine(line: string): number {
  const columns: string[] = line.split('|').filter(e => e);
  const linecol: string = columns[1].trim().replace('%', '').replace(',', '.');
  const cd: number = parseFloat(linecol);
  return cd;
}

export function assertCoverageThreshold(buffer: any, thresholdstring: string): void {
  const dotnetOutput: string = ab2str(buffer);
  console.log(`Checking threshold ${thresholdstring}`);
  console.log(dotnetOutput);
  const coverage: number | null = ExtractCoverage(dotnetOutput.split('\n'));
  if (coverage !== null && coverage !== undefined) {
    if (coverage < parseFloat(thresholdstring)) {
      core.setFailed(`coverage level too low : ${coverage} % , expecting ${thresholdstring} %`);
    }
  }
}
