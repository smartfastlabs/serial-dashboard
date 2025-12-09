# Browser Based Serial Dashboard
[![Netlify Status](https://api.netlify.com/api/v1/badges/a66e39e9-90a5-46c6-9454-f3f3bb7ca36b/deploy-status)](https://app.netlify.com/projects/serial-dashboard/deploys)

Did you know most modern browsers support Serial Communication? Don't worry, neither did I untill I was working on a project and "out grew" the Arduino serial monitor .  Here is a simple(ish) browser based serial monitoring, command, and dashboard tool I built [serialdashboard.com](https://www.serialdashboard.com).

## Features
- Monitor incoming messages over serial: e.g. from an arduino or esp32 board.
- Send messages over serial: e.g. send command messages
- Monitor Metrics: track and plot metrics over time
- Build Customizable Dashboards:
  
## Screen Shots
### Hello World
#### The most basic example; a simple echo application.  Whatever you send over serial gets sent right back by the connected arduino. 
<p align="center">
    <img width="1202" height="917" alt="image" src="https://github.com/user-attachments/assets/34bf8487-4b59-4dd8-9475-81b304a8ab81" />
</p>

### With Metrics 
#### Here we extend the dashboard to show metrics.
<p align="center">
    <img width="1201" height="955" alt="image" src="https://github.com/user-attachments/assets/e336213e-d7e4-45f8-95da-b430303d3dc4" />
</p>

### A very simple Control Panel
#### Here we add a control panel to do a better job displaying metrics and giving buttons. 
<p align="center">
    <img width="1727" height="960" alt="image" src="https://github.com/user-attachments/assets/93e7e80f-6a5b-4fa3-a5b2-4aefe3ed1230" />
</p>

## Metrics
### TODO: Make this functionality better

Serial Dashboard interprets incoming serial data that starts with **">"** as a metric.

All metrics follow the form **key:value**, all metrics are interpreted as floats and metric names may not include special characters.

## Examples

```
>metric-key:metric-value
>temp-1:212
>humidity-2:98.1
```

**Once metrics are detected they will be available in the metrics view and are useable within your control panel.**

## Building Control Panels
### TODO: Make this functionality less terrible

- Serial dashboard is built using bootstrap, we give you access to use bootstrap's class when building control panels.
- In order to build control panels you must (currently) edit json directly.  The json is of the format:

```
{
    "type": "container",
    "class": "container w-100",
    "children": [
      {
        "type": "section",
        "name": "Basic Controls",
        "children": [
          {
            "type": "chart",
            "name": "Leg Position",
            "class": "col",
            "dataSets": [
              {
                "name": "Sin",
                "key": "sin"
              }, ...
            ]
          },
          {
            "type": "container",
            "class": "row",
            "children": [
              {
                "name": "Say Hi :)",
                "onMouseDown": "Hello!"
              },...
            ]
          }
        ]
      }
    ]
  }
```
### There are 5 "Component Types"

- container: A group of components.
    - children: Component[]
    - class: string (bootstrap classes)
- section: A collapsable group of components:
    - children: Component[]
- chart: A graph to render one or more metrics
    - metrics: {name: string, key: string}[]
- button: no explanation necessary
    - onMouseDown: string (serial command to send)
    - onMouseUp: string (serial command to send)
    - class: string (bootstrap classes)
- metric: Display a single metric Value
    - metric: {name: string, key: string}[]
    - 
## TODO: 
- Add Help Section to website

## INSTALLATION
    >> git clone https://github.com/smartfastlabs/serial-dashboard.git
    >> cd serial-dashboard
    >> npm install
    >> npm run dev
    
## LICENSE: AGPLv3
