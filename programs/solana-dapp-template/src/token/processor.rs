use anchor_lang::prelude::*;
use anchor_lang::system_program::{
  transfer as transfer_sol,
  Transfer as TransferSol,
};
use anchor_spl::token::*;

use crate::token::instruction::{ TokenMintTo, TokenTransfer, TokenBurn, TokenExchange };

pub struct TokenProcessor;

impl TokenProcessor {
  pub fn token_mint_to(ctx: Context<TokenMintTo>, amount: u64) -> Result<()> {
    mint_to(ctx.accounts.into(), amount)
  }

  pub fn token_transfer(ctx: Context<TokenTransfer>, amount: u64) -> Result<()> {
    transfer(ctx.accounts.into(), amount)
  }

  pub fn token_burn(ctx: Context<TokenBurn>, amount: u64) -> Result<()> {
    burn(ctx.accounts.into(), amount)
  }

  pub fn token_exchange(ctx: Context<TokenExchange>, amount: u64) -> Result<()> {
    // let cpi_accounts = TransferSol {
    //   from: &ctx.accounts.from.clone(),
    //   to: &ctx.accounts.to.clone(),
    // };
    // let program = &ctx.accounts.token_program.clone();
    
    // transfer_sol(CpiContext::new(program, cpi_accounts), amount);
    // mint_to(ctx.accounts.into(), amount)
    Ok(())
  }

}