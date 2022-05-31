use anchor_lang::prelude::*;

#[error_code]
pub enum QuestionError {
    #[msg("right value must be 1 or 2")]
    RightValue,

    #[msg("question status not init")]
    QuestionStatusInit,

    #[msg("anwser status must right")]
    AnwserStatusRight,

    #[msg("ready anwser all")]
    ManVsMachineAnwserAll,

    #[msg("hunt match successed")]
    HuntMatchSuccessed,
    #[msg("hunt builder had in")]
    HuntBuilderHadIn,
    #[msg("hunt parter had in")]
    HuntParterHadIn,


}