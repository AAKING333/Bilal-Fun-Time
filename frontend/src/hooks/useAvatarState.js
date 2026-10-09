import { useState, useCallback } from 'react';

export const AVATAR_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  HAPPY: 'happy',
  ALERT: 'alert',
  ERROR: 'error',
};

export const useAvatarState = (initialState = AVATAR_STATES.IDLE) => {
  const [avatarState, setAvatarState] = useState(initialState);
  const [stepLabel, setStepLabel] = useState('');
  const [floatingChips, setFloatingChips] = useState([]);

  const setIdle = useCallback(() => {
    setAvatarState(AVATAR_STATES.IDLE);
    setStepLabel('');
    setFloatingChips([]);
  }, []);

  const setListening = useCallback(() => {
    setAvatarState(AVATAR_STATES.LISTENING);
    setStepLabel('Listening...');
  }, []);

  const setThinking = useCallback((step = 'Analyzing...') => {
    setAvatarState(AVATAR_STATES.THINKING);
    setStepLabel(step);
  }, []);

  const setSpeaking = useCallback((chips = []) => {
    setAvatarState(AVATAR_STATES.SPEAKING);
    setStepLabel('');
    if (chips.length) setFloatingChips(chips);
  }, []);

  const setVerdict = useCallback((isViolation, chips = []) => {
    if (isViolation) {
      setAvatarState(AVATAR_STATES.ALERT);
    } else {
      setAvatarState(AVATAR_STATES.HAPPY);
    }
    setStepLabel('');
    if (chips.length) setFloatingChips(chips);
  }, []);

  const setError = useCallback((msg = 'Error occurred') => {
    setAvatarState(AVATAR_STATES.ERROR);
    setStepLabel(msg);
  }, []);

  return {
    avatarState,
    stepLabel,
    floatingChips,
    setAvatarState,
    setStepLabel,
    setIdle,
    setListening,
    setThinking,
    setSpeaking,
    setVerdict,
    setError,
  };
};

