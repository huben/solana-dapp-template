use anchor_lang::prelude::*;
use anchor_lang::solana_program::{ program as sprogram, system_instruction };
use anchor_lang::system_program::{
  transfer as a_transfer,
  Transfer as ATransferSol,
};

use crate::constant::{ LAMPORTS_PER_SOL };

#[derive(Accounts)]
pub struct SolTransfer<'info> {
  #[account(signer)]
  pub authority: AccountInfo<'info>,
  #[account(mut)]
  pub from: AccountInfo<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub system_program: AccountInfo<'info>
}

impl<'a, 'b, 'c, 'info> From<&mut SolTransfer<'info>>
  for CpiContext<'a, 'b, 'c, 'info, ATransferSol<'info>> 
{
  fn from(accounts: &mut SolTransfer<'info>) -> CpiContext<'a, 'b, 'c, 'info, ATransferSol<'info>> {
    let cpi_accounts = ATransferSol {
      from: accounts.from.clone(),
      to: accounts.to.clone(),
    };
    let program = accounts.system_program.clone();
    CpiContext::new(program, cpi_accounts)
  }
}

pub struct SolProcessor;

impl SolProcessor {
  pub fn solana_transfer_sol(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from = &mut ctx.accounts.from.key;
    let to = &mut ctx.accounts.to.key;
  
    let ix = system_instruction::transfer(&from, &to, amount * LAMPORTS_PER_SOL);
    sprogram::invoke(&ix, &[ctx.accounts.from.to_account_info(), ctx.accounts.to.to_account_info()])?;
    Ok(())
  }

  pub fn anchor_transfer_sol(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    a_transfer(ctx.accounts.into(), amount * LAMPORTS_PER_SOL)
  }
}

