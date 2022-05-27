import { struct, u8 } from '@solana/buffer-layout';
import { publicKey } from '@solana/buffer-layout-utils';
import { PublicKey, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { TokenInstruction } from './types';
/** TODO: docs */
export var initializeMintInstructionData = struct([
    u8('instruction'),
    u8('decimals'),
    publicKey('mintAuthority'),
    u8('freezeAuthorityOption'),
    publicKey('freezeAuthority'),
]);
/**
 * Construct an InitializeMint instruction
 *
 * @param mint            Token mint account
 * @param decimals        Number of decimals in token account amounts
 * @param mintAuthority   Minting authority
 * @param freezeAuthority Optional authority that can freeze token accounts
 * @param programId       SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createInitializeMintInstruction(mint, decimals, mintAuthority, freezeAuthority, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    var data = Buffer.alloc(initializeMintInstructionData.span);
    initializeMintInstructionData.encode({
        instruction: TokenInstruction.InitializeMint,
        decimals: decimals,
        mintAuthority: mintAuthority,
        freezeAuthorityOption: freezeAuthority ? 1 : 0,
        freezeAuthority: freezeAuthority || new PublicKey(0),
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode an InitializeMint instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeInitializeMintInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== initializeMintInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeInitializeMintInstructionUnchecked(instruction), _b = _a.keys, mint = _b.mint, rent = _b.rent, data = _a.data;
    if (data.instruction !== TokenInstruction.InitializeMint)
        throw new TokenInvalidInstructionTypeError();
    if (!mint || !rent)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            mint: mint,
            rent: rent,
        },
        data: data,
    };
}
/**
 * Decode an InitializeMint instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeInitializeMintInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, mint = _b[0], rent = _b[1], data = _a.data;
    var _c = initializeMintInstructionData.decode(data), instruction = _c.instruction, decimals = _c.decimals, mintAuthority = _c.mintAuthority, freezeAuthorityOption = _c.freezeAuthorityOption, freezeAuthority = _c.freezeAuthority;
    return {
        programId: programId,
        keys: {
            mint: mint,
            rent: rent,
        },
        data: {
            instruction: instruction,
            decimals: decimals,
            mintAuthority: mintAuthority,
            freezeAuthority: freezeAuthorityOption ? freezeAuthority : null,
        },
    };
}
