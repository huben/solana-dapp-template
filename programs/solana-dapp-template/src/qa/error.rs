use anchor_lang::prelude::*;

#[error_code]
pub enum QuestionError {
    #[msg("right value must be 1 or 2")]
    RightValue,

    #[msg("question status not init")]
    QuestionStatusInit,
}