import { useColorMode } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import { FC, useState } from "react";
import Chart from 'react-apexcharts';



export type ProjectSeries = {
  name: string
  data: {
    x: string;
    y: number;
  }[];
}

type ProjectChartProps = {
  data: ProjectSeries[];
  title: string;
  loading: boolean;
  height?: number;
  width?: number;
}

const ProjectChart: FC<ProjectChartProps> = ({data, title, height = 350, width = 400}) => {

  const {colorMode} = useColorMode();

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'line',
      zoom: {
        enabled: true,
        type: 'x',
      },
      toolbar: {
        autoSelected: 'zoom'
      },
      background: "transparent"
      
    },
    xaxis: {
      type: 'category',
      labels: {
        rotate: 0,
        style:{
          fontSize: '14px',
        }
      }
    },
    yaxis: {
      labels: {
        style:{
          fontSize: '14px',
        },
      },
      forceNiceScale: true,
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      style:{
        fontSize: '18px',
      },
    },
    theme: {
      mode: colorMode,
    },
    plotOptions: {
      bar: {
        distributed: true
      }
    },
    title: {
      text: title,
      align: 'center',
    },
  });

  return (
    <Chart options={options} series={data} height={height} width={width} />
  );
}

export default ProjectChart;