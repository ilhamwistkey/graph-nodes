import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const connectNodes = (nodes: string[], targetNodes: string[]) => {
  const res: any[] = [];

  for (const node of nodes) {
    const maxConnections = Math.min(3, targetNodes.length);
    const shuffledTargets = shuffleArray(targetNodes).slice(0, maxConnections);

    shuffledTargets.forEach(target => {
      res.push({
        source: node,
        target: target
      });
    });
  }
  
  return res;
};

const shuffleArray = (array: any[]) => {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const randomizeCoordinates = (
  prefix: string,
  previousCoordinates: { [key: string]: { x: number; y: number } },
  index: string,
): { x: number; y: number } => {
  let x: number, y: number;

  const setIndex = parseInt(index.split('-')[1]);

  if (prefix.startsWith("left-")) {
    let tries = 0;
    do {
      x = getRandomInt(300) + 500;
      y = getRandomInt(200) + (setIndex - 1) * 200; 
      tries++;
      if (tries > 100) {
        console.log("break");
        break;
      }
    } while (
      Object.values(previousCoordinates).some(
        ({ x: prevX, y: prevY }) =>
          Math.abs(prevX - x) < 50 || Math.abs(prevY - y) < 50
      )
    );
  } else if (prefix.startsWith("right-")) {
    let tries = 0;
    do {
      x = getRandomInt(300) + 1600; 
      y = getRandomInt(200) + (setIndex - 1) * 200;
      tries++;
      if (tries > 100) {
        console.log("break");
        break;
      }
    } while (
      Object.values(previousCoordinates).some(
        ({ x: prevX, y: prevY }) =>
          Math.abs(prevX - x) < 50 || Math.abs(prevY - y) < 50
      )
    );
  } else {
    x = 0;
    y = 0;
  }

  return { x, y };
};


const getRandomSymbolSize = (): number => {
  const options = [5, 10, 15];
  return options[Math.floor(Math.random() * options.length)];
};

const EchartsGraph: React.FC = () => {
  const [graphData, setGraphData] = useState<any[]>([]);
  const [graphLink, setGraphLink] = useState<any[]>([]);

  const leftNodes = Array.from({ length: 10 }, (_, i) => `left-${i + 1}`);
  const rightNodes = Array.from({ length: 10 }, (_, i) => `right-${i + 1}`);
  const connectNodes_ = connectNodes(leftNodes, rightNodes)

  useEffect(() => {
    setGraphData([])
    setGraphLink([])
    let previousCoordinates: { [key: string]: { x: number; y: number } } = {};

    const startNode = {
      id: "start",
      name: 'User',
      x: 0,
      y: 1000,
      symbolSize: 70,
      itemStyle: {
        color: "#7d65f7"
      }
    }

    const initialEndNode = {
      id: "end",
      name: '',
      x: 2400,
      y: 1000,
      symbolSize: 70,
      itemStyle: {
        color: "#fff"
      }
    }

    const initialResultNode = {
      id: "result",
      name: '',
      x: 3000,
      y: 1000,
      symbolSize: 100,
      itemStyle: {
        color: "#fff"
      },
      label: {
        show: true
      },
    }

    const leftNodesMap = leftNodes.map(node => {
      const { x, y } = randomizeCoordinates("left-", previousCoordinates, node);
      previousCoordinates[node] = { x, y };
      return {
        id: node,
        name: 'Loading...',
        label: {
          position: "bottom",
          show: x % 2 === 0,
          fontSize: 8
        },
        x: x,
        y: y,
        itemStyle: {
          color: "#DDDDDD"
        },
        symbolSize: getRandomSymbolSize(),
        tooltip: {
          show: x % 2 !== 0,
          formatter: () => `${x}`,
        }
      };
    })

    console.log("left", leftNodesMap)

    const rightNodesMap = rightNodes.map(node => {
      const { x, y } = randomizeCoordinates("right-", previousCoordinates, node);
      previousCoordinates[node] = { x, y };
      return {
        id: node,
        name: 'Loading...',
        label: {
          position: "bottom",
          show: x % 2 === 0,
          fontSize: 8
        },
        x: x,
        y: y,
        itemStyle: {
          color: "#DDDDDD"
        },
        symbolSize: getRandomSymbolSize(),
        tooltip: {
          show: x % 2 !== 0,
          formatter: () => `${x}`,
        }
      };
    })

    const nodesData = [
      startNode,
      ...[],
      ...[],
      initialEndNode,
      initialResultNode,
    ];

    const nodesData2 = [
      startNode,
      ...leftNodesMap,
      ...[],
      initialEndNode,
      initialResultNode,
    ];

    const nodesData3 = [
      startNode,
      ...leftNodesMap,
      ...rightNodesMap,
      initialEndNode,
      initialResultNode,
    ];

    const endNode = {
      id: "end",
      name: 'Pebbo AI Question',
      x: 2400,
      y: 1000,
      symbolSize: 70,
      itemStyle: {
        color: "#5dcad0"
      }
    }

    const resultNode = {
      id: "result",
      name: 'Start Exercise',
      x: 3000,
      y: 1000,
      symbolSize: 100,
      itemStyle: {
        color: "#F05724"
      },
      label: {
        show: true
      },
      triggerEvent: true,
      tooltip: {
        show: true,
        formatter: () => "Click to start your excercise"
      }
    }

    const resultNodeLink = { source: "end", target: "result" }

    let nodesData4 = nodesData3.filter((val) => val?.id !== "end")
    nodesData4.push(endNode)

    let nodesData5 = nodesData4.filter((val) => val?.id !== "result")
    nodesData5.push(resultNode)

    let links = [
      ...leftNodes.map(node => ({ source: "start", target: node })),
    ];

    setGraphLink(links)
    setGraphData(nodesData)

    setTimeout(() => {
      links = links.concat(leftNodes.map(node => ({ source: "start", target: node })))
      setGraphLink(links)
      setGraphData(nodesData2)
    }, 2000);

    setTimeout(() => {
      links = links.concat(connectNodes_)
      setGraphLink(links)
      setGraphData(nodesData3)
    }, 4000);

    setTimeout(() => {
      links = links.concat(rightNodes.map(node => ({ source: node, target: "end" })))
      setGraphLink(links)
      setGraphData(nodesData4);
    }, 6000);

    setTimeout(() => {
      links.push(resultNodeLink)
      setGraphLink(links)
      setGraphData(nodesData5);
    }, 8000);
  }, []);

  const option = {
    tooltip: {
      show: false
    },
    triggerEvent: true,
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 50,
        roam: true,
        label: {
          show: true
        },
        edgeSymbol: ['none', 'none'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20
        },
        data: graphData,
        links: graphLink,
        lineStyle: {
          opacity: 0.9,
          width: 1,
          curveness: 0,
          color: '#DDDDDD',
        }
      }
    ]
  };

  return (
    <ReactEcharts option={option} style={{ height: '500px', width: '100%' }} />
  );
};


export default EchartsGraph;