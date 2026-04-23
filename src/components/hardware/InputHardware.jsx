import { updatePinSignal } from '@/store/workspaceSlice';
// ... (imports same as above)

export const WokwiButton = (props) => {
  const dispatch = useDispatch();
  const handleAction = (val) => {
    dispatch(updatePinSignal({ nodeId: props.id, pinName: '1', signalValue: val }));
  };

  return (
    <div onMouseDown={() => handleAction(1)} onMouseUp={() => handleAction(0)}>
      <GenericHardware {...props} />
    </div>
  );
};

export const WokwiPot = (props) => {
  const dispatch = useDispatch();
  const handleInput = (e) => {
    dispatch(updatePinSignal({ nodeId: props.id, pinName: 'SIG', signalValue: e.target.value }));
  };

  return (
    <div onInput={handleInput}>
      <GenericHardware {...props} />
    </div>
  );
};