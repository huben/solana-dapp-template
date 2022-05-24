pub mod counter;
pub mod post;
pub mod constant;
pub mod utils;

use anchor_lang::prelude::*;

use counter::processor::CounterProcessor;
use counter::instrction::*;

use post::instrction::*;
use post::processor::PostProcesser;

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

    pub fn create_post(ctx: Context<CreatePost>, topic: String, desc: String) -> Result<()> {
      PostProcesser::create_post(ctx, topic, desc)
    }

    pub fn update_post(ctx: Context<UpdatePost>, topic: String, desc: String) -> Result<()> {
      PostProcesser::update_post(ctx, topic, desc)
    }

    pub fn delete_post(ctx: Context<DeletePost>) -> Result<()> {
      PostProcesser::delete_post(ctx)
    }
}