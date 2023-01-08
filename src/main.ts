import * as core from '@actions/core'
import {execSync} from 'child_process'
import path from 'path'
import fs from 'fs'
import {assertCoverageThreshold} from './coverage'

async function run(): Promise<void> {
  try {
    const output: string = core.getInput('output')
    const outputFormat: string = core.getInput('outputFormat')
    let settingsFile: string = core.getInput('settingsFile')
    let thresholdstring: string = core.getInput('threshold')

    const rootpath = path.dirname('./')
    const coverageFile = `${rootpath}/${output}`
    const runSettingsFile = `${rootpath}/${settingsFile}`

    if (!fs.existsSync(coverageFile)) {
      core.setFailed(
        `error occurred : runsettings file not found at ${settingsFile}`
      )
    }

    /****************************************/
    /****                                ****/
    /****  create coverlet args          ****/
    /****                                ****/
    /****************************************/

    const properties: string = `--collect:"XPlat Code Coverage" --settings coverlet.runsettings /p:CollectCoverage=true /p:CoverletOutputFormat=${outputFormat}`
    // let properties: string = `-p:coverletOutput=${output} -p:CollectCoverage=true -p:CoverletOutputFormat=${outputFormat}`;

    const execString: string = `run dotnet test -c Debug ${properties}`
    console.log(execString)

    /* ***************************************/
    /* ***                                ****/
    /* ***  run dotnet test               ****/
    /* ***                                ****/
    /* ***************************************/

    try {
      const dotnet: any = execSync(execString)
      console.log(`dotnet succeeded`)
      assertCoverageThreshold(dotnet, thresholdstring)
    } catch (error) {
      console.log(`dotnet failed`)
      if (error instanceof Error) {
        assertCoverageThreshold(error.message, thresholdstring)
        core.setFailed(`dotnet test failure ${error.message}`)
      }
    }

    if (!fs.existsSync(coverageFile)) {
      core.setFailed(
        `error occurred : coverage file not found at ${coverageFile}`
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
