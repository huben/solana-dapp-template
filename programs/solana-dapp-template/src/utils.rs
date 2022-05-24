use anchor_lang::prelude::*;

pub fn get_timestamp() -> i64 {
  let clock = Clock::get().unwrap();
  clock.unix_timestamp
}