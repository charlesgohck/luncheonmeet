CREATE ROLE luncheonmeet_rw WITH LOGIN PASSWORD 'Password';

create database luncheonmeet;

CREATE SCHEMA dbo;

grant create, usage on schema dbo to luncheonmeet_rw;

create table luncheonmeet.dbo."user"
(
    email           varchar(128) not null
        constraint user_pk
            primary key,
    username        varchar(128) not null,
    about_me        varchar(512),
    profile_picture varchar(256),
    display_name    varchar(128)
);

comment on table luncheonmeet.dbo."user" is 'Stores user information';

alter table luncheonmeet.dbo."user"
    owner to postgres;

grant delete, insert, references, select, update on luncheonmeet.dbo."user" to luncheonmeet_rw;

create table luncheonmeet.dbo.verification
(
    email            varchar(128) not null
        constraint verification_pk
            primary key,
    organization     varchar(256),
    last_verified_at timestamp
);

alter table luncheonmeet.dbo.verification
    owner to postgres;

create table luncheonmeet.dbo.organization
(
    name            varchar(128) not null
        constraint organization_pk
            primary key,
    email_suffix    varchar(128),
    last_updated_at timestamp
);

alter table luncheonmeet.dbo.organization
    owner to postgres;

create table luncheonmeet.dbo.meetup
(
    id               uuid    default gen_random_uuid() not null
        constraint meetup_pk
            primary key,
    title            varchar(256),
    description      varchar(512),
    start_time       timestamp,
    end_time         timestamp,
    location         varchar(256),
    last_updated_at  timestamp,
    last_updated_by  varchar(128),
    created_by       varchar(64),
    max_participants integer default 20
);

alter table luncheonmeet.dbo.meetup
    owner to postgres;

create index meetup_start_time_index
    on luncheonmeet.dbo.meetup (start_time desc);

grant delete, insert, references, select, trigger, update on luncheonmeet.dbo.meetup to luncheonmeet_rw;

create table luncheonmeet.dbo.meetup_archive
(
    id               uuid    default gen_random_uuid() not null
        constraint meetup_archive_pk
            primary key,
    title            varchar(256),
    description      varchar(512),
    start_time       timestamp,
    end_time         timestamp,
    location         varchar(256),
    last_updated_at  timestamp,
    last_updated_by  varchar(128),
    created_by       varchar(64),
    max_participants integer default 20
);

alter table luncheonmeet.dbo.meetup_archive
    owner to postgres;

create index meetup_archive_start_time_index
    on luncheonmeet.dbo.meetup_archive (start_time desc);

grant delete, insert, references, select, trigger, update on luncheonmeet.dbo.meetup_archive to luncheonmeet_rw;

create table luncheonmeet.dbo.meetup_room_participant
(
    id        uuid    default gen_random_uuid() not null
        constraint meetup_room_participant_pk
            primary key,
    email     varchar(64),
    meet_id   uuid,
    joined_at timestamp with time zone,
    has_left  boolean default false
);

comment on table luncheonmeet.dbo.meetup_room_participant is 'Participants for meetup rooms';

alter table luncheonmeet.dbo.meetup_room_participant
    owner to postgres;

create index meetup_room_participant_joined_at_email_index
    on luncheonmeet.dbo.meetup_room_participant (joined_at desc, email asc);

grant delete, insert, references, select, trigger, update on luncheonmeet.dbo.meetup_room_participant to luncheonmeet_rw;

