import { Button } from "@/components/ui/button";
import { Spring, animated, easings } from "@react-spring/konva";
import { useReducer } from "react";
import { Group, Layer, Line, Ring, Stage, Text, Wedge } from "react-konva";

function reducer(state, action) {
  switch (action.type) {
    case "rotate": {
      return { ...state, rotation: action.payload };
    }
    case "spin-state": {
      return { ...state, state: action.payload };
    }
    case "set-winner": {
      return { ...state, winner: action.payload };
    }
    default:
      return { ...state };
  }
}

const initial_state = {
  rotation: { start: 0, end: 0 },
  winner: null,
  state: "idle",
};

const center = 200;
const radius = 200;
const thickness_0 = 5;
const font_size = 14;
const colors = ["#65e3ab", "#f6e829", "#92dcf0", "#ffbdcb", "#efefef"];

export default function WheelComponent({ persons, question, getRandomQ }) {
  const [state, dispatch] = useReducer(reducer, initial_state);

  const angle = 360 / persons.length;
  const thresholds = [];
  for (let i = 0; i < persons.length; i++) {
    const start = angle * i;
    const end = start + angle;
    thresholds.push({ s: start, e: end });
  }

  const _spin = () => {
    getRandomQ();
    dispatch({ type: "spin-state", payload: "spinning" });
    const start = state.rotation.end;
    let end;
    while (end === undefined || end < start || end % angle === 0) {
      // not too small and nor not on a line
      end = start + randomIntFromInterval(200, 720);
    }
    dispatch({ type: "rotate", payload: { start, end } });
  };

  const _onDone = () => {
    dispatch({ type: "spin-state", payload: "idle" });
    const rotation = state.rotation.end % 360;
    const won_threshold = thresholds.filter(
      (thr) => rotation >= thr.s && rotation <= thr.e,
    );
    const thr_idx = thresholds.indexOf(won_threshold[0]);
    const winner = persons[persons.length - 1 - thr_idx];
    dispatch({ type: "set-winner", payload: winner });
  };

  return (
    <div className="flex flex-col xl:flex-row lg:mx-8">
      <div className="overflow-hidden w-[450px]">
        <WheelCanvas
          persons={persons}
          angle={angle}
          start={state.rotation.start}
          end={state.rotation.end}
          doneCallback={_onDone}
        />
      </div>
      <div className="ml-8 max-w-[50rem]">
        <>
          <div className="flex gap-4">
            <Button disabled={state.state !== "idle"} onClick={_spin}>
              SPIN
            </Button>
          </div>
          <div className="mt-12 lg:mt-24">
            {state.state !== "idle" && (
              <p className="text-[2rem] text-zinc-400 dark:text-zinc-600">
                Spinning ...
              </p>
            )}
            {state.winner && state.state === "idle" && (
              <p className="text-[2rem] text-[#188152] dark:text-[#65e3ab]">
                {state.winner}
              </p>
            )}
            {!state.winner && state.state === "idle" && (
              <p className="text-[2rem] dark:text-zinc-100">
                Spin the wheel to get a question and a name!
              </p>
            )}
          </div>
          {question && (
            <p className="text-balance font-bold text-[3rem] leading-[3rem] mt-4">
              {question}
            </p>
          )}
        </>
      </div>
    </div>
  );
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function WheelCanvas({ persons, angle, start, end, doneCallback }) {
  if (persons.length === 0) {
    return null;
  }
  return (
    <Stage width={450} height={450}>
      <Layer>
        <Ring
          x={center}
          y={center}
          fill="black"
          outerRadius={radius}
          innerRadius={radius - thickness_0}
        />
        <Line
          x={radius * 2 - 5}
          y={center}
          fill="#9670f9"
          points={[0, 0, 25, 15, 25, -15]}
          closed
        />

        {persons.map((person, idx) => {
          return (
            <Group key={idx}>
              <Spring
                from={{ rotation: angle * idx + start }}
                to={{ rotation: angle * idx + end }}
                config={{ easing: easings.easeOutQuart, duration: 4000 }}
                // config={{ mass: 1, tension: 270, friction: 30, clamp: true }}
              >
                {(animation_props) => (
                  <animated.Wedge
                    {...animation_props}
                    x={center}
                    y={center}
                    angle={angle}
                    radius={radius - thickness_0}
                    fill={colors[idx % colors.length]}
                    opacity={0.9}
                    stroke="black"
                    strokeWidth={1}
                  />
                )}
              </Spring>
              <Spring
                from={{ rotation: angle * idx + angle / 2 + start }}
                to={{ rotation: angle * idx + angle / 2 + end }}
                config={{ easing: easings.easeOutQuart, duration: 4000 }}
                onRest={doneCallback}
                // config={{ mass: 1, tension: 270, friction: 30, clamp: true }}
              >
                {(animation_props) => (
                  <animated.Text
                    {...animation_props}
                    x={center}
                    y={center}
                    offsetY={font_size / 2}
                    width={radius - 13}
                    height={font_size}
                    align="right"
                    text={person}
                    fontSize={font_size}
                    fontFamily="Inter Variable, sans-serif"
                    fill="black"
                  />
                )}
              </Spring>
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}
