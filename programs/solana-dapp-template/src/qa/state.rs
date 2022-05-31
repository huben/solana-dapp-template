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

#[derive(Debug)]
#[account]
pub struct ManVsMachineAccount {
  pub authority: Pubkey,
  pub timestamp: i64,
  pub ata: Pubkey,
  pub count: i8,
  pub success_count: i8,
  pub error_count: i8,
  pub status: i8, // 0 已创建 1 已完成 2 已发奖 3 失败
}
const LENGTH_COUNT: usize = 1;
impl ManVsMachineAccount {
  pub const LENGTH: usize = LENGTH_DISCRIMINATOR
      + LENGTH_PUBLIC_KEY
      + LENGTH_TIMESTAMP
      + LENGTH_PUBLIC_KEY
      + LENGTH_COUNT
      + LENGTH_COUNT
      + LENGTH_COUNT
      + LENGTH_COUNT;
}



#[account]
pub struct HuntAccount {
  pub qs_accouts: [Pubkey; 10],
  pub timestamp: i64,
  pub builder: Pubkey, // player
  pub parter: Pubkey, // player
  pub winer: Pubkey, //  player ata
  pub amount: u64, // < 128
  pub status: i8, // 0 已创建 1 匹配完成 2 已完成 3 已发奖
  pub builder_in: i8,
  pub parter_in: i8,
}
impl HuntAccount {
  pub const LENGTH: usize = LENGTH_DISCRIMINATOR
      + LENGTH_PUBLIC_KEY * 10
      + LENGTH_TIMESTAMP
      + LENGTH_PUBLIC_KEY
      + LENGTH_PUBLIC_KEY
      + LENGTH_PUBLIC_KEY
      + LENGTH_TIMESTAMP
      + LENGTH_COUNT
      + LENGTH_COUNT
      + LENGTH_COUNT;
}

#[account]
pub struct HuntPlayerAccount {
  pub authority: Pubkey,
  pub timestamp: i64,
  pub ata: Pubkey,
  pub start: i64, // 开始时间戳
  pub count: i8, // 已完成数量
  pub success_count: i8, // 答对数量
  pub error_count: i8, // 答错数量
}
impl HuntPlayerAccount {
  pub const LENGTH: usize = LENGTH_DISCRIMINATOR
      + LENGTH_PUBLIC_KEY
      + LENGTH_TIMESTAMP
      + LENGTH_PUBLIC_KEY
      + LENGTH_TIMESTAMP
      + LENGTH_COUNT
      + LENGTH_COUNT
      + LENGTH_COUNT;
}