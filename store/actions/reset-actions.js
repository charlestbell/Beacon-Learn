export const RESET = 'RESET';

export const reset = () => {
  return async dispatch => {
    dispatch({ type: RESET });
  };
};
