use anchor_lang::prelude::*;

use crate::constant::{
  LENGTH_DISCRIMINATOR,
  LENGTH_PUBLIC_KEY,
  LENGTH_TIMESTAMP,
  LENGTH_ACCOUNT_TYPE,
  LENGTH_STRING_PREFIX,
};

#[account]
pub struct PostAccount {
  pub authority: Pubkey,
  pub timestamp: i64,
  pub account_type: i32,
  pub topic: String,
  pub desc: String,
}

pub const TOPIC_MAX_CHARS: usize = 10;  // 10 个字符
pub const DESC_MAX_CHARS: usize = 140;  // 140 个字符

impl PostAccount {

  pub const LENGTH_MAX_TOPIC: usize = TOPIC_MAX_CHARS * 4;
  pub const LENGTH_MAX_DESC: usize = DESC_MAX_CHARS * 4; 

  pub const LENGTH: usize = LENGTH_DISCRIMINATOR
    + LENGTH_PUBLIC_KEY
    + LENGTH_TIMESTAMP
    + LENGTH_ACCOUNT_TYPE
    + LENGTH_STRING_PREFIX + TOPIC_MAX_CHARS * 4
    + LENGTH_STRING_PREFIX + DESC_MAX_CHARS * 4;

  
}