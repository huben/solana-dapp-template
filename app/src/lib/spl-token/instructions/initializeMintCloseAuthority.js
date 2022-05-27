import { struct, u8 } from '@solana/buffer-layout';
import { publicKey } from '@solana/buffer-layout-utils';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { TokenInstruction } from './types';
/** TODO: docs */
export var initializeMintCloseAuthorityInstructionData = struct([
    u8('instruction'),
    u8('closeAuthorityOption'),
    publicKey('closeAuthority'),
]);
/**
 * Construct an InitializeMintCloseAuthority instruction
 *
 * @param mint            Token mint account
 * @param closeAuthority  Optional authority that can close the mint
 * @param programId       SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createInitializeMintCloseAuthorityInstruction(mint, closeAuthority, programId) {
    var keys = [{ pubkey: mint, isSigner: false, isWritable: true }];
    var data = Buffer.alloc(initializeMintCloseAuthorityInstructionData.span);
    initializeMintCloseAuthorityInstructionData.encode({
        instruction: TokenInstruction.InitializeMintCloseAuthority,
        closeAuthorityOption: closeAuthority ? 1 : 0,
        closeAuthority: closeAuthority || new PublicKey(0),
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode an InitializeMintCloseAuthority instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeInitializeMintCloseAuthorityInstruction(instruction, programId) {
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== initializeMintCloseAuthorityInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeInitializeMintCloseAuthorityInstructionUnchecked(instruction), mint = _a.keys.mint, data = _a.data;
    if (data.instruction !== TokenInstruction.InitializeMintCloseAuthority)
        throw new TokenInvalidInstructionTypeError();
    if (!mint)
        throw new TokenInvalidInstructionKeysError();
    return {
        programId: programId,
        keys: {
            mint: mint,
        },
        data: data,
    };
}
/**
 * Decode an InitializeMintCloseAuthority instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeInitializeMintCloseAuthorityInstructionUnchecked(_a) {
    var programId = _a.programId, mint = _a.keys[0], data = _a.data;
    var _b = initializeMintCloseAuthorityInstructionData.decode(data), instruction = _b.instruction, closeAuthorityOption = _b.closeAuthorityOption, closeAuthority = _b.closeAuthority;
    return {
        programId: programId,
        keys: {
            mint: mint,
        },
        data: {
            instruction: instruction,
            closeAuthority: closeAuthorityOption ? closeAuthority : null,
        },
    };
}
