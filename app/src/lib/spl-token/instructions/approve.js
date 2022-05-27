import { struct, u8 } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';
import { TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { addSigners } from './internal';
import { TokenInstruction } from './types';
/** TODO: docs */
export var approveInstructionData = struct([u8('instruction'), u64('amount')]);
/**
 * Construct an Approve instruction
 *
 * @param account      Account to set the delegate for
 * @param delegate     Account authorized to transfer tokens from the account
 * @param owner        Owner of the account
 * @param amount       Maximum number of tokens the delegate may transfer
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createApproveInstruction(account, delegate, owner, amount, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = addSigners([
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: delegate, isSigner: false, isWritable: false },
    ], owner, multiSigners);
    var data = Buffer.alloc(approveInstructionData.span);
    approveInstructionData.encode({
        instruction: TokenInstruction.Approve,
        amount: BigInt(amount),
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode an Approve instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeApproveInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== approveInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeApproveInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, delegate = _b.delegate, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== TokenInstruction.Approve)
        throw new TokenInvalidInstructionTypeError();
    if (!account || !delegate || !owner)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            delegate: delegate,
            owner: owner,
            multiSigners: multiSigners,
        },
        data: data,
    };
}
/**
 * Decode an Approve instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeApproveInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], delegate = _b[1], owner = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            delegate: delegate,
            owner: owner,
            multiSigners: multiSigners,
        },
        data: approveInstructionData.decode(data),
    };
}
