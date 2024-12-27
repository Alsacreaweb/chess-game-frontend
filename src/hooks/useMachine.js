import { useState, useRef, useCallback } from "react";
import { interpret } from "robot3";

export function useMachine(machine) {
  const serviceRef = useRef();
  if (!serviceRef.current) {
    serviceRef.current = interpret(machine, () => {
      setMachineState(serviceRef.current.machine.current);
      setMachineContext(serviceRef.current.context);
      console.log("machineState", serviceRef.current.machine.current);
      console.log("machineContext", serviceRef.current.context);
    });
  }

  const [machineState, setMachineState] = useState(
    serviceRef.current.machine.current
  );
  const [machineContext, setMachineContext] = useState(
    serviceRef.current.machine.current
  );

  const machineSend = useCallback(
    function (type, params = {}) {
      serviceRef.current.send(type, params);
    },
    [serviceRef]
  );

  return [machineState, machineSend, machineContext];
}
