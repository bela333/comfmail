import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface ComfEmailProps {
  today: Date
  comf: { label: string, value: number }[]
  chart: string
}

const ComfEntry = ({ value, label }: { value: number, label: string }) => {
  let color
  if (value > 75) {
    color = "green-500"
  } else if (value > 50) {
    color = "amber-400"
  } else {
    color = "red-600";
  }
  return (
    <tr>
      {/* Label */}
      <td className="font-bold text-left"><div className="mr-5">{label}</div></td>
      {/* Value */}
      <td className="text-right"><div className="mr-5">{Math.round(value * 100) / 100}%</div></td>
      {/* Progress bar */}
      <td>
        <div className="w-32 h-full border border-solid border-neutral-200 rounded-lg overflow-hidden">
          <div className={["h-full", `bg-${color}`].join(" ")} style={{
            width: `${value}%`
          }}>&nbsp;</div>
        </div>
      </td>
      <td><br /></td>
    </tr>
  )
}

export const ComfEmail = ({
  comf, today, chart
}: ComfEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head>
          <title>Comf report</title>
        </Head>
        <Body className="my-auto mx-auto font-sans">
          <Container className="border border-solid border-gray-300 my-4 shadow-xl rounded-2xl overflow-hidden">
            <Img className="w-full rounded-t-2xl" alt="Ame talking" src="https://zr4vh0lbcjlm.objectstorage.eu-zurich-1.oci.customer-oci.com/n/zr4vh0lbcjlm/b/bucket-20211205-1359/o/helbhelbema.gif" />
            <Heading className="text-black font-normal text-center" >
              The Comf Oracle has spoken
            </Heading>
            <Text className="text-center">
              Here's your comf forecast for {`${today.getUTCFullYear()}-${(today.getUTCMonth() + 1).toString().padStart(2, '0')}-${today.getUTCDate().toString().padStart(2, '0')}`}:
            </Text>
            <Row>
              <Column align="center">
                <table>
                  {comf.map(({ label, value }) => <ComfEntry key={label} label={label} value={value} />)}
                </table>
              </Column>
            </Row>
            <Img src={chart} className="w-full mt-4" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ComfEmail.PreviewProps = {
  today: new Date(2024, 2, 29, 0, 0, 0, 0),
  comf: [
    { label: "Today", value: 85.01 },
    { label: "Tomorrow", value: 52.23 },
    { label: "Day after tomorrow", value: 13.11 },
  ],
  chart: "/static/chart.jpg"
} as ComfEmailProps;

export default ComfEmail;
