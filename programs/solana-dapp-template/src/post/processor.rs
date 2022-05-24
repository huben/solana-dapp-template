use anchor_lang::prelude::*;

use crate::constant::{ ACCOUNT_TYPE_POST };
use crate::utils::{ get_timestamp };
use crate::post::state::{ PostAccount };
use crate::post::instrction::{ CreatePost, UpdatePost, DeletePost };
use crate::post::error::{ PostError };

pub struct PostProcesser;

impl PostProcesser {
  pub fn create_post(ctx: Context<CreatePost>, topic: String, desc: String) -> Result<()> {
    let post_account: &mut Account<PostAccount> = &mut ctx.accounts.post_account;
    let signer: &Signer = &ctx.accounts.signer;

    post_account.authority = *signer.key;
    post_account.timestamp = get_timestamp();
    post_account.account_type = ACCOUNT_TYPE_POST;

    if topic.chars().count() > PostAccount::LENGTH_MAX_TOPIC {
      return Err(PostError::TopicMaxLength.into());
    } 
    post_account.topic = topic;
    
    if desc.chars().count() > PostAccount::LENGTH_MAX_DESC {
      return Err(PostError::DescMaxLength.into());
    }
    post_account.desc = desc;
    Ok(())
  }

  pub fn update_post(ctx: Context<UpdatePost>, topic: String, desc: String) -> Result<()> {
    let post_account: &mut Account<PostAccount> = &mut ctx.accounts.post_account;

    if topic.chars().count() > PostAccount::LENGTH_MAX_TOPIC {
      return Err(PostError::TopicMaxLength.into());
    } 
    post_account.topic = topic;
    
    if desc.chars().count() > PostAccount::LENGTH_MAX_DESC {
      return Err(PostError::DescMaxLength.into());
    }
    post_account.desc = desc;
    Ok(())
  }

  pub fn delete_post(ctx: Context<DeletePost>) -> Result<()> {
    Ok(())
  }
}