import * as echarts from 'echarts'
import svg2img from 'svg2img'
import { JSDOM } from 'jsdom'
import { ComfResponse } from './comftypes';

const { window } = new JSDOM("", { pretendToBeVisual: true });
global.document = window.document;

const root = document.createElement('div')
root.style.cssText = `width: ${800}px; height: ${600}px;`

const chart = echarts.init(root, null, {
    renderer: 'svg'
})

export const generate_chart = async (data: ComfResponse, today: Date, format: string = 'jpg'): Promise<Buffer> => {
    chart.setOption({
        title: {
            text: `${today.getUTCFullYear()}-${(today.getUTCMonth() + 1).toString().padStart(2, '0')}-${today.getUTCDate().toString().padStart(2, '0')}`,
            left: 'center',
            textStyle: {
                fontSize: 32
            }
        },
        xAxis: {
            data: data.map(d => {
                const date = new Date(d.date);
                return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`
            }),
            axisLabel: {
                fontSize: 24,
                margin: 16
            }
        },
        yAxis: {
            type: "value",
            axisLabel: {
                fontSize: 24
            },
            min: 0,
            max: 100
        },
        series: [{
            animation: false,
            type: "line",
            data: data.map(d => d.comfValue),
            itemStyle: {
                opacity: 0
            },
            lineStyle: {
                width: 4
            }
        }]
    })

    return await new Promise((resolve, reject)=>svg2img(root.querySelector('svg').outerHTML, {
        resvg: {
            font: {
                fontFiles: ["Roboto-Regular.ttf"]
            }
        }, format, quality: 90
    }, (error, buffer) => {
        if (error) {
            reject(error)
            return
        }
        resolve(buffer)
    }))
}
