import * as core from '@actions/core'

function ab2str(buf: any) :string {
   return String.fromCharCode.apply(null, buf);
 }

 function ExtractCoverage(lines:string[]) : number | null {
   const header: string = "| Total   |";
   let i: number = 0;
   while (i < lines.length) {
     let line = lines[i];
     if (line.startsWith(header)) {
       return extractCoverageFromLine(line);
     }
     i++;
   }
   return null;
}

function extractCoverageFromLine(line: string) : number {
   var columns: string[] = line.split("|").filter((e) => e);
   let linecol: string = columns[1].trim().replace("%", "").replace(",", ".");
   var cd: number = parseFloat(linecol);
   return cd;
}

export function assertCoverageThreshold(buffer: any, thresholdstring: string) : void {
   var dotnetOutput: string = ab2str(buffer);
   console.log(`Checking threshold ${thresholdstring}`)
   console.log(dotnetOutput);
   var coverage: number | null = ExtractCoverage(dotnetOutput.split("\n"));
   if (coverage !== null && coverage !== undefined) {
     if (coverage < parseFloat(thresholdstring)) {
       core.setFailed(
         `coverage level too low : ${coverage} % , expecting ${thresholdstring} %`
       );
     }
   }
 }