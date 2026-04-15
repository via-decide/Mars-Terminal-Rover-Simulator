create table if not exists missions (
  passport_id text not null,
  mission_id integer not null,
  score integer not null,
  timestamp timestamptz not null default now()
);

create index if not exists missions_passport_id_idx on missions (passport_id);
create index if not exists missions_timestamp_idx on missions (timestamp desc);
