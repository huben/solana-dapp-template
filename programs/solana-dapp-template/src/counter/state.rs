use anchor_lang::prelude::*;

#[account]
pub struct CounterAccount {
    pub count: u64,
}