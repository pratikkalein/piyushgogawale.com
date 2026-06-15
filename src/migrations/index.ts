import * as migration_20260615_175508_initial from './20260615_175508_initial';

export const migrations = [
  {
    up: migration_20260615_175508_initial.up,
    down: migration_20260615_175508_initial.down,
    name: '20260615_175508_initial'
  },
];
