import * as migration_20260615_175508_initial from './20260615_175508_initial';
import * as migration_20260616_134208_add_page_portrait_lede from './20260616_134208_add_page_portrait_lede';

export const migrations = [
  {
    up: migration_20260615_175508_initial.up,
    down: migration_20260615_175508_initial.down,
    name: '20260615_175508_initial',
  },
  {
    up: migration_20260616_134208_add_page_portrait_lede.up,
    down: migration_20260616_134208_add_page_portrait_lede.down,
    name: '20260616_134208_add_page_portrait_lede'
  },
];
