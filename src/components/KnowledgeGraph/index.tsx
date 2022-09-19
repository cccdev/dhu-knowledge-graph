/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import ReactECharts from 'echarts-for-react';
import React from "react";


export class KnowledgeGraphProps {}

const options = () => {
  return {
      title: {
          text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
          data: ['销量', '库存']
      },
      xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'bar',
          data: [1,2,3,4],
      }, {
          name: '库存',
          type: 'bar',
          data: [2,5,4,6]
      }]
  }
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = (props) => {
   return (
    <>
       <ReactECharts option={options()} />
    </>
  );
};

KnowledgeGraph.defaultProps = new KnowledgeGraphProps();
export default KnowledgeGraph;
