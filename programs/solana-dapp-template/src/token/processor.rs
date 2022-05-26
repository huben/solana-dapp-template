use anchor_lang::prelude::*;
use anchor_spl::token::*;

use crate::token::instruction::{ TokenMintTo, TokenTransfer, TokenBurn };

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
}