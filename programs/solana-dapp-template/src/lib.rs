pub mod counter;
pub mod post;
pub mod token;
pub mod constant;
pub mod utils;
pub mod sol;
pub mod qa;

use anchor_lang::prelude::*;

use counter::processor::CounterProcessor;
use counter::instruction::*;

use post::instruction::*;
use post::processor::PostProcessor;

use token::instruction::*;
use token::processor::{ TokenProcessor, is_valid_swap, Swap, Side };
use token::processor::*;

use sol::*;

use qa::processor::*;
use qa::instruction::*;

declare_id!("9T1cysJ2PTFvVTcE9XCZdJ2cALrQg8yCckmkHXtpksU");

#[program]
pub mod solana_dapp_template {
    use super::*;

    /** counter start */
    pub fn init(ctx: Context<Init>) -> Result<()> {
      CounterProcessor::init(ctx)
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
      CounterProcessor::increment(ctx)
    }
    /** counter end */

    /** post start */
    pub fn create_post(ctx: Context<CreatePost>, topic: String, desc: String) -> Result<()> {
      PostProcessor::create_post(ctx, topic, desc)
    }

    pub fn update_post(ctx: Context<UpdatePost>, topic: String, desc: String) -> Result<()> {
      PostProcessor::update_post(ctx, topic, desc)
    }

    pub fn delete_post(ctx: Context<DeletePost>) -> Result<()> {
      PostProcessor::delete_post(ctx)
    }
    /** post end */

    /** token start */
    pub fn token_mint_to(ctx: Context<TokenMintTo>, amount: u64) -> Result<()> {
      TokenProcessor::token_mint_to(ctx, amount)
    }

    pub fn token_transfer(ctx: Context<TokenTransfer>, amount: u64) -> Result<()> {
      TokenProcessor::token_transfer(ctx, amount)
    }

    pub fn token_burn(ctx: Context<TokenBurn>, amount: u64) -> Result<()> {
      TokenProcessor::token_burn(ctx, amount)
    }
    
    // swap not impl
    #[access_control(is_valid_swap(&ctx))]
    pub fn token_swap<'info>(
      ctx: Context<'_, '_, '_, 'info, Swap<'info>>,
      side: Side,
      amount: u64,
      min_expected_swap_amount: u64,) -> Result<()> {
      TokenProcessor::swap(ctx, side, amount, min_expected_swap_amount)
    }

    /** token start */

    /** sol start */
    pub fn transfer_sol(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
      SolProcessor::anchor_transfer_sol(ctx, amount)
    }

    /** q&a start */
    pub fn new_question(
        ctx: Context<NewQuestion>,
        desc: String,
        option1: String,
        option2: String,
        right: i8,
    ) -> Result<()> {
      QaProcessor::new_question(ctx, desc, option1, option2, right)
    }
    pub fn approve_question(
        ctx: Context<ApproveQuestion>
    ) -> Result<()> {
      QaProcessor::approve_question(ctx)
    }
    pub fn reject_question(
      ctx: Context<RejectQuestion>
    ) -> Result<()> {
      QaProcessor::reject_question(ctx)
    }

    pub fn new_anwser(
      ctx: Context<NewAnwser>,
      anwser: i8,
    ) -> Result<()> {
      QaProcessor::new_anwser(ctx, anwser)
    }
    
    pub fn approve_anwser(
      ctx: Context<ApproveAnwser>
    ) -> Result<()> {
      QaProcessor::approve_anwser(ctx)
    }
}