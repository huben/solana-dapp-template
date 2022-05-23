pub mod counter;

use anchor_lang::prelude::*;

use counter::processor::CounterProcessor;
use counter::instrction::*;

declare_id!("268H6NLNLf3Y4ycKrqwm5DufvvWbp1Pkjvx1DLZuQc51");

#[program]
pub mod solana_dapp_template {
    use super::*;

    pub fn init(ctx: Context<Init>) -> Result<()> {
      CounterProcessor::init(ctx)
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
      CounterProcessor::increment(ctx)
    }
}