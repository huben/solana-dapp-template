import { struct, u8 } from '@solana/buffer-layout';
import { TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { TokenInstruction } from './types';
/** TODO: docs */
export var syncNativeInstructionData = struct([u8('instruction')]);
/**
 * Construct a SyncNative instruction
 *
 * @param account   Native account to sync lamports from
 * @param programId SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createSyncNativeInstruction(account, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = [{ pubkey: account, isSigner: false, isWritable: true }];
    var data = Buffer.alloc(syncNativeInstructionData.span);
    syncNativeInstructionData.encode({ instruction: TokenInstruction.SyncNative }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode a SyncNative instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeSyncNativeInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== syncNativeInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeSyncNativeInstructionUnchecked(instruction), account = _a.keys.account, data = _a.data;
    if (data.instruction !== TokenInstruction.SyncNative)
        throw new TokenInvalidInstructionTypeError();
    if (!account)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
        },
        data: data,
    };
}
/**
 * Decode a SyncNative instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeSyncNativeInstructionUnchecked(_a) {
    var programId = _a.programId, account = _a.keys[0], data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
        },
        data: syncNativeInstructionData.decode(data),
    };
}
