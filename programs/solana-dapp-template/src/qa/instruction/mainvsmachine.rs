use anchor_lang::prelude::*;
use anchor_spl::token::{ Transfer };

use crate::qa::state::*;

#[derive(Accounts)]
pub struct NewManVsMachine<'info> {
  #[account(
    init,
    payer = signer, 
    space = ManVsMachineAccount::LENGTH
  )]
  pub man_vs_machine_account: Account<'info, ManVsMachineAccount>,
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

impl<'a, 'b, 'c, 'info> From<&mut NewManVsMachine<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut NewManVsMachine<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
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
pub struct AnwserManVsMachine<'info> {
  #[account(mut)]
  pub man_vs_machine_account: Account<'info, ManVsMachineAccount>,
  #[account(mut)]
  pub question_account: Account<'info, QuestionAccount>,
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct ApproveManVsMachine<'info> {
  #[account(mut)]
  pub man_vs_machine_account: Account<'info, ManVsMachineAccount>,

  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub token_program: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut ApproveManVsMachine<'info>>
  for CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> 
{
  fn from(accounts: &mut ApproveManVsMachine<'info>) -> CpiContext<'a, 'b, 'c, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
      authority: accounts.authority.clone(),
      from: accounts.from.clone(),
      to: accounts.to.clone(),
    };
    let program = accounts.token_program.clone();
    CpiContext::new(program, cpi_accounts)
  }
}