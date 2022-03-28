import { useSelector } from 'react-redux';
import { State } from './types'

export function useStore<TSelected>(
  selector: (state: State) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
) {
  return useSelector<State, TSelected>(selector, equalityFn);
}
