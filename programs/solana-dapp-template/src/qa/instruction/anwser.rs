use anchor_lang::prelude::*;
use anchor_spl::token::{ Transfer };

use crate::qa::state::*;

#[derive(Accounts)]
pub struct NewAnwser<'info> {
  #[account(
    init,
    payer = signer, 
    space = AnwserAccount::LENGTH
  )]
  pub anwser_account: Account<'info, AnwserAccount>,
  #[account(mut)]
  pub question_account: Account<'info, QuestionAccount>,
  pub ata: AccountInfo<'info>,
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

impl<'a, 'b, 'c, 'info> From<&mut NewAnwser<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut NewAnwser<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
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
pub struct ApproveAnwser<'info> {
  #[account(mut)]
  pub anwser_account: Account<'info, AnwserAccount>,

  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut ApproveAnwser<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut ApproveAnwser<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
      authority: accounts.authority.clone(),
      from: accounts.from.clone(),
      to: accounts.to.clone(),
    };
    let program = accounts.token_program.clone();
    CpiContext::new(program, cpi_accounts)
  }
}