use anchor_lang::prelude::*;
use anchor_spl::token::{ Transfer };

use crate::qa::state::*;

#[derive(Accounts)]
pub struct NewQuestion<'info> {
  #[account(
    init,
    payer = signer, 
    space = QuestionAccount::LENGTH
  )]
  pub question_account: Account<'info, QuestionAccount>,
  #[account(mut)]
  pub authority_ata_account: AccountInfo<'info>,
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveQuestion<'info> {
  #[account(mut)]
  pub question_account: Account<'info, QuestionAccount>,
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut ApproveQuestion<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut ApproveQuestion<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
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
pub struct RejectQuestion<'info> {
  #[account(mut)]
  pub question_account: Account<'info, QuestionAccount>,
}



