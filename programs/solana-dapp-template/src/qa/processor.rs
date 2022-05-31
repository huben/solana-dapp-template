use anchor_lang::prelude::*;
use anchor_spl::token;

use anchor_lang::solana_program::pubkey::Pubkey;

use crate::qa::instruction::question::*;
use crate::qa::instruction::anwser::*;
use crate::qa::instruction::mainvsmachine::*;
use crate::qa::instruction::hunt::*;
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
    anwser: i8,
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

  pub fn new_man_vs_machine(
    ctx: Context<NewManVsMachine>,
    count: i8,
  ) -> Result<()> {

    let man_vs_machine_account = &mut ctx.accounts.man_vs_machine_account;
    let ata: &AccountInfo = &ctx.accounts.ata;
    let signer: &Signer = &ctx.accounts.signer;

    man_vs_machine_account.authority = *signer.key;
    man_vs_machine_account.timestamp = get_timestamp();
    man_vs_machine_account.ata = *ata.key;
    man_vs_machine_account.count = count;
    man_vs_machine_account.success_count = 0;
    man_vs_machine_account.error_count = 0;
    man_vs_machine_account.status = 0;

    let count_u64 = count as u64;
    token::transfer(ctx.accounts.into(), count_u64 * LAMPORTS_PER_SOL)
  }

  pub fn anwser_man_vs_machine(
    ctx: Context<AnwserManVsMachine>,
    anwser: i8,
  ) -> Result<()> {
    let man_vs_machine_account = &mut ctx.accounts.man_vs_machine_account;
    let question_account = &mut ctx.accounts.question_account;

    let finish_count = man_vs_machine_account.success_count + man_vs_machine_account.error_count;

    if finish_count >= man_vs_machine_account.count {
      return Err(QuestionError::ManVsMachineAnwserAll.into());
    }

    if (finish_count + 1) == man_vs_machine_account.count {
      man_vs_machine_account.status = 1;
    }

    if anwser == question_account.right {
      man_vs_machine_account.success_count += 1;
    } else {
      man_vs_machine_account.error_count += 1;
    }
    Ok(())
  }

  pub fn approve_man_vs_machine(
    ctx: Context<ApproveManVsMachine>,
  ) -> Result<()> {
    let man_vs_machine_account = &mut ctx.accounts.man_vs_machine_account;

    if man_vs_machine_account.status != 1 {
      return Err(QuestionError::ManVsMachineAnwserAll.into());
    }

    let error_f32 = man_vs_machine_account.error_count as f32;
    let count_f32 = man_vs_machine_account.count as f32;
    let error_percent: f32 = error_f32 / count_f32;
    if error_percent > 0.4 {
      man_vs_machine_account.status = 3;
    } else {
      man_vs_machine_account.status = 2;
    }

    let count_u64 = man_vs_machine_account.count as u64;
    token::transfer(ctx.accounts.into(), count_u64 * 3 * LAMPORTS_PER_SOL)
  }

  pub fn create_hunt(
    ctx: Context<CreateHunt>,
    qs_accouts: [Pubkey; 10],
    amount: u64,
  ) -> Result<()> {
    let hunt_account = &mut ctx.accounts.hunt_account;
    let signer: &Signer = &ctx.accounts.signer;

    hunt_account.qs_accouts = qs_accouts;
    hunt_account.timestamp = get_timestamp();
    hunt_account.builder = *signer.key;
    hunt_account.amount = amount;
    hunt_account.status = 0;
    
    token::transfer(ctx.accounts.into(), amount * LAMPORTS_PER_SOL)
  }

  pub fn join_hunt(
    ctx: Context<JoinHunt>
  ) -> Result<()> {
    let hunt_account = &mut ctx.accounts.hunt_account;
    let signer: &Signer = &ctx.accounts.signer;

    let from = &ctx.accounts.from;
    
    if hunt_account.status == 2 {
      return Err(QuestionError::HuntMatchSuccessed.into());
    }

    let player_account = &mut ctx.accounts.player_account;
    player_account.authority = *signer.key;
    player_account.timestamp = get_timestamp();
    player_account.ata = *from.key;
    player_account.start = get_timestamp();
    player_account.count = 10;
    player_account.success_count = 0;
    player_account.error_count = 0;

    hunt_account.status += 1;
      
    if *signer.key == hunt_account.builder {
      if hunt_account.builder_in != 1 {
        hunt_account.builder_in = 1;
        if hunt_account.parter_in == 1 {
          hunt_account.status = 1;
        }
        Ok(())
      } else {
        return Err(QuestionError::HuntBuilderHadIn.into());
      }
    } else {
      if hunt_account.parter_in != 1 {
        let authority = &ctx.accounts.authority;
        hunt_account.parter = *authority.key;
        let amount = hunt_account.amount;
        hunt_account.parter_in = 1;
        if hunt_account.builder_in == 1 {
          hunt_account.status = 1;
        }
        token::transfer(ctx.accounts.into(),  amount * LAMPORTS_PER_SOL)
      } else {
        return Err(QuestionError::HuntParterHadIn.into());
      }
      
    }
    
  }

}




