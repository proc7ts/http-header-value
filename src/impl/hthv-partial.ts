import { HthvItem } from '../hthv-item';

/**
 * @internal
 */
export interface HthvPartial<I extends HthvItem<any, any, any> = HthvItem> {
  $?: I['$'];
  n?: I['n'];
  t?: I['t'];
  v: I['v'];
  x?: I['x'];
  p?: I['p'];
  pl?: I['pl'];
}

