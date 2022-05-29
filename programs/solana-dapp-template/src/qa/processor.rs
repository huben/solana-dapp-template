use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::qa::instruction::*;
use crate::qa::error::*;
use crate::utils::{ get_timestamp };
use crate::constant::{ ACCOUNT_TYPE_QUESTION, ACCOUNT_TYPE_ANWSER, LAMPORTS_PER_SOL };

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

  pub fn new_anwser(
    ctx: Context<NewAnwser>,
  ) -> Result<()> {
    let anwser_account = &mut ctx.accounts.anwser_account;
    let question_account = &mut ctx.accounts.question_account;
    let ata = &mut ctx.accounts.ata;
    let signer: &Signer = &ctx.accounts.signer;
    
    anwser_account.authority = *signer.key;
    anwser_account.timestamp = get_timestamp();
    anwser_account.account_type = ACCOUNT_TYPE_ANWSER;
    anwser_account.question = question_account.key();
    anwser_account.ata = *ata.key;
    anwser_account.status = 0;
    
    Ok(())
  }

  pub fn enable_anwser(
    ctx: Context<EnableAnwser>,
    anwser: i8,
  ) -> Result<()> {
    let anwser_account = &mut ctx.accounts.anwser_account;
    let question_account = &mut ctx.accounts.question_account;

    // 校验题目
    if anwser_account.question != question_account.key() {
    }
    // 校验 ata from

    if anwser == question_account.right {
      anwser_account.status = 1
    } else {
      anwser_account.status = 2
    }
    anwser_account.anwser = anwser;
    token::transfer(ctx.accounts.into(), 1 * LAMPORTS_PER_SOL)
  }

  pub fn approve_anwser(
    ctx: Context<ApproveAnwser>
  ) -> Result<()> {

    let anwser_account = &mut ctx.accounts.anwser_account;
    if anwser_account.status != 1 {
      return Err(QuestionError::AnwserStatusRight.into());
    } else {
      msg!("{:#?}", anwser_account);
    }
    anwser_account.status = 3;
    token::transfer(ctx.accounts.into(), 2 * LAMPORTS_PER_SOL)

  }
}

