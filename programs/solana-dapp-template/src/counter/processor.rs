use anchor_lang::prelude::*;

use crate::counter::instrction::{ Init, Increment };
use crate::counter::error::{ CounterError };

pub struct CounterProcessor;

impl CounterProcessor {
  pub fn init(ctx: Context<Init>) -> Result<()> {
    let counter_account = &mut ctx.accounts.counter_account;
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

