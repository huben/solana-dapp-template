import { struct, u8 } from '@solana/buffer-layout';
import { SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { TokenInstruction } from './types';
/** TODO: docs */
export var initializeAccountInstructionData = struct([u8('instruction')]);
/**
 * Construct an InitializeAccount instruction
 *
 * @param account   New token account
 * @param mint      Mint account
 * @param owner     Owner of the new account
 * @param programId SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createInitializeAccountInstruction(account, mint, owner, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = [
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    var data = Buffer.alloc(initializeAccountInstructionData.span);
    initializeAccountInstructionData.encode({ instruction: TokenInstruction.InitializeAccount }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode an InitializeAccount instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeInitializeAccountInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== initializeAccountInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeInitializeAccountInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, mint = _b.mint, owner = _b.owner, rent = _b.rent, data = _a.data;
    if (data.instruction !== TokenInstruction.InitializeAccount)
        throw new TokenInvalidInstructionTypeError();
    if (!account || !mint || !owner || !rent)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            owner: owner,
            rent: rent,
        },
        data: data,
    };
}
/**
 * Decode an InitializeAccount instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeInitializeAccountInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], mint = _b[1], owner = _b[2], rent = _b[3], data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            owner: owner,
            rent: rent,
        },
        data: initializeAccountInstructionData.decode(data),
    };
}
