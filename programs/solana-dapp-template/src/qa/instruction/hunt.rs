use anchor_lang::prelude::*;
use anchor_spl::token::{ Transfer };

use crate::qa::state::*;

#[derive(Accounts)]
pub struct CreateHunt<'info> {
  #[account(
    init,
    payer = signer, 
    space = HuntAccount::LENGTH
  )]
  pub hunt_account: Account<'info, HuntAccount>,
 
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,

  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut CreateHunt<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut CreateHunt<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
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
pub struct JoinHunt<'info> {
  #[account(
    init,
    payer = signer, 
    space = HuntPlayerAccount::LENGTH
  )]
  pub player_account: Account<'info, HuntPlayerAccount>,
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
  #[account(mut)]
  pub hunt_account: Account<'info, HuntAccount>,
 
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut JoinHunt<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut JoinHunt<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
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
pub struct AnswerHunt<'info> {
  #[account(mut)]
  pub builder_account: Account<'info, HuntAccount>,
  #[account(mut)]
  pub ata: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ApproveHunt<'info> {
  #[account(mut)]
  pub hunt_account: Account<'info, HuntAccount>,
 
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut ApproveHunt<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut ApproveHunt<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
      authority: accounts.authority.clone(),
      from: accounts.from.clone(),
      to: accounts.to.clone(),
    };
    let program = accounts.token_program.clone();
    CpiContext::new(program, cpi_accounts)
  }
}
