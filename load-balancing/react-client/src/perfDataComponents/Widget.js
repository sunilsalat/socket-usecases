import Cpu from "./Cpu";
import Info from "./Info";
import Mem from "./Mem";
import "./Widget.css";

const Widget = ({ data }) => {
  const {
    freeMem,
    totalMem,
    usedMem,
    memUseage,
    osType,
    upTime,
    cpuType,
    numCores,
    cpuSpeed,
    cpuLoad,
    macA,
  } = data;

  const cpuData = { cpuLoad };
  const memData = { freeMem, totalMem, memUseage, usedMem };
  const infoData = { macA, osType, upTime, cpuSpeed, numCores, cpuType };

  return (
    <div className="widget row justify-content-evenly">
      <h1>Widget</h1>
      <Mem data={memData} />
      <Cpu data={cpuData} />
      <Info data={infoData} />
    </div>
  );
};

export default Widget;
