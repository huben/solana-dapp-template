use anchor_lang::prelude::*;

#[error_code]
pub enum PostError {
    #[msg("topic max chars 10")]
    TopicMaxLength,
    #[msg("desc max chars 140")]
    DescMaxLength,
}