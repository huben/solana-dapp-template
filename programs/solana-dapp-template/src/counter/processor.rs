use anchor_lang::prelude::*;
// use anchor_lang::solana_program::system_program;

use crate::counter::instruction::{ Init, Increment };
use crate::counter::error::{ CounterError };
use crate::constant::{ ACCOUNT_TYPE_COUNTER };
use crate::utils::{ get_timestamp };

pub struct CounterProcessor;

impl CounterProcessor {
  pub fn init(ctx: Context<Init>) -> Result<()> {
    let counter_account = &mut ctx.accounts.counter_account;

    let signer: &Signer = &ctx.accounts.signer;

    counter_account.authority = *signer.key;
    counter_account.timestamp = get_timestamp();
    counter_account.account_type = ACCOUNT_TYPE_COUNTER;
    counter_account.count = 0;
    
    Ok(())
  }
  
  pub fn increment(ctx: Context<Increment>) -> Result<()> {
    let counter_account = &mut ctx.accounts.counter_account;
    if counter_account.count >= 3 {
      return Err(CounterError::MaxCount.into());
    }
    counter_account.count += 1;
    Ok(())
  }
}

