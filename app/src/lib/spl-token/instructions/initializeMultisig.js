import { struct, u8 } from '@solana/buffer-layout';
import { SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { TokenInstruction } from './types';
/** TODO: docs */
export var initializeMultisigInstructionData = struct([
    u8('instruction'),
    u8('m'),
]);
/**
 * Construct an InitializeMultisig instruction
 *
 * @param account   Multisig account
 * @param signers   Full set of signers
 * @param m         Number of required signatures
 * @param programId SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createInitializeMultisigInstruction(account, signers, m, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = [
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    for (var _i = 0, signers_1 = signers; _i < signers_1.length; _i++) {
        var signer = signers_1[_i];
        keys.push({ pubkey: signer, isSigner: false, isWritable: false });
    }
    var data = Buffer.alloc(initializeMultisigInstructionData.span);
    initializeMultisigInstructionData.encode({
        instruction: TokenInstruction.InitializeMultisig,
        m: m,
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode an InitializeMultisig instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeInitializeMultisigInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== initializeMultisigInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeInitializeMultisigInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, rent = _b.rent, signers = _b.signers, data = _a.data;
    if (data.instruction !== TokenInstruction.InitializeMultisig)
        throw new TokenInvalidInstructionTypeError();
    if (!account || !rent || !signers.length)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            rent: rent,
            signers: signers,
        },
        data: data,
    };
}
/**
 * Decode an InitializeMultisig instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeInitializeMultisigInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], rent = _b[1], signers = _b.slice(2), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            rent: rent,
            signers: signers,
        },
        data: initializeMultisigInstructionData.decode(data),
    };
}
