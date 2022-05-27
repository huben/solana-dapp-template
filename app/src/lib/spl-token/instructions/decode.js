import { u8 } from '@solana/buffer-layout';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInvalidInstructionDataError, TokenInvalidInstructionTypeError } from '../errors';
import { decodeApproveInstruction } from './approve';
import { decodeApproveCheckedInstruction } from './approveChecked';
import { decodeBurnInstruction } from './burn';
import { decodeBurnCheckedInstruction } from './burnChecked';
import { decodeCloseAccountInstruction } from './closeAccount';
import { decodeFreezeAccountInstruction } from './freezeAccount';
import { decodeInitializeAccountInstruction } from './initializeAccount';
import { decodeInitializeMintInstruction } from './initializeMint';
import { decodeInitializeMultisigInstruction } from './initializeMultisig';
import { decodeMintToInstruction } from './mintTo';
import { decodeMintToCheckedInstruction } from './mintToChecked';
import { decodeRevokeInstruction } from './revoke';
import { decodeSetAuthorityInstruction } from './setAuthority';
import { decodeSyncNativeInstruction } from './syncNative';
import { decodeThawAccountInstruction } from './thawAccount';
import { decodeTransferInstruction } from './transfer';
import { decodeTransferCheckedInstruction } from './transferChecked';
import { TokenInstruction } from './types';
/** TODO: docs */
export function decodeInstruction(instruction, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    if (!instruction.data.length)
        throw new TokenInvalidInstructionDataError();
    var type = u8().decode(instruction.data);
    if (type === TokenInstruction.InitializeMint)
        return decodeInitializeMintInstruction(instruction, programId);
    if (type === TokenInstruction.InitializeAccount)
        return decodeInitializeAccountInstruction(instruction, programId);
    if (type === TokenInstruction.InitializeMultisig)
        return decodeInitializeMultisigInstruction(instruction, programId);
    if (type === TokenInstruction.Transfer)
        return decodeTransferInstruction(instruction, programId);
    if (type === TokenInstruction.Approve)
        return decodeApproveInstruction(instruction, programId);
    if (type === TokenInstruction.Revoke)
        return decodeRevokeInstruction(instruction, programId);
    if (type === TokenInstruction.SetAuthority)
        return decodeSetAuthorityInstruction(instruction, programId);
    if (type === TokenInstruction.MintTo)
        return decodeMintToInstruction(instruction, programId);
    if (type === TokenInstruction.Burn)
        return decodeBurnInstruction(instruction, programId);
    if (type === TokenInstruction.CloseAccount)
        return decodeCloseAccountInstruction(instruction, programId);
    if (type === TokenInstruction.FreezeAccount)
        return decodeFreezeAccountInstruction(instruction, programId);
    if (type === TokenInstruction.ThawAccount)
        return decodeThawAccountInstruction(instruction, programId);
    if (type === TokenInstruction.TransferChecked)
        return decodeTransferCheckedInstruction(instruction, programId);
    if (type === TokenInstruction.ApproveChecked)
        return decodeApproveCheckedInstruction(instruction, programId);
    if (type === TokenInstruction.MintToChecked)
        return decodeMintToCheckedInstruction(instruction, programId);
    if (type === TokenInstruction.BurnChecked)
        return decodeBurnCheckedInstruction(instruction, programId);
    // TODO: implement
    if (type === TokenInstruction.InitializeAccount2)
        throw new TokenInvalidInstructionTypeError();
    if (type === TokenInstruction.SyncNative)
        return decodeSyncNativeInstruction(instruction, programId);
    // TODO: implement
    if (type === TokenInstruction.InitializeAccount3)
        throw new TokenInvalidInstructionTypeError();
    // TODO: implement
    if (type === TokenInstruction.InitializeMultisig2)
        throw new TokenInvalidInstructionTypeError();
    // TODO: implement
    if (type === TokenInstruction.InitializeMint2)
        throw new TokenInvalidInstructionTypeError();
    throw new TokenInvalidInstructionTypeError();
}
/** TODO: docs */
export function isInitializeMintInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.InitializeMint;
}
/** TODO: docs */
export function isInitializeAccountInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.InitializeAccount;
}
/** TODO: docs */
export function isInitializeMultisigInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.InitializeMultisig;
}
/** TODO: docs */
export function isTransferInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.Transfer;
}
/** TODO: docs */
export function isApproveInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.Approve;
}
/** TODO: docs */
export function isRevokeInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.Revoke;
}
/** TODO: docs */
export function isSetAuthorityInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.SetAuthority;
}
/** TODO: docs */
export function isMintToInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.MintTo;
}
/** TODO: docs */
export function isBurnInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.Burn;
}
/** TODO: docs */
export function isCloseAccountInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.CloseAccount;
}
/** TODO: docs */
export function isFreezeAccountInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.FreezeAccount;
}
/** TODO: docs */
export function isThawAccountInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.ThawAccount;
}
/** TODO: docs */
export function isTransferCheckedInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.TransferChecked;
}
/** TODO: docs */
export function isApproveCheckedInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.ApproveChecked;
}
/** TODO: docs */
export function isMintToCheckedInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.MintToChecked;
}
/** TODO: docs */
export function isBurnCheckedInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.BurnChecked;
}
/** TODO: docs, implement */
// export function isInitializeAccount2Instruction(
//     decoded: DecodedInstruction
// ): decoded is DecodedInitializeAccount2Instruction {
//     return decoded.data.instruction === TokenInstruction.InitializeAccount2;
// }
/** TODO: docs */
export function isSyncNativeInstruction(decoded) {
    return decoded.data.instruction === TokenInstruction.SyncNative;
}
/** TODO: docs, implement */
// export function isInitializeAccount3Instruction(
//     decoded: DecodedInstruction
// ): decoded is DecodedInitializeAccount3Instruction {
//     return decoded.data.instruction === TokenInstruction.InitializeAccount3;
// }
/** TODO: docs, implement */
// export function isInitializeMultisig2Instruction(
//     decoded: DecodedInstruction
// ): decoded is DecodedInitializeMultisig2Instruction {
//     return decoded.data.instruction === TokenInstruction.InitializeMultisig2;
// }
/** TODO: docs, implement */
// export function isInitializeMint2Instruction(
//     decoded: DecodedInstruction
// ): decoded is DecodedInitializeMint2Instruction {
//     return decoded.data.instruction === TokenInstruction.InitializeMint2;
// }
