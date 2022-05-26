use anchor_lang::prelude::*;
use anchor_spl::token::{ MintTo, Transfer, Burn };

#[derive(Accounts)]
pub struct TokenMintTo<'info> {
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub mint: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut TokenMintTo<'info>>
  for CpiContext<'a, 'b, 'c, 'info, MintTo<'info>> 
{
  fn from(accounts: &mut TokenMintTo<'info>) -> CpiContext<'a, 'b, 'c, 'info, MintTo<'info>> {
    let cpi_accounts = MintTo {
      mint: accounts.mint.clone(),
      to: accounts.to.clone(),
      authority: accounts.authority.clone(),
    };
    let program = accounts.token_program.clone();
    CpiContext::new(program, cpi_accounts)
  }
}

#[derive(Accounts)]
pub struct TokenTransfer<'info> {
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut TokenTransfer<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut TokenTransfer<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
      authority: accounts.authority.clone(),
      from: accounts.from.clone(),
      to: accounts.to.clone(),
    };
    let program = accounts.token_program.clone();
    CpiContext::new(program, cpi_accounts)
  }
}

#[derive(Accounts)]
pub struct TokenBurn<'info> {
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub mint: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut TokenBurn<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Burn<'info>> 
{
  fn from(accounts: &mut TokenBurn<'info>) -> CpiContext<'a, 'b, 'c, 'info, Burn<'info>> {
    let cpi_accounts = Burn {
      mint: accounts.mint.clone(),
      from: accounts.from.clone(),
      authority: accounts.authority.clone(),
    };
    let program = accounts.token_program.clone();
    CpiContext::new(program, cpi_accounts)
  }
}