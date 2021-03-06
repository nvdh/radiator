# radiator
Super simple slick single page jenkins build radiator with json configuration.

The builds are displayed in a grid with headers for the columns and the rows. E.g. you can use a row or pipeline per product and use a column per release. Each cell can contain multiple builds.

## Quick Install

- Download from github: git clone https://github.com/nvdh/radiator.git
- Add builds in config.json
- Open in your browser

## Trouble shooting

Disable web-security if your jenkins is on a different domain

    C:\Program Files (x86)\Google\Chrome\Application>chrome.exe --disable-web-security

## Example json config
```json
[
      {
        "title" : "PRODUCT X",
        "jobs" : {
          "Rel. 1" : [
                      { "jobName" : "X.2015R1.UNITTEST", "displayName" : "UNIT"},
                      { "jobName" : "X.2015R1.INTEGRATIONTEST", "displayName" : "INTEGRATION"},
                      { "jobName" : "X.2015R1.WEBDRIVERTEST.PART1,X.2015R1.WEBDRIVERTEST.PART2,X.2015R1.WEBDRIVERTEST.PART3,X.2015R1.WEBDRIVERTEST.PART4", "displayName" : "UI"},
                      { "jobName" : "X.2015R1.JMETER", "displayName" : "PERFORMANCE", "failCount" : "2", "skipCount" : "0"}
                    ],
          "Rel. 2" : [
                      { "jobName" : "X.2015R1.UNITTEST", "displayName" : "UNIT"},
                      { "jobName" : "X.2015R1.INTEGRATIONTEST", "displayName" : "INTEGRATION"},
                      { "jobName" : "X.2015R1.WEBDRIVERTEST.PART1,X.2015R1.WEBDRIVERTEST.PART2,X.2015R1.WEBDRIVERTEST.PART3,X.2015R1.WEBDRIVERTEST.PART4", "displayName" : "UI"},
                      { "jobName" : "X.2015R1.JMETER", "displayName" : "PERFORMANCE"}
                    ]
        }
      },

      {
        "title" : "PRODUCT Y",
        "jobs" : {
          "Rel. 1"    : [
                      { "jobName" : "Y.REL2015R1.UNITTEST", "displayName" : "UNIT"},
                      { "jobName" : "Y.REL2015R1.INTEGRATIONTEST", "displayName" : "INTEGRATION"},
                      { "jobName" : "Y.REL2015R1.WEBDRIVERTEST", "displayName" : "UI"},
                      { "jobName" : "Y.REL2015R1.JMETER", "displayName" : "PERFORMANCE"}
                    ],
          "Rel. 2"    : [
                      { "jobName" : "Y.REL2015R1.UNITTEST", "displayName" : "UNIT"},
                      { "jobName" : "Y.REL2015R1.INTEGRATIONTEST", "displayName" : "INTEGRATION"},
                      { "jobName" : "Y.REL2015R1.WEBDRIVERTEST", "displayName" : "UI"},
                      { "jobName" : "Y.REL2015R1.JMETER", "displayName" : "PERFORMANCE"}
                    ]
        }
      }
]
```
