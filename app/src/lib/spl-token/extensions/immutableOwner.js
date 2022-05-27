import { struct } from '@solana/buffer-layout';
import { ExtensionType, getExtensionData } from './extensionType';
/** Buffer layout for de/serializing an account */
export var ImmutableOwnerLayout = struct([]);
export var IMMUTABLE_OWNER_SIZE = ImmutableOwnerLayout.span;
export function getImmutableOwner(account) {
    var extensionData = getExtensionData(ExtensionType.ImmutableOwner, account.tlvData);
    if (extensionData !== null) {
        return ImmutableOwnerLayout.decode(extensionData);
    }
    else {
        return null;
    }
}
