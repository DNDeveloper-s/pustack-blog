import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const generateKeyframes = (deg: number) => keyframes`
  from {
    transform: rotate(${deg}deg);
  }
  to {
    transform: rotate(${deg + 360}deg);
  }
`;

// position: absolute;
//   z-index: 2;
//   top: 80px;
//   left: 128px;
//   width: 4px;
//   height: 65px;
//   background-color: #555;
//   border-radius: 2px;
//   box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
//   transform-origin: 2px 50px;
//   transition: 0.5s;
//   -webkit-animation: rotate-hour 43200s linear infinite;
//   -moz-animation: rotate-hour 43200s linear infinite;

const AnimatedHourDiv = styled.div`
  position: absolute;
  z-index: 2;
  top: 80px;
  left: 128px;
  width: 4px;
  height: 65px;
  background-color: #555;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 2px 50px;
  transition: 0.5s;
  -webkit-animation: ${(props: any) => generateKeyframes(props.deg)} 43200s
    linear infinite;
  animation: ${(props: any) => generateKeyframes(props.deg)} 43200s linear
    infinite;
`;

const AnimatedMinuteDiv = styled.div`
  position: absolute;
  z-index: 3;
  top: 60px;
  left: 128px;
  width: 4px;
  height: 85px;
  background-color: #555;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 2px 70px;
  transition: 0.5s;
  -webkit-animation: ${(props: any) => generateKeyframes(props.deg)} 3600s
    linear infinite;
  animation: ${(props: any) => generateKeyframes(props.deg)} 3600s linear
    infinite;
`;

const AnimatedSecondDiv = styled.div`
  position: absolute;
  z-index: 4;
  top: 20px;
  left: 129px;
  width: 2px;
  height: 130px;
  background-color: #a00;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 1px 110px;
  transition: 0.5s;
  -webkit-animation: ${(props: any) => generateKeyframes(props.deg)} 60s linear
    infinite;
  animation: ${(props: any) => generateKeyframes(props.deg)} 60s linear infinite;
`;

export default function WorldClock2() {
  useEffect(() => {
    var now = new Date(),
      hourDeg = (now.getHours() / 12) * 360 + (now.getMinutes() / 60) * 30,
      minuteDeg = (now.getMinutes() / 60) * 360 + (now.getSeconds() / 60) * 6,
      secondDeg = (now.getSeconds() / 60) * 360,
      stylesDeg = [
        "@-webkit-keyframes rotate-hour{from{transform:rotate(" +
          hourDeg +
          "deg);}to{transform:rotate(" +
          (hourDeg + 360) +
          "deg);}}",
        "@-webkit-keyframes rotate-minute{from{transform:rotate(" +
          minuteDeg +
          "deg);}to{transform:rotate(" +
          (minuteDeg + 360) +
          "deg);}}",
        "@-webkit-keyframes rotate-second{from{transform:rotate(" +
          secondDeg +
          "deg);}to{transform:rotate(" +
          (secondDeg + 360) +
          "deg);}}",
        "@-moz-keyframes rotate-hour{from{transform:rotate(" +
          hourDeg +
          "deg);}to{transform:rotate(" +
          (hourDeg + 360) +
          "deg);}}",
        "@-moz-keyframes rotate-minute{from{transform:rotate(" +
          minuteDeg +
          "deg);}to{transform:rotate(" +
          (minuteDeg + 360) +
          "deg);}}",
        "@-moz-keyframes rotate-second{from{transform:rotate(" +
          secondDeg +
          "deg);}to{transform:rotate(" +
          (secondDeg + 360) +
          "deg);}}",
      ].join("");

    // document.getElementById("clock-animations").innerHTML = stylesDeg;
  }, []);

  return (
    <div className="clock-wrapper" style={{}}>
      <div className="clock-base">
        <div className="clock-dial">
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
          <div className="clock-indicator"></div>
        </div>
        <AnimatedHourDiv className="clock-hour"></AnimatedHourDiv>
        <AnimatedMinuteDiv className="clock-minute"></AnimatedMinuteDiv>
        <AnimatedSecondDiv className="clock-second"></AnimatedSecondDiv>
        <div className="clock-center"></div>
      </div>
    </div>
  );
}
