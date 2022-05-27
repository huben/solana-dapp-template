import { struct, u8 } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';
import { TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { addSigners } from './internal';
import { TokenInstruction } from './types';
/** TODO: docs */
export var transferInstructionData = struct([u8('instruction'), u64('amount')]);
/**
 * Construct a Transfer instruction
 *
 * @param source       Source account
 * @param destination  Destination account
 * @param owner        Owner of the source account
 * @param amount       Number of tokens to transfer
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createTransferInstruction(source, destination, owner, amount, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = addSigners([
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
    ], owner, multiSigners);
    var data = Buffer.alloc(transferInstructionData.span);
    transferInstructionData.encode({
        instruction: TokenInstruction.Transfer,
        amount: BigInt(amount),
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode a Transfer instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeTransferInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== transferInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeTransferInstructionUnchecked(instruction), _b = _a.keys, source = _b.source, destination = _b.destination, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== TokenInstruction.Transfer)
        throw new TokenInvalidInstructionTypeError();
    if (!source || !destination || !owner)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            source: source,
            destination: destination,
            owner: owner,
            multiSigners: multiSigners,
        },
        data: data,
    };
}
/**
 * Decode a Transfer instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeTransferInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, source = _b[0], destination = _b[1], owner = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            source: source,
            destination: destination,
            owner: owner,
            multiSigners: multiSigners,
        },
        data: transferInstructionData.decode(data),
    };
}
