use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::qa::instruction::*;
use crate::qa::error::*;
use crate::utils::{ get_timestamp };
use crate::constant::{ ACCOUNT_TYPE_QUESTION, LAMPORTS_PER_SOL };

pub struct QaProcessor;

impl QaProcessor {
  pub fn new_question(
      ctx: Context<NewQuestion>,
      desc: String,
      option1: String,
      option2: String,
      right: i8,
    ) -> Result<()> {
    let question_account = &mut ctx.accounts.question_account;
    let authority_ata_account: &AccountInfo = &ctx.accounts.authority_ata_account;
    let signer: &Signer = &ctx.accounts.signer;
    
    question_account.authority = *signer.key;
    question_account.timestamp = get_timestamp();
    question_account.account_type = ACCOUNT_TYPE_QUESTION;
    question_account.authority_ata = *authority_ata_account.key;
    question_account.status = 0;
    
    question_account.desc = desc;
    question_account.option1 = option1;
    question_account.option2 = option2;
    if right != 1 && right != 2 {
      return Err(QuestionError::RightValue.into());
    }
    question_account.right = right;
    Ok(())
  }

  pub fn approve_question(
    ctx: Context<ApproveQuestion>
  ) -> Result<()> {
    let question_account = &mut ctx.accounts.question_account;
    if question_account.status != 0 {
      return Err(QuestionError::QuestionStatusInit.into());
    } else {
      msg!("{:#?}", question_account);
    }
    question_account.status = 1;
    token::transfer(ctx.accounts.into(), 3 * LAMPORTS_PER_SOL)
  }

  pub fn reject_question(
    ctx: Context<RejectQuestion>
  ) -> Result<()> {
    let question_account = &mut ctx.accounts.question_account;
    if question_account.status != 0 {
      return Err(QuestionError::QuestionStatusInit.into());
    } else {
      msg!("{:#?}", question_account);
    }
    question_account.status = 2;
    Ok(())
  }
}

