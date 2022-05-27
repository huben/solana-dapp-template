import { struct, u8 } from '@solana/buffer-layout';
import { publicKey } from '@solana/buffer-layout-utils';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionKeysError, TokenInvalidInstructionProgramError, TokenInvalidInstructionTypeError, } from '../errors';
import { addSigners } from './internal';
import { TokenInstruction } from './types';
/** Authority types defined by the program */
export var AuthorityType;
(function (AuthorityType) {
    AuthorityType[AuthorityType["MintTokens"] = 0] = "MintTokens";
    AuthorityType[AuthorityType["FreezeAccount"] = 1] = "FreezeAccount";
    AuthorityType[AuthorityType["AccountOwner"] = 2] = "AccountOwner";
    AuthorityType[AuthorityType["CloseAccount"] = 3] = "CloseAccount";
})(AuthorityType || (AuthorityType = {}));
/** TODO: docs */
export var setAuthorityInstructionData = struct([
    u8('instruction'),
    u8('authorityType'),
    u8('newAuthorityOption'),
    publicKey('newAuthority'),
]);
/**
 * Construct a SetAuthority instruction
 *
 * @param account          Address of the token account
 * @param currentAuthority Current authority of the specified type
 * @param authorityType    Type of authority to set
 * @param newAuthority     New authority of the account
 * @param multiSigners     Signing accounts if `currentAuthority` is a multisig
 * @param programId        SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createSetAuthorityInstruction(account, currentAuthority, authorityType, newAuthority, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    var keys = addSigners([{ pubkey: account, isSigner: false, isWritable: true }], currentAuthority, multiSigners);
    var data = Buffer.alloc(setAuthorityInstructionData.span);
    setAuthorityInstructionData.encode({
        instruction: TokenInstruction.SetAuthority,
        authorityType: authorityType,
        newAuthorityOption: newAuthority ? 1 : 0,
        newAuthority: newAuthority || new PublicKey(0),
    }, data);
    return new TransactionInstruction({ keys: keys, programId: programId, data: data });
}
/**
 * Decode a SetAuthority instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
export function decodeSetAuthorityInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new TokenInvalidInstructionProgramError();
    if (instruction.data.length !== setAuthorityInstructionData.span)
        throw new TokenInvalidInstructionDataError();
    var _a = decodeSetAuthorityInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, currentAuthority = _b.currentAuthority, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== TokenInstruction.SetAuthority)
        throw new TokenInvalidInstructionTypeError();
    if (!account || !currentAuthority)
        throw new TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            currentAuthority: currentAuthority,
            multiSigners: multiSigners,
        },
        data: data,
    };
}
/**
 * Decode a SetAuthority instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
export function decodeSetAuthorityInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], currentAuthority = _b[1], multiSigners = _b.slice(2), data = _a.data;
    var _c = setAuthorityInstructionData.decode(data), instruction = _c.instruction, authorityType = _c.authorityType, newAuthorityOption = _c.newAuthorityOption, newAuthority = _c.newAuthority;
    return {
        programId: programId,
        keys: {
            account: account,
            currentAuthority: currentAuthority,
            multiSigners: multiSigners,
        },
        data: {
            instruction: instruction,
            authorityType: authorityType,
            newAuthority: newAuthorityOption ? newAuthority : null,
        },
    };
}
