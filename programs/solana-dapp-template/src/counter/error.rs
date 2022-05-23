use anchor_lang::prelude::*;

#[error_code]
pub enum CounterError {
    #[msg("count cannot > 5.")]
    MaxCount,
}