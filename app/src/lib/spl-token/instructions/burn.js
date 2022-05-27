import { struct, u8 } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';
import { TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { addSigners } from './internal';
import { TokenInstruction } from './types';
/** TODO: docs */
export var burnInstructionData = struct([u8('instruction'), u64('amount')]);
/**
 * Construct a Burn instruction
 *
 * @param account      Account to burn tokens from
 * @param mint         Mint for the account
 * @param owner        Owner of the account
 * @param amount       Number of tokens to burn
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createBurnInstruction(account, mint, owner, amount, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = addSigners([
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: true },
    ], owner, multiSigners);
    var data = Buffer.alloc(burnInstructionData.span);
    burnInstructionData.encode({
        instruction: TokenInstruction.Burn,
        amount: BigInt(amount),
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode a Burn instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeBurnInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== burnInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeBurnInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, mint = _b.mint, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== TokenInstruction.Burn)
        throw new TokenInvalidInstructionTypeError();
    if (!account || !mint || !owner)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            owner: owner,
            multiSigners: multiSigners,
        },
        data: data,
    };
}
/**
 * Decode a Burn instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeBurnInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], mint = _b[1], owner = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            owner: owner,
            multiSigners: multiSigners,
        },
        data: burnInstructionData.decode(data),
    };
}
