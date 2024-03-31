import ComfEmail from "./emails/index";
import { ComfResponse } from "./comftypes";
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import * as crypto from 'crypto'
import { generate_chart } from "./charter";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});


let today = new Date();
today.setUTCHours(0, 0, 0, 0)
let tomorrow = new Date(today)
tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
let afterTomorrow = new Date(today)
afterTomorrow.setUTCDate(afterTomorrow.getUTCDate() + 2)


type InferProps<T> = T extends (props: infer K) => any ? K : never
type User = {
    email: string,
    id: string
}


const f = async () => {
    const user: User = {
        email: process.env.USER_EMAIL,
        id: process.env.USER_ID
    } 

    const labels: string[] = ["Today", "Tomorrow", "Day after tomorrow"]
    const dates: string[] = [today.toISOString(), tomorrow.toISOString(), afterTomorrow.toISOString()]

    for (let hour = 0; hour < 24; hour++) {
        const d = new Date(today);
        d.setUTCHours(hour);
        dates.push(d.toISOString());
    }

    const data = encodeURIComponent(dates.join(","))
    const url = `https://api.fraw.st/comf/bulk?id=${encodeURIComponent(user.id)}&dates=${data}`
    const resp = await fetch(url)
    if (resp.status !== 200) {
        throw await resp.text()
    }
    const respjson: ComfResponse = await resp.json()

    const uuid = crypto.randomUUID();

    const props: InferProps<typeof ComfEmail> = {
        today, comf: labels.map((label, i) => { return { label, value: respjson[i].comfValue }; }),
        chart: `cid:${uuid}`
    };

    const chartvals = respjson.slice(labels.length)

    const chart = await generate_chart(chartvals, today)


    const emailHtml = render(ComfEmail(props));

    

    const options = {
        from: process.env.SMTP_ADDRESS,
        to: user.email,
        subject: "Your comf is ready",
        html: emailHtml,
        attachments: [{
            filename: 'chart.jpg',
            cid: uuid,
            content: chart
        }]
    };

    await transporter.sendMail(options);

}

f()



