use anchor_lang::prelude::*;

use crate::counter::state::{ CounterAccount };

#[derive(Accounts)]
pub struct Init<'info> {
    #[account(
        init,
        payer = signer, 
        space = CounterAccount::LEN
    )]
    pub counter_account: Account<'info, CounterAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter_account: Account<'info, CounterAccount>,
    
}