import { struct, u8 } from '@solana/buffer-layout';
import { TransactionInstruction } from '@solana/web3.js';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { TokenInstruction } from './types';
/** The struct that represents the instruction data as it is read by the program */
export var initializeImmutableOwnerInstructionData = struct([
    u8('instruction'),
]);
/**
 * Construct an InitializeImmutableOwner instruction
 *
 * @param account           Immutable Owner Account
 * @param programId         SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createInitializeImmutableOwnerInstruction(account, programId) {
    var keys = [{ pubkey: account, isSigner: false, isWritable: true }];
    var data = Buffer.alloc(initializeImmutableOwnerInstructionData.span);
    initializeImmutableOwnerInstructionData.encode({
        instruction: TokenInstruction.InitializeImmutableOwner,
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode an InitializeImmutableOwner instruction and validate it
 *
 * @param instruction InitializeImmutableOwner instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeInitializeImmutableOwnerInstruction(instruction, programId) {
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== initializeImmutableOwnerInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeInitializeImmutableOwnerInstructionUnchecked(instruction), account = _a.keys.account, data = _a.data;
    if (data.instruction !== TokenInstruction.InitializeImmutableOwner)
        throw new TokenInvalidInstructionTypeError();
    if (!account)
        throw new TokenInvalidInstructionKeysError();
    return {
        programId: programId,
        keys: {
            account: account,
        },
        data: data,
    };
}
/**
 * Decode an InitializeImmutableOwner instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeInitializeImmutableOwnerInstructionUnchecked(_a) {
    var programId = _a.programId, account = _a.keys[0], data = _a.data;
    var instruction = initializeImmutableOwnerInstructionData.decode(data).instruction;
    return {
        programId: programId,
        keys: {
            account: account,
        },
        data: {
            instruction: instruction,
        },
    };
}
