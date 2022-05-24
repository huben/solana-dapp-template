use anchor_lang::prelude::*;

use crate::constant::{
    LENGTH_DISCRIMINATOR,
    LENGTH_PUBLIC_KEY,
    LENGTH_TIMESTAMP,
    LENGTH_ACCOUNT_TYPE,
};

#[account]
pub struct CounterAccount {
    pub authority: Pubkey,
    pub timestamp: i64,
    pub account_type: i32,
    pub count: u64,
}

const LENGTH_COUNT: usize = 8;

impl CounterAccount {
    pub const LENGTH: usize = LENGTH_DISCRIMINATOR
        + LENGTH_PUBLIC_KEY
        + LENGTH_TIMESTAMP
        + LENGTH_ACCOUNT_TYPE
        + LENGTH_COUNT;
}