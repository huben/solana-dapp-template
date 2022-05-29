use anchor_lang::prelude::*;

use crate::constant::{
  LENGTH_DISCRIMINATOR,
  LENGTH_PUBLIC_KEY,
  LENGTH_TIMESTAMP,
  LENGTH_ACCOUNT_TYPE,
  LENGTH_STRING_PREFIX
};

#[derive(Debug)]
#[account]
pub struct QuestionAccount {
  pub authority: Pubkey,
  pub timestamp: i64,
  pub account_type: i32,
  pub authority_ata: Pubkey,
  pub status: i8, // 1: 对 2: 错 3: 发放奖励
  pub right: i8,
  pub desc: String,
  pub option1: String,
  pub option2: String,
}

const LENGTH_RIGHT: usize = 1;
const LENGTH_STATUS: usize = 1;
const LENGTH_DESC: usize = 140;
const LENGTH_OPTION: usize = 32;

impl QuestionAccount {
  pub const LENGTH: usize = LENGTH_DISCRIMINATOR
  + LENGTH_PUBLIC_KEY
  + LENGTH_TIMESTAMP
  + LENGTH_ACCOUNT_TYPE
  + LENGTH_PUBLIC_KEY
  + LENGTH_STATUS
  + LENGTH_RIGHT
  + LENGTH_STRING_PREFIX + LENGTH_DESC * 4
  + (LENGTH_STRING_PREFIX + LENGTH_OPTION * 4) * 2;
}

#[derive(Debug)]
#[account]
pub struct AnwserAccount {
  pub authority: Pubkey,
  pub timestamp: i64,
  pub account_type: i32,
  pub question: Pubkey,
  pub ata: Pubkey,
  pub status: i8,
  pub anwser: i8,
}

const LENGTH_ANWSER: usize = 1;

impl AnwserAccount {
  pub const LENGTH: usize = LENGTH_DISCRIMINATOR
  + LENGTH_PUBLIC_KEY
  + LENGTH_TIMESTAMP
  + LENGTH_ACCOUNT_TYPE
  + LENGTH_PUBLIC_KEY
  + LENGTH_PUBLIC_KEY
  + LENGTH_STATUS
  + LENGTH_ANWSER;
}
