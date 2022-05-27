import { struct, u8 } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';
import { TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { addSigners } from './internal';
import { TokenInstruction } from './types';
/** TODO: docs */
export var mintToCheckedInstructionData = struct([
    u8('instruction'),
    u64('amount'),
    u8('decimals'),
]);
/**
 * Construct a MintToChecked instruction
 *
 * @param mint         Public key of the mint
 * @param destination  Address of the token account to mint to
 * @param authority    The mint authority
 * @param amount       Amount to mint
 * @param decimals     Number of decimals in amount to mint
 * @param multiSigners Signing accounts if `authority` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createMintToCheckedInstruction(mint, destination, authority, amount, decimals, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = addSigners([
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
    ], authority, multiSigners);
    var data = Buffer.alloc(mintToCheckedInstructionData.span);
    mintToCheckedInstructionData.encode({
        instruction: TokenInstruction.MintToChecked,
        amount: BigInt(amount),
        decimals: decimals,
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode a MintToChecked instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeMintToCheckedInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== mintToCheckedInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeMintToCheckedInstructionUnchecked(instruction), _b = _a.keys, mint = _b.mint, destination = _b.destination, authority = _b.authority, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== TokenInstruction.MintToChecked)
        throw new TokenInvalidInstructionTypeError();
    if (!mint || !destination || !authority)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            mint: mint,
            destination: destination,
            authority: authority,
            multiSigners: multiSigners,
        },
        data: data,
    };
}
/**
 * Decode a MintToChecked instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeMintToCheckedInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, mint = _b[0], destination = _b[1], authority = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            mint: mint,
            destination: destination,
            authority: authority,
            multiSigners: multiSigners,
        },
        data: mintToCheckedInstructionData.decode(data),
    };
}
