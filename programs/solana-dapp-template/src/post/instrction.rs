use anchor_lang::prelude::*;

use crate::post::state::{ PostAccount };

#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(
    init,
    payer = signer,
    space = PostAccount::LENGTH
  )]
  pub post_account: Account<'info, PostAccount>,
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
  #[account(mut, has_one = authority)]
  pub post_account: Account<'info, PostAccount>,
  pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeletePost<'info> {
  #[account(mut, has_one = authority, close = authority)]
  pub post_account: Account<'info, PostAccount>,
  pub authority: Signer<'info>,
}