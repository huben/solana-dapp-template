pub mod counter;
pub mod post;
pub mod token;
pub mod constant;
pub mod utils;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::{ program as sprogram, system_instruction };
use crate::constant::{ LAMPORTS_PER_SOL };

use counter::processor::CounterProcessor;
use counter::instruction::*;

use post::instruction::*;
use post::processor::PostProcessor;

use token::instruction::*;
use token::processor::TokenProcessor; 

declare_id!("268H6NLNLf3Y4ycKrqwm5DufvvWbp1Pkjvx1DLZuQc51");

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

    pub fn transfer_sol(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
      let from = &mut ctx.accounts.from.key;
      let to = &mut ctx.accounts.to.key;

      let ix = system_instruction::transfer(&from, &to, amount * LAMPORTS_PER_SOL);
      sprogram::invoke(&ix, &[ctx.accounts.from.to_account_info(), ctx.accounts.to.to_account_info()])?;
      Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub system_program: Program<'info, System>
}