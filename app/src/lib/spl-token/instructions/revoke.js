import { struct, u8 } from '@solana/buffer-layout';
import { TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { addSigners } from './internal';
import { TokenInstruction } from './types';
/** TODO: docs */
export var revokeInstructionData = struct([u8('instruction')]);
/**
 * Construct a Revoke instruction
 *
 * @param account      Address of the token account
 * @param owner        Owner of the account
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createRevokeInstruction(account, owner, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = addSigners([{ pubkey: account, isSigner: false, isWritable: true }], owner, multiSigners);
    var data = Buffer.alloc(revokeInstructionData.span);
    revokeInstructionData.encode({ instruction: TokenInstruction.Revoke }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode a Revoke instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeRevokeInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== revokeInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeRevokeInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== TokenInstruction.Revoke)
        throw new TokenInvalidInstructionTypeError();
    if (!account || !owner)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            owner: owner,
            multiSigners: multiSigners,
        },
        data: data,
    };
}
/**
 * Decode a Revoke instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeRevokeInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], owner = _b[1], multiSigners = _b.slice(2), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            owner: owner,
            multiSigners: multiSigners,
        },
        data: revokeInstructionData.decode(data),
    };
}
